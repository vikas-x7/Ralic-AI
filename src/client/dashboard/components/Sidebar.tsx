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
    <aside className="flex w-60 flex-col border-r border-[#252525]  bg-[#050505]">
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-1">
          {dummyChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-gray-700"
            >
              <svg
                className="h-4 w-4 flex-shrink-0 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>

     
    </aside>
  );
}
