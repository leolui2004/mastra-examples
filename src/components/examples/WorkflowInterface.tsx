'use client';

import { useState } from 'react';
import { Play, Check, X } from 'lucide-react';

interface WorkflowStep {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'waiting' | 'error';
  name: string;
  result?: any;
}

interface WorkflowInterfaceProps {
  exampleId: string;
}

export function WorkflowInterface({ exampleId }: WorkflowInterfaceProps) {
  const [input, setInput] = useState('');
  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [waitingForConfirmation, setWaitingForConfirmation] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Define workflow-specific configurations
  const getWorkflowConfig = (workflowId: string) => {
    switch (workflowId) {
      case 'human-in-loop':
        return {
          steps: [
            { id: 'step-1', status: 'pending' as const, name: 'Pass value through' },
            { id: 'step-2', status: 'pending' as const, name: 'Wait for confirmation' },
          ],
          requiresConfirmation: true,
          inputType: 'number' as const
        };
      case 'conditional-branch-workflow':
        return {
          steps: [
            { id: 'branch-evaluation', status: 'pending' as const, name: 'Evaluate condition' },
            { id: 'branch-execution', status: 'pending' as const, name: 'Execute selected branch' },
          ],
          requiresConfirmation: false,
          inputType: 'number' as const
        };
      case 'array-workflow':
        return {
          steps: [
            { id: 'foreach-step', status: 'pending' as const, name: 'Process each array item' },
            { id: 'collect-step', status: 'pending' as const, name: 'Collect results' },
          ],
          requiresConfirmation: false,
          inputType: 'array' as const
        };
      default:
        return {
          steps: [
            { id: 'workflow-execution', status: 'pending' as const, name: 'Execute workflow' },
          ],
          requiresConfirmation: false,
          inputType: 'number' as const
        };
    }
  };

  const startWorkflow = async () => {
    if (!input.trim()) return;

    const config = getWorkflowConfig(exampleId);
    let processedInput: any;
    let requestBody: any;

    // Process input based on workflow type
    if (config.inputType === 'array') {
      try {
        // Try to parse as JSON array first
        const trimmedInput = input.trim();
        if (trimmedInput.startsWith('[') && trimmedInput.endsWith(']')) {
          processedInput = JSON.parse(trimmedInput);
        } else {
          // Split by comma and clean up
          processedInput = trimmedInput.split(',').map(item => item.trim()).filter(item => item.length > 0);
        }
        
        if (!Array.isArray(processedInput) || processedInput.length === 0) {
          alert('Please enter a valid array (e.g., "apple, banana, cherry" or ["apple", "banana", "cherry"])');
          return;
        }
        requestBody = processedInput; // Array workflows expect the array directly
      } catch (error) {
        alert('Please enter a valid array (e.g., "apple, banana, cherry" or ["apple", "banana", "cherry"])');
        return;
      }
    } else {
      // Number input
      processedInput = parseInt(input);
      if (isNaN(processedInput)) {
        alert('Please enter a valid number');
        return;
      }
      requestBody = { value: processedInput }; // Number workflows expect { value: number }
    }

    setIsRunning(true);
    setResult(null);
    setSteps(config.steps.map(step => ({ ...step, status: 'running' })));

    try {
      const response = await fetch(`/api/run/${exampleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to start workflow');
      }

      const data = await response.json();
      setWorkflowId(data.workflowId);

      if (config.requiresConfirmation) {
        // Human-in-loop workflow behavior
        setSteps(prev => prev.map(step => 
          step.id === 'step-1' 
            ? { ...step, status: 'completed', result: { value: processedInput } }
            : step.id === 'step-2'
            ? { ...step, status: 'waiting' }
            : step
        ));
        setWaitingForConfirmation(true);
        setIsRunning(false);
      } else {
        // Other workflows
        if (exampleId === 'conditional-branch-workflow') {
          const branchResult = processedInput <= 10 ? 0 : 20;
          const conditionText = processedInput <= 10 ? 'value ≤ 10' : 'value > 10';
          setSteps([
            { id: 'branch-evaluation', status: 'completed', name: 'Evaluate condition', result: { condition: conditionText } },
            { id: 'branch-execution', status: 'completed', name: 'Execute selected branch', result: { value: branchResult } },
          ]);
          setResult({ value: branchResult });
        } else if (exampleId === 'array-workflow') {
          // Array workflow specific handling
          const processedItems = processedInput.map((item: string) => `${item} mapStep`);
          setSteps([
            { id: 'foreach-step', status: 'completed', name: 'Process each array item', result: { processed: processedItems } },
            { id: 'collect-step', status: 'completed', name: 'Collect results', result: data },
          ]);
          setResult(data);
        } else {
          // Generic workflow completion
          setSteps(prev => prev.map(step => ({ ...step, status: 'completed', result: data })));
          setResult(data);
        }
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setSteps(prev => prev.map(step => 
        step.status === 'running' ? { ...step, status: 'error' } : step
      ));
      setIsRunning(false);
    }
  };

  const handleConfirmation = async (confirm: boolean) => {
    if (!workflowId) return;

    setWaitingForConfirmation(false);
    setSteps(prev => prev.map(step => 
      step.id === 'step-2' ? { ...step, status: 'running' } : step
    ));

    try {
      const response = await fetch(`/api/run/${exampleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          workflowId,
          confirm,
          action: 'resume'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to resume workflow');
      }

      const data = await response.json();
      
      setSteps(prev => prev.map(step => 
        step.id === 'step-2' 
          ? { ...step, status: 'completed', result: { confirmed: confirm } }
          : step
      ));

      setResult(data.result);
    } catch (error) {
      console.error('Error:', error);
      setSteps(prev => prev.map(step => 
        step.id === 'step-2' ? { ...step, status: 'error' } : step
      ));
    }
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'running':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      case 'waiting':
        return <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />;
      case 'error':
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const getStepBgColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      case 'waiting':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-4">
        <div>
          {(() => {
            const config = getWorkflowConfig(exampleId);
            const isArrayInput = config.inputType === 'array';
            return (
              <>
                <label htmlFor="workflow-input" className="block text-sm font-medium text-gray-700 mb-2">
                  {isArrayInput ? 'Enter array items:' : 'Enter a number:'}
                </label>
                <div className="flex space-x-2">
                  <input
                    id="workflow-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isArrayInput ? 'apple, banana, cherry' : 'Enter a number'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isRunning || waitingForConfirmation}
                  />
                  <button
                    onClick={startWorkflow}
                    disabled={isRunning || waitingForConfirmation || !input.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start Workflow</span>
                  </button>
                </div>
                {isArrayInput && (
                  <p className="text-sm text-gray-500 mt-1">
                    Enter items separated by commas, or use JSON format: ["item1", "item2"]
                  </p>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* Workflow Steps */}
      {steps.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Workflow Progress</h3>
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`border rounded-lg p-4 ${getStepBgColor(step.status)}`}
            >
              <div className="flex items-center space-x-3">
                {getStepIcon(step.status)}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    Step {index + 1}: {step.name}
                  </div>
                  {step.result && (
                    <div className="text-sm text-gray-600 mt-1">
                      Result: {JSON.stringify(step.result)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation - only show for workflows that require it */}
      {waitingForConfirmation && exampleId === 'human-in-loop' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Confirmation Required
          </h4>
          <p className="text-gray-600 mb-4">
            The workflow is waiting for your confirmation to proceed. Do you want to continue?
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => handleConfirmation(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Confirm
            </button>
            <button
              onClick={() => handleConfirmation(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Final Result */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-2">
            Workflow Completed
          </h4>
          <div className="text-green-700">
            Final Result: {JSON.stringify(result)}
          </div>
        </div>
      )}
    </div>
  );
}