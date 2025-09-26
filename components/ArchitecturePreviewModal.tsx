import React from 'react';
// FIX: Import UnifiedConfig to handle all asset types.
import type { ModelConfig, UnifiedConfig } from '../types';
import { Card } from './ui/Card';
import { CheckCircleIcon, CodeIcon, DnaIcon, EyeIcon, InfinityIcon, MusicIcon, ScaleIcon, XCircleIcon, BrainCircuitIcon } from './icons/Icons';

interface ArchitecturePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Update config type to UnifiedConfig.
  config: UnifiedConfig;
}

const DetailCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg">
        <h4 className="text-md font-semibold text-[rgb(var(--color-primary-light-val))] mb-3 border-b border-[rgb(var(--color-primary-val)/0.2)] pb-2">{title}</h4>
        <div className="space-y-2">{children}</div>
    </div>
);

const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{label}:</span>
        <span className="font-mono text-slate-200 bg-slate-700/50 px-2 py-0.5 rounded">{value}</span>
    </div>
);

const StatusItem: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
    <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">{label}:</span>
        {active ?
            <span className="flex items-center gap-1 text-green-400"><CheckCircleIcon className="w-4 h-4" /> Enabled</span> :
            <span className="flex items-center gap-1 text-red-400"><XCircleIcon className="w-4 h-4" /> Disabled</span>
        }
    </div>
);

const iconMap: { [key: string]: React.ReactNode } = {
    "Computer Science": <CodeIcon className="w-5 h-5 text-purple-400" />,
    "AI / ML": <BrainCircuitIcon className="w-5 h-5 text-fuchsia-400" />,
    "Neuroscience / Psychology": <DnaIcon className="w-5 h-5 text-pink-400" />,
    "Music Theory / Composition": <MusicIcon className="w-5 h-5 text-indigo-300" />,
    "Quantum Physics / Advanced Math": <InfinityIcon className="w-5 h-5 text-violet-400" />,
    "Philosophy / Ethics": <ScaleIcon className="w-5 h-5 text-cyan-300" />,
};

export const ArchitecturePreviewModal: React.FC<ArchitecturePreviewModalProps> = ({ isOpen, onClose, config }) => {
  if (!isOpen) return null;
  
  // FIX: Conditionally render a simple JSON view for non-LLM configs.
  if (config.type !== 'llm') {
    return (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <Card 
            className="w-full max-w-3xl max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <Card.Header className="flex justify-between items-center">
              <div>
                <Card.Title>Blueprint Preview: {config.type.toUpperCase()}</Card.Title>
                <Card.Description>A specification sheet for the current configuration.</Card.Description>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
            </Card.Header>
            <Card.Content className="overflow-y-auto pr-2 scrollbar-thin">
                <pre className="text-sm bg-slate-900/50 p-4 rounded">{JSON.stringify(config, null, 2)}</pre>
            </Card.Content>
          </Card>
        </div>
    );
  }

  const { core, memory, selfImprovement, expertise } = config;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header className="flex justify-between items-center">
          <div>
            <Card.Title>Detailed Blueprint Preview</Card.Title>
            <Card.Description>A complete specification sheet for the current model configuration.</Card.Description>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </Card.Header>
        <Card.Content className="overflow-y-auto space-y-4 pr-2 scrollbar-thin">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailCard title="Core Architecture">
                    <DetailItem label="Layers" value={core.layers} />
                    <DetailItem label="Attention Heads" value={core.heads} />
                    <DetailItem label="Hidden Dimension" value={core.hiddenDimension} />
                    <StatusItem label="Quantum Evaluation" active={core.quantumEvaluation} />
                </DetailCard>
                <DetailCard title="Memory & Context">
                    <DetailItem label="Short-Term Tokens" value={memory.shortTermTokens} />
                    <StatusItem label="Episodic Memory" active={memory.episodicMemory} />
                    <StatusItem label="Knowledge Graph" active={memory.knowledgeGraph} />
                </DetailCard>
            </div>
             <DetailCard title="Recursive Self-Improvement">
                <StatusItem label="Recursive Stability Monitor (RSM)" active={selfImprovement.recursiveStabilityMonitor} />
                <StatusItem label="Dynamic Alignment Engine (DAE)" active={selfImprovement.dynamicAlignmentEngine} />
                <StatusItem label="Introspection Orchestrator (IO)" active={selfImprovement.introspectionOrchestrator} />
            </DetailCard>
            <DetailCard title="Interdisciplinary Modules">
                {expertise.domains.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                        {expertise.domains.map(domain => (
                            <div key={domain} className="flex items-center gap-2 bg-slate-700/50 p-2 rounded-md">
                                {iconMap[domain] || <EyeIcon className="w-5 h-5 text-slate-400" />}
                                <span className="text-sm text-slate-300">{domain}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 text-center py-2">No expertise modules enabled.</p>
                )}
            </DetailCard>

        </Card.Content>
      </Card>
    </div>
  );
};