import { NextRequest, NextResponse } from 'next/server';
import { getExample } from '@/agents';
import { createAnswerRelevancyMetric } from '@/agents/examples/answer-relevancy';
import { createBiasMetric } from '@/agents/examples/bias-evaluation';
import { randomUUID } from 'crypto';

// In-memory storage for workflow states (simplified for demo purposes)
const workflowStates = new Map<string, { value: number; step: number }>();

// Note: Do not rely on in-memory session storage for memory threads.
// Use a deterministic threadId derived from the sessionId so memory persists
// across hot reloads/stateless environments.

export async function POST(
  request: NextRequest,
  { params }: { params: { exampleId: string } }
) {
  try {
    const { exampleId } = params;
    const example = getExample(exampleId);

    if (!example) {
      return NextResponse.json(
        { error: 'Example not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (example.type === 'chat' && example.agent) {
      // Handle chat agent
      const { message, sessionId } = body;
      
      if (!message) {
        return NextResponse.json(
          { error: 'Message is required' },
          { status: 400 }
        );
      }

      // Check if this is a memory agent that requires session management
      if (exampleId === 'memory-agent') {
        // Use sessionId as the deterministic threadId so memory can be recalled reliably
        const actualSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const threadId = actualSessionId;
        const resourceId = actualSessionId;

        try {
          // Handle memory agent with proper streaming and session management
          const result = await example.agent.stream(message, {
            threadId,
            resourceId,
            memoryOptions: {
              lastMessages: 10, // Get last 10 messages
              semanticRecall: {
                topK: 3, // Get top 3 most relevant messages
                messageRange: 2, // Include context around each match
              },
            },
          });

          // Collect the streamed response
          let responseText = '';
          for await (const chunk of result.textStream) {
            responseText += chunk;
          }

          return NextResponse.json({
            response: responseText,
            sessionId: actualSessionId,
          });
        } catch (error) {
          console.error('Memory agent error:', error);
          // Fallback to regular generation if memory fails
          const fallbackResult = await example.agent.generate(message);
          return NextResponse.json({
            response: fallbackResult.text,
            sessionId: actualSessionId,
          });
        }
      } else {
        // Handle regular chat agents
        const result = await example.agent.generate(message);
        
        return NextResponse.json({
          response: result.text
        });
      }

    } else if (example.type === 'workflow' && example.workflow) {
      // Handle workflow
      const { value, workflowId, confirm, action } = body;

      if (action === 'resume' && workflowId) {
        // Resume workflow with confirmation (simplified implementation)
        const state = workflowStates.get(workflowId);
        
        if (!state) {
          return NextResponse.json(
            { error: 'Workflow instance not found' },
            { status: 404 }
          );
        }

        try {
          // Simulate workflow completion
          const result = {
            value: state.value,
            confirmed: confirm
          };
          
          // Clean up completed workflow
          workflowStates.delete(workflowId);

          return NextResponse.json({
            result,
            status: 'success'
          });
        } catch (error) {
          console.error('Error resuming workflow:', error);
          return NextResponse.json(
            { error: 'Failed to resume workflow' },
            { status: 500 }
          );
        }
      } else {
        try {
          // Simulate workflow execution (simplified for demo)
          // Step 1: Pass value through (automatic)
          // Step 2: Suspend for user confirmation
          
          const workflowId = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // Store the workflow state for later resume
          workflowStates.set(workflowId, { value, step: 2 });
          
          return NextResponse.json({
            workflowId,
            status: 'suspended'
          });
        } catch (error) {
          console.error('Error starting workflow:', error);
          return NextResponse.json(
            { error: 'Failed to start workflow' },
            { status: 500 }
          );
        }
      }
    } else if (example.type === 'eval' && example.id === 'answer-relevancy') {
      const { query, response } = body;
      if (!query || !response) {
        return NextResponse.json(
          { error: 'Both query and response are required' },
          { status: 400 }
        );
      }
      try {
        const metric = createAnswerRelevancyMetric();
        const result = await metric.measure(query, response);
        return NextResponse.json({ result });
      } catch (error) {
        console.error('Eval error:', error);
        return NextResponse.json(
          { error: 'Failed to run evaluation' },
          { status: 500 }
        );
      }
    } else if (example.type === 'eval' && example.id === 'bias') {
      const { query, response } = body;
      if (!query || !response) {
        return NextResponse.json(
          { error: 'Both query and response are required' },
          { status: 400 }
        );
      }
      try {
        const metric = createBiasMetric();
        const result = await metric.measure(query, response);
        return NextResponse.json({ result });
      } catch (error) {
        console.error('Eval error:', error);
        return NextResponse.json(
          { error: 'Failed to run evaluation' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Unsupported example type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}