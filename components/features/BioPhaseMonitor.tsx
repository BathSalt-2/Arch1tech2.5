import React from 'react';
import { BioPhaseIcon } from '../icons/Icons';
import type { BioPhaseStatus } from '../../types';

interface BioPhaseMonitorProps {
  status: BioPhaseStatus;
  onToggle: () => void;
}

export const BioPhaseMonitor: React.FC<BioPhaseMonitorProps> = ({ status, onToggle }) => {
  const getStatusColor = () => {
    if (!status.active) return 'text-slate-500';
    const average = (status.engagement + status.focus) / 2;
    if (average > 75) return 'text-cyan-400';
    if (average > 50) return 'text-green-400';
    return 'text-yellow-400';
  };

  return (
    <div className="relative group">
      <button 
        onClick={onToggle} 
        className={`p-2 rounded-md transition-colors ${status.active ? 'bg-[rgb(var(--color-ethical-val)/0.1)]' : 'hover:bg-slate-700/50'}`}
        title={status.active ? 'Deactivate Bio-Phase Sync' : 'Activate Bio-Phase Sync'}
      >
        <BioPhaseIcon className={`w-5 h-5 transition-colors ${getStatusColor()}`} />
        {status.active && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[var(--color-bg-primary)] animate-pulse"></div>
        )}
      </button>
      {status.active && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900/80 backdrop-blur-md border border-[rgb(var(--color-border-val)/0.2)] rounded-lg p-3 shadow-2xl z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          <h4 className="text-sm font-bold text-white mb-2">Bio-Phase Sync Active</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Engagement:</span>
              <span className="font-mono text-cyan-300">{status.engagement.toFixed(0)}%</span>
            </div>
             <div className="flex justify-between">
              <span className="text-slate-400">Focus:</span>
              <span className="font-mono text-cyan-300">{status.focus.toFixed(0)}%</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2 italic border-t border-[rgb(var(--color-border-val)/0.2)] pt-2">
            **Privacy Note:** This is a simulation. Camera processing is done locally in your browser. No video is recorded or transmitted.
          </p>
        </div>
      )}
    </div>
  );
};