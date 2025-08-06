import { Agent } from "@mastra/core/agent";
import { z } from "zod";

// Import all examples
import { catExpertExample } from "./examples/cat-expert";
import { humanInLoopExample } from "./examples/human-in-loop";
import { hierarchicalMultiAgentExample } from "./examples/hierarchical-multi-agent";
import { arrayWorkflowExample } from "./examples/array-workflow";
import { toolAgentExample } from "./examples/agent-tool";
import { conditionalBranchWorkflowExample } from "./examples/conditional-branch-workflow";

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
  catExpertExample,
  humanInLoopExample,
  hierarchicalMultiAgentExample,
  arrayWorkflowExample,
  toolAgentExample,
  conditionalBranchWorkflowExample,
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