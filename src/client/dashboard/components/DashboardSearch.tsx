'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { trpc } from '@/client/trpc/react';

interface DashboardSearchProps {
  onClose: () => void;
}

function makeSnippet(content: string, query: string) {
  const normalizedContent = content.replace(/\s+/g, ' ').trim();
  const lowerContent = normalizedContent.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerContent.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return normalizedContent.slice(0, 180);
  }

  const start = Math.max(0, matchIndex - 70);
  const end = Math.min(
    normalizedContent.length,
    matchIndex + query.length + 110
  );
  const prefix = start > 0 ? '...' : '';
  const suffix = end < normalizedContent.length ? '...' : '';

  return `${prefix}${normalizedContent.slice(start, end)}${suffix}`;
}

export default function DashboardSearch({ onClose }: DashboardSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();
  const recentChatsQuery = trpc.chat.getChats.useQuery();
  const searchQuery = trpc.chat.searchChats.useQuery(
    { query: trimmedQuery },
    {
      enabled: trimmedQuery.length > 0,
    }
  );
  const chats = useMemo(
    () =>
      trimmedQuery
        ? (searchQuery.data ?? [])
        : (recentChatsQuery.data ?? []).map((chat) => ({
            ...chat,
            messages: [],
          })),
    [recentChatsQuery.data, searchQuery.data, trimmedQuery]
  );
  const resultCount = chats.length;
  const helperText = useMemo(() => {
    if (!trimmedQuery) {
      if (recentChatsQuery.isLoading) return 'Loading chats...';
      if (!resultCount) return 'No chats yet.';

      return `${resultCount} recent ${resultCount === 1 ? 'chat' : 'chats'}`;
    }
    if (searchQuery.isLoading) return 'Searching...';
    if (searchQuery.error) return searchQuery.error.message;
    if (!resultCount) return 'No matching chats found.';

    return `${resultCount} matching ${resultCount === 1 ? 'chat' : 'chats'}`;
  }, [
    recentChatsQuery.isLoading,
    resultCount,
    searchQuery.error,
    searchQuery.isLoading,
    trimmedQuery,
  ]);

  const handleOpenChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/60 px-4 text-white backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative flex h-[520px] max-h-[78vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[10px] border border-white/10 bg-[#111] shadow-2xl shadow-black/70">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <FiSearch size={18} className="shrink-0 text-white/45" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
            placeholder="Search chats"
            className="w-full bg-transparent text-[16px] text-white outline-none placeholder:text-white/35"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[5px] text-white/35 transition-colors hover:bg-white/10 hover:text-white"
              title="Clear search"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        <div className="px-4 py-3 text-sm text-white/45">{helperText}</div>

        <div className="min-h-[260px] flex-1 overflow-y-auto px-2 pb-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => handleOpenChat(chat.id)}
              className="w-full rounded-[7px] px-3 py-3 text-left transition-colors hover:bg-white/10"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="truncate text-sm font-medium text-white">
                  {chat.title}
                </span>
                <span className="shrink-0 text-xs text-white/35">
                  {new Date(chat.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-1.5 space-y-1">
                {chat.messages.length > 0 ? (
                  chat.messages.map((message) => (
                    <p
                      key={message.id}
                      className="line-clamp-2 text-sm leading-6 text-white/55"
                    >
                      <span className="text-white/35">{message.role}: </span>
                      {makeSnippet(message.content, trimmedQuery)}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-white/45">
                    Title matches this search.
                  </p>
                )}
              </div>
            </button>
          ))}

          {!recentChatsQuery.isLoading &&
            !searchQuery.isLoading &&
            !chats.length && (
              <div className="flex min-h-[220px] items-center justify-center px-6 text-center text-sm text-white/35">
                {trimmedQuery
                  ? 'No matching chats found.'
                  : 'Your chats will show here.'}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
