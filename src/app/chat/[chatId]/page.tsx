'use client';

import { use } from 'react';
import dynamic from 'next/dynamic';

const ChatCanvas = dynamic(
  () => import('@/client/dashboard/chat/components/ChatCanvas'),
  { ssr: false }
);

export default function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = use(params);

  return <ChatCanvas chatId={chatId} />;
}
