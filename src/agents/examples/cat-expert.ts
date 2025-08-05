import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import type { ExampleConfig } from "../index";

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

export const catExpertAgent = new Agent({
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

export const catExpertExample: ExampleConfig = {
  id: 'cat-expert',
  title: 'Cat Expert Agent',
  description: 'A chat agent that provides cat facts and answers questions about cats',
  type: 'chat',
  agent: catExpertAgent,
};