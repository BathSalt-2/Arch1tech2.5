import React from 'react';
import type { Message, KnowledgeBaseTopic } from '../types';
import { Button } from './ui/Button';
import { BotIcon, SaveIcon, AlertTriangleIcon, DnaIcon } from './icons/Icons';

interface InteractiveAIMessageProps {
    message: Message;
    onOnboardingAction?: (actionType: 'save_onboarding_agent') => void;
    onOpenKnowledgeBase: (topic: KnowledgeBaseTopic) => void;
}

const KNOWLEDGE_BASE_KEYWORDS: { keyword: string; topic: KnowledgeBaseTopic }[] = [
    { keyword: 'QSCI', topic: 'Engineering the Inner World' },
    { keyword: 'Σ-Matrix', topic: 'Engineering the Inner World' },
    { keyword: 'Sigma-Matrix', topic: 'Engineering the Inner World' },
    { keyword: 'ERPS', topic: 'ERPS Explained' },
    { keyword: 'Synthetic Epinoetics', topic: 'Engineering the Inner World' },
    { keyword: 'AEGIS-Ω', topic: 'Founder\'s Dossier' },
];

export const InteractiveAIMessage: React.FC<InteractiveAIMessageProps> = ({ message, onOnboardingAction, onOpenKnowledgeBase }) => {
  const { text, isReflection, isError, action } = message;

  const renderTextWithLinks = (inputText: string) => {
    let remainingText = inputText;
    // FIX: Change type to React.ReactNode to resolve JSX namespace error.
    const parts: (string | React.ReactNode)[] = [];
    let keyIndex = 0;

    while(remainingText.length > 0) {
        let foundMatch = false;
        for (const { keyword, topic } of KNOWLEDGE_BASE_KEYWORDS) {
            const regex = new RegExp(`(${keyword})`, 'i');
            const match = remainingText.match(regex);

            if (match && match.index !== undefined) {
                const prefix = remainingText.substring(0, match.index);
                if (prefix) parts.push(prefix);
                
                parts.push(
                    <button 
                        key={`${keyword}-${keyIndex++}`}
                        onClick={() => onOpenKnowledgeBase(topic)}
                        className="font-bold text-[rgb(var(--color-ethical-val))] hover:underline"
                    >
                        {match[1]}
                    </button>
                );
                remainingText = remainingText.substring(match.index + keyword.length);
                foundMatch = true;
                break;
            }
        }
        if (!foundMatch) {
            parts.push(remainingText);
            break;
        }
    }
    return <p className={`whitespace-pre-wrap ${
                isError ? 'text-red-200' :
                isReflection ? 'text-indigo-200' : 'text-slate-200'
            }`}>{parts}</p>;
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ring-1 ${
          isError ? 'bg-red-900/50 ring-red-400' :
          isReflection ? 'bg-indigo-900/50 ring-indigo-400' : 
          'bg-[rgb(var(--color-primary-val)/0.2)] ring-[rgb(var(--color-primary-val))]'
      }`}>
        {isError ? (
          <AlertTriangleIcon className="w-5 h-5 text-red-300" />
        ) : isReflection ? (
          <DnaIcon className="w-5 h-5 text-indigo-300" />
        ) : (
          <BotIcon className="w-5 h-5 text-[rgb(var(--color-primary-light-val))]" />
        )}
      </div>
      <div className={`rounded-lg p-3 max-w-2xl min-w-[60px] ${
          isError ? 'bg-red-800/40 border border-red-600/50' :
          isReflection ? 'bg-slate-800/60 border border-indigo-600/50 italic' : 
          'bg-slate-700/50'
      }`}>
          {text.length === 0 ? (
              <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[rgb(var(--color-primary-light-val))] rounded-full animate-pulse delay-0"></span>
                  <span className="w-2 h-2 bg-[rgb(var(--color-primary-light-val))] rounded-full animate-pulse delay-150"></span>
                  <span className="w-2 h-2 bg-[rgb(var(--color-primary-light-val))] rounded-full animate-pulse delay-300"></span>
              </div>
          ) : (
              renderTextWithLinks(text)
          )}
          {action && onOnboardingAction && (
            <Button onClick={() => onOnboardingAction(action.type)} className="mt-3 w-full">
              <SaveIcon className="w-5 h-5" />
              {action.label}
            </Button>
          )}
      </div>
    </div>
  );
};