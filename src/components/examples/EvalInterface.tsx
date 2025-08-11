'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface EvalInterfaceProps {
  exampleId: string;
}

export function EvalInterface({ exampleId }: EvalInterfaceProps) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!query.trim() || !response.trim()) {
      setError('Please enter both query and response');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/run/${exampleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), response: response.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to run evaluation');
      }
      const data = await res.json();
      setResult(data.result);
    } catch (e: any) {
      setError(e?.message || 'Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Query</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter the user query..."
            className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Response</label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Enter the model response..."
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={isLoading || !query.trim() || !response.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Run Eval</span>
          </button>
          {isLoading && <span className="text-gray-500 text-sm">Evaluating…</span>}
        </div>

        {error && (
          <div className="text-sm text-red-600">{error}</div>
        )}
      </div>

      {result && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-900 mb-2">Result</h4>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}


