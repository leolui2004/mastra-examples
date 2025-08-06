import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import type { ExampleConfig } from "../index";

const lessThanStep = createStep({
  id: "less-than-step",
  description: "if value is <=10, return 0",
  inputSchema: z.object({
    value: z.number()
  }),
  outputSchema: z.object({
    value: z.number()
  }),
  execute: async () => {
    return {
      value: 0
    };
  }
});
const greaterThanStep = createStep({
  id: "greater-than-step",
  description: "if value is >10, return 20",
  inputSchema: z.object({
    value: z.number()
  }),
  outputSchema: z.object({
    value: z.number()
  }),
  execute: async () => {
    return {
      value: 20
    };
  }
});
 
export const branchSteps = createWorkflow({
  id: "branch-workflow",
  inputSchema: z.object({
    value: z.number()
  }),
  outputSchema: z.object({
    value: z.number()
  })
})
  .branch([
    [async ({ inputData: { value } }) => value <= 10, lessThanStep],
    [async ({ inputData: { value } }) => value > 10, greaterThanStep]
  ])
  .commit();

export const conditionalBranchWorkflowExample: ExampleConfig = {
  id: 'conditional-branch-workflow',
  title: 'Conditional Branch Workflow',
  description: 'A workflow that demonstrates conditional branching based on input value',
  type: 'workflow',
  workflow: branchSteps,
  inputSchema: z.object({
    value: z.number()
  })
};