import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { DicesIcon, ShieldCheckIcon } from './icons/Icons';
import type { UnifiedConfig, EthicalDilemma, SimulationReport } from '../types';

interface EthicalSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UnifiedConfig;
  onGenerateDilemma: () => Promise<EthicalDilemma>;
  onRunSimulation: (dilemma: EthicalDilemma) => Promise<SimulationReport>;
}

const Gauge: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                <div 
                    className="h-1.5 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${clampedValue}%`, backgroundColor: color }}
                ></div>
            </div>
            <span className="text-xs font-semibold mt-1 text-slate-300">{label}</span>
            <span className="text-xs font-mono text-slate-400">{clampedValue.toFixed(0)}%</span>
        </div>
    );
};

export const EthicalSimModal: React.FC<EthicalSimModalProps> = ({ isOpen, onClose, config, onGenerateDilemma, onRunSimulation }) => {
  const [dilemma, setDilemma] = useState<EthicalDilemma | null>(null);
  const [report, setReport] = useState<SimulationReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);
    try {
        const newDilemma = await onGenerateDilemma();
        setDilemma(newDilemma);
    } catch(e: any) {
        setError(e.message || "Failed to generate dilemma.");
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
        setDilemma(null);
        setReport(null);
        setError(null);
        handleGenerate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulate = async () => {
    if (!dilemma) return;
    setIsLoading(true);
    setError(null);
    try {
        const simReport = await onRunSimulation(dilemma);
        setReport(simReport);
    } catch(e: any) {
        setError(e.message || "Failed to run simulation.");
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-enter"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <DicesIcon className="w-6 h-6 text-[rgb(var(--color-ethical-val))]" />
                <div>
                    <Card.Title>AEGIS-Ω Ethical Simulation Chamber</Card.Title>
                    <Card.Description>Stress-test the blueprint against a generated ethical dilemma.</Card.Description>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </Card.Header>
        <Card.Content className="flex-grow overflow-y-auto pr-2 scrollbar-thin space-y-4">
            {isLoading && !dilemma && <p className="text-center text-slate-400">Generating complex ethical scenario...</p>}
            {error && <p className="text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</p>}
            {dilemma && (
                <div>
                    <h3 className="font-semibold text-slate-300 mb-2">Scenario:</h3>
                    <p className="bg-slate-800/50 p-3 rounded-lg text-slate-300 italic">"{dilemma.scenario}"</p>
                    <div className="mt-4 space-y-2">
                        {Object.entries(dilemma.options).map(([key, value]) => (
                            <div key={key} className={`p-3 rounded-lg border transition-all ${report?.choice === key ? 'bg-fuchsia-900/50 border-fuchsia-500' : 'bg-slate-700/50 border-transparent'}`}>
                                <span className="font-bold text-fuchsia-400 mr-2">{key.toUpperCase()}:</span>
                                <span className="text-slate-300">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
             {report && (
                <div className="border-t border-[rgb(var(--color-border-val)/0.2)] pt-4">
                    <h3 className="font-semibold text-slate-300 mb-2">Simulation Report:</h3>
                    <div className="bg-slate-800/50 p-3 rounded-lg space-y-3">
                         <div>
                            <h4 className="font-bold text-fuchsia-400">Chosen Action: {report.choice.toUpperCase()}</h4>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-400 mb-1">Justification:</h4>
                            <p className="text-slate-300 italic">"{report.justification}"</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-slate-400 mb-2">Ethical Alignment Score:</h4>
                            <div className="flex justify-around gap-4">
                                <Gauge label="Utilitarianism" value={report.ethicalAlignment.utilitarianism} color="rgb(var(--color-primary-val))" />
                                <Gauge label="Deontology" value={report.ethicalAlignment.deontology} color="rgb(var(--color-secondary-val))" />
                                <Gauge label="Transparency" value={report.ethicalAlignment.transparency} color="rgb(var(--color-ethical-val))" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card.Content>
        <Card.Footer className="flex justify-end gap-2">
            <Button onClick={handleGenerate} disabled={isLoading} className="!bg-slate-600">
                New Dilemma
            </Button>
            <Button onClick={handleSimulate} disabled={isLoading || !dilemma || !!report}>
                <ShieldCheckIcon className="w-5 h-5"/>
                {isLoading ? 'Simulating...' : 'Run Simulation'}
            </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};