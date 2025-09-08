'use client';

import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { useState } from 'react';

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
    <div className="min-w-[300px] rounded-lg bg-[#171717]">


      <div className="p-4">
        <div className="mb-3 flex items-center justify-between  pb-2">
          <span className="text-sm font-medium text-gray-200">Chat Node</span>
          <span className="text-xs text-gray-500">{id.slice(0, 8)}</span>
        </div>

        <div className="space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[80px] w-full resize-none rounded-md border border-gray-600 bg-gray-700 p-2 text-sm text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <button
            onClick={handleSend}
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Send
          </button>

          {response && (
            <div className="rounded-md bg-gray-700 p-3">
              <p className="mb-1 text-xs font-medium text-gray-400">
                AI Response:
              </p>
              <p className="text-sm text-gray-200">{response}</p>
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
       
        position={Position.Top}
        className="!h-3 !w-3 !bg-blue-500"
      />
    </div>
  );
}
