import React, { useState, useEffect } from 'react';
import type { ModelConfig, ThemeName } from '../types';
import { Card } from './ui/Card';
// FIX: Import Button and SparklesIcon for the new "Generate Blueprint" feature.
import { Button } from './ui/Button';
import { SparklesIcon } from './icons/Icons';

interface VisualizationPanelProps {
  config: ModelConfig;
  theme: ThemeName;
  isLiveUpdating?: boolean;
}

const initialColors = {
  core: '#f0abfc', 
  expertise: '#c084fc',
  memory: '#a5b4fc',
  selfImprove: '#818cf8',
  ethical: '#22d3ee',
  connection: 'rgba(192, 132, 252, 0.4)',
  inactiveConnection: 'rgba(71, 85, 105, 0.3)',
};

const DataParticle: React.FC<{ pathId: string, delay: string, active: boolean, color: string }> = ({ pathId, delay, active, color }) => (
  <circle cx="0" cy="0" r="1.5" fill={color} opacity={active ? 1 : 0}>
    <animateMotion dur="4s" repeatCount="indefinite" begin={delay}>
      <mpath href={`#${pathId}`} />
    </animateMotion>
  </circle>
);

const SubNode: React.FC<{ cx: number, cy: number, label: string, color: string, active: boolean }> = ({ cx, cy, label, color, active }) => (
    <g opacity={active ? 1 : 0.3} style={{ transition: 'opacity 0.3s ease-in-out' }}>
        <circle cx={cx} cy={cy} r={3} fill={color}>
            {active && <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />}
        </circle>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#e2e8f0" fontSize="4" fontWeight="bold">{label}</text>
    </g>
);


export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ config, theme, isLiveUpdating }) => {
  const { core, expertise, memory, selfImprovement } = config;
  const [colors, setColors] = useState(initialColors);
  // FIX: Add state to force re-render of the blueprint SVG for animation.
  const [blueprintKey, setBlueprintKey] = useState(0);

  useEffect(() => {
    // This effect reads the CSS variables from the DOM when the theme changes
    const style = getComputedStyle(document.body);
    setColors({
      core: `rgb(${style.getPropertyValue('--color-primary-light-val')})`,
      expertise: `rgb(${style.getPropertyValue('--color-secondary-val')})`,
      memory: `rgb(${style.getPropertyValue('--color-secondary-hover-val')})`,
      selfImprove: `rgb(${style.getPropertyValue('--color-accent-val')})`,
      ethical: `rgb(${style.getPropertyValue('--color-ethical-val')})`,
      connection: `rgba(${style.getPropertyValue('--color-accent-val')}, 0.4)`,
      inactiveConnection: 'rgba(71, 85, 105, 0.3)',
    });
  }, [theme]);

  const isExpertiseActive = expertise.domains.length > 0;
  const isMemoryActive = memory.episodicMemory || memory.knowledgeGraph;
  const isImprovementActive = selfImprovement.recursiveStabilityMonitor || selfImprovement.dynamicAlignmentEngine || selfImprovement.introspectionOrchestrator;
  const corePulseDuration = `${4 - (core.layers / 24) * 2}s`;

  return (
    <Card className={`flex-grow transition-all ${isLiveUpdating ? 'border-[rgb(var(--color-primary-val))] animate-pulse' : ''}`}>
      <Card.Header>
        <Card.Title>Architectural Blueprint</Card.Title>
        <Card.Description>A real-time visualization of your AI's quantum-neural structure.</Card.Description>
      </Card.Header>
      <Card.Content className="flex items-center justify-center h-full min-h-[300px] lg:min-h-0">
        {/* FIX: Add key to SVG to allow re-triggering animations. */}
        <svg key={blueprintKey} width="100%" height="100%" viewBox="0 0 400 300">
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.core} stopOpacity="0.6" />
              <stop offset="100%" stopColor={colors.core} stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <style>{`
            @keyframes pulse-vigilant {
              0%, 100% {
                stroke-opacity: 0.4;
                r: 28;
              }
              50% {
                stroke-opacity: 0.8;
                r: 30;
              }
            }
          `}</style>

          {/* Paths for particles */}
          <path id="path-expertise" d="M 200,150 C 150,150 150,75 100,75" fill="none" stroke={isExpertiseActive ? colors.connection : colors.inactiveConnection} strokeWidth="1" />
          <path id="path-memory" d="M 200,150 C 250,150 250,75 300,75" fill="none" stroke={isMemoryActive ? colors.connection : colors.inactiveConnection} strokeWidth="1" />
          <path id="path-selfImprove" d="M 200,150 C 150,150 150,225 100,225" fill="none" stroke={isImprovementActive ? colors.connection : colors.inactiveConnection} strokeWidth="1" />
          <path id="path-ethical" d="M 200,150 C 250,150 250,225 300,225" fill="none" stroke={colors.connection} strokeWidth="1" />
          
          {/* Data Particles */}
          <DataParticle pathId="path-expertise" delay="0s" active={isExpertiseActive} color={colors.core} />
          <DataParticle pathId="path-expertise" delay="2s" active={isExpertiseActive} color={colors.core} />
          <DataParticle pathId="path-memory" delay="0.5s" active={isMemoryActive} color={colors.core} />
          <DataParticle pathId="path-memory" delay="2.5s" active={isMemoryActive} color={colors.core} />
          <DataParticle pathId="path-selfImprove" delay="1s" active={isImprovementActive} color={colors.core} />
          <DataParticle pathId="path-selfImprove" delay="3s" active={isImprovementActive} color={colors.core} />
          <DataParticle pathId="path-ethical" delay="1.5s" active={true} color={colors.core} />
          <DataParticle pathId="path-ethical" delay="3.5s" active={true} color={colors.core} />
          
          {/* Central Core */}
          <g transform="translate(200, 150)">
            <circle cx="0" cy="0" r="40" fill="url(#coreGlow)" filter="url(#glow)" />
            <circle cx="0" cy="0" r="20" fill="var(--color-bg-primary)" stroke={colors.core} strokeWidth="1.5">
              <animate attributeName="r" values="20;22;20" dur={corePulseDuration} repeatCount="indefinite" />
            </circle>
             {Array.from({ length: core.heads / 4 }).map((_, i) => (
                <line
                  key={i}
                  x1="0" y1="0" x2="0" y2="-30"
                  stroke={core.quantumEvaluation ? colors.core : colors.inactiveConnection}
                  strokeWidth="1"
                  transform={`rotate(${i * (360 / (core.heads / 4))})`}
                >
                    <animateTransform attributeName="transform" type="rotate" from={`${i * (360 / (core.heads / 4))}`} to={`${i * (360 / (core.heads / 4)) + 360}`} dur="10s" repeatCount="indefinite" />
                </line>
              ))}
            <text x="0" y="5" textAnchor="middle" fill="#e2e8f0" fontSize="12" fontWeight="bold">Core</text>
          </g>

          {/* Module Nodes */}
          {[[100, 75, "Expertise", colors.expertise, isExpertiseActive], [300, 75, "Memory", colors.memory, isMemoryActive], [100, 225, "Self-Improve", colors.selfImprove, isImprovementActive], [300, 225, "Ethical Matrix", colors.ethical, true]].map(
            ([x, y, label, color, active]) => (
            <g key={label as string} transform={`translate(${x}, ${y})`} opacity={active ? 1 : 0.4} style={{ transition: 'opacity 0.3s' }}>
              <circle cx="0" cy="0" r="25" fill="var(--color-bg-primary)" stroke={active ? color as string : colors.inactiveConnection} strokeWidth="1.5" />
              <circle 
                cx="0" cy="0" r="28" 
                stroke={active ? color as string : 'transparent'} 
                strokeWidth="1.5" 
                strokeOpacity="0.3" 
                filter="url(#glow)"
                style={label === 'Ethical Matrix' ? { animation: 'pulse-vigilant 2.5s ease-in-out infinite' } : {}}
              />
              <text x="0" y="15" textAnchor="middle" fill="#e2e8f0" fontSize="9" fontWeight="semibold">
                {label}
              </text>

               {label === 'Memory' && (
                <>
                  <SubNode cx={-8} cy={-5} label="EM" color={color as string} active={memory.episodicMemory} />
                  <SubNode cx={8} cy={-5} label="KG" color={color as string} active={memory.knowledgeGraph} />
                </>
              )}
              {label === 'Self-Improve' && (
                <>
                  <SubNode cx={-10} cy={-5} label="RSM" color={color as string} active={selfImprovement.recursiveStabilityMonitor} />
                  <SubNode cx={0} cy={-5} label="DAE" color={color as string} active={selfImprovement.dynamicAlignmentEngine} />
                  <SubNode cx={10} cy={-5} label="IO" color={color as string} active={selfImprovement.introspectionOrchestrator} />
                </>
              )}

            </g>
          ))}
        </svg>
      </Card.Content>
      {/* FIX: Add a footer with a button to regenerate the blueprint animation. */}
      <Card.Footer className="flex justify-center">
        <Button onClick={() => setBlueprintKey(k => k + 1)} className="w-full sm:w-auto">
          <SparklesIcon className="w-5 h-5" />
          Generate Blueprint
        </Button>
      </Card.Footer>
    </Card>
  );
};