'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BsArrowsAngleContract } from 'react-icons/bs';
import { IoMdArrowUp } from 'react-icons/io';
import {
  FiChevronDown,
  FiPlus,
  FiMic,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiRefreshCw,
  FiCheck,
} from 'react-icons/fi';
import MessageContent from './MessageContent';
import { FcGoogle } from 'react-icons/fc';
import { LiaLinkSolid } from 'react-icons/lia';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  status?: 'pending' | 'error';
}

interface FullscreenChatProps {
  nodeId: string;
  messages: ChatMessage[];
  onSend: (nodeId: string, message: string) => void;
  onClose: () => void;
  onTextSelection?: (
    nodeId: string,
    selectedText: string,
    selectionRect: DOMRect
  ) => void;
}

export default function FullscreenChat({
  nodeId,
  messages,
  onSend,
  onClose,
  onTextSelection,
}: FullscreenChatProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<
    Partial<Record<number, 'like' | 'dislike'>>
  >({});

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
                      'Thinking...'
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
              <div className="flex items-center gap-1">
                <button
                  className={`flex items-center justify-center gap-2 rounded-[5px] border border-[#303030] px-3 py-0.5 text-[13px]`}
                >
                  <FcGoogle size={14} />
                  <span>Gemma 2</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button className="nodrag nopan flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] transition-colors hover:bg-[#303030] hover:text-white">
                  <LiaLinkSolid size={18} />
                </button>

                <button
                  onClick={onClose}
                  className="nodrag nopan flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] transition-colors hover:bg-[#303030] hover:text-white"
                  title="Collapse to node view"
                >
                  <BsArrowsAngleContract size={14} />
                </button>

                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="nodrag nopan ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] bg-white text-black/90 transition-all hover:bg-white/30 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white"
                >
                  <IoMdArrowUp size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
