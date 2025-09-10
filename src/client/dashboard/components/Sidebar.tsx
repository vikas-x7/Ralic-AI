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
    <aside className="flex w-60 flex-col border-r border-[#2a2a2a] bg-[#050505]">
      <div className="px- mb-4 flex items-center border-b border-[#2a2a2a] py-1 text-white">
        <img
          src="https://i.pinimg.com/1200x/a0/cf/06/a0cf0615ea4915513ce4e3f64053ff8c.jpg"
          alt=""
          className="w-11"
        />
        <h1 className="font-serif text-[18px] font-medium">Kausy AI </h1>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        <button className="flex w-full items-center gap-2 rounded-[3px] px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e]">
          New chat
        </button>
        <div className="space-y-1">
          {dummyChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className="flex w-full items-center gap-2 rounded-[3px] px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e]"
            >
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
