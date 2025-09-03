'use client';

import dynamic from 'next/dynamic';

const ChatCanvas = dynamic(
  () => import('@/client/dashboard/chat/components/ChatCanvas'),
  { ssr: false }
);

export default function ChatPage() {
  return <ChatCanvas />;
}
