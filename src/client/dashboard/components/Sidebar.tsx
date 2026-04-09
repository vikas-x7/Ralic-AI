'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FiEdit2,
  FiLogOut,
  FiMoreHorizontal,
  FiSearch,
  FiSidebar,
  FiStar,
  FiTrash2,
} from 'react-icons/fi';
import { IoCreateOutline } from 'react-icons/io5';
import { trpc } from '@/client/trpc/react';

interface Chat {
  id: string;
  title: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SidebarProps {
  onOpenSearch: () => void;
}

export default function Sidebar({ onOpenSearch }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeChatId = pathname.match(/^\/dashboard\/chat\/([^/]+)/)?.[1];
  const [isOpen, setIsOpen] = useState(true);
  const [menuChatId, setMenuChatId] = useState<string | null>(null);
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Chat | null>(null);
  const utils = trpc.useUtils();
  const chatsQuery = trpc.chat.getChats.useQuery();
  const userQuery = trpc.auth.getUser.useQuery();
  const createChatMutation = trpc.chat.createChat.useMutation({
    onSuccess: (chat) => {
      void utils.chat.getChats.invalidate();
      router.push(`/dashboard/chat/${chat.id}`);
    },
  });
  const renameChatMutation = trpc.chat.renameChat.useMutation({
    onMutate: async (variables) => {
      await utils.chat.getChats.cancel();
      const previousChats = utils.chat.getChats.getData();

      utils.chat.getChats.setData(undefined, (currentChats) =>
        currentChats?.map((chat) =>
          chat.id === variables.chatId
            ? { ...chat, title: variables.title }
            : chat
        )
      );

      return { previousChats };
    },
    onError: (_error, _variables, context) => {
      utils.chat.getChats.setData(undefined, context?.previousChats);
    },
    onSettled: async () => {
      await utils.chat.getChats.invalidate();
    },
  });
  const setChatPinnedMutation = trpc.chat.setChatPinned.useMutation({
    onMutate: async (variables) => {
      await utils.chat.getChats.cancel();
      const previousChats = utils.chat.getChats.getData();

      utils.chat.getChats.setData(undefined, (currentChats) =>
        currentChats
          ?.map((chat) =>
            chat.id === variables.chatId
              ? {
                  ...chat,
                  isPinned: variables.isPinned,
                  updatedAt: new Date(),
                }
              : chat
          )
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          })
      );

      return { previousChats };
    },
    onError: (_error, _variables, context) => {
      utils.chat.getChats.setData(undefined, context?.previousChats);
    },
    onSettled: async () => {
      await utils.chat.getChats.invalidate();
    },
  });
  const deleteChatMutation = trpc.chat.deleteChat.useMutation({
    onMutate: async (variables) => {
      await utils.chat.getChats.cancel();
      const previousChats = utils.chat.getChats.getData();

      utils.chat.getChats.setData(undefined, (currentChats) =>
        currentChats?.filter((chat) => chat.id !== variables.chatId)
      );

      return { previousChats };
    },
    onError: (_error, _variables, context) => {
      utils.chat.getChats.setData(undefined, context?.previousChats);
    },
    onSuccess: (_, variables) => {
      if (activeChatId === variables.chatId) {
        router.push('/dashboard');
      }
    },
    onSettled: async () => {
      await utils.chat.getChats.invalidate();
    },
  });

  useEffect(() => {
    if (!menuChatId) return;

    const handleDocumentClick = () => {
      setMenuChatId(null);
    };

    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [menuChatId]);

  const handleNewChat = () => {
    createChatMutation.mutate({ title: 'New Chat' });
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
  };

  const startRename = (chat: Chat) => {
    setRenamingChatId(chat.id);
    setRenameValue(chat.title);
    setMenuChatId(null);
  };

  const submitRename = (chatId: string) => {
    const title = renameValue.trim();

    setRenamingChatId(null);

    if (!title) return;

    renameChatMutation.mutate({ chatId, title });
  };

  const handleTogglePin = (chat: Chat) => {
    setMenuChatId(null);
    setChatPinnedMutation.mutate({
      chatId: chat.id,
      isPinned: !chat.isPinned,
    });
  };

  const handleDeleteChat = (chat: Chat) => {
    setMenuChatId(null);
    setDeleteTarget(chat);
  };

  const confirmDeleteChat = () => {
    if (!deleteTarget) return;

    deleteChatMutation.mutate({ chatId: deleteTarget.id });
    setDeleteTarget(null);
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
          <div className="shrink-0 px-2 pt-4">
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
          </div>

          <div className="mt-4 flex-1 overflow-y-auto px-2 pb-4">
            <div className="space-y">
              <p className="sticky top-0 z-10 mb-2 bg-black px-3 py-1 text-[13px] font-medium text-white/60">
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
                const isRenaming = renamingChatId === chat.id;
                const isMenuOpen = menuChatId === chat.id;

                return (
                  <div
                    key={chat.id}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group relative flex w-full items-center rounded-[3px] px-2 py-1 text-sm transition-colors ${
                      isActive
                        ? 'bg-[#242424] text-white'
                        : 'text-gray-300 hover:bg-[#1e1e1e] hover:text-white'
                    }`}
                  >
                    {isRenaming ? (
                      <input
                        value={renameValue}
                        onChange={(event) => setRenameValue(event.target.value)}
                        onBlur={() => submitRename(chat.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                            submitRename(chat.id);
                          }

                          if (event.key === 'Escape') {
                            setRenamingChatId(null);
                          }
                        }}
                        autoFocus
                        className="min-w-0 flex-1 bg-[#303030] px-2 py-1 text-sm text-white outline-none"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleChatClick(chat.id)}
                        className="flex min-w-0 flex-1 items-center gap-1.5 px-1 py-1 text-left"
                      >
                        {chat.isPinned && (
                          <FiStar
                            size={12}
                            className="shrink-0 fill-white/50 text-white/50"
                          />
                        )}
                        <span className="truncate">{chat.title}</span>
                      </button>
                    )}

                    {!isRenaming && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setMenuChatId(isMenuOpen ? null : chat.id);
                        }}
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] text-white/40 transition-colors hover:bg-white/10 hover:text-white ${
                          isMenuOpen
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                        }`}
                        title="Chat options"
                      >
                        <FiMoreHorizontal size={16} />
                      </button>
                    )}

                    {isMenuOpen && (
                      <div
                        onClick={(event) => event.stopPropagation()}
                        className="absolute top-8 right-1 z-30 w-36 rounded-[7px] bg-[#202020] p-1 shadow-xl shadow-black/50"
                      >
                        <button
                          type="button"
                          onClick={() => startRename(chat)}
                          className="flex w-full items-center gap-2 rounded-[5px] px-2.5 py-2 text-left text-sm text-white/75 hover:bg-white/10 hover:text-white"
                        >
                          <FiEdit2 size={14} />
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTogglePin(chat)}
                          className="flex w-full items-center gap-2 rounded-[5px] px-2.5 py-2 text-left text-sm text-white/75 hover:bg-white/10 hover:text-white"
                        >
                          <FiStar size={14} />
                          {chat.isPinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteChat(chat)}
                          className="flex w-full items-center gap-2 rounded-[5px] px-2.5 py-2 text-left text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200"
                        >
                          <FiTrash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
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

      {deleteTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-[10px] bg-[#151515] p-4 text-white shadow-2xl shadow-black/60">
            <h2 className="text-[15px] font-medium">Delete chat?</h2>
            <p className="mt-2 text-sm leading-6 text-white/50">
              This will permanently delete &quot;{deleteTarget.title}&quot;.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-[6px] px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteChat}
                disabled={deleteChatMutation.isPending}
                className="rounded-[6px] bg-red-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteChatMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
