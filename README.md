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
├── agents/index.ts                      # Agent & workflow registry
└── components/
    ├── ui/card.tsx                      # UI components
    └── examples/
        ├── ChatInterface.tsx            # Chat UI for agents
        └── WorkflowInterface.tsx        # Workflow UI with steps
```

## 🔧 Adding New Examples

Add your examples to `src/agents/index.ts`:

```typescript
export const examples: ExampleConfig[] = [
  {
    id: 'your-example',
    title: 'Your Example Title', 
    description: 'Description of your example',
    type: 'chat', // or 'workflow'
    agent: yourAgent, // for chat examples
    workflow: yourWorkflow, // for workflow examples
  }
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
