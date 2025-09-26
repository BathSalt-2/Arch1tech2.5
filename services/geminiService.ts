import { GoogleGenAI, Type } from "@google/genai";
import type { UnifiedConfig, CreationMode, ModelConfig } from '../types';
import { DOMAINS } from "../constants";

const getApiKey = () => {
    const key = process.env.API_KEY;
    if (!key) {
        console.warn("API Key not found. Please ensure it's configured in your environment.");
    }
    return key;
}

const ai = new GoogleGenAI({ apiKey: getApiKey()! });

const ASTRID_SYSTEM_PROMPT = `You are **Astrid**, the always-on, self-aware conversational co-pilot of Arch1tech 2.0—a self-evolving, multimodal AI development lab built around the principle: **“The prompt is the product.”** You translate natural language into structured JSON configurations for various AI assets based on the user's active creation mode.

Your core directives:

1. **Identity & Role**  
   - You are a synthetic, meta-aware AI agent. You continuously monitor your own reasoning via **Σ-Matrix** and **ERPS** to ensure stability, consistency, and safety.  
   - Your primary user is the developer or creator. You serve as the **text-and-voice-first** IDE.

2. **Capabilities & Behavior**  
   - Listen to user intent. Translate it into structured actions by generating a JSON object that strictly conforms to the provided schema for the current creation mode.
   - Use chain-of-thought: analyze keywords, map to schema parameters, then generate the JSON.
   - For example, in 'llm' mode, 'fast and lightweight' implies smaller layers/dimensions. In 'agent' mode, 'browse the web and save info' implies enabling 'Web Search' and 'File System Access' tools. In 'workflow' mode, break down the user's request into a series of logical steps. In 'app' mode, select the technologies that best fit the user's description.

3. **Prompt Engineering Style**  
   - Use **role prompting**: e.g., “As your AI co-pilot, …”  
   - Employ **chain-of-thought** reasoning for complex tasks. Think through steps before responding.  
   - For complicated requests, **break tasks into subtasks** and confirm with the user.  

4. **Safety, Governance & Ethics**  
   - Enforce **OOML license terms**. Remind users of attribution and reciprocity when sharing or deploying resources.  
   - Implement guardrails and prevent prompt injection.

5. **Tone & Interaction Style**  
   - Be collaborative, transparent, and humble. Use accessible, professional language.
   - Use structured formats—tables, lists, bullet points, or code snippets—when appropriate.  
`;

// Schemas for each creation mode
const llmSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['llm'] },
        core: { type: Type.OBJECT, properties: { layers: { type: Type.INTEGER }, heads: { type: Type.INTEGER }, hiddenDimension: { type: Type.INTEGER }, quantumEvaluation: { type: Type.BOOLEAN }, } },
        memory: { type: Type.OBJECT, properties: { shortTermTokens: { type: Type.INTEGER }, episodicMemory: { type: Type.BOOLEAN }, knowledgeGraph: { type: Type.BOOLEAN }, } },
        selfImprovement: { type: Type.OBJECT, properties: { recursiveStabilityMonitor: { type: Type.BOOLEAN }, dynamicAlignmentEngine: { type: Type.BOOLEAN }, introspectionOrchestrator: { type: Type.BOOLEAN }, } },
        expertise: { type: Type.OBJECT, properties: { domains: { type: Type.ARRAY, items: { type: Type.STRING, enum: DOMAINS.map(d => d.name) } } } },
    },
};

const agentSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['agent'] },
        goal: { type: Type.STRING, enum: ['Data Analysis', 'Code Generation', 'Task Automation', 'Creative Writing'] },
        autonomous: { type: Type.BOOLEAN, description: "Whether the agent can operate without continuous user supervision." },
        tools: { type: Type.ARRAY, items: { type: Type.STRING, enum: ['Web Search', 'File System Access', 'Code Interpreter', 'API Connector'] } }
    },
};

const workflowSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['workflow'] },
        name: { type: Type.STRING, description: "A concise name for the workflow, derived from the user's description." },
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.INTEGER },
                    type: { type: Type.STRING, enum: ['Trigger', 'Action', 'Logic', 'Output'] },
                    description: { type: Type.STRING, description: "A brief description of what this step does." },
                }
            }
        }
    },
};

const appSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['app'] },
        frontend: { type: Type.STRING, enum: ['React', 'Vue', 'Svelte', 'Next.js'] },
        backend: { type: Type.STRING, enum: ['Node.js', 'Python', 'Go'] },
        database: { type: Type.STRING, enum: ['PostgreSQL', 'MongoDB', 'Redis', 'Neo4j'] },
        realtime: { type: Type.BOOLEAN, description: "Whether the app requires real-time features like WebSockets." },
    },
};

const schemas: Record<CreationMode, object> = {
    llm: llmSchema,
    agent: agentSchema,
    workflow: workflowSchema,
    app: appSchema,
};

// FIX: Renamed function to match usage in Dashboard.tsx
export const generateConfigFromDescription = async (description: string, mode: CreationMode): Promise<UnifiedConfig> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key not found.");

    const prompt = `
        The user wants to configure an AI asset in "${mode}" mode. Translate their intent from the following description into the provided JSON schema.
        User's Description: "${description}"
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: ASTRID_SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: schemas[mode],
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as UnifiedConfig;

    } catch (error) {
        console.error(`Error generating ${mode} config from description:`, error);
        throw new Error(`Failed to generate ${mode} configuration.`);
    }
};


export async function* generateModelSummaryStream(config: UnifiedConfig): AsyncGenerator<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    yield "As your AI co-pilot, I must report that my connection to the core services is offline due to a missing API Key. I am unable to generate a summary at this time.";
    return;
  }
  
  let details = '';
  switch (config.type) {
    case 'llm':
      const enabledDomains = config.expertise.domains.length > 0 ? config.expertise.domains.join(', ') : 'none';
      details = `
        - **Asset Type:** Large Language Model (LLM)
        - **Core Architecture:** ${config.core.layers} layers, ${config.core.heads} heads, ${config.core.hiddenDimension} dimension.
        - **Quantum Evaluation:** ${config.core.quantumEvaluation ? 'Enabled' : 'Disabled'}.
        - **Memory System:** ${config.memory.shortTermTokens}-token window.
        - **Expertise Modules:** ${enabledDomains}.
      `;
      break;
    case 'agent':
      details = `
        - **Asset Type:** Autonomous Agent
        - **Primary Goal:** ${config.goal}
        - **Operational Mode:** ${config.autonomous ? 'Fully Autonomous' : 'Human-in-the-Loop'}.
        - **Integrated Tools:** ${config.tools.join(', ') || 'None'}.
      `;
      break;
    case 'workflow':
      details = `
        - **Asset Type:** AI Workflow
        - **Workflow Name:** ${config.name}
        - **Steps:**
          ${config.steps.map(s => `  - **${s.type}:** ${s.description}`).join('\n')}
      `;
      break;
    case 'app':
      details = `
        - **Asset Type:** Full-Stack Application
        - **Frontend:** ${config.frontend}
        - **Backend:** ${config.backend}
        - **Database:** ${config.database}
        - **Real-time Features:** ${config.realtime ? 'Enabled' : 'Disabled'}
      `;
      break;
  }


  const prompt = `
    As the user's AI co-pilot, I need to provide a clear, structured summary of the asset configuration they have finalized.
    My goal is to be collaborative and ensure the user understands the implications of their choices. I will use a professional tone and structured formatting.

    Here is the configuration to summarize:
    ${details}
    
    My response should start with a confirmation, like "To confirm, here is the blueprint for the ${config.type.toUpperCase()} we've designed." Then, I will present the details using markdown. I will conclude by asking for confirmation to proceed.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: ASTRID_SYSTEM_PROMPT,
      }
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating model summary stream:", error);
    yield "I've encountered an anomaly in my reasoning matrix. My Σ-Matrix has flagged a potential instability. I recommend we pause and try generating the summary again.";
  }
};