import React, { forwardRef } from 'react';
import type { AgentConfig, AgentGoal, AgentTool, WebSearchConfig } from '../types';
import { Card } from './ui/Card';
import { Toggle } from './ui/Toggle';
import { Slider } from './ui/Slider';
import { AGENT_TOOLS } from '../constants';

interface AgentConfiguratorPanelProps {
  config: AgentConfig;
  onConfigChange: (key: keyof Omit<AgentConfig, 'tools' | 'webSearchConfig' | 'type'>, value: any) => void;
  onToolToggle: (tool: AgentTool) => void;
  onWebSearchConfigChange: (key: keyof WebSearchConfig, value: any) => void;
  isLiveUpdating?: boolean;
}

const goals: AgentGoal[] = ['Data Analysis', 'Code Generation', 'Task Automation', 'Creative Writing'];

const SegmentedControl: React.FC<{
    options: { label: string, value: string }[],
    value: string,
    onChange: (value: any) => void
}> = ({ options, value, onChange }) => {
    return (
        <div className="flex w-full bg-slate-700/50 rounded-lg p-1">
            {options.map(opt => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`w-full rounded-md py-1 text-sm font-semibold transition-colors ${
                        value === opt.value
                         ? 'bg-[rgb(var(--color-primary-val))] text-white'
                         : 'text-slate-300 hover:bg-slate-600/50'
                    }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};

// NEW: Wrapped in forwardRef to allow parent components to get a ref to the main div.
export const AgentConfiguratorPanel = forwardRef<HTMLDivElement, AgentConfiguratorPanelProps>(({
  config,
  onConfigChange,
  onToolToggle,
  onWebSearchConfigChange,
  isLiveUpdating,
}, ref) => {
  const isWebSearchEnabled = config.tools.includes('Web Search');
  const webSearchConfig = config.webSearchConfig || { searchDepth: 'Shallow', filterResults: true, resultCount: 5, keywords: '' };


  return (
    <Card ref={ref} className={`h-full transition-all ${isLiveUpdating ? 'border-[rgb(var(--color-primary-val))] animate-pulse' : ''}`}>
      <Card.Header>
        <Card.Title>Agent Configuration</Card.Title>
        <Card.Description>
          Define the agent's goal, tools, and operational parameters.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin">
        
        <section>
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-primary-light-val))]">Core Objective</h3>
          <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-slate-300 mb-1 block">Primary Goal</label>
                <select 
                    value={config.goal} 
                    onChange={e => onConfigChange('goal', e.target.value as AgentGoal)}
                    className="w-full bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm"
                >
                    {goals.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            <Toggle
              label="Autonomous Operation"
              checked={config.autonomous}
              onChange={(val) => onConfigChange('autonomous', val)}
            />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-primary-light-val))]">Tool Integration</h3>
          <div className="space-y-2">
             {AGENT_TOOLS.map((tool) => (
                <div
                    key={tool.name}
                    onClick={() => onToolToggle(tool.name)}
                    className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                        config.tools.includes(tool.name)
                            ? 'bg-[rgb(var(--color-primary-val)/0.2)] ring-1 ring-[rgb(var(--color-primary-light-val))]'
                            : 'bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                >
                    <div className="flex-shrink-0 mt-1">{tool.icon}</div>
                    <div>
                        <h4 className="font-semibold text-white">{tool.name}</h4>
                        <p className="text-sm text-slate-400">{tool.description}</p>
                    </div>
                </div>
             ))}
          </div>
        </section>
        
        {isWebSearchEnabled && (
            <section>
                <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-secondary-hover-val))]">Web Search Parameters</h3>
                <div className="space-y-4 p-3 bg-slate-800/40 rounded-lg">
                    <div>
                        <label className="text-sm font-medium text-slate-300 mb-2 block">Search Depth</label>
                        <SegmentedControl 
                            options={[{label: 'Shallow', value: 'Shallow'}, {label: 'Deep', value: 'Deep'}]}
                            value={webSearchConfig.searchDepth}
                            onChange={(val) => onWebSearchConfigChange('searchDepth', val)}
                        />
                    </div>
                     <Toggle
                        label="Filter & Summarize Results"
                        checked={webSearchConfig.filterResults}
                        onChange={(val) => onWebSearchConfigChange('filterResults', val)}
                    />
                    <Slider
                        label="Number of Results"
                        value={webSearchConfig.resultCount}
                        min={1} max={20} step={1}
                        onChange={(val) => onWebSearchConfigChange('resultCount', val)}
                    />
                     <div>
                        <label className="text-sm font-medium text-slate-300 mb-1 block">Filter Keywords</label>
                        <input
                            type="text"
                            value={webSearchConfig.keywords}
                            onChange={(e) => onWebSearchConfigChange('keywords', e.target.value)}
                            placeholder="e.g., AI, machine learning"
                            className="w-full bg-slate-700/50 border border-[rgb(var(--color-border-val)/0.2)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm"
                        />
                    </div>
                </div>
            </section>
        )}

      </Card.Content>
    </Card>
  );
});
