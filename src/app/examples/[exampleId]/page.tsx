import { notFound } from 'next/navigation';
import { getExample } from '@/agents';
import { ChatInterface } from '@/components/examples/ChatInterface';
import { WorkflowInterface } from '@/components/examples/WorkflowInterface';
import { EvalInterface } from '@/components/examples/EvalInterface';

interface ExamplePageProps {
  params: {
    exampleId: string;
  };
}

export default function ExamplePage({ params }: ExamplePageProps) {
  const example = getExample(params.exampleId);
  
  if (!example) {
    notFound();
  }

  // Only pass serializable data to client components
  const exampleData = {
    id: example.id,
    title: example.title,
    description: example.description,
    type: example.type
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {exampleData.title}
        </h1>
        <p className="text-gray-600 mb-4">
          {exampleData.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Type:</span>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {exampleData.type}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        {exampleData.type === 'chat' && (
          <ChatInterface exampleId={exampleData.id} />
        )}
        {exampleData.type === 'workflow' && (
          <WorkflowInterface exampleId={exampleData.id} />
        )}
        {exampleData.type === 'eval' && (
          <EvalInterface exampleId={exampleData.id} />
        )}
      </div>
    </div>
  );
}