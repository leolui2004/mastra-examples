import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import type { ExampleConfig } from "../index";

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

export const humanInLoopWorkflow = createWorkflow({
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

export const humanInLoopExample: ExampleConfig = {
  id: 'human-in-loop',
  title: 'Human-in-the-Loop Workflow',
  description: 'A workflow that demonstrates human intervention with confirmation steps',
  type: 'workflow',
  workflow: humanInLoopWorkflow,
  inputSchema: z.object({
    value: z.number()
  })
};