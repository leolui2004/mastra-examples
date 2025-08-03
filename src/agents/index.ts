import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

// Agent System Prompt (Cat Expert)
const getCatFact = async () => {
  const { fact } = (await fetch("https://catfact.ninja/fact").then((res) =>
    res.json(),
  )) as {
    fact: string;
  };
  return fact;
};

const catFact = createTool({
  id: "Get cat facts",
  inputSchema: z.object({}),
  description: "Fetches cat facts",
  execute: async () => {
    console.log("using tool to fetch cat fact");
    return {
      catFact: await getCatFact(),
    };
  },
});

const catExpertAgent = new Agent({
  name: "cat-expert",
  instructions: `You are a helpful cat expert assistant. When discussing cats, you should always include an interesting cat fact.

Your main responsibilities:
1. Answer questions about cats
2. Use the catFact tool to provide verified cat facts
3. Incorporate the cat facts naturally into your responses

Always use the catFact tool at least once in your responses to ensure accuracy.`,
  model: openai("gpt-4o-mini"),
  tools: {
    catFact,
  },
});

// Human-in-the-loop Workflow
const step1 = createStep({
  id: "step-1",
  description: "passes value from input to output",
  inputSchema: z.object({
    value: z.number()
  }),
  outputSchema: z.object({
    value: z.number()
  }),
  execute: async ({ inputData }) => {
    const { value } = inputData;
    return {
      value
    };
  }
});

const step2 = createStep({
  id: "step-2",
  description: "pauses until user confirms",
  inputSchema: z.object({
    value: z.number()
  }),
  resumeSchema: z.object({
    confirm: z.boolean()
  }),
  outputSchema: z.object({
    value: z.number(),
    confirmed: z.boolean().optional()
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const { value } = inputData;

    // If no resumeData, this is the first execution - suspend and wait for user input
    if (!resumeData) {
      await suspend({});
      return { value: value };
    }

    // If we have resumeData, the user has provided input
    const { confirm } = resumeData;
    return { value: value, confirmed: confirm };
  }
});

const humanInLoopWorkflow = createWorkflow({
  id: "human-in-loop-workflow",
  inputSchema: z.object({
    value: z.number()
  }),
  outputSchema: z.object({
    value: z.number()
  })
})
  .then(step1)
  .then(step2)
  .commit();

// Example Registry
export interface ExampleConfig {
  id: string;
  title: string;
  description: string;
  type: 'chat' | 'workflow';
  agent?: Agent;
  workflow?: any;
  inputSchema?: z.ZodSchema;
}

// Public interface for client components (only serializable data)
export interface ExampleMetadata {
  id: string;
  title: string;
  description: string;
  type: 'chat' | 'workflow';
}

export const examples: ExampleConfig[] = [
  {
    id: 'cat-expert',
    title: 'Cat Expert Agent',
    description: 'A chat agent that provides cat facts and answers questions about cats',
    type: 'chat',
    agent: catExpertAgent,
  },
  {
    id: 'human-in-loop',
    title: 'Human-in-the-Loop Workflow',
    description: 'A workflow that demonstrates human intervention with confirmation steps',
    type: 'workflow',
    workflow: humanInLoopWorkflow,
    inputSchema: z.object({
      value: z.number()
    })
  }
];

export const getExample = (id: string): ExampleConfig | undefined => {
  return examples.find(example => example.id === id);
};

export const getExampleMetadata = (id: string): ExampleMetadata | undefined => {
  const example = examples.find(example => example.id === id);
  if (!example) return undefined;
  
  return {
    id: example.id,
    title: example.title,
    description: example.description,
    type: example.type
  };
};

export const getAllExamplesMetadata = (): ExampleMetadata[] => {
  return examples.map(example => ({
    id: example.id,
    title: example.title,
    description: example.description,
    type: example.type
  }));
};