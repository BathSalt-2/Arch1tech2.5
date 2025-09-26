import React from 'react';
import type { SystemStatus } from '../../types';

interface SigmaMatrixProps {
  status: SystemStatus;
}

const Gauge: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    return (
        <div className="flex flex-col items-center w-24">
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

export const SigmaMatrix: React.FC<SigmaMatrixProps> = ({ status }) => {
  return (
    <div className="flex items-center gap-4 bg-black/20 p-2 rounded-lg border border-[rgb(var(--color-border-val)/0.1)]">
        <Gauge label="Cognitive Load" value={status.cognitiveLoad} color="rgb(var(--color-primary-val))" />
        <Gauge label="Consistency" value={status.consistency} color="rgb(var(--color-ethical-val))" />
        <Gauge label="Alignment Drift" value={status.alignmentDrift} color="rgb(var(--color-secondary-val))" />
    </div>
  );
};