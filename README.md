# Mastra Examples

A Next.js web application showcasing various Mastra agents and workflows through an interactive interface.

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Examples

### 1. Cat Expert Agent
- **Type**: Chat Interface
- **Description**: An AI agent that provides cat facts and answers cat-related questions
- **Features**: Uses OpenAI GPT-4o-mini with a tool to fetch real cat facts

### 2. Human-in-the-Loop Workflow  
- **Type**: Workflow Interface
- **Description**: A workflow demonstrating human intervention with confirmation steps
- **Features**: Two-step process with user confirmation and state management

### 3. Hierarchical Multi-Agent System
- **Type**: Chat Interface
- **Description**: A complex multi-agent system with publisher, copywriter, and editor agents working together
- **Features**: Demonstrates agent collaboration where a publisher coordinates copywriter and editor agents to create blog posts

### 4. Array Processing Workflow
- **Type**: Workflow Interface
- **Description**: A workflow demonstrating array processing with foreach operations
- **Features**: Shows how to process arrays of data through workflow steps with transformation logic

## 🐳 Docker Support

### Production
```bash
docker-compose up --build
```

### Development
```bash
docker-compose --profile dev up --build
```

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/run/[exampleId]/route.ts    # API endpoints
│   ├── examples/[exampleId]/page.tsx    # Dynamic example pages
│   ├── examples/layout.tsx              # Examples layout with sidebar
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Landing page
├── agents/
│   ├── index.ts                         # Agent & workflow registry
│   └── examples/                        # Individual example implementations
│       ├── cat-expert.ts                # Cat Expert Agent
│       ├── human-in-loop.ts             # Human-in-Loop Workflow
│       ├── hierarchical-multi-agent.ts  # Multi-Agent System
│       └── array-workflow.ts            # Array Processing Workflow
└── components/
    ├── ui/card.tsx                      # UI components
    └── examples/
        ├── ChatInterface.tsx            # Chat UI for agents
        └── WorkflowInterface.tsx        # Workflow UI with steps
```

## 🔧 Adding New Examples

1. **Create a new example file** in `src/agents/examples/`:

```typescript
// src/agents/examples/your-example.ts
import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { z } from "zod";
import type { ExampleConfig } from "../index";

export const yourAgent = new Agent({
  name: "your-agent",
  instructions: "Your agent instructions...",
  model: openai("gpt-4o-mini"),
});

export const yourExample: ExampleConfig = {
  id: 'your-example',
  title: 'Your Example Title',
  description: 'Description of your example',
  type: 'chat', // or 'workflow'
  agent: yourAgent, // for chat examples
  // workflow: yourWorkflow, // for workflow examples
  // inputSchema: z.object({...}) // for workflow examples
};
```

2. **Import and register** in `src/agents/index.ts`:

```typescript
import { yourExample } from "./examples/your-example";

export const examples: ExampleConfig[] = [
  // ... existing examples
  yourExample,
];
```

## 📚 Documentation

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **AI**: Mastra Core + OpenAI
- **Language**: TypeScript
- **Container**: Docker
