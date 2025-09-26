import React from 'react';
import type { ModelConfig, Domain } from '../types';
import { Card } from './ui/Card';
import { Slider } from './ui/Slider';
import { Toggle } from './ui/Toggle';

interface ConfiguratorPanelProps {
  config: ModelConfig;
  onConfigChange: <K extends keyof ModelConfig>(
    section: K,
    key: keyof ModelConfig[K],
    value: ModelConfig[K][keyof ModelConfig[K]]
  ) => void;
  onDomainToggle: (domainName: string) => void;
  domains: (Domain & { icon: React.ReactNode })[];
  isLiveUpdating?: boolean;
}

export const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({
  config,
  onConfigChange,
  onDomainToggle,
  domains,
  isLiveUpdating,
}) => {
  return (
    <Card className={`h-full transition-all ${isLiveUpdating ? 'border-[rgb(var(--color-primary-val))] animate-pulse' : ''}`}>
      <Card.Header>
        <Card.Title>Model Configuration</Card.Title>
        <Card.Description>
          Tune the parameters of your Quantum-Inspired AI.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin">
        
        <section>
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-primary-light-val))]">Core Architecture</h3>
          <div className="space-y-4">
            <Slider
              label="Layers"
              value={config.core.layers}
              min={6} max={24} step={1}
              onChange={(val) => onConfigChange('core', 'layers', val)}
            />
            <Slider
              label="Attention Heads"
              value={config.core.heads}
              min={8} max={32} step={1}
              onChange={(val) => onConfigChange('core', 'heads', val)}
            />
            <Slider
              label="Hidden Dimension"
              value={config.core.hiddenDimension}
              min={256} max={1024} step={128}
              onChange={(val) => onConfigChange('core', 'hiddenDimension', val)}
            />
            <Toggle
              label="Quantum Parallel Evaluation"
              checked={config.core.quantumEvaluation}
              onChange={(val) => onConfigChange('core', 'quantumEvaluation', val)}
            />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-primary-light-val))]">Memory & Context</h3>
          <div className="space-y-4">
            <Slider
              label="Short-Term Tokens"
              value={config.memory.shortTermTokens}
              min={2048} max={16384} step={2048}
              onChange={(val) => onConfigChange('memory', 'shortTermTokens', val)}
            />
            <Toggle
              label="Episodic Memory"
              checked={config.memory.episodicMemory}
              onChange={(val) => onConfigChange('memory', 'episodicMemory', val)}
            />
            <Toggle
              label="Persistent Knowledge Graph"
              checked={config.memory.knowledgeGraph}
              onChange={(val) => onConfigChange('memory', 'knowledgeGraph', val)}
            />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-primary-light-val))]">Recursive Self-Improvement</h3>
          <div className="space-y-4">
            <Toggle
              label="Recursive Stability Monitor (RSM)"
              checked={config.selfImprovement.recursiveStabilityMonitor}
              onChange={(val) => onConfigChange('selfImprovement', 'recursiveStabilityMonitor', val)}
            />
            <Toggle
              label="Dynamic Alignment Engine (DAE)"
              checked={config.selfImprovement.dynamicAlignmentEngine}
              onChange={(val) => onConfigChange('selfImprovement', 'dynamicAlignmentEngine', val)}
            />
            <Toggle
              label="Introspection Orchestrator (IO)"
              checked={config.selfImprovement.introspectionOrchestrator}
              onChange={(val) => onConfigChange('selfImprovement', 'introspectionOrchestrator', val)}
            />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-primary-light-val))]">Interdisciplinary Modules</h3>
          <div className="space-y-2">
            {domains.map((domain) => (
              <div
                key={domain.name}
                onClick={() => onDomainToggle(domain.name)}
                className={`flex items-start gap-4 p-3 rounded-lg cursor-pointer transition-all ${
                  config.expertise.domains.includes(domain.name)
                    ? 'bg-[rgb(var(--color-primary-val)/0.2)] ring-1 ring-[rgb(var(--color-primary-light-val))]'
                    : 'bg-slate-800/50 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex-shrink-0 mt-1">{domain.icon}</div>
                <div>
                  <h4 className="font-semibold text-white">{domain.name}</h4>
                  <p className="text-sm text-slate-400">{domain.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </Card.Content>
    </Card>
  );
};
