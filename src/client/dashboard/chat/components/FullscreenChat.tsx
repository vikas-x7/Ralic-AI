'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BsArrowsAngleContract } from 'react-icons/bs';
import { IoMdArrowUp } from 'react-icons/io';
import { IoMicSharp } from 'react-icons/io5';
import {
  FiChevronDown,
  FiTrash2,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiRefreshCw,
  FiCheck,
  FiSquare,
} from 'react-icons/fi';
import MessageContent from './MessageContent';
import { FcGoogle } from 'react-icons/fc';
import { LiaLinkSolid as LinkIcon } from 'react-icons/lia';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'pending' | 'error';
}

interface FullscreenChatProps {
  nodeId: string;
  messages: ChatMessage[];
  isStreaming?: boolean;
  onSend: (nodeId: string, message: string) => void;
  onStop: (nodeId: string) => void;
  onClose: () => void;
  onRequestDelete?: (nodeId: string) => void;
  canDelete?: boolean;
  onTextSelection?: (
    nodeId: string,
    selectedText: string,
    selectionRect: DOMRect
  ) => void;
}

export default function FullscreenChat({
  nodeId,
  messages,
  isStreaming = false,
  onSend,
  onStop,
  onClose,
  onRequestDelete,
  canDelete,
  onTextSelection,
}: FullscreenChatProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<
    Partial<Record<number, 'like' | 'dislike'>>
  >({});
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as globalThis.Node)
      ) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFeedback = (index: number, type: 'like' | 'dislike') => {
    setFeedback((prev) => ({
      ...prev,
      [index]: prev[index] === type ? undefined : type,
    }));
  };

  const handleRetry = (index: number) => {
    const prevMsg = messages
      .slice(0, index)
      .reverse()
      .find((m) => m.role === 'user');
    if (prevMsg) {
      onSend(nodeId, prevMsg.content);
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const resizeTextarea = useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = '0px';
    const nextHeight = Math.min(textarea.scrollHeight, 200);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > 200 ? 'auto' : 'hidden';
  }, []);

  useEffect(() => {
    if (!textareaRef.current) return;
    resizeTextarea(textareaRef.current);
  }, [input, resizeTextarea]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(nodeId, input.trim());
    setInput('');
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selection || !selectedText || selection.rangeCount === 0) return;

    onTextSelection?.(
      nodeId,
      selectedText,
      selection.getRangeAt(0).getBoundingClientRect()
    );
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-black">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[768px] px-4 py-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-6 ${msg.role === 'user' ? 'flex justify-end' : ''}`}
            >
              {msg.role === 'user' ? (
                <div
                  onMouseUp={handleTextSelection}
                  onTouchEnd={handleTextSelection}
                  className="max-w-[85%] rounded-[5px] rounded-br-sm bg-[#202020] px-4 py-2 text-[15px] leading-7 text-gray-200"
                >
                  <MessageContent
                    content={msg.content}
                    isUser={msg.role === 'user'}
                  />
                </div>
              ) : (
                <div className="max-w-[85%]">
                  <div className="mb-1 flex items-center"></div>
                  <div
                    onMouseUp={handleTextSelection}
                    onTouchEnd={handleTextSelection}
                    className="rounded-2xl rounded-tl-sm px-4 py-3 text-[15px] leading-7 wrap-anywhere text-gray-300"
                  >
                    {msg.status === 'pending' && !msg.content ? (
                      <span className="inline-flex items-center gap-1.5 py-2">
                        <span
                          className="h-2 w-2 animate-pulse rounded-full bg-white/40"
                          style={{
                            animationDelay: '0ms',
                            animationDuration: '1.2s',
                          }}
                        />
                        <span
                          className="h-2 w-2 animate-pulse rounded-full bg-white/40"
                          style={{
                            animationDelay: '200ms',
                            animationDuration: '1.2s',
                          }}
                        />
                        <span
                          className="h-2 w-2 animate-pulse rounded-full bg-white/40"
                          style={{
                            animationDelay: '400ms',
                            animationDuration: '1.2s',
                          }}
                        />
                      </span>
                    ) : (
                      <MessageContent content={msg.content} />
                    )}
                  </div>

                  {msg.status !== 'pending' && msg.content && (
                    <div className="mt-2 flex items-center pl-2 text-white/40">
                      <button
                        onClick={() => handleCopy(msg.content, i)}
                        className="flex h-7 w-7 items-center justify-center rounded-[5px] transition-colors hover:bg-white/10 hover:text-white"
                        title="Copy"
                      >
                        {copiedIndex === i ? (
                          <FiCheck size={14} />
                        ) : (
                          <FiCopy size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => handleFeedback(i, 'like')}
                        className={`flex h-7 w-7 items-center justify-center rounded-[5px] transition-colors hover:bg-white/10 hover:text-white ${feedback[i] === 'like' ? 'bg-white/10 text-white' : ''}`}
                        title="Like"
                      >
                        <FiThumbsUp size={14} />
                      </button>
                      <button
                        onClick={() => handleFeedback(i, 'dislike')}
                        className={`flex h-7 w-7 items-center justify-center rounded-[5px] transition-colors hover:bg-white/10 hover:text-white ${feedback[i] === 'dislike' ? 'bg-white/10 text-white' : ''}`}
                        title="Dislike"
                      >
                        <FiThumbsDown size={14} />
                      </button>
                      <button
                        onClick={() => handleRetry(i)}
                        className="flex h-7 w-7 items-center justify-center rounded-[5px] transition-colors hover:bg-white/10 hover:text-white"
                        title="Retry"
                      >
                        <FiRefreshCw size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="shrink-0 bg-black px-4 py-4">
        <div className="mx-auto w-full max-w-[768px]">
          <div className="rounded-[9px] bg-[#121212] px-4 py-3 shadow-lg">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resizeTextarea(e.currentTarget);
              }}
              placeholder="Ask a follow-up"
              className="w-full resize-none overflow-y-hidden bg-transparent py-1 text-[16px] leading-6 text-gray-200 placeholder-white/40 outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <div className="mt-3 flex cursor-pointer items-center justify-between text-white/70">
              <div
                className="relative flex items-center gap-1"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center justify-center gap-2 rounded-[5px] border border-[#303030] px-2 py-1.5 text-[13px] transition-colors hover:bg-[#303030]"
                >
                  <FcGoogle size={17} className="mb-0.5" />
                  <span>Gemma 2</span>
                  <FiChevronDown size={14} className="opacity-50" />
                </button>

                <div className="relative">
                  <button className="peer flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] transition-colors hover:bg-[#303030] hover:text-white">
                    <IoMicSharp size={18} />
                  </button>
                  <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[200] -translate-x-1/2 rounded-[5px] border border-white/10 bg-[#1a1a1a] px-2.5 py-1.5 text-[11px] whitespace-nowrap text-white/70 opacity-0 shadow-xl transition-opacity duration-150 peer-hover:opacity-100">
                    This feature is under Development phase
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
                  </div>
                </div>

                {isModelDropdownOpen && (
                  <div className="absolute bottom-[calc(100%+8px)] left-0 z-50 w-52 rounded-[8px] border border-[#303030] bg-[#1a1a1a] p-1.5 shadow-2xl">
                    <button className="flex w-full items-center justify-between rounded-[5px] px-2 py-1.5 text-left text-[13px] text-white hover:bg-[#303030]">
                      <div className="flex items-center gap-2">
                        <FcGoogle size={14} />
                        <span>Gemma 2</span>
                      </div>
                      <FiCheck size={12} className="text-white/50" />
                    </button>

                    <div className="my-1.5 h-[1px] w-full bg-[#303030]/50" />

                    <button
                      disabled
                      className="flex w-full items-center justify-between rounded-[5px] px-2 py-1.5 text-left text-[13px] text-white/50"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="https://thesvg.org/icons/minimax/default.svg"
                          alt="Minimax"
                          className="h-4 w-4 rounded-[3px] object-contain opacity-70"
                        />
                        <span>Minimax</span>
                      </div>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40">
                        Up coming
                      </span>
                    </button>

                    <button
                      disabled
                      className="flex w-full items-center justify-between rounded-[5px] px-2 py-1.5 text-left text-[13px] text-white/50"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="https://thesvg.org/icons/kimi/default.svg"
                          alt="Kimi"
                          className="h-4 w-4 rounded-[3px] object-contain opacity-70"
                        />
                        <span>Kimi</span>
                      </div>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40">
                        Up coming
                      </span>
                    </button>

                    <button
                      disabled
                      className="flex w-full items-center justify-between rounded-[5px] px-2 py-1.5 text-left text-[13px] text-white/50"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="https://thesvg.org/icons/deepseek/default.svg"
                          alt="DeepSeek"
                          className="h-4 w-4 rounded-[3px] object-contain opacity-70"
                        />
                        <span>DeepSeek</span>
                      </div>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40">
                        Up coming
                      </span>
                    </button>

                    <button
                      disabled
                      className="flex w-full items-center justify-between rounded-[5px] px-2 py-1.5 text-left text-[13px] text-white/50"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src="https://thesvg.org/icons/mistral/default.svg"
                          alt="Mistral"
                          className="h-4 w-4 rounded-[3px] object-contain opacity-70"
                        />
                        <span>Mistral</span>
                      </div>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/40">
                        Up coming
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="nodrag nopan relative">
                  <button className="peer flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] transition-colors hover:bg-[#303030] hover:text-white">
                    <LinkIcon size={18} />
                  </button>
                  <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[200] -translate-x-1/2 rounded-[5px] border border-white/10 bg-[#1a1a1a] px-2.5 py-1.5 text-[11px] whitespace-nowrap text-white/70 opacity-0 shadow-xl transition-opacity duration-150 peer-hover:opacity-100">
                    This feature is under Development phase
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="nodrag nopan flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] transition-colors hover:bg-[#303030] hover:text-white"
                  title="Collapse to node view"
                >
                  <BsArrowsAngleContract size={14} />
                </button>

                {canDelete !== false && (
                  <button
                    onClick={() => onRequestDelete?.(nodeId)}
                    className="nodrag nopan flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] text-white/60 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
                    title="Delete node"
                  >
                    <FiTrash2 size={15} />
                  </button>
                )}

                {isStreaming ? (
                  <button
                    onClick={() => onStop(nodeId)}
                    className="nodrag nopan ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] bg-white/20 text-red-500 transition-all hover:bg-white/80 active:scale-90"
                    title="Stop generating"
                  >
                    <FiSquare size={14} className="fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="nodrag nopan ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] bg-white text-black/90 transition-all hover:bg-white/30 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white"
                  >
                    <IoMdArrowUp size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
