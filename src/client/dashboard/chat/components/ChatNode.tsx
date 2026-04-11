'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FiChevronDown, FiPlus, FiMic } from 'react-icons/fi';
import { IoMdArrowUp } from 'react-icons/io';
import { BsArrowsFullscreen, BsFileMusic } from 'react-icons/bs';
import type { ChatMessage } from './FullscreenChat';
import MessageContent from './MessageContent';
import { FcGoogle } from 'react-icons/fc';
import { LiaLinkSolid } from 'react-icons/lia';

export type ChatNodeData = {
  customId: string;
  initialInput?: string;
  selectionAnchors?: Array<{
    id: string;
    x: number;
    y: number;
  }>;
  messages?: ChatMessage[];
  onInteract?: () => void;
  onResponseHeightChange?: (nodeId: string, delta: number) => void;
  onSend?: (nodeId: string, message: string) => void;
  onExpand?: (nodeId: string) => void;
  onFocusNode?: (nodeId: string) => void;
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
    onInteract,
    onResponseHeightChange,
    onSend,
    onExpand,
    onFocusNode,
    onTextSelection,
  } = data;
  const [input, setInput] = useState(() => initialInput ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const responseSectionRef = useRef<HTMLDivElement>(null);
  const previousResponseHeightRef = useRef(0);

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
                <span className="inline-flex items-center text-white/45">
                  Thinking
                  <span className="stream-thinking-dots" />
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
                onClick={() => onExpand?.(customId)}
                className="nodrag nopan flex h-8 w-8 cursor-pointer items-center justify-center gap-1.5 rounded-[5px] border border-[#303030] text-[13px] transition-colors hover:bg-[#303030] hover:text-white"
                title="Open fullscreen chat"
              >
                <BsArrowsFullscreen size={14} />
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
