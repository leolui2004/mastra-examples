import { NextRequest, NextResponse } from 'next/server';
import { getExample } from '@/agents';

// In-memory storage for workflow states (simplified for demo purposes)
const workflowStates = new Map<string, { value: number; step: number }>();

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
      const { message } = body;
      
      if (!message) {
        return NextResponse.json(
          { error: 'Message is required' },
          { status: 400 }
        );
      }

      const result = await example.agent.generate(message);
      
      return NextResponse.json({
        response: result.text
      });

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