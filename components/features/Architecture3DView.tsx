import React from 'react';
import type { ModelConfig } from '../../types';
import { LayersIcon, BrainCircuitIcon, DnaIcon, ScaleIcon } from '../icons/Icons';

interface Architecture3DViewProps {
  config: ModelConfig;
}

export const Architecture3DView: React.FC<Architecture3DViewProps> = ({ config }) => {
  const { core, memory, selfImprovement, ethicalMatrix } = config;
  
  const totalItems = core.layers + 3; // Layers + 3 core modules
  const angle = 360 / totalItems;

  const getLayerColor = (index: number) => {
    const hue = (index / core.layers) * 120 + 240; // From blue to purple to pink
    return `hsl(${hue}, 70%, 60%)`;
  };

  return (
    <div className="w-full h-full flex items-center justify-center perspective-1000">
      <div className="w-80 h-80 relative preserve-3d animate-slow-spin">
        {/* Central Core */}
        <div className="absolute w-24 h-24 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgb(var(--color-primary-val)/0.3)] flex items-center justify-center text-center text-xs font-bold text-white transform-style-preserve-3d backface-hidden">
            DAEDALUS<br/>CORE
        </div>

        {/* Cognitive Layers */}
        {Array.from({ length: core.layers }).map((_, i) => (
          <div
            key={`layer-${i}`}
            className="absolute top-1/2 left-1/2 w-8 h-8 -m-4 rounded-full flex items-center justify-center border-2 transition-all duration-500"
            style={{
              borderColor: getLayerColor(i),
              transform: `rotateY(${i * angle}deg) translateZ(150px) rotateY(-${i * angle}deg)`,
              transitionDelay: `${i * 20}ms`,
            }}
          >
             <LayersIcon className="w-4 h-4" style={{ color: getLayerColor(i) }}/>
          </div>
        ))}
        
        {/* Core Modules */}
        <div
            className="absolute top-1/2 left-1/2 w-10 h-10 -m-5 rounded-md flex items-center justify-center border-2 border-cyan-400 bg-cyan-900/50"
             style={{ transform: `rotateY(${core.layers * angle}deg) translateZ(150px) rotateY(-${core.layers * angle}deg)`}}
             title={`Memory Substrate\nTokens: ${memory.shortTermTokens}`}
        >
            <BrainCircuitIcon className="w-5 h-5 text-cyan-400" />
        </div>
         <div
            className="absolute top-1/2 left-1/2 w-10 h-10 -m-5 rounded-md flex items-center justify-center border-2 border-indigo-400 bg-indigo-900/50"
             style={{ transform: `rotateY(${(core.layers + 1) * angle}deg) translateZ(150px) rotateY(-${(core.layers + 1) * angle}deg)`}}
             title={`Σ-Matrix Active: ${selfImprovement.recursiveStabilityMonitor}`}
        >
            <DnaIcon className="w-5 h-5 text-indigo-400" />
        </div>
        <div
            className="absolute top-1/2 left-1/2 w-10 h-10 -m-5 rounded-md flex items-center justify-center border-2 border-rose-400 bg-rose-900/50"
             style={{ transform: `rotateY(${(core.layers + 2) * angle}deg) translateZ(150px) rotateY(-${(core.layers + 2) * angle}deg)`}}
             title={`ECL Transparency: ${ethicalMatrix.transparency}%`}
        >
            <ScaleIcon className="w-5 h-5 text-rose-400" />
        </div>

      </div>
       <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        @keyframes slow-spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 30s linear infinite;
        }
      `}</style>
    </div>
  );
};
