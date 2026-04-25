'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ChatNode, {
  type ChatNodeData,
} from '@/client/dashboard/chat/components/ChatNode';

const nodeTypes = {
  chatNode: ChatNode,
};

const step1Nodes: Node<ChatNodeData>[] = [
  {
    id: '1',
    type: 'chatNode',
    position: { x: -400, y: 10 },
    data: {
      customId: '1',
      initialInput: 'Explain AI Neural Networks',
      messages: [
        {
          role: 'assistant',
          content:
            'Neural networks are computing systems inspired by biological brains. They consist of layers of interconnected nodes that process data by recognizing patterns and making decisions.',
        },
      ],
    },
  },
  {
    id: '2',
    type: 'chatNode',
    position: { x: 380, y: 10 },
    data: {
      customId: '2',
      initialInput: 'What is the Internet?',
      messages: [
        {
          role: 'assistant',
          content:
            'The Internet is a global network of computers connected via TCP/IP protocols. It enables communication, data sharing, and access to information across the world.',
        },
      ],
    },
  },
];

const step1Edges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    sourceHandle: 'right',
    target: '2',
    style: { stroke: '#ffffff', strokeWidth: 3 },
    animated: true,
  },
];

const step2Nodes: Node<ChatNodeData>[] = [
  {
    id: '1',
    type: 'chatNode',
    position: { x: -400, y: 0 },
    data: {
      customId: '1',
      initialInput: 'Explain how transformers work',
      messages: [
        {
          role: 'assistant',
          content:
            'Transformers use self-attention to process sequential data in parallel. Each token attends to every other token, capturing long-range dependencies efficiently. This architecture powers most modern LLMs.',
        },
      ],
    },
  },
  {
    id: '2',
    type: 'chatNode',
    position: { x: 380, y: 300 },
    data: {
      customId: '2',
      initialInput: 'Dive deeper into self-attention',
      messages: [
        {
          role: 'assistant',
          content:
            'Self-attention computes Query, Key, and Value matrices from input embeddings. The attention scores determine how much each token should influence others, enabling context-aware representations.',
        },
      ],
    },
  },
];

const step2Edges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    sourceHandle: 'right',
    style: { stroke: '#ffffff', strokeWidth: 3 },
    animated: true,
  },
];

const step3Nodes: Node<ChatNodeData>[] = [
  {
    id: '1',
    type: 'chatNode',
    position: { x: -400, y: 0 },
    data: {
      customId: '1',
      initialInput: 'What is machine learning?',
      messages: [
        {
          role: 'assistant',
          content:
            'Machine learning is a subset of AI that enables systems to learn patterns from data without explicit programming. Algorithms improve performance as they are exposed to more data over time.',
        },
      ],
    },
  },
  {
    id: '2',
    type: 'chatNode',
    position: { x: -400, y: 420 },
    data: {
      customId: '2',
      initialInput: 'What is deep learning?',
      messages: [
        {
          role: 'assistant',
          content:
            'Deep learning uses multi-layered neural networks to model complex patterns. It excels at tasks like image recognition, natural language processing, and speech synthesis.',
        },
      ],
    },
  },
  {
    id: '3',
    type: 'chatNode',
    position: { x: 380, y: 100 },
    data: {
      customId: '3',
      initialInput: 'How are they related?',
      messages: [
        {
          role: 'assistant',
          content:
            'Deep learning is a specialized subset of machine learning. While ML includes many techniques like decision trees and SVMs, deep learning specifically uses deep neural networks to solve complex problems.',
        },
      ],
    },
  },
];

const step3Edges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    sourceHandle: 'right',
    target: '2',
    style: { stroke: '#ffffff', strokeWidth: 3 },
    animated: true,
  },
  {
    id: 'e1-3',
    source: '1',
    sourceHandle: 'right',
    target: '3',
    style: { stroke: '#ffffff', strokeWidth: 3 },
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    sourceHandle: 'right',
    target: '3',
    style: { stroke: '#ffffff', strokeWidth: 3 },
    animated: true,
  },
];

const stepsData = [
  {
    title: 'Run parallel conversations',
    description:
      'Start a new node anywhere on your canvas and explore every angle of your thinking without disrupting what you were already building.',
    nodes: step1Nodes,
    edges: step1Edges,
  },
  {
    title: 'Branch mid-thought',
    description:
      'A new idea hits mid-conversation? Branch it instantly. Full context carries forward, both directions keep moving, nothing gets lost.',
    nodes: step2Nodes,
    edges: step2Edges,
  },
  {
    title: 'Connect the dots',
    description:
      'Zoom out and see how all your ideas connect. Every node, every branch, every thought laid out as a living map of your mind.',
    nodes: step3Nodes,
    edges: step3Edges,
  },
];

const FlowPreview = ({
  nodes: initNodes,
  edges: initEdges,
}: {
  nodes: Node<ChatNodeData>[];
  edges: Edge[];
}) => {
  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      panOnDrag
      zoomOnScroll={false}
      zoomOnPinch
      preventScrolling={false}
      nodesDraggable
      nodesConnectable={false}
      proOptions={{ hideAttribution: true }}
      className="rounded-xl"
    >
      <Background color="rgba(255,255,255,0.03)" gap={20} />
    </ReactFlow>
  );
};

const CanvasShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  const handleTryClick = () => {
    if (session) {
      router.push('/chat');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="bg-black text-white selection:bg-white/20">
      <section className="mx-auto flex max-w-[1440px] flex-col items-stretch px-6 lg:flex-row">
        {/* LEFT SIDE */}
        <div className="flex w-full flex-col justify-center pr-3 pl-4 lg:sticky lg:w-2/5">
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="mb-1 h-5 w-5 bg-white" />
              <h1 className="text-2xl tracking-tight">Relic AI Canvas</h1>
            </div>
            <p className="text-sm text-white/50 md:text-base">
              Visually map your AI conversations across multiple branching
              threads all in one fluid workspace.
            </p>
          </div>

          <div className="space-y-0">
            {stepsData.map((step, index) => (
              <div
                key={step.title}
                className="group cursor-pointer border-t border-white/10 py-5 transition-all hover:bg-white/[0.02]"
                onMouseEnter={() => setActiveIndex(index)}
              >
                <h3
                  className={`text-2xl font-normal tracking-tight transition-colors ${
                    activeIndex === index
                      ? 'text-white'
                      : 'text-white/30 group-hover:text-gray-300'
                  }`}
                >
                  {step.title}
                </h3>

                <div
                  className={`grid transition-all duration-300 ${
                    activeIndex === index
                      ? 'mt-3 grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-sm text-sm leading-relaxed text-white/40">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-white/10" />
          </div>

          <button
            onClick={handleTryClick}
            className="mt-8 w-fit border border-white/10 px-6 py-2.5 text-sm font-medium transition-all hover:bg-white/10"
          >
            Try Relic AI
          </button>
        </div>

        {/* RIGHT SIDE ReactFlow */}
        <div className="relative flex w-full items-center justify-center overflow-hidden bg-[#0A0A0A] lg:h-[75vh] lg:w-3/5">
          <div className="absolute inset-0">
            <Image
              width={1000}
              height={1000}
              src="/images/relicaicanvas.jpg"
              alt="background"
              className="h-full w-full object-cover opacity-40"
            />
          </div>

          <div className="relative z-10 h-full w-full">
            <FlowPreview
              key={activeIndex}
              nodes={stepsData[activeIndex].nodes}
              edges={stepsData[activeIndex].edges}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CanvasShowcase;
