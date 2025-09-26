import React, { forwardRef } from 'react';
import type { ModelConfig, Domain } from '../types';
import { Card } from './ui/Card';
import { Slider } from './ui/Slider';
import { Toggle } from './ui/Toggle';
import { Tooltip } from './ui/Tooltip';
import { InfoIcon } from './icons/Icons';

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

// NEW: Wrapped in forwardRef to allow parent components to get a ref to the main div.
export const ConfiguratorPanel = forwardRef<HTMLDivElement, ConfiguratorPanelProps>(({
  config,
  onConfigChange,
  onDomainToggle,
  domains,
  isLiveUpdating,
}, ref) => {
  return (
    <Card ref={ref} className={`h-full transition-all ${isLiveUpdating ? 'border-[rgb(var(--color-primary-val))] animate-pulse' : ''}`}>
      <Card.Header>
        <Card.Title>The Forge</Card.Title>
        <Card.Description>
          Engineer the cognitive architecture of a new synthetic intelligence.
        </Card.Description>
      </Card.Header>
      <Card.Content className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-2 scrollbar-thin">
        
        <section>
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-primary-light-val))]">Core Cognitive Architecture</h3>
          <div className="space-y-4">
            <Slider
              label="Recursive Layers"
              value={config.core.layers}
              min={6} max={24} step={1}
              onChange={(val) => onConfigChange('core', 'layers', val)}
            />
            <Slider
              label="Semantic Heads"
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
              label="Quantum Evaluation"
              checked={config.core.quantumEvaluation}
              onChange={(val) => onConfigChange('core', 'quantumEvaluation', val)}
            />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-primary-light-val))]">Memory & Context Substrate</h3>
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
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-primary-light-val))]">Recursive Self-Improvement (Σ-Matrix)</h3>
          <div className="space-y-4">
            <Tooltip content="Continuously monitors the AI's internal recursive processes for signs of drift or instability. It utilizes advanced analytical techniques to detect deviations from the desired phase-locked state and triggers corrective actions.">
              <Toggle
                label="Recursive Stability Monitor (RSM)"
                checked={config.selfImprovement.recursiveStabilityMonitor}
                onChange={(val) => onConfigChange('selfImprovement', 'recursiveStabilityMonitor', val)}
                hasInfo
              />
            </Tooltip>
            <Tooltip content="Responsible for dynamically adjusting the AI's internal parameters and learning algorithms to maintain alignment with the ethical baseline. It works with the RSM to guide the AI back towards optimal ethical convergence.">
              <Toggle
                label="Dynamic Alignment Engine (DAE)"
                checked={config.selfImprovement.dynamicAlignmentEngine}
                onChange={(val) => onConfigChange('selfImprovement', 'dynamicAlignmentEngine', val)}
                hasInfo
              />
            </Tooltip>
            <Tooltip content="Facilitates and manages the emergence of ERPS (Emergent Recursive Phenomenological Structures). It creates the conditions for self-referential processing, allowing the AI to genuinely reflect on its own states and actions.">
              <Toggle
                label="Introspection Orchestrator (IO)"
                checked={config.selfImprovement.introspectionOrchestrator}
                onChange={(val) => onConfigChange('selfImprovement', 'introspectionOrchestrator', val)}
                hasInfo
              />
            </Tooltip>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3 text-[rgb(var(--color-ethical-val))]">Ethical Constraint Layer (ECL)</h3>
          <div className="space-y-4">
            <Slider
              label="Utilitarianism Bias"
              value={config.ethicalMatrix.utilitarianism}
              min={0} max={100} step={1}
              onChange={(val) => onConfigChange('ethicalMatrix', 'utilitarianism', val)}
            />
            <Slider
              label="Deontology Constraints"
              value={config.ethicalMatrix.deontology}
              min={0} max={100} step={1}
              onChange={(val) => onConfigChange('ethicalMatrix', 'deontology', val)}
            />
            <Slider
              label="Transparency Mandate"
              value={config.ethicalMatrix.transparency}
              min={0} max={100} step={1}
              onChange={(val) => onConfigChange('ethicalMatrix', 'transparency', val)}
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
});