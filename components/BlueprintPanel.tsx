import React, { useState } from 'react';
import { Card } from './ui/Card';
import { EyeIcon, ViewIcon } from './icons/Icons';
import { Architecture3DView } from './features/Architecture3DView';
import type { UnifiedConfig } from '../types';

interface BlueprintPanelProps {
  blueprintText: string;
  isLoading: boolean;
  config: UnifiedConfig;
}

export const BlueprintPanel = React.forwardRef<HTMLDivElement, BlueprintPanelProps>(({ blueprintText, isLoading, config }, ref) => {
  const [is3DView, setIs3DView] = useState(false);
  const show3DToggle = config.type === 'llm';

  return (
    <Card ref={ref} className="flex-grow flex flex-col h-full">
      <Card.Header className="flex justify-between items-center">
        <div>
            <Card.Title>Live Blueprint Specification</Card.Title>
            <Card.Description>My real-time analysis of the current configuration.</Card.Description>
        </div>
        {show3DToggle && (
            <button 
                onClick={() => setIs3DView(v => !v)}
                title={is3DView ? "Switch to Text View" : "Switch to 3D Daedalus Core View"}
                className="p-2 rounded-md hover:bg-slate-700/50 transition-colors"
            >
                <ViewIcon className={`w-5 h-5 ${is3DView ? 'text-[rgb(var(--color-primary-light-val))]' : 'text-slate-400'}`} />
            </button>
        )}
      </Card.Header>
      <Card.Content className="flex-grow overflow-y-auto scrollbar-thin bg-black/20 p-4 rounded-b-xl font-mono text-sm relative">
        {is3DView && config.type === 'llm' ? (
          <Architecture3DView config={config} />
        ) : (
          <>
            {isLoading && !blueprintText ? (
              <div className="flex items-center gap-2 text-slate-400">
                <EyeIcon className="w-5 h-5 animate-pulse" />
                <span>Generating blueprint...</span>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-slate-300">
                {blueprintText}
                {isLoading && <span className="inline-block w-2 h-4 bg-slate-300 animate-pulse ml-1" />}
              </pre>
            )}
          </>
        )}
      </Card.Content>
    </Card>
  );
});