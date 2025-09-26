import React from 'react';
// FIX: Import UnifiedConfig and Card for conditional rendering.
import type { ModelConfig, Message, ThemeName, MobileView, UnifiedConfig } from '../types';
import { DOMAINS } from '../constants';
import { ConfiguratorPanel } from './ConfiguratorPanel';
import { VisualizationPanel } from './VisualizationPanel';
import { ChatPanel } from './ChatPanel';
import { BottomNavBar } from './BottomNavBar';
import { Card } from './ui/Card';

interface MobileLayoutProps {
    // FIX: Update config to be UnifiedConfig.
    config: UnifiedConfig;
    theme: ThemeName;
    messages: Message[];
    isLoading: boolean;
    isLiveUpdating: boolean;
    prompt: string;
    onPromptChange: (value: string) => void;
    handleConfigChange: <K extends keyof ModelConfig>(
        section: K,
        key: keyof ModelConfig[K],
        value: ModelConfig[K][keyof ModelConfig[K]]
    ) => void;
    handleDomainToggle: (domainName: string) => void;
    handleArchitectClick: () => void;
    openSaveModal: () => void;
    openPreview: () => void;
    mobileView: MobileView;
    setMobileView: (view: MobileView) => void;
    openGallery: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    config,
    theme,
    messages,
    isLoading,
    isLiveUpdating,
    prompt,
    onPromptChange,
    handleConfigChange,
    handleDomainToggle,
    handleArchitectClick,
    openSaveModal,
    openPreview,
    mobileView,
    setMobileView,
    openGallery
}) => {
    const renderContent = () => {
        switch (mobileView) {
            case 'chat':
                return (
                    <ChatPanel
                        messages={messages}
                        isLoading={isLoading}
                        isLiveUpdating={isLiveUpdating}
                        prompt={prompt}
                        onPromptChange={onPromptChange}
                        onArchitectClick={handleArchitectClick}
                        config={config}
                        onSave={openSaveModal}
                        onPreview={openPreview}
                    />
                );
            case 'configure':
                // FIX: Conditionally render configurator for LLMs or a JSON view for other types.
                return config.type === 'llm' ? (
                    <ConfiguratorPanel
                        config={config}
                        onConfigChange={handleConfigChange}
                        onDomainToggle={handleDomainToggle}
                        domains={DOMAINS}
                        isLiveUpdating={isLiveUpdating}
                    />
                ) : (
                     <Card className="h-full">
                        <Card.Header>
                            <Card.Title>{config.type.charAt(0).toUpperCase() + config.type.slice(1)} Configuration</Card.Title>
                            <Card.Description>Live updates for this asset type are reflected below.</Card.Description>
                        </Card.Header>
                        <Card.Content className="overflow-auto scrollbar-thin">
                            <pre className="text-xs bg-slate-900/50 p-2 rounded-md">{JSON.stringify(config, null, 2)}</pre>
                        </Card.Content>
                    </Card>
                );
            case 'visualize':
                 // FIX: Conditionally render visualization for LLMs or a placeholder for other types.
                return config.type === 'llm' ? (
                    <VisualizationPanel config={config} theme={theme} isLiveUpdating={isLiveUpdating} />
                ) : (
                    <Card className="h-full flex items-center justify-center min-h-[300px]">
                        <Card.Content className="text-center text-slate-400">
                           <p>Blueprint visualization is only available for LLM assets.</p>
                        </Card.Content>
                    </Card>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="flex flex-col flex-grow overflow-hidden">
            <main className="flex-grow p-2 pb-20 overflow-y-auto">
                {renderContent()}
            </main>
            <BottomNavBar 
                activeView={mobileView} 
                setView={setMobileView} 
                onShowGallery={openGallery}
            />
        </div>
    );
};