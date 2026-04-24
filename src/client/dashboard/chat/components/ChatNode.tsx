'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  FiChevronDown,
  FiPlus,
  FiMic,
  FiTrash2,
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiRefreshCw,
  FiCheck,
  FiSquare,
} from 'react-icons/fi';
import { IoMdArrowUp } from 'react-icons/io';
import { BsArrowsFullscreen, BsFileMusic } from 'react-icons/bs';
import type { ChatMessage } from './FullscreenChat';
import MessageContent from './MessageContent';
import { FcGoogle } from 'react-icons/fc';
import { LiaLinkSolid } from 'react-icons/lia';
import { IoMicSharp } from 'react-icons/io5';

export type ChatNodeData = {
  customId: string;
  initialInput?: string;
  selectionAnchors?: Array<{
    id: string;
    x: number;
    y: number;
  }>;
  messages?: ChatMessage[];
  isStreaming?: boolean;
  onInteract?: () => void;
  onResponseHeightChange?: (nodeId: string, delta: number) => void;
  onSend?: (nodeId: string, message: string) => void;
  onStop?: (nodeId: string) => void;
  onExpand?: (nodeId: string) => void;
  onFocusNode?: (nodeId: string) => void;
  onRequestDelete?: (nodeId: string) => void;
  canDelete?: boolean;
  onTextSelection?: (
    nodeId: string,
    selectedText: string,
    selectionRect: DOMRect
  ) => void;
};

export const CHAT_NODE_WIDTH = 750;
export const CHAT_NODE_HANDLE_TOP = 25;
const CHAT_INPUT_LINE_HEIGHT = 32;
const CHAT_INPUT_MAX_LINES = 7;
const CHAT_INPUT_MAX_HEIGHT = CHAT_INPUT_LINE_HEIGHT * CHAT_INPUT_MAX_LINES;
const CHAT_TEXT_INTERACTION_CLASS = 'nodrag nopan cursor-text select-text';

export const CHAT_NODE_HANDLE_IDS = {
  left: 'left',
  right: 'right',
} as const;

const baseHandleStyle = {
  width: 17,
  height: 17,
  // background: '#2b2b33',
  borderRadius: '50%',
  border: '4px solid #d6d6d6',
  zIndex: 10,
} as const;

export default function ChatNode({ data }: NodeProps<Node<ChatNodeData>>) {
  const {
    customId,
    initialInput,
    messages = [],
    selectionAnchors = [],
    isStreaming = false,
    onInteract,
    onResponseHeightChange,
    onSend,
    onStop,
    onExpand,
    onFocusNode,
    onRequestDelete,
    onTextSelection,
  } = data;
  const [input, setInput] = useState(() => initialInput ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseSectionRef = useRef<HTMLDivElement>(null);
  const previousResponseHeightRef = useRef(0);

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
    if (prevMsg && onSend) {
      onSend(customId, prevMsg.content);
    }
  };

  const resizeTextarea = useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = '0px';

    const nextHeight = Math.min(textarea.scrollHeight, CHAT_INPUT_MAX_HEIGHT);

    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY =
      textarea.scrollHeight > CHAT_INPUT_MAX_HEIGHT ? 'auto' : 'hidden';
  }, []);

  useEffect(() => {
    if (!textareaRef.current) return;

    resizeTextarea(textareaRef.current);
  }, [input, resizeTextarea]);

  useLayoutEffect(() => {
    const nextHeight =
      responseSectionRef.current?.getBoundingClientRect().height ?? 0;
    const delta = nextHeight - previousResponseHeightRef.current;

    if (delta) {
      previousResponseHeightRef.current = nextHeight;
      onResponseHeightChange?.(customId, delta);
    }
  }, [customId, onResponseHeightChange, messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (onSend) {
      onSend(customId, input.trim());
    }
    setInput('');
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (!selection || !selectedText || selection.rangeCount === 0) return;

    onTextSelection?.(
      customId,
      selectedText,
      selection.getRangeAt(0).getBoundingClientRect()
    );
  };

  return (
    <div className="group relative w-[750px] rounded-[8px] border border-[#303030] bg-[#121212] shadow-xl transition-all">
      <Handle
        type="target"
        position={Position.Top}
        className="opacity-0"
        style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
      />
      <div className="flex items-center justify-between border-b border-[#1f1f1f] p-3 py-4" />

      {messages.length > 0 && (
        <div ref={responseSectionRef} className="space-y-3 px-4 py-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              onMouseUp={handleTextSelection}
              onTouchEnd={handleTextSelection}
              className={`${CHAT_TEXT_INTERACTION_CLASS} rounded-[5px] px-4 py-3 text-[18px] leading-7 wrap-anywhere text-gray-200 ${
                msg.role === 'user' ? 'ml-8 bg-[#202020]' : 'mr-8'
              }`}
            >
              {msg.role === 'assistant' && (
                <span className="mb-1 block text-[19px] font-medium text-white/30"></span>
              )}
              {msg.status === 'pending' && !msg.content ? (
                <span className="inline-flex items-center gap-1.5 py-2">
                  <span
                    className="h-2 w-2 animate-pulse rounded-full bg-white/40"
                    style={{ animationDelay: '0ms', animationDuration: '1.2s' }}
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
                <>
                  <MessageContent
                    content={msg.content}
                    isUser={msg.role === 'user'}
                  />
                  {msg.status === 'pending' && (
                    <span className="stream-cursor" aria-hidden="true" />
                  )}

                  {msg.role === 'assistant' &&
                    msg.status !== 'pending' &&
                    msg.content && (
                      <div className="mt-2 flex items-center text-white/40">
                        <button
                          onClick={() => handleCopy(msg.content, i)}
                          className="flex h-7 w-7 items-center justify-center rounded-[5px] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-75"
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
                          className={`flex h-7 w-7 items-center justify-center rounded-[5px] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-75 ${feedback[i] === 'like' ? 'scale-110 bg-white/10 text-white' : ''}`}
                          title="Like"
                        >
                          <FiThumbsUp size={14} />
                        </button>
                        <button
                          onClick={() => handleFeedback(i, 'dislike')}
                          className={`flex h-7 w-7 items-center justify-center rounded-[5px] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-75 ${feedback[i] === 'dislike' ? 'scale-110 bg-white/10 text-white' : ''}`}
                          title="Dislike"
                        >
                          <FiThumbsDown size={14} />
                        </button>
                        <button
                          onClick={() => handleRetry(i)}
                          className="flex h-7 w-7 items-center justify-center rounded-[5px] transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-75"
                          title="Retry"
                        >
                          <FiRefreshCw size={14} />
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <div className="border-t border-[#1f1f1f] bg-[#121212] px-4 pt-10 pb-5 shadow-lg">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => {
              const nextValue = e.target.value;

              if (!input.length && nextValue.length) {
                onInteract?.();
              }

              setInput(nextValue);
              resizeTextarea(e.currentTarget);
            }}
            placeholder="Ask a follow-up"
            className={`${CHAT_TEXT_INTERACTION_CLASS} w-full resize-none overflow-y-hidden bg-transparent py-1 text-[16px] leading-6 text-gray-200 placeholder-white/40 outline-none`}
            onFocus={() => onFocusNode?.(customId)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <div className="mt-3 flex cursor-pointer items-center justify-between text-white/70">
            <div className="relative flex items-center gap-1" ref={dropdownRef}>
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className={`flex items-center justify-center gap-2 rounded-[5px] border border-[#303030] px-2 py-0.75 transition-colors hover:bg-[#303030]`}
              >
                <FcGoogle size={14} />
                <span>Gemma 2 </span>
                <FiChevronDown size={14} className="opacity-50" />
              </button>

              <div className="nodrag nopan relative">
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
                      coming soon
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
                      coming soon
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
                      coming soon
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
                      coming soon
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="nodrag nopan relative">
                <button className="peer flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] transition-colors hover:bg-[#303030] hover:text-white">
                  <LiaLinkSolid size={18} />
                </button>
                <div className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-[200] -translate-x-1/2 rounded-[5px] border border-white/10 bg-[#1a1a1a] px-2.5 py-1.5 text-[11px] whitespace-nowrap text-white/70 opacity-0 shadow-xl transition-opacity duration-150 peer-hover:opacity-100">
                  This feature is under Development phase
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
                </div>
              </div>

              <button
                onClick={() => onExpand?.(customId)}
                className="nodrag nopan flex h-8 w-8 cursor-pointer items-center justify-center gap-1.5 rounded-[5px] border border-[#303030] text-[13px] transition-colors hover:bg-[#303030] hover:text-white"
                title="Open fullscreen chat"
              >
                <BsArrowsFullscreen size={14} />
              </button>

              {data.canDelete !== false && (
                <button
                  onClick={() => onRequestDelete?.(customId)}
                  className="nodrag nopan flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] border border-[#303030] text-white/60 transition-colors hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-200"
                  title="Delete node"
                >
                  <FiTrash2 size={15} />
                </button>
              )}

              {isStreaming ? (
                <button
                  onClick={() => onStop?.(customId)}
                  className="nodrag nopan ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[5px] bg-white/20 text-red-500 transition-all hover:bg-white/80 active:scale-90"
                  title="Stop generating"
                >
                  <FiSquare size={18} className="fill-current" />
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

        <Handle
          type="source"
          id={CHAT_NODE_HANDLE_IDS.right}
          position={Position.Right}
          className="scale-75 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
          style={{
            ...baseHandleStyle,
            right: 25,
            top: 20,
          }}
        />

        <Handle
          type="source"
          id={CHAT_NODE_HANDLE_IDS.left}
          position={Position.Left}
          className="scale-75 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100"
          style={{
            ...baseHandleStyle,
            left: 25,
            top: 20,
          }}
        />
      </div>

      {selectionAnchors.map((anchor) => (
        <Handle
          key={anchor.id}
          type="source"
          id={anchor.id}
          position={Position.Right}
          className="pointer-events-none opacity-0"
          style={{
            width: 1,
            height: 1,
            border: 0,
            background: 'transparent',
            left: anchor.x,
            top: anchor.y,
          }}
        />
      ))}
    </div>
  );
}
