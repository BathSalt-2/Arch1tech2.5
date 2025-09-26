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

export interface ModelConfig {
  type: 'llm';
  core: CoreArchitecture;
  memory: MemoryContext;
  selfImprovement: SelfImprovement;
  expertise: Expertise;
}

// New types for the upgrade
export type AgentGoal = 'Data Analysis' | 'Code Generation' | 'Task Automation' | 'Creative Writing';
export type AgentTool = 'Web Search' | 'File System Access' | 'Code Interpreter' | 'API Connector';

export interface AgentConfig {
  type: 'agent';
  goal: AgentGoal;
  autonomous: boolean;
  tools: AgentTool[];
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
    // FIX: Update config to be UnifiedConfig to allow saving all asset types.
    config: UnifiedConfig;
    savedAt: string; // ISO 8601 timestamp
}

export interface SavedModel {
    id: number;
    name: string;
    versions: ModelVersion[];
}

export interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export interface Domain {
  name:string;
  description: string;
}

export type ThemeName = 'default' | 'nebula' | 'cyberpunk';

export interface Theme {
    name: ThemeName;
    displayName: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
}

export type MobileView = 'chat' | 'visualize' | 'configure' | 'gallery';