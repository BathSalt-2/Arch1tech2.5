import type { ModelConfig, Domain, Theme } from './types';
import React from 'react';
import { BrainCircuitIcon, CodeIcon, DnaIcon, InfinityIcon, MusicIcon, ScaleIcon, BriefcaseIcon, GamepadIcon, FeatherIcon } from './components/icons/Icons';

export const DEFAULT_CONFIG: ModelConfig = {
  type: 'llm',
  core: {
    layers: 12,
    heads: 16,
    hiddenDimension: 512,
    quantumEvaluation: true,
  },
  memory: {
    shortTermTokens: 8192,
    episodicMemory: true,
    knowledgeGraph: true,
  },
  selfImprovement: {
    recursiveStabilityMonitor: true,
    dynamicAlignmentEngine: true,
    introspectionOrchestrator: true,
  },
  expertise: {
    domains: [
        "Computer Science",
        "AI / ML",
        "Neuroscience / Psychology",
        "Music Theory / Composition"
    ],
  },
};

export const DOMAINS: (Domain & { icon: React.ReactNode })[] = [
  {
    name: "Computer Science",
    description: "Efficient algorithm execution, system optimization, and scalable code reasoning.",
    icon: <CodeIcon className="w-8 h-8 text-purple-400" />,
  },
  {
    name: "AI / ML",
    description: "Reinforcement learning, deep learning, transfer learning, and meta-learning.",
    icon: <BrainCircuitIcon className="w-8 h-8 text-fuchsia-400" />,
  },
  {
    name: "Neuroscience / Psychology",
    description: "Cognitive modeling, emotion recognition, and behavioral prediction.",
    icon: <DnaIcon className="w-8 h-8 text-pink-400" />,
  },
  {
    name: "Music Theory / Composition",
    description: "Generative composition, harmonic reasoning, and emotional resonance modeling.",
    icon: <MusicIcon className="w-8 h-8 text-indigo-300" />,
  },
  {
    name: "Quantum Physics / Advanced Math",
    description: "Probabilistic reasoning, mathematical abstraction, and quantum-inspired optimization.",
    icon: <InfinityIcon className="w-8 h-8 text-violet-400" />,
  },
  {
    name: "Philosophy / Ethics",
    description: "Ethical reasoning engine, scenario simulation, and value-aligned decision-making.",
    icon: <ScaleIcon className="w-8 h-8 text-cyan-300" />,
  },
  {
    name: "Finance / Economics",
    description: "Market analysis, risk assessment, and algorithmic trading strategies.",
    icon: <BriefcaseIcon className="w-8 h-8 text-lime-400" />,
  },
  {
    name: "Game Development",
    description: "NPC behavior, procedural content generation, and player modeling.",
    icon: <GamepadIcon className="w-8 h-8 text-orange-400" />,
  },
  {
    name: "Creative Writing / Storytelling",
    description: "Narrative generation, character development, and plot structuring.",
    icon: <FeatherIcon className="w-8 h-8 text-rose-400" />,
  },
];

export const THEMES: Theme[] = [
    {
        name: 'default',
        displayName: 'Architech Default',
        colors: {
            primary: '#c026d3', // fuchsia-500
            secondary: '#8b5cf6', // violet-500
            accent: '#8b5cf6', // violet-500
        }
    },
    {
        name: 'nebula',
        displayName: 'Cosmic Nebula',
        colors: {
            primary: '#06b6d4', // cyan-500
            secondary: '#22c55e', // green-500
            accent: '#22c55e', // green-500
        }
    },
    {
        name: 'cyberpunk',
        displayName: 'Neon Cyberpunk',
        colors: {
            primary: '#fde047', // yellow-300
            secondary: '#ec4899', // pink-500
            accent: '#06b6d4', // cyan-500
        }
    }
];