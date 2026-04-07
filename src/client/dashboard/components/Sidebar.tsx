'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiLogOut, FiSearch, FiSidebar } from 'react-icons/fi';
import { IoCreateOutline } from 'react-icons/io5';
import { trpc } from '@/client/trpc/react';

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
}

interface SidebarProps {
  onOpenSearch: () => void;
}

export default function Sidebar({ onOpenSearch }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeChatId = pathname.match(/^\/dashboard\/chat\/([^/]+)/)?.[1];
  const [isOpen, setIsOpen] = useState(true);
  const utils = trpc.useUtils();
  const chatsQuery = trpc.chat.getChats.useQuery();
  const userQuery = trpc.auth.getUser.useQuery();
  const createChatMutation = trpc.chat.createChat.useMutation({
    onSuccess: (chat) => {
      void utils.chat.getChats.invalidate();
      router.push(`/dashboard/chat/${chat.id}`);
    },
  });

  const handleNewChat = () => {
    createChatMutation.mutate({ title: 'New Chat' });
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
          <div className="flex items-center justify-between border-b border-[#2a2a2a] pr-3">
            <div className="flex items-center text-white">
              <img src="/images/logo.png" alt="" className="w-10" />
              <h1 className="mt-0.5 -ml-1 text-[17px] font-medium tracking-tight">
                Relic ai
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
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <button
              onClick={handleNewChat}
              disabled={createChatMutation.isPending}
              className="flex w-full items-center gap-2 rounded-[3px] bg-white/5 px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IoCreateOutline size={18} className="mb-0.5 opacity-80" />
              {createChatMutation.isPending ? 'Creating...' : 'New chat'}
            </button>
            <button
              onClick={onOpenSearch}
              className="mt-2 flex w-full items-center gap-2 rounded-[3px] px-3 py-2 text-left text-sm text-gray-200 transition-colors hover:bg-[#1e1e1e] hover:text-white"
            >
              <FiSearch size={17} className="opacity-80" />
              Search
            </button>
            <div className="mt-4 space-y-2">
              <p className="mb-2 px-3 text-[13px] font-medium text-white/60">
                chats
              </p>
              {chatsQuery.isLoading && (
                <p className="px-3 py-2 text-sm text-white/35">Loading...</p>
              )}
              {chatsQuery.data?.length === 0 && (
                <p className="px-3 py-2 text-sm text-white/35">No chats yet</p>
              )}
              {chatsQuery.data?.map((chat: Chat) => {
                const isActive = activeChatId === chat.id;

                return (
                  <button
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center rounded-[3px] px-3 py-1 text-left text-sm transition-colors ${
                      isActive
                        ? 'bg-[#242424] text-white'
                        : 'text-gray-300 hover:bg-[#1e1e1e] hover:text-white'
                    }`}
                  >
                    <span className="truncate">{chat.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 px-2 py-1">
            <div className="flex items-center gap-3">
              {userQuery.data?.image ? (
                <img
                  src={userQuery.data.image}
                  alt={userQuery.data.name || ''}
                  className="h-7 w-7 rounded-sm object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/10 text-sm font-semibold text-white uppercase">
                  {userQuery.data?.name?.[0] ||
                    userQuery.data?.email?.[0] ||
                    'U'}
                </div>
              )}

              <div className="flex flex-col">
                <span className="max-w-[120px] truncate text-[13px] font-medium text-white">
                  {userQuery.data?.name || 'User'}
                </span>
                <span className="max-w-[120px] truncate text-[11px] text-white/40">
                  {userQuery.data?.email || ''}
                </span>
              </div>
            </div>

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
