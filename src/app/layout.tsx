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
  metadataBase: new URL('https://relicai.in'),

  title: {
    default: 'Relic AI ',
    template: '%s | Relic AI',
  },

  description:
    'A canvas-based AI thinking space where your ideas live as nodes, branch freely, and never get lost. Think without limits  your canvas never forgets.',

  keywords: [
    'Relic AI',
    'node based AI',
    'AI thinking canvas',
    'visual AI workspace',
    'branching AI chat',
    'AI second brain',
    'AI brainstorming tool',
    'infinite canvas AI',
    'mind mapping AI',
    'spatial AI workspace',
    'visual thinking AI',
    'AI workflow canvas',
    'AI research workspace',
    'ChatGPT alternative',
    'Claude alternative',
  ],

  authors: [{ name: 'Relic AI' }],

  creator: 'Relic AI',

  publisher: 'Relic AI',

  category: 'technology',

  applicationName: 'Relic AI',

  referrer: 'origin-when-cross-origin',

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: [
      {
        url: '/images/relicIcon.jpg',
      },
      {
        url: '/images/relicIcon.jpg',
        type: 'image/jpeg',
      },
    ],

    apple: '/images/relicIcon.jpg',
  },

  openGraph: {
    type: 'website',

    locale: 'en_US',

    url: 'https://relicai.in',

    siteName: 'Relic AI',

    title: 'Relic AI ',

    description:
      'A canvas-based AI thinking space where your ideas live as nodes, branch freely, and never get lost. Think without limits  your canvas never forgets.',

    images: [
      {
        url: '/images/relicaicanvas.jpg',
        width: 1200,
        height: 630,
        alt: 'Relic AI Visual AI Workspace',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Relic AI ',

    description:
      'A canvas-based AI thinking space where your ideas live as nodes, branch freely, and never get lost. Think without limits  your canvas never forgets.',

    images: ['/images/relicaicanvas.jpg'],

    creator: '@relicai',
  },

  alternates: {
    canonical: 'https://relicai.in',
  },

  verification: {
    google: 'kF0zawFyb56bCJymLSKydsR14_q0i1Hvdg0UAHj-0Fw',
  },
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
