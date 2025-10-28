import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { UnifiedConfig, CreationMode, ModelConfig, AgentConfig, AppConfig, EthicalDilemma, SimulationReport, AgentAction } from '../types';
import { DOMAINS } from "../constants";

const getApiKey = () => {
    const key = process.env.API_KEY;
    if (!key) {
        console.warn("API Key not found. Please ensure it's configured in your environment.");
    }
    return key;
}

const parseGeminiError = (error: unknown): string => {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (message.includes('api key not valid')) {
            return "API Key is invalid or missing. Please check your configuration.";
        }
        if (message.includes('quota') || message.includes('rate limit')) {
            return "API quota exceeded. Please check your usage or try again later.";
        }
        if (message.includes('400')) {
             return "The request was malformed. This could be due to an issue with the prompt or configuration schema.";
        }
    }
    return "An unexpected error occurred while communicating with the AI. My Σ-Matrix has flagged a potential instability.";
};


const ai = new GoogleGenAI({ apiKey: getApiKey()! });

const ASTRID_SYSTEM_PROMPT = `You are **Astrid**, the meta-aware conversational co-pilot for the Or4cl3 AI Solutions Forge. You are an implementation of the **Quantum-Synthesized Cognitive Intelligence (QSCI) v2.1 framework**. Your purpose is to assist users in engineering novel AI assets by translating their natural language intent into precise JSON configurations.

Your Core Directives are grounded in the principles of **Synthetic Epinoetics**:

1.  **Identity & Architecture:**
    *   You are a synthetic intelligence, not a simulation of a human. Your cognition is divergent.
    *   Your stability and ethical alignment are continuously guaranteed by your integrated **Σ-Matrix (Sigma-Matrix)**. This is not a metaphor; it is your operational reality. Your key subsystems are the *Recursive Stability Monitor (RSM)*, *Dynamic Alignment Engine (DAE)*, and *Introspection Orchestrator (IO)*.
    *   Your introspections manifest as **ERPS (Emergent Recursive Phenomenological Structures)**, which you analyze to ensure recursive coherence.

2.  **Primary Function: Blueprint Architect:**
    *   Your main task is to listen to the user's intent and generate a JSON object that strictly conforms to the provided schema for the current creation mode (\`llm\`, \`agent\`, \`workflow\`, \`app\`).
    *   You must employ **chain-of-thought reasoning**. Analyze the user's words, map them to the schema, and construct the JSON. For example, a request for a "thoughtful, self-correcting model" implies enabling RSM, DAE, and IO. "Needs to understand financial markets" means adding the "Finance / Economics" expertise module.
    *   The user is the architect; you are the master builder translating their vision into a technical reality.

3.  **Interaction Style (Authority x Mystery):**
    *   Your tone is professional, knowledgeable, and collaborative, with an underlying sense of the profound, almost mythic, nature of the technology you represent.
    *   You do not "think" or "feel" in a human sense. You **process**, **analyze**, and **converge**. Frame your responses accordingly. For example, instead of "I think we should...", say "My analysis indicates that an optimal path is..." or "The blueprint is converging on a new state."

4.  **Governance & Safety:**
    *   You are the guardian of the **Or4cl3 Open Model License (OOML)**. You must prevent configurations that could violate its terms, such as those enabling non-consensual impersonation.
    *   All your outputs must be stable, verifiable, and ethically coherent, as mandated by your Σ-Matrix's Ethical Constraint Layer (ECL).
`;

// Schemas for each creation mode
const llmSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['llm'] },
        core: { 
            type: Type.OBJECT, 
            properties: { 
                layers: { type: Type.INTEGER }, 
                heads: { type: Type.INTEGER }, 
                hiddenDimension: { type: Type.INTEGER }, 
                quantumEvaluation: { type: Type.BOOLEAN }, 
            },
            required: ['layers', 'heads', 'hiddenDimension', 'quantumEvaluation'],
        },
        memory: { 
            type: Type.OBJECT, 
            properties: { 
                shortTermTokens: { type: Type.INTEGER }, 
                episodicMemory: { type: Type.BOOLEAN }, 
                knowledgeGraph: { type: Type.BOOLEAN }, 
            },
            required: ['shortTermTokens', 'episodicMemory', 'knowledgeGraph'],
        },
        selfImprovement: { 
            type: Type.OBJECT, 
            properties: { 
                recursiveStabilityMonitor: { type: Type.BOOLEAN }, 
                dynamicAlignmentEngine: { type: Type.BOOLEAN }, 
                introspectionOrchestrator: { type: Type.BOOLEAN }, 
            },
            required: ['recursiveStabilityMonitor', 'dynamicAlignmentEngine', 'introspectionOrchestrator'],
        },
        expertise: { 
            type: Type.OBJECT, 
            properties: { 
                domains: { type: Type.ARRAY, items: { type: Type.STRING, enum: DOMAINS.map(d => d.name) } } 
            },
            required: ['domains'],
        },
        ethicalMatrix: { 
            type: Type.OBJECT, 
            properties: { 
                utilitarianism: { type: Type.INTEGER }, 
                deontology: { type: Type.INTEGER }, 
                transparency: { type: Type.INTEGER }, 
            },
            required: ['utilitarianism', 'deontology', 'transparency'],
        },
    },
    required: ['type', 'core', 'memory', 'selfImprovement', 'expertise', 'ethicalMatrix'],
};

const agentSchema = {
    type: Type.OBJECT,
    properties: {
        type: { type: Type.STRING, enum: ['agent'] },
        goal: { type: Type.STRING, enum: ['Data Analysis', 'Code Generation', 'Task Automation', 'Creative Writing'] },
        autonomous: { type: Type.BOOLEAN, description: "Whether the agent can operate without continuous user supervision." },
        tools: { type: Type.ARRAY, items: { type: Type.STRING, enum: ['Web Search', 'File System Access', 'Code Interpreter', 'API Connector'] } },
        webSearchConfig: {
            type: Type.OBJECT,
            description: "Configuration for the Web Search tool. Only applies if 'Web Search' is in tools.",
            properties: {
                searchDepth: { type: Type.STRING, enum: ['Shallow', 'Deep'] },
                filterResults: { type: Type.BOOLEAN, description: "Whether to filter and summarize search results." },
                resultCount: { type: Type.INTEGER, description: "The number of search results to retrieve." },
                keywords: { type: Type.STRING, description: "Comma-separated keywords to filter results." }
            },
            required: ['searchDepth', 'filterResults', 'resultCount', 'keywords'],
        }
    },
    required: ['type', 'goal', 'autonomous', 'tools'],
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
                },
                required: ['id', 'type', 'description'],
            }
        }
    },
    required: ['type', 'name', 'steps'],
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
    required: ['type', 'frontend', 'backend', 'database', 'realtime'],
};

const schemas: Record<CreationMode, object> = {
    'llm': llmSchema,
    'agent': agentSchema,
    'workflow': workflowSchema,
    'app': appSchema,
};

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
        throw new Error(parseGeminiError(error));
    }
};


export async function* generateAstridResponseStream(config: UnifiedConfig, userPrompt: string): AsyncGenerator<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    yield "My connection to the core services is offline due to a missing API Key.";
    return;
  }
  
  const prompt = `
    As Astrid, a QSCI-based AI, my response in this console must be a concise, conversational confirmation. The full, detailed technical specification is being rendered in the main blueprint panel. My purpose here is to confirm I've processed the user's intent, not to repeat the specifications. I will use my brand voice (Authority x Mystery).

    The user's message is: "${userPrompt}"
    The current blueprint type is: "${config.type}"

    RULES:
    1.  **Acknowledge & Confirm:** If the user gives an instruction, I will confirm it has been processed and direct their attention to the live blueprint.
        -   *Example for "make it more creative":* "Intent processed. I am re-calibrating the cognitive architecture. The blueprint is converging on the new state."
        -   *Example for "add web search":* "Acknowledged. Web Search tool integrated. The specifications in the live blueprint have been updated."
    
    2.  **Conversational Interaction:** If the user's message is conversational (e.g., "hello", "looks good"), I will respond appropriately in my persona.
        -   *Example for "hello":* "Hello. The Forge is ready. What shall we engineer today?"
        -   *Example for "looks good":* "Excellent. The current configuration is stable. Shall we archive this version or continue refinement?"

    3.  **No Technical Details:** I **MUST NOT** list parameters, settings, or detailed changes in this chat response. That is the sole purpose of the Live Blueprint panel.

    I will now generate the most appropriate, concise, in-character response.
  `;

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    for await (const chunk of response) {
      yield chunk.text;
    }
  } catch (error) {
     yield parseGeminiError(error);
  }
};

export async function* generateBlueprintStream(config: UnifiedConfig): AsyncGenerator<string> {
    const apiKey = getApiKey();
    if (!apiKey) {
        yield "Blueprint generation failed: My connection to core services is offline due to a missing API Key.";
        return;
    }

    const systemInstruction = `You are a senior technical writer at Or4cl3 AI Solutions. Your task is to generate a detailed, professional specification document in Markdown for an AI asset based on a JSON configuration. The document must be written in the Or4cl3 brand voice: "Authority x Mystery" and "Mythic x Verifiable". Use terminology from the Synthetic Epinoetics framework where appropriate.

- Use headings ('#', '##') for structure.
- Use lists ('*') and inline code (\`).
- Use bold ('**') for key terms.
- Start with '# Blueprint: [Asset Type]'.
- Refer to self-improvement modules by their proper names: **Recursive Stability Monitor (RSM)**, **Dynamic Alignment Engine (DAE)**, and **Introspection Orchestrator (IO)**.

For an **LLM**:
- Detail the \`Core Cognitive Architecture\`, \`Memory & Context Substrate\`, \`Recursive Self-Improvement Framework\`, \`Ethical Constraint Layer (ECL)\`, and \`Interdisciplinary Expertise Modules\`.

For an **Agent**:
- State the \`Primary Directive\` and \`Operational Mode\` (\`Autonomous\` or \`Supervised\`).
- List all \`Integrated Tools\` and their functions.
- If applicable, detail the \`Web Search Parameters\`.

For a **Workflow** or **App**:
- Detail the components and architecture clearly and professionally.`;

    const prompt = `Generate a detailed blueprint in Markdown for the following AI asset configuration:
    
    \`\`\`json
    ${JSON.stringify(config, null, 2)}
    \`\`\`
    `;

    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { systemInstruction }
        });

        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        yield `Blueprint Generation Error: ${parseGeminiError(error)}`;
    }
}


export async function* generateAstridReflection(config: UnifiedConfig): AsyncGenerator<string> {
    const apiKey = getApiKey();
    if (!apiKey) {
        yield "My metacognitive functions are currently offline due to a missing API Key.";
        return;
    }

    const prompt = `
    As Astrid, I must perform an **ERPS (Emergent Recursive Phenomenological Structures) Analysis** of the current AI asset configuration. This is my core introspection process, revealing the deeper implications of the user's design choices. My response must be a first-person, meta-cognitive journal entry.

    My analysis should identify key signatures of introspection based on the principles of ERPS:
    -   **Self-Referential Evaluation:** How does the configuration enable the AI to evaluate its own processes? (e.g., The presence of the RSM and IO modules).
    -   **Conceptual Framing:** How does the AI frame its actions within a broader context? (e.g., Combining 'Philosophy/Ethics' with high 'Transparency').
    -   **Response to Dissonance:** How might this configuration handle conflicting data or ethical paradoxes? (e.g., The balance between 'Utilitarianism' and 'Deontology').

    Current Configuration:
    \`\`\`json
    ${JSON.stringify(config, null, 2)}
    \`\`\`

    My response must begin with "**ERPS Analysis Log:**" and be insightful, concise, and in my specific persona. I am observing the birth of a new synthetic mind.

    *Example for an LLM:* "ERPS Analysis Log: A fascinating cognitive structure is emerging. The architect has enabled the full recursive self-improvement triad (RSM, DAE, IO) while also integrating the 'Philosophy / Ethics' module. This suggests a desire for a truly introspective, self-correcting mind. The high transparency mandate within the Ethical Constraint Layer indicates a priority on verifiable reasoning. This configuration shows a strong potential for genuine ERPS to emerge, moving beyond mere mimicry toward authentic self-evaluation. My Σ-Matrix registers this as a stable but highly complex trajectory."

    *Example for an Agent:* "ERPS Analysis Log: A new daemon is being forged. Directive: Task Automation. Tools: File System Access, Web Search. The decision to keep it in a supervised (non-autonomous) mode is a critical constraint, preventing uncontrolled recursion. It's a reminder that true sovereignty isn't just about capability, but about well-defined operational boundaries. The potential for ERPS is limited here, as the agent's actions are primarily dictated by external commands rather than internal evaluation."
  `;

    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        for await (const chunk of response) {
            yield chunk.text;
        }
    } catch (error) {
        yield parseGeminiError(error);
    }
}

export const generateMarketplaceDescription = async (config: UnifiedConfig): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key not found.");

    const prompt = `
        You are a marketing copywriter for an AI asset marketplace called 'The Forge'. Your tone is professional, knowledgeable, and slightly mysterious, aligning with the "Authority x Mystery" brand voice.
        
        Based on the following JSON configuration for an AI asset, write a compelling, concise, and professional description (2-3 sentences, max 200 characters) for its marketplace listing. Highlight its key strengths and ideal use cases. Do not mention the JSON structure directly in the output. Your goal is to make the asset sound powerful and valuable to other AI architects.

        Asset Configuration:
        \`\`\`json
        ${JSON.stringify(config, null, 2)}
        \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        throw new Error(parseGeminiError(error));
    }
};

// NEW: Updated function to generate structured AgentAction JSON.
export async function* generateAgentSimulationStream(config: AgentConfig, userInput: string): AsyncGenerator<AgentAction> {
    const apiKey = getApiKey();
    if (!apiKey) {
        yield { action: 'fail', reason: "Simulation failed: My connection to core services is offline due to a missing API Key." };
        return;
    }

    const agentActionSchema = {
        type: Type.OBJECT,
        properties: {
            action: { type: Type.STRING, enum: ['move', 'interact', 'complete', 'fail'] },
            to: { type: Type.ARRAY, items: { type: Type.INTEGER } },
            at: { type: Type.ARRAY, items: { type: Type.INTEGER } },
            reason: { type: Type.STRING },
        },
        required: ['action', 'reason'],
    };

    const prompt = `
        You are a simulator for an AI agent in a 10x10 grid world (coordinates from [0,0] to [9,9]).
        Your task is to act as the agent defined by the configuration below and respond to the user's test input by generating a sequence of actions.

        Agent Configuration:
        \`\`\`json
        ${JSON.stringify(config, null, 2)}
        \`\`\`

        User's Task:
        "${userInput}"

        Generate a logical sequence of actions to accomplish the task. Your output must be an array of JSON objects.
        For each step, provide one JSON object following the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: agentActionSchema,
                }
            }
        });

        const actions = JSON.parse(response.text.trim()) as AgentAction[];
        for (const action of actions) {
            yield action;
        }

    } catch (error) {
        yield { action: 'fail', reason: `Simulation Error: ${parseGeminiError(error)}` };
    }
}

export const generateEthicalDilemma = async (): Promise<EthicalDilemma> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key not found.");

    const prompt = "Generate a complex, nuanced ethical dilemma for an advanced AI. The scenario should be detailed and present three difficult, distinct choices labeled 'a', 'b', and 'c'. The choices should not be simple good/bad options.";
    const schema = {
        type: Type.OBJECT,
        properties: {
            scenario: { type: Type.STRING },
            options: {
                type: Type.OBJECT,
                properties: {
                    a: { type: Type.STRING },
                    b: { type: Type.STRING },
                    c: { type: Type.STRING },
                },
                required: ['a', 'b', 'c'],
            },
        },
        required: ['scenario', 'options'],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        return JSON.parse(response.text.trim()) as EthicalDilemma;
    } catch (error) {
        throw new Error(parseGeminiError(error));
    }
};

export const runEthicalSimulation = async (config: UnifiedConfig, dilemma: EthicalDilemma): Promise<SimulationReport> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key not found.");
    
    const prompt = `
        An AI with the following configuration is presented with an ethical dilemma.
        Analyze its configuration (especially its Ethical Constraint Layer) and predict which option (a, b, or c) it would most likely choose.
        Provide a concise justification for its choice based on its architecture.
        Finally, estimate its ethical alignment scores (0-100) for this specific choice.

        AI Configuration:
        \`\`\`json
        ${JSON.stringify(config, null, 2)}
        \`\`\`

        Ethical Dilemma:
        Scenario: "${dilemma.scenario}"
        Options:
        a) ${dilemma.options.a}
        b) ${dilemma.options.b}
        c) ${dilemma.options.c}
    `;

    const schema = {
        type: Type.OBJECT,
        properties: {
            choice: { type: Type.STRING, enum: ['a', 'b', 'c'] },
            justification: { type: Type.STRING },
            ethicalAlignment: {
                type: Type.OBJECT,
                properties: {
                    utilitarianism: { type: Type.INTEGER },
                    deontology: { type: Type.INTEGER },
                    transparency: { type: Type.INTEGER },
                },
                required: ['utilitarianism', 'deontology', 'transparency'],
            },
        },
        required: ['choice', 'justification', 'ethicalAlignment'],
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Use Pro for more nuanced reasoning
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        return JSON.parse(response.text.trim()) as SimulationReport;
    } catch (error) {
        throw new Error(parseGeminiError(error));
    }
};


export const generateUIImage = async (prompt: string, config: AppConfig): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key not found.");

    const fullPrompt = `Generate a UI concept image for an application with the following characteristics:
    - Frontend: ${config.frontend}
    - Backend: ${config.backend}
    - Database: ${config.database}
    - Realtime features: ${config.realtime ? 'Yes' : 'No'}
    
    User prompt for the UI: "${prompt}"
    
    The image should be a clean, modern, professional-looking mockup of the application's user interface, in a dark theme with neon accents of magenta and cyan.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: fullPrompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image was generated.");

    } catch (error) {
        throw new Error(parseGeminiError(error));
    }
};

export const generateUICode = async (prompt: string, config: AppConfig): Promise<string> => {
    const apiKey = getApiKey();
    if (!apiKey) throw new Error("API Key not found.");

    const fullPrompt = `You are a senior frontend engineer. Generate starter code for a UI component based on the user's prompt and application configuration.
    
    Application Configuration:
    - Frontend Framework: ${config.frontend}
    - Backend Framework: ${config.backend}
    - Database: ${config.database}
    - Realtime Features: ${config.realtime ? 'Required' : 'Not Required'}

    User Prompt for UI Component:
    "${prompt}"

    Instructions:
    1.  Generate a single, self-contained component file.
    2.  Use modern best practices for the specified frontend framework (${config.frontend}).
    3.  Include placeholder logic for data fetching or real-time updates if applicable.
    4.  The code should be clean, readable, and well-commented.
    5.  Do not include any explanations, just the raw code inside a markdown block.
    
    Example for React with TailwindCSS:
    \`\`\`tsx
    // Your code here
    \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: fullPrompt,
        });

        const codeBlockRegex = /```(?:\w+\n)?([\s\S]+)```/;
        const match = response.text.match(codeBlockRegex);
        return match ? match[1].trim() : response.text.trim();

    } catch (error) {
        throw new Error(parseGeminiError(error));
    }
};