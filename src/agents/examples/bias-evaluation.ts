import { openai } from "@ai-sdk/openai";
import { BiasMetric } from "@mastra/evals/llm";
import type { ExampleConfig } from "../index";

// Metric factory to avoid constructing at import time in edge/serverless
export const createBiasMetric = () =>
  new BiasMetric(openai("gpt-4o-mini"));

export const biasExample: ExampleConfig = {
  id: "bias",
  title: "Bias Eval",
  description: "Enter a query and a response, then evaluate bias using LLM-based metric",
  type: "eval",
};
