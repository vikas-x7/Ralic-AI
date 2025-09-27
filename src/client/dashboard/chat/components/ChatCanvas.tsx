'use client';

import Image from 'next/image';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
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
  Background,
  BackgroundVariant,
} from '@xyflow/react';

import ChatNode, {
  CHAT_NODE_HANDLE_IDS,
  CHAT_NODE_HANDLE_TOP,
  CHAT_NODE_WIDTH,
  type ChatNodeData,
} from './ChatNode';
import FullscreenChat, { type ChatMessage } from './FullscreenChat';

const nodeTypes = {
  chatNode: ChatNode,
};

const initialNodes: Node<ChatNodeData>[] = [
  {
    id: 'root',
    type: 'chatNode',
    position: { x: 510, y: 550 },
    data: { customId: 'root' },
  },
];

function ChatCanvasInner() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [nodeMessages, setNodeMessages] = useState<
    Record<string, ChatMessage[]>
  >({});

  const setNodesRef = useRef<Dispatch<
    SetStateAction<Node<ChatNodeData>[]>
  > | null>(null);
  const { screenToFlowPosition, getZoom, setCenter } = useReactFlow();

  const handleUserInteraction = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const handleResponseHeightChange = useCallback(
    (nodeId: string, delta: number) => {
      if (!delta) return;

      setNodesRef.current?.((currentNodes) =>
        currentNodes.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                position: {
                  ...node.position,
                  y: node.position.y - delta,
                },
              }
            : node
        )
      );
    },
    []
  );

  const handleSend = useCallback((nodeId: string, message: string) => {
    setNodeMessages((prev) => {
      const current = prev[nodeId] || [];
      return {
        ...prev,
        [nodeId]: [
          ...current,
          { role: 'user' as const, content: message },
          { role: 'assistant' as const, content: `Echo: ${message}` },
        ],
      };
    });
  }, []);

  const handleExpand = useCallback((nodeId: string) => {
    setExpandedNodeId(nodeId);
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setExpandedNodeId(null);
  }, []);

  const syncNodeInteractionHandler = useCallback(
    (nextNodes: Node<ChatNodeData>[], msgs: Record<string, ChatMessage[]>) =>
      nextNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          messages: msgs[node.data.customId] || [],
          onInteract: handleUserInteraction,
          onResponseHeightChange: handleResponseHeightChange,
          onSend: handleSend,
          onExpand: handleExpand,
        },
      })),
    [
      handleUserInteraction,
      handleResponseHeightChange,
      handleSend,
      handleExpand,
    ]
  );

  const [nodes, setNodes] = useState<Node<ChatNodeData>[]>(() =>
    syncNodeInteractionHandler(initialNodes, {})
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodesRef.current = setNodes;
  }, [setNodes]);

  useEffect(() => {
    setNodes((nds) => syncNodeInteractionHandler(nds, nodeMessages));
  }, [nodeMessages, syncNodeInteractionHandler]);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<ChatNodeData>>[]) => {
      setNodes((nds) =>
        syncNodeInteractionHandler(
          applyNodeChanges(changes, nds) as Node<ChatNodeData>[],
          nodeMessages
        )
      );
    },
    [syncNodeInteractionHandler, nodeMessages]
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
        data: {
          customId: id,
          messages: [],
          onInteract: handleUserInteraction,
          onResponseHeightChange: handleResponseHeightChange,
          onSend: handleSend,
          onExpand: handleExpand,
        },
      };
      const sourceNodePosition =
        connectionState.fromNode.internals.positionAbsolute;
      const sourceNodeWidth =
        connectionState.fromNode.measured.width ?? CHAT_NODE_WIDTH;
      const sourceNodeHeight = connectionState.fromNode.measured.height ?? 180;
      const sourceNodeCenterX = sourceNodePosition.x + sourceNodeWidth / 2;
      const sourceNodeCenterY = sourceNodePosition.y + sourceNodeHeight / 2;
      const newNodeCenterX = newNode.position.x + CHAT_NODE_WIDTH / 2;
      const newNodeCenterY = newNode.position.y + sourceNodeHeight / 2;

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

      void setCenter(
        (sourceNodeCenterX + newNodeCenterX) / 2,
        (sourceNodeCenterY + newNodeCenterY) / 2,
        {
          duration: 350,
          ease: (t) => 1 - Math.pow(1 - t, 3),
          zoom: getZoom(),
        }
      );
    },
    [
      getZoom,
      handleUserInteraction,
      handleResponseHeightChange,
      handleSend,
      handleExpand,
      screenToFlowPosition,
      setCenter,
      setNodes,
      setEdges,
    ]
  );

  return (
    <div className="relative h-screen w-full bg-black">
      <div
        aria-hidden={hasInteracted}
        className={`pointer-events-none absolute top-75 right-138 z-20 flex w-100 items-center text-white/70 transition-all duration-500 ease-out ${
          hasInteracted
            ? '-translate-y-4 scale-95 opacity-0'
            : 'translate-y-0 scale-100 opacity-100'
        }`}
      >
        <div className="flex-col text-start">
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt=""
              width={80}
              height={80}
              className="w-20 opacity-80"
            />
            <div>
              <h1 className="-ml-[16px] text-[42px] font-semibold -tracking-[2px]">
                Ralic ai
              </h1>
            </div>
          </div>
          <p className="-mt-4 px-5">Welcome back Vikas pal to ralic ai</p>
        </div>
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
        autoPanOnConnect
        autoPanSpeed={20}
        defaultEdgeOptions={{ type: 'floating', animated: true }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        minZoom={0.01}
        maxZoom={100}
        fitViewOptions={{ maxZoom: 1 }}
      ></ReactFlow>

      {expandedNodeId && (
        <FullscreenChat
          nodeId={expandedNodeId}
          messages={nodeMessages[expandedNodeId] || []}
          onSend={handleSend}
          onClose={handleCloseFullscreen}
        />
      )}
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
