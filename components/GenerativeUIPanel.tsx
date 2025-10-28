import React, { useState, forwardRef } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { SparklesIcon, AppIcon } from './icons/Icons';
import type { AppConfig } from '../types';
// FIX: Correctly import functions from geminiService.
import { generateUIImage, generateUICode } from '../services/geminiService';

interface GenerativeUIPanelProps {
  config: AppConfig;
}

export const GenerativeUIPanel = forwardRef<HTMLDivElement, GenerativeUIPanelProps>(({ config }, ref) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedCode(null);

    try {
      const [imgResult, codeResult] = await Promise.all([
        generateUIImage(prompt, config),
        generateUICode(prompt, config)
      ]);
      setGeneratedImage(imgResult);
      setGeneratedCode(codeResult);
    } catch (e: any) {
      setError(e.message || "Failed to generate UI assets.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card ref={ref} className="h-full">
      <Card.Header>
        <Card.Title>Generative UI Scaffolding</Card.Title>
        <Card.Description>
          Describe the main interface of your application to generate a visual concept and starter code.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin">
        <div className="flex flex-col gap-2">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'A dashboard for real-time stock market data visualization...'"
                className="w-full bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm resize-none scrollbar-thin"
                rows={3}
                disabled={isLoading}
            />
            <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
                <SparklesIcon className="w-5 h-5" />
                {isLoading ? 'Generating Assets...' : 'Generate UI'}
            </Button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4">
            <div>
                <h3 className="text-lg font-semibold mb-2 text-[rgb(var(--color-primary-light-val))]">UI Concept</h3>
                <div className="w-full aspect-video bg-black/20 rounded-lg flex items-center justify-center border border-[rgb(var(--color-border-val)/0.2)]">
                    {isLoading && !generatedImage && <p className="text-slate-400 animate-pulse">Generating image...</p>}
                    {generatedImage && <img src={generatedImage} alt="Generated UI Concept" className="w-full h-full object-contain rounded-lg"/>}
                    {!isLoading && !generatedImage && <div className="text-slate-500 text-center"><AppIcon className="w-10 h-10 mx-auto"/><p>Image will appear here</p></div>}
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-2 text-[rgb(var(--color-primary-light-val))]">Component Code</h3>
                <div className="w-full h-64 bg-black/20 rounded-lg border border-[rgb(var(--color-border-val)/0.2)] overflow-auto scrollbar-thin">
                    {isLoading && !generatedCode && <p className="text-slate-400 animate-pulse p-4">Generating code...</p>}
                    {generatedCode && <pre className="text-xs p-4 text-slate-300"><code>{generatedCode}</code></pre>}
                    {!isLoading && !generatedCode && <p className="text-slate-500 p-4 text-center">Code will appear here</p>}
                </div>
            </div>
        </div>
      </Card.Content>
    </Card>
  );
});