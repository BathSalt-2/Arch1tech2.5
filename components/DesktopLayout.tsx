import React, { useState } from 'react';
import type { Message, UnifiedConfig, ModelConfig, AgentConfig, WebSearchConfig, AgentTool, KnowledgeBaseTopic } from '../types';
import { DOMAINS } from '../constants';
import { ConfiguratorPanel } from './ConfiguratorPanel';
import { ChatPanel } from './ChatPanel';
import { AgentConfiguratorPanel } from './AgentConfiguratorPanel';
import { BlueprintPanel } from './BlueprintPanel';
import { GenerativeUIPanel } from './GenerativeUIPanel';
import { VisualizationPanel } from './VisualizationPanel';
// FIX: Import the Card component.
import { Card } from './ui/Card';

interface LayoutRefs {
    forgeRef: React.RefObject<HTMLDivElement>;
    blueprintRef: React.RefObject<HTMLDivElement>;
    chatRef: React.RefObject<HTMLDivElement>;
}

interface DesktopLayoutProps {
    config: UnifiedConfig;
    messages: Message[];
    isLoading: boolean;
    isLiveUpdating: boolean;
    prompt: string;
    onPromptChange: (value: string) => void;
    handleConfigChange: (section: any, key: any, value: any) => void;
    handleDomainToggle: (domainName: string) => void;
    handleAgentConfigChange: (key: keyof Omit<AgentConfig, 'tools' | 'webSearchConfig' | 'type'>, value: any) => void;
    handleAgentToolToggle: (tool: AgentTool) => void;
    handleWebSearchConfigChange: (key: keyof WebSearchConfig, value: any) => void;
    handleArchitectClick: (fullPrompt: string, userText: string) => void;
    handleRequestReflection: () => void;
    openSaveModal: () => void;
    openPreview: () => void;
    onboardingStep?: number;
    onOnboardingAction?: (actionType: any, data?: any) => void;
    blueprintText: string;
    isBlueprintLoading: boolean;
    refs: LayoutRefs;
    onOpenKnowledgeBase: (topic: KnowledgeBaseTopic) => void;
    onOpenEthicalSim: () => void;
    onLaunchAgentSim: () => void;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({
    config,
    messages,
    isLoading,
    isLiveUpdating,
    prompt,
    onPromptChange,
    handleConfigChange,
    handleDomainToggle,
    handleAgentConfigChange,
    handleAgentToolToggle,
    handleWebSearchConfigChange,
    handleArchitectClick,
    handleRequestReflection,
    openSaveModal,
    openPreview,
    onboardingStep,
    onOnboardingAction,
    blueprintText,
    isBlueprintLoading,
    refs,
    onOpenKnowledgeBase,
    onOpenEthicalSim,
    onLaunchAgentSim,
}) => {
    
    const { forgeRef, blueprintRef, chatRef } = refs;
    const [leftPanel, setLeftPanel] = useState<'forge' | 'visualize'>('forge');

    const renderConfigurator = () => {
        switch (config.type) {
            case 'llm':
                return (
                    <ConfiguratorPanel
                        ref={forgeRef}
                        config={config}
                        onConfigChange={handleConfigChange}
                        onDomainToggle={handleDomainToggle}
                        domains={DOMAINS}
                        isLiveUpdating={isLiveUpdating}
                    />
                );
            case 'agent':
                return (
                    <AgentConfiguratorPanel
                        ref={forgeRef}
                        config={config}
                        onConfigChange={handleAgentConfigChange}
                        onToolToggle={handleAgentToolToggle}
                        onWebSearchConfigChange={handleWebSearchConfigChange}
                        isLiveUpdating={isLiveUpdating}
                        onLaunchSimulation={onLaunchAgentSim}
                    />
                );
            case 'app':
                return (
                    <GenerativeUIPanel ref={forgeRef} config={config} />
                );
            default:
                 return (
                    <Card className="h-full" ref={forgeRef}>
                        <Card.Header>
                            <Card.Title>{config.type.charAt(0).toUpperCase() + config.type.slice(1)} Configuration</Card.Title>
                            <Card.Description>This asset type is configured via the command console.</Card.Description>
                        </Card.Header>
                        <Card.Content className="overflow-auto scrollbar-thin">
                            <pre className="text-xs bg-slate-900/50 p-2 rounded-md">{JSON.stringify(config, null, 2)}</pre>
                        </Card.Content>
                    </Card>
                );
        }
    }

    return (
        <main className="flex-grow container mx-auto p-4 flex flex-col lg:flex-row gap-4 overflow-hidden">
            {/* Left column with Forge/Visualize tabs */}
            <div className="lg:w-1/3 xl:w-1/4 h-full flex flex-col gap-2">
                {/* Tab switcher */}
                <div
                    className="flex rounded-lg overflow-hidden border flex-shrink-0"
                    style={{ borderColor: 'var(--color-primary)', borderOpacity: 0.3 }}
                >
                    <button
                        onClick={() => setLeftPanel('forge')}
                        className="flex-1 py-2 px-3 text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-1.5"
                        style={{
                            backgroundColor: leftPanel === 'forge'
                                ? 'color-mix(in srgb, var(--color-primary) 20%, transparent)'
                                : 'transparent',
                            color: leftPanel === 'forge' ? 'var(--color-primary)' : 'var(--color-text-secondary, #64748b)',
                            borderRight: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)',
                        }}
                    >
                        <span>⚙️</span>
                        <span>FORGE</span>
                    </button>
                    <button
                        onClick={() => setLeftPanel('visualize')}
                        className="flex-1 py-2 px-3 text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-1.5"
                        style={{
                            backgroundColor: leftPanel === 'visualize'
                                ? 'color-mix(in srgb, var(--color-primary) 20%, transparent)'
                                : 'transparent',
                            color: leftPanel === 'visualize' ? 'var(--color-primary)' : 'var(--color-text-secondary, #64748b)',
                        }}
                    >
                        <span>🔮</span>
                        <span>VISUALIZE</span>
                    </button>
                </div>

                {/* Panel content */}
                <div className="flex-grow overflow-hidden">
                    {leftPanel === 'forge' ? renderConfigurator() : (
                        <VisualizationPanel config={config} ref={null} />
                    )}
                </div>
            </div>

            {/* Right column: Blueprint + Chat */}
            <div className="lg:w-2/3 xl:w-3/4 flex flex-col gap-4 h-full">
                <BlueprintPanel
                    ref={blueprintRef}
                    blueprintText={blueprintText}
                    isLoading={isBlueprintLoading}
                    config={config}
                />
                <ChatPanel
                    ref={chatRef}
                    messages={messages}
                    isLoading={isLoading}
                    isLiveUpdating={isLiveUpdating}
                    prompt={prompt}
                    onPromptChange={onPromptChange}
                    onArchitectClick={handleArchitectClick}
                    config={config}
                    onSave={openSaveModal}
                    onPreview={openPreview}
                    onReflect={handleRequestReflection}
                    onboardingStep={onboardingStep}
                    onOnboardingAction={onOnboardingAction as any}
                    onOpenKnowledgeBase={onOpenKnowledgeBase}
                    onOpenEthicalSim={onOpenEthicalSim}
                />
            </div>
        </main>
    );
};
