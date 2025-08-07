# Mastra Examples

A Next.js web application showcasing various Mastra agents and workflows through an interactive interface.

## 🐳 Docker Environment

### Production
```bash
docker-compose up --build
```

### Development
```bash
docker-compose --env-file .env.local --profile dev up --build
```

## 🚀 Local Environment

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

**You would also need to run a libSQL server if you want to try the memory function**

## 📦 Available Examples

1. Cat Expert Agent
2. Human-in-the-Loop Workflow  
3. Hierarchical Multi-Agent System
4. Array Processing Workflow
5. Tool with Agent
6. Conditional Branch Workflow

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/run/[exampleId]/route.ts     # API endpoints
│   ├── examples/[exampleId]/page.tsx    # Dynamic example pages
│   ├── examples/layout.tsx              # Examples layout with sidebar
│   ├── layout.tsx                       # Root layout
│   └── page.tsx                         # Landing page
├── agents/
│   ├── index.ts                         # Agent & workflow registry
│   └── examples/                        # Individual example implementations
│       ├── ...                          # Agent examples
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


## Special Thanks

Using Next.js with Mastra in some of the Next.js version will cause an error, the way to solve the error can be reference as below:

https://github.com/ai-peace/akira/blob/9f7aede5fecf4c90377a5edc11897ee20124c7de/mastra-nextjs-integration-report.md?plain=1#L8
