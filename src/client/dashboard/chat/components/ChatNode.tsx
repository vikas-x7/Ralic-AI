'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { useState } from 'react';
import { FiDownload, FiCopy, FiTrash2, FiChevronDown } from 'react-icons/fi';

export type ChatNodeData = { customId: string };

export default function ChatNode({ id }: NodeProps<Node<ChatNodeData>>) {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    setResponse(`Echo: ${input}`);
    setInput('');
  };

  return (
    <div className="w-[420px] rounded-[5px] border border-[#2a2a2a] bg-[#0b0b0b] shadow-xl">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-[#1f1f1f] px-4 py-2">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <div className="flex h-5 w-5 items-center justify-center rounded border border-gray-500 text-xs">
            B
          </div>
          <span>untitled</span>
        </div>

        <div className="flex items-center gap-3 text-gray-400">
          <FiDownload className="cursor-pointer hover:text-white" />
          <FiCopy className="cursor-pointer hover:text-white" />
          <FiTrash2 className="cursor-pointer hover:text-red-500" />
        </div>
      </div>

      {/* Input */}
      <div className="p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="min-h-[140px] w-full resize-none bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
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
            className="flex items-center gap-1 text-gray-300 hover:text-white"
          >
            Ask ⌘↵
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
        position={Position.Top}
        className="!absolute !top-0 !right-0 !h-3 !w-3 !bg-blue-500"
      />
    </div>
  );
}
