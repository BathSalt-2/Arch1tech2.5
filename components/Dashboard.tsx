import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Message, SavedModel, ThemeName, MobileView, UnifiedConfig, CreationMode, SystemStatus, AgentConfig, AgentTool, WebSearchConfig, HighlightedElement } from '../types';
import { DEFAULT_LLM_CONFIG, DEFAULT_AGENT_CONFIG, DEFAULT_WORKFLOW_CONFIG, DEFAULT_APP_CONFIG, DOMAINS } from '../constants';
import { Header } from './Header';
import { generateAstridResponseStream, generateConfigFromDescription, generateAstridReflection, generateBlueprintStream } from '../services/geminiService';
import { GalleryModal } from './GalleryModal';
import { SaveModelModal } from './SaveModelModal';
import { ArchitecturePreviewModal } from './ArchitecturePreviewModal';
import { SettingsModal } from './SettingsModal';
import { useIsMobile } from '../hooks/useIsMobile';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';
import { useDebounce } from '../hooks/useDebounce';
import { LicenseModal } from './LicenseModal';
import { ConfirmationModal } from './ConfirmationModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { OnboardingGuide } from './OnboardingGuide';
import { KnowledgeBaseModal } from './KnowledgeBaseModal';

interface DashboardProps {
    savedModels: SavedModel[];
    onSaveModel: (name: string, config: UnifiedConfig) => void;
    onDeleteModel: (modelId: number) => void;
    theme: ThemeName;
    onThemeChange: (themeName: ThemeName) => void;
}

const MIN_PROMPT_LENGTH = 10;

const calculateSystemStatus = (config: UnifiedConfig): SystemStatus => {
    // ... (heuristic calculation logic remains the same)
    let cognitiveLoad = 0;
    let alignmentDrift = 0;
    let consistency = 100;

    if (config.type === 'llm') {
        cognitiveLoad += config.core.layers * 1.5;
        cognitiveLoad += config.core.heads * 1.5;
        cognitiveLoad += config.core.hiddenDimension / 20;
        cognitiveLoad += config.memory.shortTermTokens / 400;
        cognitiveLoad += config.expertise.domains.length * 5;
        if (config.selfImprovement.recursiveStabilityMonitor) cognitiveLoad += 5;
        if (config.selfImprovement.dynamicAlignmentEngine) cognitiveLoad += 5;

        alignmentDrift = Math.max(0, 50 - config.ethicalMatrix.transparency / 2);
        alignmentDrift += (config.ethicalMatrix.utilitarianism - 50) / 5;
        if (config.selfImprovement.dynamicAlignmentEngine) alignmentDrift -= 10;

        if (config.core.quantumEvaluation && config.core.layers < 10) consistency -= 20;
        if (config.memory.knowledgeGraph && config.memory.shortTermTokens < 4096) consistency -= 15;

    } else if (config.type === 'agent') {
        cognitiveLoad = 20 + config.tools.length * 15;
        if (config.autonomous) cognitiveLoad += 20;
        if (config.tools.includes('Web Search') && config.webSearchConfig?.searchDepth === 'Deep') cognitiveLoad += 10;
        alignmentDrift = config.autonomous ? 25 : 10;
    } else {
        cognitiveLoad = 15;
        alignmentDrift = 5;
    }

    return {
        cognitiveLoad: Math.min(100, Math.max(0, cognitiveLoad)),
        alignmentDrift: Math.min(100, Math.max(0, alignmentDrift)),
        consistency: Math.min(100, Math.max(0, consistency)),
    };
};

export const Dashboard: React.FC<DashboardProps> = ({ savedModels, onSaveModel, onDeleteModel, theme, onThemeChange }) => {
  const [config, setConfig] = useState<UnifiedConfig>(DEFAULT_LLM_CONFIG);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('chat');
  const [creationMode, setCreationMode] = useState<CreationMode>('llm');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(calculateSystemStatus(DEFAULT_LLM_CONFIG));
  const isMobile = useIsMobile();
  const debouncedPrompt = useDebounce(prompt, 750);
  
  // NEW: State for the dynamic blueprint panel
  const [blueprintText, setBlueprintText] = useState('');
  const [isBlueprintLoading, setIsBlueprintLoading] = useState(false);

  // NEW: State for conversational onboarding.
  const [onboardingComplete, setOnboardingComplete] = useLocalStorage('or4cl3-onboarding-complete', false);
  const [onboardingStep, setOnboardingStep] = useState(onboardingComplete ? -1 : 0); // -1 means inactive
  const [userName, setUserName] = useState('');
  const [highlightedElement, setHighlightedElement] = useState<HighlightedElement | null>(null);

  // Refs for highlighting UI elements during onboarding
  const forgeRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const getElementRect = (ref: React.RefObject<HTMLElement>) => ref.current?.getBoundingClientRect() || null;

  // NEW: Function to generate the blueprint content
  const handleGenerateBlueprint = useCallback(async (newConfig: UnifiedConfig) => {
    setIsBlueprintLoading(true);
    setBlueprintText('');
    try {
        let fullText = "";
        for await (const chunk of generateBlueprintStream(newConfig)) {
            fullText += chunk;
            setBlueprintText(fullText);
        }
    } catch (error) {
        console.error("Blueprint generation failed:", error);
        setBlueprintText("Error: Could not generate blueprint specification.");
    } finally {
        setIsBlueprintLoading(false);
    }
  }, []);

  // Effect to manage the onboarding flow
  useEffect(() => {
    if (onboardingStep === -1) {
        setHighlightedElement(null);
        return;
    };

    const runOnboardingStep = async () => {
      switch (onboardingStep) {
        case 0:
          setMessages([{ id: 1, sender: 'ai', text: "Initializing QSCI v2.1 interface... I am Astrid, your meta-aware co-pilot in the Forge. To personalize our session, please state your name." }]);
          setHighlightedElement({ rect: getElementRect(chatRef), padding: 10, radius: 12 });
          break;
        case 1:
          setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: `Acknowledged, Architect ${userName}. This Forge engineers divergent machine cognition. We will begin by forging a 'Story Helper' agent.\n\nInput the following directive into the console:\n**\`Forge a creative agent for storytelling\`**\nThen engage the 'Architect' protocol.` }]);
          setPrompt('Forge a creative agent for storytelling');
          break;
        case 2:
          setCreationMode('agent');
          try {
            const agentConfig = await generateConfigFromDescription('Forge a creative agent for storytelling', 'agent');
            setConfig(agentConfig);
            handleGenerateBlueprint(agentConfig);
            setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Directive processed. Observe the panel on the left: **The Forge**. This is where the core cognitive architecture of your asset is defined. I have configured its primary directive for 'Creative Writing'." }]);
            setTimeout(() => setHighlightedElement({ rect: getElementRect(forgeRef), padding: 10, radius: 12 }), 100);
          } catch (e) { console.error(e); }
          break;
        case 3:
            setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Now, observe the center panel: the **Live Blueprint**. This is a real-time specification document generated from my core analysis of the asset's structure. Note how it reflects the agent's directive." }]);
            setTimeout(() => {
                setHighlightedElement({ rect: getElementRect(blueprintRef), padding: 10, radius: 12 });
                if (isMobile) setMobileView('visualize');
            }, 100);
          break;
        case 4:
            if(isMobile) setMobileView('chat');
            setHighlightedElement({ rect: getElementRect(chatRef), padding: 10, radius: 12 });
            setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: `The final protocol is to archive your work in the **Gallery**. I have proposed a designation for this blueprint. Engage the save protocol below to commit it.`, action: { label: `Archive "${userName}'s Story-Engine"`, type: 'save_onboarding_agent' } }]);
            break;
        case 5:
            setOnboardingComplete(true);
            setHighlightedElement(null);
            setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: `Congratulations, Architect ${userName}. You have forged your first synthetic asset. The lab is now fully unlocked. My Σ-Matrix is stable and I am ready for your next directive.` }]);
            setOnboardingStep(-1); // End onboarding
            break;
      }
    };
    runOnboardingStep();
  }, [onboardingStep, userName, isMobile, handleGenerateBlueprint, setOnboardingComplete]);


  useEffect(() => {
    if (onboardingStep > -1) return;
    const initialMessage = `The Forge is active in **${creationMode.toUpperCase()}** mode. State your intent to begin the engineering process.`;
    setMessages([
      { id: Date.now(), sender: 'ai', text: initialMessage },
    ]);
    handleGenerateBlueprint(config);
  }, [creationMode, onboardingStep, config, handleGenerateBlueprint]);

  useEffect(() => {
      setSystemStatus(calculateSystemStatus(config));
  }, [config]);

  const handleCreationModeChange = (mode: CreationMode) => {
    if (onboardingStep > -1) return;
    setCreationMode(mode);
    switch (mode) {
        case 'llm': setConfig(DEFAULT_LLM_CONFIG); break;
        case 'agent': setConfig(DEFAULT_AGENT_CONFIG); break;
        case 'workflow': setConfig(DEFAULT_WORKFLOW_CONFIG); break;
        case 'app': setConfig(DEFAULT_APP_CONFIG); break;
        default: setConfig(DEFAULT_LLM_CONFIG);
    }
  };

  const handleLiveConfigUpdate = useCallback(async (description: string) => {
    setIsLiveUpdating(true);
    try {
        const newConfig = await generateConfigFromDescription(description, creationMode);
        setConfig(newConfig);
        handleGenerateBlueprint(newConfig); // Regenerate blueprint on live update
    } catch (error: any) {
        console.error("Live update failed:", error);
        setMessages(prev => [...prev, {
            id: Date.now(),
            sender: 'ai',
            text: `Live-update failed: ${error.message}`,
            isError: true,
        }]);
    } finally {
        setIsLiveUpdating(false);
    }
  }, [creationMode, handleGenerateBlueprint]);

  useEffect(() => {
    if (onboardingStep > -1 || debouncedPrompt.trim().length < MIN_PROMPT_LENGTH) {
        return;
    }
    handleLiveConfigUpdate(debouncedPrompt);
  }, [debouncedPrompt, handleLiveConfigUpdate, onboardingStep]);

  const handleOnboardingAction = (actionType: 'save_onboarding_agent') => {
    if (onboardingStep === 4 && actionType === 'save_onboarding_agent') {
        const agentName = `${userName}'s Story-Engine`;
        onSaveModel(agentName, config);
        setMessages(prev => [...prev, {id: Date.now(), sender: 'ai', text: `Confirmed. Blueprint for "${agentName}" has been archived.`}]);
        setOnboardingStep(5);
    }
    else {
      setOnboardingStep(prev => prev + 1);
    }
  };
  
  const handleConfigUpdate = (newConfig: UnifiedConfig) => {
      setConfig(newConfig);
      handleGenerateBlueprint(newConfig);
  }

  const handleConfigChange = useCallback((section: any, key: any, value: any) => {
    if (onboardingStep > -1) return;
    const newConfig = { ...config };
    if (newConfig.type === 'llm') {
        (newConfig[section] as any)[key] = value;
        handleConfigUpdate(newConfig);
    }
  }, [onboardingStep, config, handleConfigUpdate]);

  const handleDomainToggle = useCallback((domainName: string) => {
    if (onboardingStep > -1) return;
    const newConfig = { ...config };
    if (newConfig.type === 'llm') {
      const currentDomains = newConfig.expertise.domains;
      const newDomains = currentDomains.includes(domainName)
        ? currentDomains.filter(d => d !== domainName)
        : [...currentDomains, domainName];
      newConfig.expertise.domains = newDomains;
      handleConfigUpdate(newConfig);
    }
  }, [onboardingStep, config, handleConfigUpdate]);
  
  const handleAgentConfigChange = useCallback((key: keyof Omit<AgentConfig, 'tools' | 'webSearchConfig' | 'type'>, value: any) => {
    if (onboardingStep > -1) return;
    const newConfig = { ...config };
    if (newConfig.type === 'agent') {
      (newConfig as any)[key] = value;
      handleConfigUpdate(newConfig);
    }
  }, [onboardingStep, config, handleConfigUpdate]);

  const handleAgentToolToggle = useCallback((tool: AgentTool) => {
    if (onboardingStep > -1) return;
    const newConfig = { ...config };
    if (newConfig.type === 'agent') {
      const newTools = newConfig.tools.includes(tool)
        ? newConfig.tools.filter(t => t !== tool)
        : [...newConfig.tools, tool];
      newConfig.tools = newTools;
      handleConfigUpdate(newConfig);
    }
  }, [onboardingStep, config, handleConfigUpdate]);
  
  const handleWebSearchConfigChange = useCallback((key: keyof WebSearchConfig, value: any) => {
      if (onboardingStep > -1) return;
      const newConfig = { ...config };
      if (newConfig.type === 'agent') {
          const currentWebConfig = newConfig.webSearchConfig || DEFAULT_AGENT_CONFIG.webSearchConfig;
          newConfig.webSearchConfig = { ...currentWebConfig!, [key]: value };
          handleConfigUpdate(newConfig);
      }
  }, [onboardingStep, config, handleConfigUpdate]);

  const handleArchitectClick = (fullPrompt: string, userText: string) => {
    // Handle onboarding steps
    if (onboardingStep === 0) {
      setUserName(userText.trim());
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText.trim() }]);
      setOnboardingStep(1);
      setPrompt('');
      return;
    }
    if (onboardingStep === 1) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText.trim() }]);
      setOnboardingStep(2);
      setPrompt('');
      return;
    }
    if (onboardingStep > -1) return; // Block normal function during onboarding

    if (userText.trim().length < MIN_PROMPT_LENGTH) return;
    setIsLoading(true);
    const userMessage: Message = { id: Date.now(), sender: 'user', text: userText };
    setMessages(prev => [...prev, userMessage]);
    handleGenerateAstridResponse(userMessage.id + 1, fullPrompt); 
    setPrompt('');
  };
  
  const handleGenerateAstridResponse = useCallback(async (aiMessageId: number, userPrompt: string) => {
    setMessages(prev => [...prev, { id: aiMessageId, sender: 'ai', text: '' }]);
    try {
      const newConfig = await generateConfigFromDescription(userPrompt, creationMode);
      setConfig(newConfig);
      handleGenerateBlueprint(newConfig);

      let fullText = "";
      for await (const chunk of generateAstridResponseStream(newConfig, userPrompt)) {
        fullText += chunk;
        setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: fullText } : m));
      }
    } catch (error: any) {
       setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: error.message, isError: true } : m));
    } finally {
      setIsLoading(false);
    }
  }, [creationMode, handleGenerateBlueprint]);

  const handleRequestReflection = useCallback(async () => {
    if (onboardingStep > -1) return;
    setIsLoading(true);
    const reflectionMessageId = Date.now();
    setMessages(prev => [...prev, { id: reflectionMessageId, sender: 'ai', text: '', isReflection: true }]);
    try {
        let fullText = "";
        for await (const chunk of generateAstridReflection(config)) {
            fullText += chunk;
            setMessages(prev => prev.map(m => m.id === reflectionMessageId ? { ...m, text: fullText } : m));
        }
    } catch (error: any) {
        setMessages(prev => prev.map(m => m.id === reflectionMessageId ? { ...m, text: error.message, isError: true } : m));
    } finally {
        setIsLoading(false);
    }
  }, [config, onboardingStep]);

  const handleSaveWithName = (name: string) => {
    onSaveModel(name, config);
    setIsSaveModalOpen(false);
    setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Confirmed. A new version of the "${name}" blueprint has been committed to the gallery.`
    }]);
  };

  const handleLoadModel = (modelConfig: UnifiedConfig, modelName: string) => {
    setCreationMode(modelConfig.type);
    setConfig(modelConfig);
    handleGenerateBlueprint(modelConfig);
    setIsGalleryOpen(false);
    setMobileView('chat');
     setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: `The blueprint for "${modelName}" (${modelConfig.type.toUpperCase()}) is now loaded.`
    }]);
  };
  
  const commonProps = {
      config,
      messages,
      isLoading,
      isLiveUpdating,
      prompt,
      onPromptChange: setPrompt,
      // LLM
      handleConfigChange,
      handleDomainToggle,
      // Agent
      handleAgentConfigChange,
      handleAgentToolToggle,
      handleWebSearchConfigChange,
      // Common
      handleArchitectClick,
      handleRequestReflection,
      openSaveModal: () => setIsSaveModalOpen(true),
      openPreview: () => setIsPreviewOpen(true),
      // Onboarding
      onboardingStep,
// FIX: Corrected typo from `onOnboardingAction` to `handleOnboardingAction` to pass the correct function as a prop.
      onOnboardingAction: handleOnboardingAction,
      // Blueprint
      blueprintText,
      isBlueprintLoading,
  };

  const layoutRefs = { forgeRef, blueprintRef, chatRef };

  return (
    <div className={`bg-[var(--color-bg-primary)] bg-gradient-to-br from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)] min-h-screen flex flex-col h-screen transition-filter duration-500 ${onboardingStep > -1 ? 'pointer-events-none' : ''}`}>
      <Header
        onShowGallery={() => setIsGalleryOpen(true)}
        onShowSettings={() => setIsSettingsOpen(true)}
        onShowKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
        creationMode={creationMode}
        onCreationModeChange={handleCreationModeChange}
        systemStatus={systemStatus}
      />
      
      {isMobile ? (
        <MobileLayout
          {...commonProps}
// FIX: Changed from `ref` to a standard `refs` prop to correctly pass multiple refs without violating React's rules for the `ref` attribute.
          refs={layoutRefs}
          mobileView={mobileView}
          setMobileView={setMobileView}
          openGallery={() => setIsGalleryOpen(true)}
        />
      ) : (
// FIX: Changed from `ref` to a standard `refs` prop to correctly pass multiple refs.
        <DesktopLayout {...commonProps} refs={layoutRefs} />
      )}
      
      <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} models={savedModels} onLoad={handleLoadModel} onDelete={onDeleteModel} />
      <SaveModelModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={handleSaveWithName} />
      <ArchitecturePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} config={config} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentTheme={theme} 
        onThemeChange={onThemeChange}
        onShowLicense={() => setIsLicenseOpen(true)}
      />
      <LicenseModal isOpen={isLicenseOpen} onClose={() => setIsLicenseOpen(false)} />
      <KnowledgeBaseModal isOpen={isKnowledgeBaseOpen} onClose={() => setIsKnowledgeBaseOpen(false)} />
       {onboardingStep > -1 && (
        <OnboardingGuide 
          step={onboardingStep}
          highlightedElement={highlightedElement}
          userName={userName}
          onNext={() => setOnboardingStep(prev => prev + 1)}
        />
       )}
    </div>
  );
};