import React from 'react';
import type { HighlightedElement } from '../types';
import { Button } from './ui/Button';

interface OnboardingGuideProps {
    step: number;
    highlightedElement: HighlightedElement | null;
    userName: string;
    onNext: () => void;
    onSkip: () => void;
}

const getStepContent = (step: number, userName: string) => {
    switch(step) {
        case 0:
            return {
                title: "Welcome to the Forge",
                text: "I am Astrid, your QSCI-based co-pilot. To personalize our session, please state your name in the console below.",
                showNext: false,
            };
        case 1:
            return {
                title: `Acknowledged, Architect ${userName}`,
                text: "This Forge engineers divergent machine cognition. We will begin by forging a 'Story Helper' agent. Input the directive I have prepared, then engage the 'Architect' protocol.",
                showNext: false,
            };
        case 2:
            return {
                title: "This is The Forge",
                text: "This panel defines the core cognitive architecture of your asset. I have configured its primary directive for 'Creative Writing'. Let's continue.",
                showNext: true,
            };
        case 3:
            return {
                title: "The Live Blueprint",
                text: "This is the real-time specification document, generated from my core analysis. Note how it reflects the agent's new directive. Ready for the final step?",
                showNext: true,
            };
        case 4:
            return {
                title: "Archive Your Blueprint",
                text: "The final protocol is to archive your work in the Gallery. Engage the protocol below to commit this blueprint.",
                showNext: false,
            }
        default:
            return { title: "", text: "", showNext: false };
    }
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ step, highlightedElement, userName, onNext, onSkip }) => {
    const content = getStepContent(step, userName);
    const { rect, padding = 10, radius = 12 } = highlightedElement || {};

    const textBoxPosition = rect ? { top: rect.y > window.innerHeight / 2 ? rect.top - 150 : rect.bottom + 15, left: Math.max(10, Math.min(rect.left, window.innerWidth - 330)) } : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

    return (
        <div className="fixed inset-0 z-50 pointer-events-auto">
             <svg width="100%" height="100%" className="absolute inset-0">
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {rect && (
                            <rect
                                x={rect.x - padding}
                                y={rect.y - padding}
                                width={rect.width + padding * 2}
                                height={rect.height + padding * 2}
                                rx={radius}
                                fill="black"
                                className="transition-all duration-500 ease-in-out"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.8)"
                    mask="url(#spotlight-mask)"
                />
            </svg>
            
            <div 
                className="absolute bg-slate-900/80 backdrop-blur-md border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-4 w-80 shadow-2xl transition-all duration-500 ease-in-out"
                style={textBoxPosition}
            >
                <h3 className="text-lg font-bold text-[rgb(var(--color-primary-light-val))]">{content.title}</h3>
                <p className="text-slate-300 mt-2 text-sm">{content.text}</p>
                <div className="flex justify-between items-center mt-4">
                    <button 
                        onClick={onSkip} 
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        Skip Tutorial
                    </button>
                    {content.showNext && (
                        <div className="flex justify-end">
                            <Button onClick={onNext}>Continue</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};