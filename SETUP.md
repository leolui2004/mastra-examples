# Mastra Examples Setup Guide

This project demonstrates various Mastra agents and workflows through an interactive web interface.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for the cat expert agent)
- Docker (optional, for containerized deployment)

## Environment Setup

1. Create a `.env.local` file in the root directory:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser.

## Available Examples

### 1. Cat Expert Agent (Chat Interface)
- **Type**: Chat Agent
- **Description**: An AI agent that provides cat facts and answers cat-related questions
- **Features**: Uses OpenAI GPT-4o-mini with a custom tool to fetch real cat facts from catfact.ninja API

### 2. Human-in-the-Loop Workflow
- **Type**: Workflow
- **Description**: Demonstrates a workflow that requires human confirmation to proceed
- **Features**: Two-step workflow with user interaction and state management

## Docker Deployment

### Production Mode
```bash
# Build and run
docker-compose up --build

# Access at http://localhost:3000
```

### Development Mode
```bash
# Run development environment
docker-compose --profile dev up --build

# Access at http://localhost:3001
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── run/
│   │       └── [exampleId]/
│   │           └── route.ts         # API endpoint for running examples
│   ├── examples/
│   │   ├── [exampleId]/
│   │   │   └── page.tsx             # Dynamic example pages
│   │   └── layout.tsx               # Shared layout with sidebar
│   ├── globals.css                  # Tailwind CSS
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing page
├── agents/
│   └── index.ts                     # Agent and workflow registry
└── components/
    ├── ui/
    │   └── card.tsx                 # Basic UI components
    └── examples/
        ├── ChatInterface.tsx        # Chat UI for agents
        └── WorkflowInterface.tsx    # Workflow UI with step tracking
```

## Adding New Examples

1. **Add your agent/workflow** to `src/agents/index.ts`:
```typescript
export const examples: ExampleConfig[] = [
  // ... existing examples
  {
    id: 'your-example',
    title: 'Your Example Title',
    description: 'Your example description',
    type: 'chat', // or 'workflow'
    agent: yourAgent, // for chat type
    workflow: yourWorkflow, // for workflow type
    inputSchema: yourSchema, // for workflow type
  }
];
```

2. **Create UI component** (if needed) in `src/components/examples/`

3. **Update the dynamic page** in `src/app/examples/[exampleId]/page.tsx` if you need custom UI

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **AI Framework**: Mastra Core
- **LLM Provider**: OpenAI (GPT-4o-mini)
- **Type Safety**: TypeScript with Zod schemas
- **Icons**: Lucide React
- **Containerization**: Docker & Docker Compose

## Features

- **Interactive UI**: Clean, responsive interface for testing agents
- **Real-time Chat**: Live chat interface for conversational agents
- **Workflow Visualization**: Step-by-step workflow execution with status tracking
- **Example Browser**: Easy navigation between different examples
- **Docker Support**: Production-ready containerization
- **Type Safety**: Full TypeScript support with Zod validation

## API Endpoints

### POST `/api/run/[exampleId]`

**For Chat Agents:**
```json
{
  "message": "Your question here"
}
```

**For Workflows (Start):**
```json
{
  "value": 42
}
```

**For Workflows (Resume):**
```json
{
  "workflowId": "workflow_123",
  "confirm": true,
  "action": "resume"
}
```

## Troubleshooting

### Common Issues

1. **OpenAI API errors**: Make sure your API key is set in `.env.local`
2. **Build errors**: Ensure all dependencies are installed with `npm install`
3. **Port conflicts**: Change ports in `docker-compose.yml` if needed
4. **TypeScript errors**: Run `npm run lint` to check for issues

### Development Tips

- Use the browser's developer tools to inspect API calls
- Check the console for detailed error messages
- Workflow state is stored in memory - restart the server to reset

## Contributing

When adding new examples:
1. Follow the existing code patterns
2. Add proper TypeScript types
3. Include error handling
4. Test both UI and API endpoints
5. Update this documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.