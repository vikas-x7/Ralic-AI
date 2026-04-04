'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BsArrowsAngleContract } from 'react-icons/bs';
import { IoMdArrowUp } from 'react-icons/io';
import { FiChevronDown, FiPlus, FiMic } from 'react-icons/fi';
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
        <div className="mx-auto max-w-[768px] px-4 py-6 pb-36">
          {messages.length === 0 && (
            <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center">
              <img
                src="/images/logo.png"
                alt=""
                className="mb-4 w-16 opacity-40"
              />
              <h2 className="mb-2 text-xl font-semibold text-gray-300">
                Start a conversation
              </h2>
              <p className="text-sm text-gray-500">
                Type a message below to begin
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-6 ${msg.role === 'user' ? 'flex justify-end' : ''}`}
            >
              {msg.role === 'user' ? (
                <div
                  onMouseUp={handleTextSelection}
                  onTouchEnd={handleTextSelection}
                  className="py- max-w-[85%] rounded-2xl rounded-br-sm bg-[#202020] px-4 text-[15px] leading-7 text-gray-200"
                >
                  {msg.content}
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
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 w-full max-w-[768px] -translate-x-1/2 px-4">
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
                className={`flex items-center justify-center gap-2 rounded-[5px] border border-[#303030] px-3 py-0.5`}
              >
                <FcGoogle size={14} />
                <span>Gemma-2</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="nodrag nopan flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] transition-colors hover:bg-[#303030] hover:text-white">
                <LiaLinkSolid size={18} />
              </button>

              <button
                onClick={onClose}
                className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-colors hover:bg-[#303030] hover:text-white"
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
  );
}
