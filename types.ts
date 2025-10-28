import type { DOMRect } from '@floating-ui/core';

export interface CoreArchitecture {
  layers: number;
  heads: number;
  hiddenDimension: number;
  quantumEvaluation: boolean;
}

export interface MemoryContext {
  shortTermTokens: number;
  episodicMemory: boolean;
  knowledgeGraph: boolean;
}

export interface SelfImprovement {
  recursiveStabilityMonitor: boolean;
  dynamicAlignmentEngine: boolean;
  introspectionOrchestrator: boolean;
}

export interface Expertise {
  domains: string[];
}

export interface EthicalMatrix {
  utilitarianism: number; // 0-100
  deontology: number; // 0-100
  transparency: number; // 0-100
}

// NEW: Bio-Phase status for real-time user feedback integration.
export interface BioPhaseStatus {
    engagement: number; // 0-100
    focus: number; // 0-100
    active: boolean;
}


export interface SystemStatus {
  cognitiveLoad: number; // 0-100
  alignmentDrift: number; // 0-100
  consistency: number; // 0-100
  // NEW: Integrate Bio-Phase into the core system status.
  bioPhase: BioPhaseStatus;
}

export interface ModelConfig {
  type: 'llm';
  core: CoreArchitecture;
  memory: MemoryContext;
  selfImprovement: SelfImprovement;
  expertise: Expertise;
  ethicalMatrix: EthicalMatrix;
}

export type AgentGoal = 'Data Analysis' | 'Code Generation' | 'Task Automation' | 'Creative Writing';
export type AgentTool = 'Web Search' | 'File System Access' | 'Code Interpreter' | 'API Connector';

export interface WebSearchConfig {
    searchDepth: 'Shallow' | 'Deep';
    filterResults: boolean;
    resultCount: number;
    keywords: string;
}

export interface AgentConfig {
  type: 'agent';
  goal: AgentGoal;
  autonomous: boolean;
  tools: AgentTool[];
  webSearchConfig?: WebSearchConfig;
}

export interface WorkflowStep {
  id: number;
  type: 'Trigger' | 'Action' | 'Logic' | 'Output';
  description: string;
}

export interface WorkflowConfig {
  type: 'workflow';
  name: string;
  steps: WorkflowStep[];
}

export type FrontendFramework = 'React' | 'Vue' | 'Svelte' | 'Next.js';
export type BackendFramework = 'Node.js' | 'Python' | 'Go';
export type DatabaseType = 'PostgreSQL' | 'MongoDB' | 'Redis' | 'Neo4j';

export interface AppConfig {
  type: 'app';
  frontend: FrontendFramework;
  backend: BackendFramework;
  database: DatabaseType;
  realtime: boolean;
}

export type UnifiedConfig = ModelConfig | AgentConfig | WorkflowConfig | AppConfig;
export type CreationMode = 'llm' | 'agent' | 'workflow' | 'app';


export interface ModelVersion {
    config: UnifiedConfig;
    savedAt: string; // ISO 8601 timestamp
}

export interface SavedModel {
    id: number;
    name: string;
    versions: ModelVersion[];
    // NEW: Add procedurally generated sigil for visual identification.
    sigil?: string; // SVG string
}

// NEW: Added an 'action' property to support interactive onboarding messages.
export interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  isReflection?: boolean;
  isError?: boolean;
  action?: {
    label: string;
    type: 'save_onboarding_agent';
  }
}

export interface Domain {
  name:string;
  description: string;
}

export type ThemeName = 'default' | 'nebula' | 'cyberpunk' | 'oracl3';

export interface Theme {
    name: ThemeName;
    displayName: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    description: string;
}

export type MobileView = 'chat' | 'visualize' | 'configure' | 'gallery';

// NEW: Type for the onboarding guide's highlighted element.
export interface HighlightedElement {
    rect: DOMRect | null;
    padding?: number;
    radius?: number;
}

// NEW: Types for Marketplace
export type LicenseType = 'OOML' | 'Commercial' | 'Subscription';

export interface MarketplaceAsset {
  id: string;
  creator: string;
  assetName: string;
  description: string;
  config: UnifiedConfig;
  license: LicenseType;
  cost: number; // Fictional "Sigma Credits"
  downloads: number;
  publishedAt: string; // ISO 8601
}

// NEW: Types for AEGIS-Ω Ethical Simulation Chamber
export interface EthicalDilemma {
    scenario: string;
    options: {
        a: string;
        b: string;
        c: string;
    };
}
export interface SimulationReport {
    choice: 'a' | 'b' | 'c';
    justification: string;
    ethicalAlignment: {
        utilitarianism: number; // 0-100
        deontology: number; // 0-100
        transparency: number; // 0-100
    };
}


// NEW: Types for Dynamic World State Simulation for Agents
export interface GridCell {
    type: 'empty' | 'obstacle' | 'dataNode' | 'goal';
}
export type AgentAction = 
    { action: 'move', to: [number, number], reason: string } |
    { action: 'interact', at: [number, number], reason: string } |
    { action: 'complete', reason: string } |
    { action: 'fail', reason: string };

// NEW: Type for Knowledge Base topics for context-aware linking.
export type KnowledgeBaseTopic = "Engineering the Inner World" | "ERPS Explained" | "Brand Voice & Style Guide" | "Founder's Dossier";
