import Link from 'next/link';
import { getAllExamplesMetadata } from '@/agents';
import { ArrowLeft } from 'lucide-react';

export default function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const examples = getAllExamplesMetadata();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <Link 
            href="/" 
            className="flex items-center text-blue-600 hover:text-blue-800 mr-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Examples
          </Link>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Examples</h3>
              <nav className="space-y-2">
                {examples.map((example) => (
                  <Link
                    key={example.id}
                    href={`/examples/${example.id}`}
                    className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                  >
                    {example.title}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}