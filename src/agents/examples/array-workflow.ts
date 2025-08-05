import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import type { ExampleConfig } from "../index";

const mapStep = createStep({
  id: "map-step",
  description: "adds mapStep suffix to input value",
  inputSchema: z.string(),
  outputSchema: z.object({
    value: z.string()
  }),
  execute: async ({ inputData }) => {
    return {
      value: `${inputData} mapStep`
    };
  }
});

const step2 = createStep({
  id: "step-2",
  description: "passes value from input to output",
  inputSchema: z.array(
    z.object({
      value: z.string()
    })
  ),
  outputSchema: z.array(
    z.object({
      value: z.string()
    })
  ),
  execute: async ({ inputData }) => {
    return inputData.map(({ value }) => ({
      value: value
    }));
  }
});

export const arrayWorkflow = createWorkflow({
  id: "foreach-workflow",
  inputSchema: z.array(z.string()),
  outputSchema: z.array(
    z.object({
      value: z.string()
    })
  )
})
  .foreach(mapStep)
  .then(step2)
  .commit();

export const arrayWorkflowExample: ExampleConfig = {
  id: 'array-workflow',
  title: 'Array Processing Workflow',
  description: 'A workflow that demonstrates processing arrays with foreach operations',
  type: 'workflow',
  workflow: arrayWorkflow,
  inputSchema: z.array(z.string())
};