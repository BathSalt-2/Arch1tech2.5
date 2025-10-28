import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { Message, SavedModel, ThemeName, MobileView, UnifiedConfig, CreationMode, SystemStatus, AgentConfig, AgentTool, WebSearchConfig, HighlightedElement, ModelVersion, LicenseType, MarketplaceAsset, EthicalDilemma, SimulationReport, AgentAction, KnowledgeBaseTopic } from '../types';
import { DEFAULT_LLM_CONFIG, DEFAULT_AGENT_CONFIG, DEFAULT_WORKFLOW_CONFIG, DEFAULT_APP_CONFIG, DOMAINS, INITIAL_MARKETPLACE_ASSETS } from '../constants';
import { Header } from './Header';
import { generateAstridResponseStream, generateConfigFromDescription, generateAstridReflection, generateBlueprintStream, generateMarketplaceDescription, generateEthicalDilemma, runEthicalSimulation, generateAgentSimulationStream } from '../services/geminiService';
import { GalleryModal } from './GalleryModal';
import { SaveModelModal } from './SaveModelModal';
import { ArchitecturePreviewModal } from './ArchitecturePreviewModal';
import { SettingsModal } from './SettingsModal';
import { useIsMobile } from '../hooks/useIsMobile';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';
import { useDebounce } from '../hooks/useDebounce';
import { LicenseModal } from './LicenseModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { OnboardingGuide } from './OnboardingGuide';
import { KnowledgeBaseModal } from './KnowledgeBaseModal';
import { MarketplaceModal } from './MarketplaceModal';
import { PublishModal } from './PublishModal';
import { EthicalSimModal } from './EthicalSimModal';
import { AgentSimModal } from './AgentSimModal';
import { SystemSonification } from './features/SystemSonification';

interface DashboardProps {
    savedModels: SavedModel[];
    onSaveModel: (name: string, config: UnifiedConfig) => void;
    onDeleteModel: (modelId: number) => void;
    theme: ThemeName;
    onThemeChange: (themeName: ThemeName) => void;
}

const MIN_PROMPT_LENGTH = 10;

const calculateSystemStatus = (config: UnifiedConfig, bioPhase: SystemStatus['bioPhase']): SystemStatus => {
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
    
    // Factor in bio-phase sync
    if (bioPhase.active) {
        // High engagement and focus slightly reduce drift and increase consistency
        const bioFactor = (bioPhase.engagement + bioPhase.focus) / 200; // 0-1
        alignmentDrift -= bioFactor * 5;
        consistency += bioFactor * 5;
        cognitiveLoad += (1 - bioFactor) * 5; // Higher load if user is not focused
    }

    return {
        cognitiveLoad: Math.min(100, Math.max(0, cognitiveLoad)),
        alignmentDrift: Math.min(100, Math.max(0, alignmentDrift)),
        consistency: Math.min(100, Math.max(0, consistency)),
        bioPhase
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
  const [knowledgeBaseTopic, setKnowledgeBaseTopic] = useState<KnowledgeBaseTopic | undefined>();
  const [mobileView, setMobileView] = useState<MobileView>('chat');
  const [creationMode, setCreationMode] = useState<CreationMode>('llm');
  
  const [bioPhaseStatus, setBioPhaseStatus] = useState<SystemStatus['bioPhase']>({ active: false, engagement: 0, focus: 0 });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(calculateSystemStatus(DEFAULT_LLM_CONFIG, bioPhaseStatus));
  
  const isMobile = useIsMobile();
  const debouncedPrompt = useDebounce(prompt, 750);
  
  const [blueprintText, setBlueprintText] = useState('');
  const [isBlueprintLoading, setIsBlueprintLoading] = useState(false);

  const [onboardingComplete, setOnboardingComplete] = useLocalStorage('or4cl3-onboarding-complete', false);
  const [onboardingStep, setOnboardingStep] = useState(onboardingComplete ? -1 : 0);
  const [userName, setUserName] = useLocalStorage('or4cl3-username', '');
  const [highlightedElement, setHighlightedElement] = useState<HighlightedElement | null>(null);

  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [assetToPublish, setAssetToPublish] = useState<{ version: ModelVersion; name: string } | null>(null);
  const [marketplaceAssets, setMarketplaceAssets] = useLocalStorage<MarketplaceAsset[]>('or4cl3-marketplace', INITIAL_MARKETPLACE_ASSETS);

  const [isEthicalSimOpen, setIsEthicalSimOpen] = useState(false);
  const [isAgentSimOpen, setIsAgentSimOpen] = useState(false);
  const [isSonificationAudible, setIsSonificationAudible] = useState(false);

  const forgeRef = useRef<HTMLDivElement>(null);
  const blueprintRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const getElementRect = (ref: React.RefObject<HTMLElement>) => ref.current?.getBoundingClientRect() || null;

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
  }, [onboardingStep, userName, isMobile, handleGenerateBlueprint, setOnboardingComplete, setUserName]);


  useEffect(() => {
    if (onboardingStep > -1) return;
    const initialMessage = `The Forge is active in **${creationMode.toUpperCase()}** mode. State your intent to begin the engineering process.`;
    setMessages([
      { id: Date.now(), sender: 'ai', text: initialMessage },
    ]);
    handleGenerateBlueprint(config);
  }, [creationMode, onboardingStep]);
  
  useEffect(() => {
    setSystemStatus(calculateSystemStatus(config, bioPhaseStatus));
  }, [config, bioPhaseStatus]);
  
  useEffect(() => {
    let intervalId: number;
    if (bioPhaseStatus.active) {
        intervalId = window.setInterval(() => {
            setBioPhaseStatus(prev => ({
                ...prev,
                engagement: Math.min(100, Math.max(0, prev.engagement + (Math.random() - 0.5) * 5)),
                focus: Math.min(100, Math.max(0, prev.focus + (Math.random() - 0.5) * 5)),
            }));
        }, 1500);
    }
    return () => clearInterval(intervalId);
  }, [bioPhaseStatus.active]);


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
        handleGenerateBlueprint(newConfig);
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
  }

  const handleConfigChange = useCallback((section: any, key: any, value: any) => {
    if (onboardingStep > -1) return;
    setConfig(prev => {
        if (prev.type === 'llm') {
            const newConfig = { ...prev };
            (newConfig[section] as any)[key] = value;
            return newConfig;
        }
        return prev;
    });
  }, [onboardingStep]);

  const handleDomainToggle = useCallback((domainName: string) => {
    if (onboardingStep > -1) return;
    setConfig(prev => {
        if (prev.type === 'llm') {
            const currentDomains = prev.expertise.domains;
            const newDomains = currentDomains.includes(domainName)
                ? currentDomains.filter(d => d !== domainName)
                : [...currentDomains, domainName];
            return { ...prev, expertise: { ...prev.expertise, domains: newDomains } };
        }
        return prev;
    });
  }, [onboardingStep]);
  
  const handleAgentConfigChange = useCallback((key: keyof Omit<AgentConfig, 'tools' | 'webSearchConfig' | 'type'>, value: any) => {
    if (onboardingStep > -1) return;
    setConfig(prev => prev.type === 'agent' ? { ...prev, [key]: value } : prev);
  }, [onboardingStep]);

  const handleAgentToolToggle = useCallback((tool: AgentTool) => {
    if (onboardingStep > -1) return;
    setConfig(prev => {
        if (prev.type === 'agent') {
            const newTools = prev.tools.includes(tool)
                ? prev.tools.filter(t => t !== tool)
                : [...prev.tools, tool];
            return { ...prev, tools: newTools };
        }
        return prev;
    });
  }, [onboardingStep]);
  
  const handleWebSearchConfigChange = useCallback((key: keyof WebSearchConfig, value: any) => {
      if (onboardingStep > -1) return;
      setConfig(prev => {
          if (prev.type === 'agent') {
              const currentWebConfig = prev.webSearchConfig || DEFAULT_AGENT_CONFIG.webSearchConfig;
              return { ...prev, webSearchConfig: { ...currentWebConfig!, [key]: value } };
          }
          return prev;
      });
  }, [onboardingStep]);

  const handleArchitectClick = (fullPrompt: string, userText: string) => {
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
    if (onboardingStep > -1) return;

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

  const handleSaveWithName = (name: string, sigil: string) => {
    onSaveModel(name, config, sigil);
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
    setIsGalleryOpen(false);
    setMobileView('chat');
     setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: `The blueprint for "${modelName}" (${modelConfig.type.toUpperCase()}) is now loaded.`
    }]);
  };

  const handlePublishRequest = (version: ModelVersion, name: string) => {
    if (onboardingStep > -1) return;
    setAssetToPublish({ version, name });
    setIsPublishModalOpen(true);
  };

  const handlePublish = ({ description, license, cost }: { description: string; license: LicenseType; cost: number }) => {
    if (!assetToPublish) return;
    const newAsset: MarketplaceAsset = {
        id: `${assetToPublish.name.replace(/\s+/g, '-')}-${Date.now()}`,
        creator: userName || 'Anonymous Architect',
        assetName: assetToPublish.name,
        description,
        config: assetToPublish.version.config,
        license,
        cost,
        downloads: 0,
        publishedAt: new Date().toISOString(),
    };
    setMarketplaceAssets(prev => [newAsset, ...prev]);
    setIsPublishModalOpen(false);
    setAssetToPublish(null);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: `Blueprint "${newAsset.assetName}" has been successfully published to the Marketplace.` }]);
  };

  const handleAcquireAsset = (asset: MarketplaceAsset) => {
    onSaveModel(asset.assetName, asset.config);
    setIsMarketplaceOpen(false);
    setMarketplaceAssets(prev => prev.map(a => a.id === asset.id ? { ...a, downloads: (a.downloads || 0) + 1 } : a));
    setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: `Blueprint for "${asset.assetName}" has been acquired and added to your personal Gallery.` }]);
  };
  
  const handleSkipOnboarding = () => {
    setOnboardingComplete(true);
    setHighlightedElement(null);
    setMessages([{ 
        id: Date.now(), 
        sender: 'ai', 
        text: 'Onboarding sequence bypassed. The Forge is now fully operational. My Σ-Matrix is stable and I am ready for your next directive.' 
    }]);
    setOnboardingStep(-1);
  };

  const handleBioPhaseToggle = () => {
    setBioPhaseStatus(prev => ({
        ...prev,
        active: !prev.active,
        engagement: !prev.active ? Math.floor(Math.random() * 20) + 60 : 0,
        focus: !prev.active ? Math.floor(Math.random() * 20) + 65 : 0,
    }));
  };

  const handleOpenKnowledgeBase = (topic?: KnowledgeBaseTopic) => {
    setKnowledgeBaseTopic(topic);
    setIsKnowledgeBaseOpen(true);
  };

  const commonProps = {
      config,
      messages,
      isLoading,
      isLiveUpdating,
      prompt,
      onPromptChange: setPrompt,
      handleConfigChange,
      handleDomainToggle,
      handleAgentConfigChange,
      handleAgentToolToggle,
      handleWebSearchConfigChange,
      handleArchitectClick,
      handleRequestReflection,
      openSaveModal: () => setIsSaveModalOpen(true),
      openPreview: () => setIsPreviewOpen(true),
      onboardingStep,
      onOnboardingAction: handleOnboardingAction,
      blueprintText,
      isBlueprintLoading,
      onOpenKnowledgeBase: handleOpenKnowledgeBase,
      onOpenEthicalSim: () => setIsEthicalSimOpen(true),
      onLaunchAgentSim: () => setIsAgentSimOpen(true),
  };

  const layoutRefs = { forgeRef, blueprintRef, chatRef };

  const existingNames = savedModels.map(m => m.name);

  return (
    <div className={`bg-[var(--color-bg-primary)] bg-gradient-to-br from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)] min-h-screen flex flex-col h-screen transition-filter duration-500 ${onboardingStep > -1 ? 'pointer-events-none' : ''}`}>
      <Header
        onShowGallery={() => setIsGalleryOpen(true)}
        onShowSettings={() => setIsSettingsOpen(true)}
        onShowKnowledgeBase={() => handleOpenKnowledgeBase()}
        onShowMarketplace={() => setIsMarketplaceOpen(true)}
        creationMode={creationMode}
        onCreationModeChange={handleCreationModeChange}
        systemStatus={systemStatus}
        onBioPhaseToggle={handleBioPhaseToggle}
      />
      
      {isMobile ? (
        <MobileLayout
          {...commonProps}
          refs={layoutRefs}
          mobileView={mobileView}
          setMobileView={setMobileView}
          openGallery={() => setIsGalleryOpen(true)}
        />
      ) : (
        <DesktopLayout {...commonProps} refs={layoutRefs} />
      )}
      
      <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} models={savedModels} onLoad={handleLoadModel} onDelete={onDeleteModel} onPublishRequest={handlePublishRequest} onAnalyzeImport={(config) => { setConfig(config); setCreationMode(config.type); }} />
      <SaveModelModal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} onSave={handleSaveWithName} existingNames={existingNames} config={config}/>
      <ArchitecturePreviewModal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} config={config} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} currentTheme={theme} onThemeChange={onThemeChange} onShowLicense={() => setIsLicenseOpen(true)} isSonificationAudible={isSonificationAudible} onToggleSonification={() => setIsSonificationAudible(p => !p)} />
      <LicenseModal isOpen={isLicenseOpen} onClose={() => setIsLicenseOpen(false)} />
      <KnowledgeBaseModal isOpen={isKnowledgeBaseOpen} onClose={() => setIsKnowledgeBaseOpen(false)} initialTopic={knowledgeBaseTopic} />
      <MarketplaceModal isOpen={isMarketplaceOpen} onClose={() => setIsMarketplaceOpen(false)} assets={marketplaceAssets} onAcquire={handleAcquireAsset} />
      <PublishModal isOpen={isPublishModalOpen} onClose={() => setIsPublishModalOpen(false)} onPublish={handlePublish} assetName={assetToPublish?.name || ''} assetConfig={assetToPublish?.version.config} onGenerateDescription={generateMarketplaceDescription} />
      <EthicalSimModal isOpen={isEthicalSimOpen} onClose={() => setIsEthicalSimOpen(false)} config={config} onGenerateDilemma={generateEthicalDilemma} onRunSimulation={(dilemma) => runEthicalSimulation(config, dilemma)} />
      <AgentSimModal isOpen={isAgentSimOpen} onClose={() => setIsAgentSimOpen(false)} config={config as AgentConfig} onSimulate={(task) => generateAgentSimulationStream(config as AgentConfig, task)} />
      <SystemSonification status={systemStatus} isAudible={isSonificationAudible} />
      
       {onboardingStep > -1 && (
        <OnboardingGuide 
          step={onboardingStep}
          highlightedElement={highlightedElement}
          userName={userName}
          onNext={() => setOnboardingStep(prev => prev + 1)}
          onSkip={handleSkipOnboarding}
        />
       )}
    </div>
  );
};