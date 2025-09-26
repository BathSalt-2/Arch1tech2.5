import React from 'react';
import { Card } from './ui/Card';
import { EyeIcon } from './icons/Icons';

interface BlueprintPanelProps {
  blueprintText: string;
  isLoading: boolean;
}

export const BlueprintPanel = React.forwardRef<HTMLDivElement, BlueprintPanelProps>(({ blueprintText, isLoading }, ref) => {
  return (
    <Card ref={ref} className="flex-grow flex flex-col h-full">
      <Card.Header>
        <Card.Title>Live Blueprint Specification</Card.Title>
        <Card.Description>My real-time analysis of the current configuration.</Card.Description>
      </Card.Header>
      <Card.Content className="flex-grow overflow-y-auto scrollbar-thin bg-black/20 p-4 rounded-b-xl font-mono text-sm">
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
      </Card.Content>
    </Card>
  );
});