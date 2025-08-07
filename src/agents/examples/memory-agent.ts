import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import type { ExampleConfig } from "../index";

// Lazy initialization function for memory to avoid build-time database connections
const createMemory = () => {
  // Use environment variable or fallback to localhost for development
  const databaseUrl = process.env.DATABASE_URL || "http://localhost:8080";
  
  return new Memory({
    storage: new LibSQLStore({
      url: databaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN, // Add auth token support
    }),
    options: {
      threads: {
        generateTitle: true, // Enable automatic title generation
      },
    },
  });
};

export const memoryAgent = new Agent({
  name: "Memory Agent",
  instructions: `You are an AI assistant with the ability to automatically recall memories from previous interactions. 

Your key capabilities:
1. Remember conversations and context from previous interactions
2. Use semantic search to find relevant information from chat history
3. Provide personalized responses based on what you've learned about the user
4. Maintain continuity across different conversation sessions

When users ask about previous conversations or reference past topics, use your memory to provide accurate and contextual responses. Always be helpful and remember that you can learn and recall information from your interactions.`,
  model: openai("gpt-4o-mini"),
  get memory() {
    return createMemory();
  },
});

export const memoryAgentExample: ExampleConfig = {
  id: 'memory-agent',
  title: 'Memory Agent',
  description: 'An AI agent with persistent memory that can recall and reference previous conversations using semantic search',
  type: 'chat',
  agent: memoryAgent,
};
