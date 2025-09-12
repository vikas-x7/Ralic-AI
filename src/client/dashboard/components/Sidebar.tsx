'use client';

import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { IoIosCreate } from 'react-icons/io';
import { IoCreateOutline } from 'react-icons/io5';

interface Chat {
  id: string;
  title: string;
  createdAt: string;
}

const dummyChats: Chat[] = [
  { id: '1', title: 'Project Planning', createdAt: '2024-01-15' },
  { id: '2', title: 'Code Review Discussion', createdAt: '2024-01-14' },
  { id: '3', title: 'Architecture Design', createdAt: '2024-01-13' },
  { id: '1', title: 'Project Planning', createdAt: '2024-01-15' },
  { id: '2', title: 'Code Review Discussion', createdAt: '2024-01-14' },
  { id: '3', title: 'Architecture Design', createdAt: '2024-01-13' },
  { id: '1', title: 'Project Planning', createdAt: '2024-01-15' },
  { id: '2', title: 'Code Review Discussion', createdAt: '2024-01-14' },
  { id: '3', title: 'Architecture Design', createdAt: '2024-01-13' },
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
    <aside className="flex w-60 flex-col border-r border-[#2a2a2a] bg-[#141414]">
      <div className="px- mb-4 flex items-center border-b border-[#2a2a2a] py-1 text-white">
        <img src="/images/logo.png" alt="" className="w-11" />
        <h1 className="font-serif text-[18px] font-medium">Kausy AI </h1>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        <button className="flex w-full items-center gap-2 rounded-[3px] px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e]">
          <IoCreateOutline size={18} className="mb-1" />
          New chat
        </button>
        <div className="space-y-1">
          <p className="mt-3 mb-2 px-3 text-[15px] text-white">chats</p>
          {dummyChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className="flex w-full items-center rounded-[3px] px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e]"
            >
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#2a2a2a] px-3 py-2">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-white">
            VP
          </div>

          <div className="flex flex-col">
            <span className="text-[13px] text-white">vikas pal</span>
            <span className="text-[11px] text-gray-400">
              vikaspal968562@gmail.com
            </span>
          </div>
        </div>

        {/* Right Icon */}
        <FiLogOut className="cursor-pointer text-gray-400 hover:text-white" />
      </div>
    </aside>
  );
}
