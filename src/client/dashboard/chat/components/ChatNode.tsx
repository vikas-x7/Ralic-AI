'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { IoMdArrowUp } from 'react-icons/io';

export type ChatNodeData = { customId: string };
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

export default function ChatNode({}: NodeProps<Node<ChatNodeData>>) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setResponse(`Echo: ${input}`);
    setInput('');
  };

  return (
    <div className="w-[520px] rounded-[5px] border border-[#2a2a2a] bg-[#0b0b0b] shadow-xl">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] px-8 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <span>untitled</span>
        </div>
      </div>

      {/* Input */}
      <div className="p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="min-h-[10px] w-full resize-none bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        {/* Bottom bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex cursor-pointer items-center gap-1 hover:text-white">
            <span>gpt-4o</span>
            <FiChevronDown />
          </div>

          <button
            onClick={handleSend}
            className="flex items-center gap-1 rounded-full bg-white/40 p-1.5 text-black hover:text-white"
          >
            <IoMdArrowUp />
          </button>
        </div>
      </div>

      {/* Response */}
      {response && (
        <div className="px-4 pb-4">
          <div className="rounded-lg bg-[#1a1a1a] p-3 text-sm text-gray-200">
            {response}
          </div>
        </div>
      )}

      <Handle
        type="source"
        id={CHAT_NODE_HANDLE_IDS.right}
        position={Position.Right}
        style={{
          ...baseHandleStyle,
          right: 15,
        }}
      />
      <Handle
        type="source"
        id={CHAT_NODE_HANDLE_IDS.left}
        position={Position.Left}
        style={{
          ...baseHandleStyle,
          left: 0,
        }}
      />
    </div>
  );
}
