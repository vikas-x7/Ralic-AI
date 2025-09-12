'use client';

import Image from 'next/image';
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  useEdgesState,
  ConnectionMode,
  ReactFlowProvider,
  useReactFlow,
  Position,
  type Node,
  type Edge,
  type NodeChange,
  type FinalConnectionState,
  applyNodeChanges,
} from '@xyflow/react';

import ChatNode, {
  CHAT_NODE_HANDLE_IDS,
  CHAT_NODE_HANDLE_TOP,
  CHAT_NODE_WIDTH,
  type ChatNodeData,
} from './ChatNode';

const nodeTypes = {
  chatNode: ChatNode,
};

const initialNodes: Node<ChatNodeData>[] = [
  {
    id: 'root',
    type: 'chatNode',
    position: { x: 600, y: 700 },
    data: { customId: 'root' },
  },
];

function ChatCanvasInner() {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleUserInteraction = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const syncNodeInteractionHandler = useCallback(
    (nextNodes: Node<ChatNodeData>[]) =>
      nextNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onInteract: handleUserInteraction,
        },
      })),
    [handleUserInteraction]
  );

  const [nodes, setNodes] = useState<Node<ChatNodeData>[]>(() =>
    syncNodeInteractionHandler(initialNodes)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<ChatNodeData>>[]) => {
      setNodes((nds) =>
        syncNodeInteractionHandler(
          applyNodeChanges(changes, nds) as Node<ChatNodeData>[]
        )
      );
    },
    [syncNodeInteractionHandler]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      if (
        connectionState.isValid ||
        !connectionState.fromNode ||
        connectionState.toNode ||
        connectionState.toHandle
      ) {
        return;
      }

      const id = crypto.randomUUID();

      const clientX =
        'clientX' in event ? event.clientX : event.changedTouches?.[0]?.clientX;
      const clientY =
        'clientY' in event ? event.clientY : event.changedTouches?.[0]?.clientY;

      if (clientX === undefined || clientY === undefined) return;

      const dropPosition = screenToFlowPosition({ x: clientX, y: clientY });

      const sourceNodeId = connectionState.fromNode.id;
      const sourceHandleId = connectionState.fromHandle?.id || null;

      const targetHandle =
        connectionState.fromPosition === Position.Left
          ? CHAT_NODE_HANDLE_IDS.right
          : CHAT_NODE_HANDLE_IDS.left;

      const newNode: Node<ChatNodeData> = {
        id,
        type: 'chatNode',
        position: {
          x:
            targetHandle === CHAT_NODE_HANDLE_IDS.right
              ? dropPosition.x - CHAT_NODE_WIDTH
              : dropPosition.x,
          y: dropPosition.y - CHAT_NODE_HANDLE_TOP,
        },
        data: { customId: id, onInteract: handleUserInteraction },
      };

      setHasInteracted(true);
      setNodes((nds) => nds.concat(newNode));

      setEdges((eds) =>
        eds.concat({
          id: `e-${sourceNodeId}-${id}`,
          source: sourceNodeId,
          sourceHandle: sourceHandleId,
          target: id,
          targetHandle,
          type: 'floating',
        })
      );
    },
    [handleUserInteraction, screenToFlowPosition, setNodes, setEdges]
  );

  return (
    <div className="h-screen w-full bg-[#141414]">
      <div
        aria-hidden={hasInteracted}
        className={`pointer-events-none absolute top-90 right-198 z-20 flex items-center text-white/70 transition-all duration-500 ease-out ${
          hasInteracted
            ? '-translate-y-4 scale-95 opacity-0'
            : 'translate-y-0 scale-100 opacity-100'
        }`}
      >
        <Image
          src="/images/logo.png"
          alt=""
          width={80}
          height={80}
          className="w-17 opacity-80"
        />
        <h1 className="-ml-[16px] text-[32px] font-semibold -tracking-[2px]">
          Kausy ai
        </h1>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectEnd={onConnectEnd}
        isValidConnection={() => false}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        connectOnClick={false}
        defaultEdgeOptions={{ type: 'floating', animated: true }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        fitViewOptions={{ maxZoom: 6 }}
      >
        {/* <Background
          variant={BackgroundVariant.Dots}
          gap={14}
          size={1.5}
          color="#2a2a2a"
        /> */}
      </ReactFlow>
    </div>
  );
}

export default function ChatCanvas() {
  return (
    <ReactFlowProvider>
      <ChatCanvasInner />
    </ReactFlowProvider>
  );
}
