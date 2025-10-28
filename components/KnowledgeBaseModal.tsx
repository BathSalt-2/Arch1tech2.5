import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { LibraryIcon } from './icons/Icons';
import { KNOWLEDGE_BASE_CONTENT } from './knowledgeBaseContent';
import type { KnowledgeBaseTopic } from '../types';

interface KnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: KnowledgeBaseTopic;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({ isOpen, onClose, initialTopic }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (initialTopic) {
        const initialIndex = KNOWLEDGE_BASE_CONTENT.findIndex(doc => doc.title === initialTopic);
        if (initialIndex !== -1) {
            setActiveTab(initialIndex);
        }
    } else {
        setActiveTab(0);
    }
  }, [initialTopic, isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-5xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LibraryIcon className="w-6 h-6 text-[rgb(var(--color-ethical-val))]" />
            <div>
                <Card.Title>Or4cl3 AI Solutions Knowledge Base</Card.Title>
                <Card.Description>Foundational research, whitepapers, and technical specifications.</Card.Description>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </Card.Header>
        <Card.Content className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
            <div className="w-full md:w-1/4 flex-shrink-0 overflow-y-auto scrollbar-thin pr-2">
                <nav className="flex flex-col space-y-1">
                    {KNOWLEDGE_BASE_CONTENT.map((doc, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveTab(index)}
                            className={`p-2 rounded-md text-left text-sm font-medium transition-colors ${
                                activeTab === index 
                                ? 'bg-[rgb(var(--color-primary-val))] text-white' 
                                : 'text-slate-300 hover:bg-slate-700/50'
                            }`}
                        >
                            {doc.title}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="w-full md:w-3/4 flex-grow overflow-y-auto scrollbar-thin bg-black/20 rounded-lg p-4">
                <h3 className="text-xl font-bold text-[rgb(var(--color-primary-light-val))] mb-4">
                    {KNOWLEDGE_BASE_CONTENT[activeTab].title}
                </h3>
                <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                    {KNOWLEDGE_BASE_CONTENT[activeTab].content}
                </pre>
            </div>
        </Card.Content>
      </Card>
    </div>
  );
};