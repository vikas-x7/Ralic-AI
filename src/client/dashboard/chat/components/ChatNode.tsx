'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdArrowUp } from 'react-icons/io';

export type ChatNodeData = {
  customId: string;
  onInteract?: () => void;
  onResponseHeightChange?: (nodeId: string, delta: number) => void;
};

export const CHAT_NODE_WIDTH = 750;
export const CHAT_NODE_HANDLE_TOP = 20;
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
  background: '#2b2b33',
  borderRadius: '50%',
  border: '4px solid #f1a0faa7',
  top: CHAT_NODE_HANDLE_TOP,
  zIndex: 10,
} as const;

export default function ChatNode({ data }: NodeProps<Node<ChatNodeData>>) {
  const { customId, onInteract, onResponseHeightChange } = data;
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
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
  }, [customId, onResponseHeightChange, response]);

  const handleSend = () => {
    if (!input.trim()) return;
    setResponse(`Echo: ${input}`);
    setInput('');
  };

  return (
    <div className="group w-[750px] rounded-[12px] border border-[#303030] bg-[#181818] shadow-xl transition-all">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] p-3 py-5" />
      {response && (
        <div
          ref={responseSectionRef}
          className="border-b border-[#1f1f1f] px-4 py-4"
        >
          <div
            className={`${CHAT_TEXT_INTERACTION_CLASS} rounded-[10px] bg-[#202020] px-4 py-3 text-[20px] leading-8 [overflow-wrap:anywhere] break-words whitespace-pre-wrap text-gray-200`}
          >
            {response}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4">
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
          placeholder="Ask a question..."
          className={`${CHAT_TEXT_INTERACTION_CLASS} w-full resize-none overflow-y-hidden bg-transparent p-0 text-sm text-[20px] leading-8 text-gray-200 placeholder-white/30 outline-none`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className="mt-4 flex items-center justify-between text-white/70">
          <div className="flex cursor-pointer items-center gap-1 rounded-[3px] border border-[#303030] px-3 py-0.5 text-[17px] hover:text-white">
            <span
              className={`${CHAT_TEXT_INTERACTION_CLASS} flex items-center gap-2`}
            >
              <img
                src="https://thesvg.org/icons/gemini/default.svg"
                alt=""
                className="w-5"
              />{' '}
              Gemini flash 2.5
            </span>
            <FiChevronDown />
          </div>

          <button
            onClick={handleSend}
            className="flex cursor-pointer items-center gap-1 rounded-[3px] border border-[#303030] p-2 text-white/60 hover:text-white"
          >
            <IoMdArrowUp size={20} />
          </button>
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
        }}
      />
    </div>
  );
}
