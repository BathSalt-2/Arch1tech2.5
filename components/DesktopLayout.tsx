import React from 'react';
// FIX: Import UnifiedConfig and Card for conditional rendering.
import type { ModelConfig, Message, ThemeName, UnifiedConfig } from '../types';
import { DOMAINS } from '../constants';
import { ConfiguratorPanel } from './ConfiguratorPanel';
import { VisualizationPanel } from './VisualizationPanel';
import { ChatPanel } from './ChatPanel';
import { Card } from './ui/Card';

interface DesktopLayoutProps {
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
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
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
}) => {
    return (
        <main className="flex-grow container mx-auto p-4 flex flex-col lg:flex-row gap-4 overflow-hidden">
            <div className="lg:w-1/3 xl:w-1/4 h-full">
                {/* FIX: Conditionally render configurator for LLMs or a JSON view for other types. */}
                {config.type === 'llm' ? (
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
                )}
            </div>
            <div className="lg:w-2/3 xl:w-3/4 flex flex-col gap-4 h-full">
                {/* FIX: Conditionally render visualization for LLMs or a placeholder for other types. */}
                {config.type === 'llm' ? (
                    <VisualizationPanel config={config} theme={theme} isLiveUpdating={isLiveUpdating} />
                ) : (
                    <Card className="flex-grow flex items-center justify-center">
                        <Card.Content className="text-center text-slate-400">
                           <p>Blueprint visualization is only available for LLM assets.</p>
                        </Card.Content>
                    </Card>
                )}
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
            </div>
        </main>
    );
};