import Link from 'next/link';
import { getAllExamplesMetadata } from '@/agents';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const examples = getAllExamplesMetadata();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mastra Examples
          </h1>
          <p className="text-xl text-gray-600">
            Explore different Mastra agents and workflows in action
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {examples.map((example) => (
            <Link key={example.id} href={`/examples/${example.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {example.title}
                    <span className="text-sm font-normal bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {example.type}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {example.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              About This Project
            </h2>
            <p className="text-gray-600">
              This project showcases various Mastra examples including chat agents and workflows. 
              Each example demonstrates different capabilities and use cases of the Mastra framework.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}