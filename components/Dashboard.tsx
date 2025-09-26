import React, { useState, useCallback, useEffect } from 'react';
// FIX: Import UnifiedConfig and CreationMode to support multiple asset types.
import type { ModelConfig, Message, SavedModel, ThemeName, MobileView, UnifiedConfig, CreationMode } from '../types';
import { DEFAULT_CONFIG, DOMAINS } from '../constants';
import { Header } from './Header';
// FIX: Corrected the import name to match the exported function in geminiService.
import { generateModelSummaryStream, generateConfigFromDescription } from '../services/geminiService';
import { GalleryModal } from './GalleryModal';
import { SaveModelModal } from './SaveModelModal';
import { ArchitecturePreviewModal } from './ArchitecturePreviewModal';
import { SettingsModal } from './SettingsModal';
import { useIsMobile } from '../hooks/useIsMobile';
import { DesktopLayout } from './DesktopLayout';
import { MobileLayout } from './MobileLayout';
import { useDebounce } from '../hooks/useDebounce';

interface DashboardProps {
    savedModels: SavedModel[];
    // FIX: Update config type to UnifiedConfig to allow saving any asset type.
    onSaveModel: (name: string, config: UnifiedConfig) => void;
    onDeleteModel: (modelId: number) => void;
    theme: ThemeName;
    onThemeChange: (themeName: ThemeName) => void;
}

const MIN_PROMPT_LENGTH = 10;

export const Dashboard: React.FC<DashboardProps> = ({ savedModels, onSaveModel, onDeleteModel, theme, onThemeChange }) => {
  // FIX: Change config state to hold any type of UnifiedConfig.
  const [config, setConfig] = useState<UnifiedConfig>(DEFAULT_CONFIG);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveUpdating, setIsLiveUpdating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('chat');
  const [creationMode, setCreationMode] = useState<CreationMode>('llm');
  const isMobile = useIsMobile();
  const debouncedPrompt = useDebounce(prompt, 750);

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: "I am Astrid, your co-pilot in the Arch1tech 2.0 lab.\n\nTo begin, please describe the model you wish to build. What are its primary goals, and are there any constraints I should be aware of?",
      },
    ]);
  }, []);

  const handleLiveConfigUpdate = useCallback(async (description: string) => {
    setIsLiveUpdating(true);
    try {
        // FIX: Pass the current creationMode to the generator function.
        const newConfig = await generateConfigFromDescription(description, creationMode);
        setConfig(newConfig);
        if (isMobile && mobileView === 'chat') {
            setMobileView('configure'); // Switch view to show the user their changes
        }
    } catch (error) {
        console.error("Live update failed:", error);
        // Optionally, show a subtle error to the user
    } finally {
        setIsLiveUpdating(false);
    }
  // FIX: Add creationMode to dependency array.
  }, [isMobile, mobileView, creationMode]);

  useEffect(() => {
    if (debouncedPrompt.trim().length >= MIN_PROMPT_LENGTH) {
      handleLiveConfigUpdate(debouncedPrompt);
    }
  }, [debouncedPrompt, handleLiveConfigUpdate]);


  const handleConfigChange = useCallback(<K extends keyof ModelConfig>(
    section: K,
    key: keyof ModelConfig[K],
    value: ModelConfig[K][keyof ModelConfig[K]]
  ) => {
    setConfig(prevConfig => {
      // FIX: Add guard to ensure config is an LLM before updating LLM-specific fields.
      if (prevConfig.type !== 'llm') return prevConfig;
      return {
      ...prevConfig,
      [section]: {
        ...prevConfig[section],
        [key]: value,
      },
    }});
  }, []);

  const handleDomainToggle = useCallback((domainName: string) => {
    setConfig(prevConfig => {
      // FIX: Add guard to ensure config is an LLM before updating LLM-specific fields.
      if (prevConfig.type !== 'llm') return prevConfig;
      const currentDomains = prevConfig.expertise.domains;
      const newDomains = currentDomains.includes(domainName)
        ? currentDomains.filter(d => d !== domainName)
        : [...currentDomains, domainName];
      return {
        ...prevConfig,
        expertise: {
          ...prevConfig.expertise,
          domains: newDomains,
        },
      };
    });
  }, []);

  const handleArchitectClick = () => {
    if (prompt.trim().length < MIN_PROMPT_LENGTH) return;
    
    setIsLoading(true);
    const userMessage: Message = { id: Date.now(), sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setPrompt(''); // Clear input after finalizing
    
    // Now generate the summary for the locked-in config
    handleGenerateSummary(userMessage.id + 1);
  };
  
  const handleGenerateSummary = useCallback(async (aiMessageId: number) => {
    setMessages(prev => [
      ...prev,
      { id: aiMessageId, sender: 'ai', text: '' }
    ]);

    try {
      const stream = generateModelSummaryStream(config);
      for await (const chunk of stream) {
        setMessages(prev => prev.map(m => 
            m.id === aiMessageId ? { ...m, text: m.text + chunk } : m
        ));
      }
    } catch (error) {
       const errorResponseText = "I've encountered an anomaly in my reasoning matrix. My Σ-Matrix has flagged a potential instability. I recommend we pause and try generating the summary again.";
       setMessages(prev => prev.map(m => m.id === aiMessageId ? { ...m, text: errorResponseText } : m));
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const handleSaveWithName = (name: string) => {
    onSaveModel(name, config);
    setIsSaveModalOpen(false);
    setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Confirmed. A new version of the "${name}" blueprint has been committed to the gallery.`
    }]);
  };

  // FIX: Update to handle UnifiedConfig and set creationMode accordingly.
  const handleLoadModel = (modelConfig: UnifiedConfig, modelName: string) => {
    setConfig(modelConfig);
    setCreationMode(modelConfig.type);
    setIsGalleryOpen(false);
    setMobileView('configure'); // Switch to config view on load
     setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: `The blueprint for "${modelName}" (${modelConfig.type.toUpperCase()}) is now loaded. All parameters have been updated to reflect the selected version.`
    }]);
  };
  
  const commonProps = {
      config,
      theme,
      messages,
      isLoading,
      isLiveUpdating,
      prompt,
      onPromptChange: setPrompt,
      handleConfigChange,
      handleDomainToggle,
      handleArchitectClick,
      openSaveModal: () => setIsSaveModalOpen(true),
      openPreview: () => setIsPreviewOpen(true),
  };

  return (
    <div className="bg-[var(--color-bg-primary)] bg-gradient-to-br from-[var(--color-bg-gradient-start)] to-[var(--color-bg-gradient-end)] min-h-screen flex flex-col h-screen">
      {/* FIX: Pass creationMode and onCreationModeChange props to Header. */}
      <Header
        onShowGallery={() => setIsGalleryOpen(true)}
        onShowSettings={() => setIsSettingsOpen(true)}
        creationMode={creationMode}
        onCreationModeChange={setCreationMode}
      />
      
      {isMobile ? (
        <MobileLayout
          {...commonProps}
          mobileView={mobileView}
          setMobileView={setMobileView}
          openGallery={() => setIsGalleryOpen(true)}
        />
      ) : (
        <DesktopLayout {...commonProps} />
      )}
      
      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        models={savedModels}
        onLoad={handleLoadModel}
        onDelete={onDeleteModel}
      />
      <SaveModelModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveWithName}
      />
       <ArchitecturePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        config={config}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        onThemeChange={onThemeChange}
      />
    </div>
  );
};