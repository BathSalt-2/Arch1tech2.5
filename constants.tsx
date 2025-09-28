import type { ModelConfig, Domain, Theme, AgentConfig, WorkflowConfig, AppConfig, AgentTool, MarketplaceAsset } from './types';
import React from 'react';
import { BrainCircuitIcon, CodeIcon, DnaIcon, InfinityIcon, MusicIcon, ScaleIcon, BriefcaseIcon, GamepadIcon, FeatherIcon, FileTerminalIcon, CodeSquareIcon, DatabaseIcon, BotIcon } from './components/icons/Icons';

export const DEFAULT_LLM_CONFIG: ModelConfig = {
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
  // NEW: Add default ethical matrix values
  ethicalMatrix: {
    utilitarianism: 50,
    deontology: 50,
    transparency: 75,
  },
};

export const DEFAULT_AGENT_CONFIG: AgentConfig = {
    type: 'agent',
    goal: 'Task Automation',
    autonomous: false,
    tools: [],
    webSearchConfig: {
      searchDepth: 'Shallow',
      filterResults: true,
      // NEW: Add defaults for new web search settings.
      resultCount: 5,
      keywords: '',
    },
};

export const DEFAULT_WORKFLOW_CONFIG: WorkflowConfig = {
    type: 'workflow',
    name: 'New Workflow',
    steps: [
        { id: 1, type: 'Trigger', description: 'Receives user input.' },
        { id: 2, type: 'Action', description: 'Processes the input data.' },
        // FIX: Corrected property 'a' to 'type' to match the WorkflowStep interface.
        { id: 3, type: 'Output', description: 'Returns the result.' },
    ],
};

export const DEFAULT_APP_CONFIG: AppConfig = {
    type: 'app',
    frontend: 'React',
    backend: 'Node.js',
    database: 'PostgreSQL',
    realtime: false,
};

// NEW: Centralized definition for agent tools with icons and descriptions.
export const AGENT_TOOLS: { name: AgentTool; description: string; icon: React.ReactNode }[] = [
    {
        name: 'Web Search',
        description: 'Enables the agent to search the internet for real-time information.',
        icon: <BrainCircuitIcon className="w-8 h-8 text-cyan-300" />
    },
    {
        name: 'File System Access',
        description: 'Allows the agent to read, write, and manage local files.',
        icon: <FileTerminalIcon className="w-8 h-8 text-lime-400" />
    },
    {
        name: 'Code Interpreter',
        description: 'Provides the ability to execute Python code in a sandboxed environment.',
        icon: <CodeSquareIcon className="w-8 h-8 text-yellow-300" />
    },
    {
        name: 'API Connector',
        description: 'Connects to external APIs to fetch or send data.',
        icon: <DatabaseIcon className="w-8 h-8 text-indigo-300" />
    }
];


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
        name: 'oracl3',
        displayName: 'Oracl3 Ætherwave',
        colors: {
            primary: '#db2777', // pink-600
            secondary: '#4c1d95', // violet-800
            accent: '#06b6d4', // cyan-500
        },
        description: "The signature Or4cl3 theme. A fusion of deep indigo, radiant magenta, and electric cyan, embodying our 'Authority x Mystery' brand voice."
    },
    {
        name: 'nebula',
        displayName: 'Cosmic Nebula',
        colors: {
            primary: '#06b6d4', // cyan-500
            secondary: '#22c55e', // green-500
            accent: '#22c55e', // green-500
        },
        description: "A cool, serene theme inspired by deep space. Dominated by cyans and greens, it evokes a sense of calm, focus, and cosmic exploration."
    },
    {
        name: 'cyberpunk',
        displayName: 'Neon Cyberpunk',
        colors: {
            primary: '#fde047', // yellow-300
            secondary: '#ec4899', // pink-500
            accent: '#06b6d4', // cyan-500
        },
        description: "A high-energy, futuristic theme. Blends vibrant yellows and pinks against a dark backdrop for a retro-futuristic, neon-drenched aesthetic."
    }
];

export const OOML_LICENSE_TEXT = `🔏 Or4cl3 Open Model License (OOML) v1.0

By Or4cl3 AI Solutions

Preamble
The Or4cl3 Open Model License (“OOML”) is designed to encourage open innovation in AI while enforcing reciprocity, attribution, and ethical use. It allows broad use, modification, and distribution of models, workflows, and related assets while ensuring improvements are contributed back to the community.


---

1. Definitions

Licensed Material – Any AI model, dataset, workflow, code, or derivative made available under OOML.

Derivative Material – Any work that modifies, fine-tunes, retrains, adapts, or builds upon Licensed Material.

Contributor – Any individual or entity creating or modifying Licensed Material.

User – Anyone who downloads, uses, or interacts with Licensed Material.



---

2. Grant of Rights

Contributors grant every User a worldwide, royalty-free, non-exclusive license to:

1. Use Licensed Material for lawful purposes.


2. Modify, adapt, fine-tune, or extend Licensed Material.


3. Distribute Licensed Material and Derivative Material (source or binary).


4. Deploy Licensed Material in services, applications, or products.




---

3. Reciprocity

If you publicly release or deploy Derivative Material:

1. License it under OOML (or a compatible license approved by Or4cl3).


2. Share substantive improvements back with the community (weights, code, datasets).


3. Provide clear attribution to original contributors.




---

4. Attribution

All public uses must include:

“Powered by [Name of Model/Workflow] under the Or4cl3 Open Model License (OOML).”

Link to the source repository or official distribution.




---

5. Prohibited Uses

You may not:

1. Use Licensed Material for non-consensual impersonation (e.g., voice or image cloning).


2. Deploy in violation of laws (e.g., harassment, discrimination).


3. Remove or obscure attribution.


4. Re-license under a closed proprietary license.




---

6. Termination

Violation of the license immediately terminates all granted rights.

Rights may be reinstated after remedying the violation and notifying original contributors.



---

7. Disclaimer of Warranty

Licensed Material is provided “as-is”, without warranties of any kind.


---

8. Limitation of Liability

Contributors are not liable for any damages arising from use of the Licensed Material.


---

9. Governing Law

This license is governed by the laws of the jurisdiction of Or4cl3 AI Solutions, unless otherwise required by law.


---

📝 Plain-Language Summary

What you can do:

Use, modify, and deploy the models, datasets, workflows, and code freely.

Share your improvements, as long as you license derivatives under OOML and credit the original contributors.


What you can’t do:

Claim someone else’s work as your own.

Use the material unethically (e.g., deepfakes, harassment).

Close off derivatives under proprietary licenses.


Key idea:

> Open like MIT, protective like GPL — free to innovate, but improvements and attribution stay in the community.
`;

// NEW: Mock data for the marketplace to feel populated on first load.
export const INITIAL_MARKETPLACE_ASSETS: MarketplaceAsset[] = [
    {
        id: 'agent-deep-researcher-1',
        creator: 'Architect Zero',
        assetName: 'Deep Web Researcher',
        description: 'An autonomous agent optimized for deep, recursive web searches. Excellent for academic research and market analysis. Comes with pre-configured filters to reduce noise.',
        config: {
            type: 'agent',
            goal: 'Data Analysis',
            autonomous: true,
            tools: ['Web Search', 'File System Access'],
            webSearchConfig: {
                searchDepth: 'Deep',
                filterResults: true,
                resultCount: 20,
                keywords: 'academic, research, data, analysis',
            },
        },
        license: 'Commercial',
        cost: 250,
        downloads: 112,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
        id: 'llm-poet-1',
        creator: 'E. A. Poe',
        assetName: 'The Raven Poetic Engine',
        description: 'A highly specialized LLM fine-tuned for creative writing and poetry generation. Features a unique cognitive architecture that prioritizes metaphorical reasoning and emotional resonance.',
        config: {
            type: 'llm',
            core: { layers: 18, heads: 24, hiddenDimension: 768, quantumEvaluation: true },
            memory: { shortTermTokens: 8192, episodicMemory: true, knowledgeGraph: false },
            selfImprovement: { recursiveStabilityMonitor: true, dynamicAlignmentEngine: false, introspectionOrchestrator: true },
            expertise: { domains: ['Creative Writing / Storytelling', 'Philosophy / Ethics', 'Music Theory / Composition'] },
            ethicalMatrix: { utilitarianism: 20, deontology: 80, transparency: 60 },
        },
        license: 'OOML',
        cost: 0,
        downloads: 589,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: 'workflow-social-media-1',
        creator: 'SocialStream Inc.',
        assetName: 'Auto Social Poster',
        description: 'A simple but powerful workflow that takes a text input, generates a relevant image using an external API (placeholder), and posts to multiple social media platforms.',
        config: {
            type: 'workflow',
            name: 'Auto Social Poster',
            steps: [
                { id: 1, type: 'Trigger', description: 'Receives text content.' },
                { id: 2, type: 'Action', description: 'Connects to ImageGen API to create an image.' },
                { id: 3, type: 'Logic', description: 'Formats posts for Twitter, LinkedIn.' },
                { id: 4, type: 'Output', description: 'Publishes formatted posts.' },
            ],
        },
        license: 'Subscription',
        cost: 50,
        downloads: 34,
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    },
];