import React from 'react';
import type { Message, UnifiedConfig, ModelConfig, AgentConfig, WebSearchConfig, AgentTool } from '../types';
import { DOMAINS } from '../constants';
import { ConfiguratorPanel } from './ConfiguratorPanel';
import { ChatPanel } from './ChatPanel';
import { Card } from './ui/Card';
import { AgentConfiguratorPanel } from './AgentConfiguratorPanel';
import { BlueprintPanel } from './BlueprintPanel';

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
}) => {
    
    const { forgeRef, blueprintRef, chatRef } = refs;

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
                    />
                );
            default:
                 return (
                    <Card className="h-full" ref={forgeRef}>
                        <Card.Header>
                            <Card.Title>{config.type.charAt(0).toUpperCase() + config.type.slice(1)} Configuration</Card.Title>
                            <Card.Description>Live updates for this asset type are reflected below.</Card.Description>
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
            <div className="lg:w-1/3 xl:w-1/4 h-full">
                {renderConfigurator()}
            </div>
            <div className="lg:w-2/3 xl:w-3/4 flex flex-col gap-4 h-full">
                <BlueprintPanel
                    ref={blueprintRef}
                    blueprintText={blueprintText}
                    isLoading={isBlueprintLoading}
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
                />
            </div>
        </main>
    );
};