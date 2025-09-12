'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdArrowUp } from 'react-icons/io';

export type ChatNodeData = {
  customId: string;
  onInteract?: () => void;
};

export const CHAT_NODE_WIDTH = 520;
export const CHAT_NODE_HANDLE_TOP = 20;

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
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setResponse(`Echo: ${input}`);
    setInput('');
  };

  return (
    <div className="group w-[750px] rounded-[9px] border border-[#303030] bg-[#181818] shadow-xl transition-all">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] p-3 py-5" />
      {response && (
        <div className="bg-red-600 px-4">
          <div className="rounded-l text-[20px] text-gray-200">{response}</div>
        </div>
      )}

      {/* Input */}
      <div className="p-4">
        <textarea
          value={input}
          onChange={(e) => {
            const nextValue = e.target.value;

            if (!input.length && nextValue.length) {
              data.onInteract?.();
            }

            setInput(nextValue);
          }}
          placeholder="Ask a question..."
          className="min-h-[10px] w-full resize-none bg-transparent text-sm text-[20px] text-gray-200 placeholder-white/30 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className="mt-4 flex items-center justify-between text-white/70">
          <div className="flex cursor-pointer items-center gap-1 rounded-[3px] border border-[#303030] px-3 py-0.5 text-[17px] hover:text-white">
            <span>Minimax kimi k2.5</span>
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

      {/* Response */}

      {/* 🔥 Handles (hidden → visible on hover) */}
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
