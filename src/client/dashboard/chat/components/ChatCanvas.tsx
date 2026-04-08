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
  MiniMap,
} from '@xyflow/react';
import { FiColumns, FiMinus, FiPlus } from 'react-icons/fi';
import { trpc } from '@/client/trpc/react';

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

type TextSelectionAction = {
  sourceNodeId: string;
  text: string;
  x: number;
  y: number;
};

type PersistedCanvas = {
  nodes: Array<{
    id: string;
    type?: string;
    position: { x: number; y: number };
    data?: {
      customId: string;
      initialInput?: string;
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    sourceHandle?: string | null;
    target: string;
    targetHandle?: string | null;
    type?: string;
    animated?: boolean;
  }>;
};

function serializeCanvas(
  nodes: Node<ChatNodeData>[],
  edges: Edge[]
): PersistedCanvas {
  return {
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        customId: node.data.customId,
        initialInput: node.data.initialInput,
      },
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      sourceHandle: edge.sourceHandle,
      target: edge.target,
      targetHandle: edge.targetHandle,
      type: edge.type,
      animated: edge.animated,
    })),
  };
}

function isPersistedCanvas(value: unknown): value is PersistedCanvas {
  if (!value || typeof value !== 'object') return false;

  const canvas = value as PersistedCanvas;

  return Array.isArray(canvas.nodes) && Array.isArray(canvas.edges);
}

function ChatCanvasInner({ chatId }: { chatId: string }) {
  const utils = trpc.useUtils();
  const chatQuery = trpc.chat.getChat.useQuery({ chatId });
  const saveCanvasMutation = trpc.chat.saveCanvas.useMutation();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);
  const [textSelectionAction, setTextSelectionAction] =
    useState<TextSelectionAction | null>(null);
  const [nodeMessages, setNodeMessages] = useState<
    Record<string, ChatMessage[]>
  >({});
  const loadedChatIdRef = useRef<string | null>(null);
  const lastSavedCanvasRef = useRef<string | null>(null);

  const setNodesRef = useRef<Dispatch<
    SetStateAction<Node<ChatNodeData>[]>
  > | null>(null);
  const {
    screenToFlowPosition,
    getZoom,
    getNode,
    setCenter,
    fitView,
    zoomIn,
    zoomOut,
  } = useReactFlow();

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

  const handleSend = useCallback(
    (nodeId: string, message: string) => {
      const userMessage: ChatMessage = { role: 'user', content: message };
      const pendingMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '',
        status: 'pending',
      };
      const conversation = [
        ...(nodeMessages[nodeId] || []).filter((msg) => !msg.status),
        userMessage,
      ].map(({ role, content }) => ({ role, content }));

      setNodeMessages((prev) => {
        const current = prev[nodeId] || [];

        return {
          ...prev,
          [nodeId]: [...current, userMessage, pendingMessage],
        };
      });

      void (async () => {
        try {
          const response = await fetch('/api/chat/stream', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatId, nodeId, messages: conversation }),
          });

          if (!response.ok) {
            const errorBody = (await response.json().catch(() => null)) as {
              error?: string;
            } | null;

            throw new Error(errorBody?.error || 'AI response failed.');
          }

          if (!response.body) {
            throw new Error('AI response stream was empty.');
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let streamedContent = '';

          while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            streamedContent += chunk;

            setNodeMessages((prev) => ({
              ...prev,
              [nodeId]: (prev[nodeId] || []).map((msg) =>
                msg.id === pendingMessage.id
                  ? {
                      ...msg,
                      content: streamedContent,
                    }
                  : msg
              ),
            }));
          }

          const trailingChunk = decoder.decode();

          if (trailingChunk) {
            streamedContent += trailingChunk;
          }

          const finalContent =
            streamedContent.trim() || 'No response returned from the model.';

          setNodeMessages((prev) => ({
            ...prev,
            [nodeId]: (prev[nodeId] || []).map((msg) =>
              msg.id === pendingMessage.id
                ? {
                    id: pendingMessage.id,
                    role: 'assistant',
                    content: finalContent,
                  }
                : msg
            ),
          }));

          void utils.chat.getChats.invalidate();
          void utils.chat.getChat.invalidate({ chatId });
        } catch (error) {
          setNodeMessages((prev) => ({
            ...prev,
            [nodeId]: (prev[nodeId] || []).map((msg) =>
              msg.id === pendingMessage.id
                ? {
                    ...msg,
                    content:
                      error instanceof Error
                        ? error.message
                        : 'AI response failed.',
                    status: 'error',
                  }
                : msg
            ),
          }));
        }
      })();
    },
    [chatId, nodeMessages, utils.chat.getChat, utils.chat.getChats]
  );

  const handleExpand = useCallback((nodeId: string) => {
    setExpandedNodeId(nodeId);
  }, []);

  const handleCloseFullscreen = useCallback(() => {
    setExpandedNodeId(null);
  }, []);

  const handleTextSelection = useCallback(
    (nodeId: string, selectedText: string, selectionRect: DOMRect) => {
      const text = selectedText.trim();

      if (!text) {
        setTextSelectionAction(null);
        return;
      }

      setTextSelectionAction({
        sourceNodeId: nodeId,
        text,
        x: selectionRect.left + selectionRect.width / 2,
        y: Math.max(16, selectionRect.top - 46),
      });
    },
    []
  );

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
          onTextSelection: handleTextSelection,
        },
      })),
    [
      handleUserInteraction,
      handleResponseHeightChange,
      handleSend,
      handleExpand,
      handleTextSelection,
    ]
  );

  const [nodes, setNodes] = useState<Node<ChatNodeData>[]>(() =>
    syncNodeInteractionHandler(initialNodes, {})
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (!chatQuery.data || loadedChatIdRef.current === chatId) return;

    const messagesByNode = chatQuery.data.messages.reduce<
      Record<string, ChatMessage[]>
    >((acc, message) => {
      if (message.role !== 'user' && message.role !== 'assistant') return acc;

      acc[message.nodeId] = [
        ...(acc[message.nodeId] || []),
        {
          id: message.id,
          role: message.role,
          content: message.content,
        },
      ];

      return acc;
    }, {});
    const savedCanvas = isPersistedCanvas(chatQuery.data.canvas)
      ? chatQuery.data.canvas
      : null;
    const nextNodes = savedCanvas?.nodes.length
      ? savedCanvas.nodes.map(
          (node): Node<ChatNodeData> => ({
            id: node.id,
            type: node.type || 'chatNode',
            position: node.position,
            data: {
              customId: node.data?.customId || node.id,
              initialInput: node.data?.initialInput,
            },
          })
        )
      : initialNodes;
    const nextEdges = savedCanvas?.edges.length ? savedCanvas.edges : [];

    setNodeMessages(messagesByNode);
    setHasInteracted(Object.keys(messagesByNode).length > 0);
    setNodes(syncNodeInteractionHandler(nextNodes, messagesByNode));
    setEdges(nextEdges);

    loadedChatIdRef.current = chatId;
    lastSavedCanvasRef.current = JSON.stringify(
      serializeCanvas(nextNodes, nextEdges)
    );

    setTimeout(() => {
      window.requestAnimationFrame(() => {
        fitView({ duration: 800, padding: 0.1, maxZoom: 1 });
      });
    }, 100);
  }, [
    chatId,
    chatQuery.data,
    setEdges,
    setNodes,
    syncNodeInteractionHandler,
    fitView,
  ]);

  useEffect(() => {
    if (!chatQuery.data || loadedChatIdRef.current !== chatId) return;

    const canvas = serializeCanvas(nodes, edges);
    const signature = JSON.stringify(canvas);

    if (lastSavedCanvasRef.current === signature) return;

    const timeout = window.setTimeout(() => {
      lastSavedCanvasRef.current = signature;
      saveCanvasMutation.mutate({ chatId, canvas });
    }, 600);

    return () => window.clearTimeout(timeout);
  }, [chatId, chatQuery.data, edges, nodes, saveCanvasMutation]);

  const handleCreateNodeFromSelection = useCallback(() => {
    if (!textSelectionAction) return;

    const sourceNode = getNode(textSelectionAction.sourceNodeId);
    const id = crypto.randomUUID();
    const sourceNodeWidth = sourceNode?.measured?.width ?? CHAT_NODE_WIDTH;
    const sourceNodeHeight = sourceNode?.measured?.height ?? 180;
    const sourcePosition = sourceNode?.position ?? { x: 0, y: 0 };
    const newNodePosition = {
      x: sourcePosition.x + sourceNodeWidth + 160,
      y: sourcePosition.y + 40,
    };

    const newNode: Node<ChatNodeData> = {
      id,
      type: 'chatNode',
      position: newNodePosition,
      data: {
        customId: id,
        initialInput: textSelectionAction.text,
        messages: [],
        onInteract: handleUserInteraction,
        onResponseHeightChange: handleResponseHeightChange,
        onSend: handleSend,
        onExpand: handleExpand,
        onTextSelection: handleTextSelection,
      },
    };

    setHasInteracted(true);
    setExpandedNodeId(null);
    setTextSelectionAction(null);
    window.getSelection()?.removeAllRanges();

    setNodes((nds) => nds.concat(newNode));
    setEdges((eds) =>
      eds.concat({
        id: `e-${textSelectionAction.sourceNodeId}-${id}`,
        source: textSelectionAction.sourceNodeId,
        sourceHandle: CHAT_NODE_HANDLE_IDS.right,
        target: id,
        targetHandle: CHAT_NODE_HANDLE_IDS.left,
        type: 'floating',
      })
    );

    void setCenter(
      sourcePosition.x + sourceNodeWidth + 80,
      sourcePosition.y + sourceNodeHeight / 2,
      {
        duration: 350,
        ease: (t) => 1 - Math.pow(1 - t, 3),
        zoom: getZoom(),
      }
    );
  }, [
    getNode,
    getZoom,
    handleExpand,
    handleResponseHeightChange,
    handleSend,
    handleTextSelection,
    handleUserInteraction,
    setCenter,
    setEdges,
    textSelectionAction,
  ]);

  useEffect(() => {
    setNodesRef.current = setNodes;
  }, [setNodes]);

  useEffect(() => {
    setNodes((nds) => syncNodeInteractionHandler(nds, nodeMessages));
  }, [nodeMessages, syncNodeInteractionHandler]);

  useEffect(() => {
    if (!textSelectionAction) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('#new-node-btn')) return;

      setTextSelectionAction(null);
      window.getSelection()?.removeAllRanges();
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [textSelectionAction]);

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

  const handleArrangeNodes = useCallback(() => {
    if (nodes.length <= 1) return;

    const firstNode = nodes[0];
    const startX = firstNode.position.x;
    const startY = firstNode.position.y;
    const horizontalGap = CHAT_NODE_WIDTH + 180;

    setNodes((currentNodes) =>
      currentNodes.map((node, index) => ({
        ...node,
        position: {
          x: startX + index * horizontalGap,
          y: startY,
        },
      }))
    );

    window.requestAnimationFrame(() => {
      void fitView({ duration: 450, padding: 0.12, maxZoom: 1 });
    });
  }, [fitView, nodes, setNodes]);

  return (
    <div className="relative h-screen w-full bg-black">
      {chatQuery.isLoading && (
        <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black text-sm text-white/50">
          Loading chat...
        </div>
      )}
      {chatQuery.error && (
        <div className="absolute inset-0 z-[80] flex items-center justify-center bg-black px-6 text-center text-sm text-red-300">
          {chatQuery.error.message}
        </div>
      )}
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
                Relic ai
              </h1>
            </div>
          </div>
          <p className="-mt-4 px-5">Welcome back Vikas pal to relic ai</p>
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
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1.5}
          color="#212121"
        />
        <MiniMap
          style={{
            width: 120,
            height: 80,
            position: 'fixed',
            background: '#000',
          }}
          className="overflow-hidden rounded-md border border-[#222]"
          pannable
          zoomable
          nodeColor={() => '#555'} // nodes color
          nodeStrokeColor={() => '#999'}
          nodeBorderRadius={2}
          bgColor="#000" // background fix
          maskColor="rgba(255,255,255,0.05)" // vewport overlay
        />
      </ReactFlow>

      <div className="absolute bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-[8px] bg-[#151515] p-1 shadow-xl shadow-black/40">
        <button
          type="button"
          onClick={() => void zoomOut({ duration: 180 })}
          className="nodrag nopan flex h-9 w-9 items-center justify-center rounded-[6px] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          title="Zoom out"
        >
          <FiMinus size={18} />
        </button>
        <button
          type="button"
          onClick={() => void zoomIn({ duration: 180 })}
          className="nodrag nopan flex h-9 w-9 items-center justify-center rounded-[6px] text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          title="Zoom in"
        >
          <FiPlus size={18} />
        </button>
        <button
          type="button"
          onClick={handleArrangeNodes}
          disabled={nodes.length <= 1}
          className="nodrag nopan flex h-9 w-9 items-center justify-center rounded-[6px] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-white/60"
          title="Arrange nodes side by side"
        >
          <FiColumns size={18} />
        </button>
      </div>

      {expandedNodeId && (
        <FullscreenChat
          nodeId={expandedNodeId}
          messages={nodeMessages[expandedNodeId] || []}
          onSend={handleSend}
          onClose={handleCloseFullscreen}
          onTextSelection={handleTextSelection}
        />
      )}

      {textSelectionAction && (
        <button
          id="new-node-btn"
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleCreateNodeFromSelection}
          className="fixed z-[70] flex -translate-x-1/2 items-center gap-1.5 rounded-[5px] border border-white/10 bg-[#202020] px-3 py-1 text-[13px] font-medium text-white shadow-2xl shadow-black/40 transition-colors hover:bg-[#303030]"
          style={{
            left: textSelectionAction.x,
            top: textSelectionAction.y,
          }}
          title="Create node from selection"
        >
          <FiPlus size={15} />
          New node
        </button>
      )}
    </div>
  );
}

export default function ChatCanvas({ chatId }: { chatId: string }) {
  return (
    <ReactFlowProvider>
      <ChatCanvasInner chatId={chatId} />
    </ReactFlowProvider>
  );
}
