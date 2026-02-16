import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ConsoleSidebar } from '@/components/layout/ConsoleSidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'LogOps Console',
  description: 'AI-Grade Observability Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${mono.variable} font-sans bg-background text-foreground overflow-x-hidden`}>
        <ConsoleSidebar />
        <main className="pl-20 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
