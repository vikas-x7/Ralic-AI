'use client';

import { useRouter } from 'next/navigation';

interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

const dummyChats: Chat[] = [
  { id: '1', title: 'Project Planning', createdAt: '2024-01-15' },
  { id: '2', title: 'Code Review Discussion', createdAt: '2024-01-14' },
  { id: '3', title: 'Architecture Design', createdAt: '2024-01-13' },
];

export default function Sidebar() {
  const router = useRouter();

  const handleNewChat = () => {
    const chatId = crypto.randomUUID();
    router.push(`/dashboard/chat/${chatId}`);
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
  };

  return (
    <aside className="flex w-60 flex-col border-r border-[#100f0f] bg-[#050505]">
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {dummyChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-gray-700"
            >
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
