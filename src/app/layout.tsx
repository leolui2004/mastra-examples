import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mastra Examples',
  description: 'Explore Mastra agents and workflows',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="text-xl font-bold text-gray-900">
                Mastra Examples
              </a>
              <div className="text-sm text-gray-600">
                Powered by Mastra
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}