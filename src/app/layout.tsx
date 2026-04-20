import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import '@xyflow/react/dist/style.css';
import './globals.css';
import { TRPCProvider } from '@/client/components/providers/TRPCProvider';
import { SessionProvider } from 'next-auth/react';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Relic AI | Node based AI ',
  description:
    'A canvas-based AI thinking space where your ideas live as nodes, branch freely, and never get lost. Think without limits  your canvas never forgets.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${dmSans.className} flex min-h-full flex-col`}>
        <SessionProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
