import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { SaveIcon, SparklesIcon } from './icons/Icons';
import type { UnifiedConfig } from '../types';

interface SaveModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, sigil: string) => void;
  existingNames: string[];
  config: UnifiedConfig;
}

const generateSigilSVG = (config: UnifiedConfig): string => {
    const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; 
        }
        return hash;
    };

    const seed = hashString(JSON.stringify(config));
    const rand = (min: number, max: number, offset: number) => {
        const x = Math.sin(seed + offset) * 10000;
        return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    const c1 = `hsl(${rand(0, 360, 1)}, 70%, 60%)`;
    const c2 = `hsl(${rand(0, 360, 2)}, 70%, 50%)`;
    const shapes = [];
    const numShapes = rand(3, 6, 3);

    for (let i = 0; i < numShapes; i++) {
        const type = rand(0, 2, 4 + i);
        if (type === 0) { // Circle
            shapes.push(`<circle cx="${rand(20, 80, 5+i)}" cy="${rand(20, 80, 6+i)}" r="${rand(5, 20, 7+i)}" fill="none" stroke="${i % 2 === 0 ? c1 : c2}" stroke-width="3" opacity="0.8"/>`);
        } else if (type === 1) { // Line
            shapes.push(`<line x1="${rand(10, 90, 8+i)}" y1="${rand(10, 90, 9+i)}" x2="${rand(10, 90, 10+i)}" y2="${rand(10, 90, 11+i)}" stroke="${i % 2 === 0 ? c1 : c2}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>`);
        } else { // Polygon
            const points = Array.from({length: 3}).map((_, j) => `${rand(10, 90, 12+i+j)},${rand(10, 90, 13+i+j)}`).join(' ');
            shapes.push(`<polygon points="${points}" fill="none" stroke="${i % 2 === 0 ? c1 : c2}" stroke-width="2" opacity="0.8"/>`);
        }
    }

    return `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${shapes.join('')}</svg>`;
};


// TODO: Wire up to Gemini service
const generateNameFromConfig = async (config: UnifiedConfig): Promise<string> => {
    // Placeholder logic
    await new Promise(res => setTimeout(res, 1000));
    const type = config.type;
    const prefixes = ["Quantum", "Recursive", "Aether", "Chrono", "Synaptic"];
    const nouns = ["Weaver", "Engine", "Oracle", "Sentinel", "Core"];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} (${type.toUpperCase()})`;
}


export const SaveModelModal: React.FC<SaveModelModalProps> = ({ isOpen, onClose, onSave, existingNames, config }) => {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSigil, setGeneratedSigil] = useState('');

  useEffect(() => {
    if (isOpen) {
        setName('');
        setGeneratedSigil(generateSigilSVG(config));
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const handleSaveClick = () => {
    if (name.trim()) {
      onSave(name.trim(), generatedSigil);
      setName('');
    }
  };

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    const suggestedName = await generateNameFromConfig(config);
    setName(suggestedName);
    setIsGenerating(false);
  }

  const nameExists = name.trim() && existingNames.includes(name.trim());

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-enter"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header>
          <Card.Title>Archive Blueprint</Card.Title>
          <Card.Description>Enter a name to save this model configuration to your gallery.</Card.Description>
        </Card.Header>
        <Card.Content>
          <div className="flex items-center gap-4">
              <div 
                className="w-20 h-20 flex-shrink-0 bg-black/20 rounded-md flex items-center justify-center border border-[rgb(var(--color-border-val)/0.2)] p-1"
                dangerouslySetInnerHTML={{ __html: generatedSigil }}
                title="Procedurally Generated Asset Sigil"
              />
              <div className="flex-grow space-y-2">
                 <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-300">Designation</label>
                    <Button onClick={handleGenerateClick} disabled={isGenerating} className="!text-xs !py-1 !px-2 !bg-indigo-600">
                        <SparklesIcon className="w-4 h-4" />
                        {isGenerating ? 'Asking Astrid...' : 'Suggest'}
                    </Button>
                 </div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Creative Storyteller v1"
                    className="w-full bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            if(name.trim()) handleSaveClick();
                        }
                    }}
                />
              </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 h-4 transition-opacity duration-300"
             style={{ opacity: name.trim() ? 1 : 0 }}
          >
            {nameExists 
                ? "This will add a new version to the existing blueprint." 
                : "This will create a new blueprint in your gallery."
            }
          </p>
        </Card.Content>
        <Card.Footer className="flex justify-end gap-2">
            <Button onClick={onClose} className="!bg-slate-600 hover:!bg-slate-500 focus:!ring-slate-500">
                Cancel
            </Button>
            <Button onClick={handleSaveClick} disabled={!name.trim()}>
                <SaveIcon className="w-5 h-5" />
                {nameExists ? 'Archive New Version' : 'Archive New Blueprint'}
            </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};