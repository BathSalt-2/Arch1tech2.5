import React from 'react';
import type { Message, MobileView, UnifiedConfig, ModelConfig, AgentConfig, WebSearchConfig, AgentTool, KnowledgeBaseTopic } from '../types';
import { DOMAINS } from '../constants';
import { ConfiguratorPanel } from './ConfiguratorPanel';
import { ChatPanel } from './ChatPanel';
import { BottomNavBar } from './BottomNavBar';
import { Card } from './ui/Card';
import { AgentConfiguratorPanel } from './AgentConfiguratorPanel';
import { BlueprintPanel } from './BlueprintPanel';
import { GenerativeUIPanel } from './GenerativeUIPanel';
import { VisualizationPanel } from './VisualizationPanel';

interface LayoutRefs {
    forgeRef: React.RefObject<HTMLDivElement>;
    blueprintRef: React.RefObject<HTMLDivElement>;
    chatRef: React.RefObject<HTMLDivElement>;
}

interface MobileLayoutProps {
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
    mobileView: MobileView;
    setMobileView: (view: MobileView) => void;
    openGallery: () => void;
    onboardingStep?: number;
    onOnboardingAction?: (actionType: any, data?: any) => void;
    blueprintText: string;
    isBlueprintLoading: boolean;
    refs: LayoutRefs;
    onOpenKnowledgeBase: (topic: KnowledgeBaseTopic) => void;
    onOpenEthicalSim: () => void;
    onLaunchAgentSim: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
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
    mobileView,
    setMobileView,
    openGallery,
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

    const renderContent = () => {
        switch (mobileView) {
            case 'chat':
                return (
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
                );
            case 'configure':
                switch (config.type) {
                    case 'llm':
                        return <ConfiguratorPanel
                            ref={forgeRef}
                            config={config as ModelConfig}
                            onConfigChange={handleConfigChange}
                            onDomainToggle={handleDomainToggle}
                            domains={DOMAINS}
                            isLiveUpdating={isLiveUpdating}
                        />;
                    case 'agent':
                        return <AgentConfiguratorPanel
                            ref={forgeRef}
                            config={config as AgentConfig}
                            onConfigChange={handleAgentConfigChange}
                            onToolToggle={handleAgentToolToggle}
                            onWebSearchConfigChange={handleWebSearchConfigChange}
                            isLiveUpdating={isLiveUpdating}
                            onLaunchSimulation={onLaunchAgentSim}
                        />;
                    case 'app':
                        return <GenerativeUIPanel ref={forgeRef} config={config} />;
                    default:
                        return <Card className="h-full" ref={forgeRef}>
                            <Card.Header>
                                <Card.Title>{config.type.charAt(0).toUpperCase() + config.type.slice(1)} Configuration</Card.Title>
                                <Card.Description>This asset type is configured via the command console.</Card.Description>
                            </Card.Header>
                            <Card.Content className="overflow-auto scrollbar-thin">
                                <pre className="text-xs bg-slate-900/50 p-2 rounded-md">{JSON.stringify(config, null, 2)}</pre>
                            </Card.Content>
                        </Card>;
                }
            case 'visualize':
                return (
                    <VisualizationPanel
                        ref={null}
                        config={config}
                    />
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
