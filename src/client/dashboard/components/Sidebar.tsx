'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiLogOut, FiSidebar } from 'react-icons/fi';
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
  const [isOpen, setIsOpen] = useState(true);

  const handleNewChat = () => {
    const chatId = crypto.randomUUID();
    router.push(`/dashboard/chat/${chatId}`);
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
  };

  return (
    <>
      <aside
        className={`relative flex flex-col border-white/10 bg-black transition-all duration-300 ease-in-out ${
          isOpen ? 'w-[260px] border-r' : 'w-0 overflow-hidden border-r-0'
        }`}
      >
        <div className="flex h-full w-[260px] flex-col">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pr-3 pb-1">
            <div className="flex items-center text-white">
              <img src="/images/logo.png" alt="" className="w-12" />
              <h1 className="-ml-1 text-[17px] font-medium tracking-tight">
                Ralic ai
              </h1>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              title="Close Sidebar"
            >
              <FiSidebar size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-4">
            <button className="flex w-full items-center gap-2 rounded-[3px] bg-white/5 px-3 py-2.5 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e]">
              <IoCreateOutline size={18} className="mb-0.5 opacity-80" />
              New chat
            </button>
            <div className="mt-4 space-y-1">
              <p className="mb-2 px-3 text-[13px] font-medium text-white/60">
                chats
              </p>
              {dummyChats.map((chat, i) => (
                <button
                  key={`${chat.id}-${i}`}
                  onClick={() => handleChatClick(chat.id)}
                  className="flex w-full items-center rounded-[3px] px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-[#1e1e1e] hover:text-white"
                >
                  <span className="truncate">{chat.title}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#2a2a2a] px-4 py-3">
            {/* Left */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/10 text-sm font-semibold text-white">
                VP
              </div>

              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-white">
                  vikas pal
                </span>
                <span className="text-[11px] text-white/40">
                  vikaspal968562@gmail.com
                </span>
              </div>
            </div>

            {/* Right Icon */}
            <FiLogOut
              className="cursor-pointer text-white/40 hover:text-white"
              size={18}
            />
          </div>
        </div>
      </aside>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-6 left-6 z-[100] rounded-md border border-[#303030] bg-[#1a1a1a] p-2 text-white/50 shadow-md transition-colors hover:text-white"
          title="Open Sidebar"
        >
          <FiSidebar size={20} />
        </button>
      )}
    </>
  );
}
