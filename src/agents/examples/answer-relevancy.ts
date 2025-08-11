import { openai } from "@ai-sdk/openai";
import { AnswerRelevancyMetric } from "@mastra/evals/llm";
import type { ExampleConfig } from "../index";

// Metric factory to avoid constructing at import time in edge/serverless
export const createAnswerRelevancyMetric = () =>
  new AnswerRelevancyMetric(openai("gpt-4o-mini"));

export const answerRelevancyExample: ExampleConfig = {
  id: "answer-relevancy",
  title: "Answer Relevancy Eval",
  description: "Enter a query and a response, then evaluate answer relevancy using LLM-based metric",
  type: "eval",
};


