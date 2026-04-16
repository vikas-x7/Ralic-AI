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
import { FiColumns, FiCrosshair, FiMinus, FiPlus } from 'react-icons/fi';
import { trpc } from '@/client/trpc/react';

import ChatNode, {
  CHAT_NODE_HANDLE_IDS,
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

const NEW_NODE_HORIZONTAL_GAP = 160;
const NEW_NODE_VERTICAL_GAP = 60;
const STREAM_MIN_REVEAL_RATE = 70;
const STREAM_MAX_REVEAL_RATE = 520;
const STREAM_FRAME_CAP_MS = 80;
const CHAT_INPUT_FOCUS_ZOOM = 0.95;

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

function getStreamRevealRate(remainingCharacters: number) {
  if (remainingCharacters > 700) return STREAM_MAX_REVEAL_RATE;
  if (remainingCharacters > 250) return 360;
  if (remainingCharacters > 80) return 220;

  return STREAM_MIN_REVEAL_RATE;
}

function ChatCanvasInner({ chatId }: { chatId: string }) {
  const utils = trpc.useUtils();
  const chatQuery = trpc.chat.getChat.useQuery({ chatId });
  const saveCanvasMutation = trpc.chat.saveCanvas.useMutation();
  const userQuery = trpc.auth.getUser.useQuery();
  const [hasInteracted, setHasInteracted] = useState(false);
  const [streamingNodeIds, setStreamingNodeIds] = useState<Set<string>>(
    new Set()
  );
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const [activeNodeId, setActiveNodeId] = useState(initialNodes[0].id);
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
  const { getZoom, getNode, setCenter, fitView, zoomIn, zoomOut } =
    useReactFlow();

  const handleUserInteraction = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const handleNodeFocus = useCallback((nodeId: string) => {
    setActiveNodeId(nodeId);
  }, []);

  const handleResponseHeightChange = useCallback(() => {}, []);

  const handleSend = useCallback(
    (nodeId: string, message: string) => {
      setActiveNodeId(nodeId);

      // Abort any existing stream for this node
      const existingController = abortControllersRef.current.get(nodeId);
      if (existingController) {
        existingController.abort();
        abortControllersRef.current.delete(nodeId);
      }

      const abortController = new AbortController();
      abortControllersRef.current.set(nodeId, abortController);

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

      setStreamingNodeIds((prev) => new Set(prev).add(nodeId));

      void (async () => {
        let targetContent = '';
        let displayedContent = '';
        let animationFrame: number | null = null;
        let resolveDisplayFlush: (() => void) | null = null;
        let lastFrameTime = 0;
        let revealBudget = 0;

        const updatePendingMessage = (content: string) => {
          setNodeMessages((prev) => ({
            ...prev,
            [nodeId]: (prev[nodeId] || []).map((msg) =>
              msg.id === pendingMessage.id
                ? {
                    ...msg,
                    content,
                  }
                : msg
            ),
          }));
        };

        const animateStream = (frameTime: number) => {
          const remaining = targetContent.length - displayedContent.length;

          if (remaining > 0) {
            const elapsedTime = lastFrameTime
              ? Math.min(frameTime - lastFrameTime, STREAM_FRAME_CAP_MS)
              : 16;
            const revealRate = getStreamRevealRate(remaining);

            lastFrameTime = frameTime;
            revealBudget += (revealRate * elapsedTime) / 1000;

            const step = Math.min(
              remaining,
              Math.max(1, Math.floor(revealBudget))
            );
            revealBudget = Math.max(0, revealBudget - step);
            displayedContent = targetContent.slice(
              0,
              displayedContent.length + step
            );
            updatePendingMessage(displayedContent);
          }

          if (displayedContent.length < targetContent.length) {
            animationFrame = window.requestAnimationFrame(animateStream);
            return;
          }

          animationFrame = null;
          lastFrameTime = 0;
          revealBudget = 0;
          resolveDisplayFlush?.();
          resolveDisplayFlush = null;
        };

        const pushStreamContent = (content: string) => {
          targetContent = content;

          if (animationFrame === null) {
            animationFrame = window.requestAnimationFrame(animateStream);
          }
        };

        const waitForStreamDisplay = () => {
          if (displayedContent.length >= targetContent.length) {
            return Promise.resolve();
          }

          return new Promise<void>((resolve) => {
            resolveDisplayFlush = resolve;

            if (animationFrame === null) {
              animationFrame = window.requestAnimationFrame(animateStream);
            }
          });
        };

        const cleanup = () => {
          abortControllersRef.current.delete(nodeId);
          setStreamingNodeIds((prev) => {
            const next = new Set(prev);
            next.delete(nodeId);
            return next;
          });
        };

        try {
          const response = await fetch('/api/chat/stream', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ chatId, nodeId, messages: conversation }),
            signal: abortController.signal,
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
            pushStreamContent(streamedContent);
          }

          const trailingChunk = decoder.decode();

          if (trailingChunk) {
            streamedContent += trailingChunk;
            pushStreamContent(streamedContent);
          }

          const finalContent =
            streamedContent.trim() || 'No response returned from the model.';
          pushStreamContent(finalContent);
          await waitForStreamDisplay();

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

          cleanup();
          void utils.chat.getChats.invalidate();
          void utils.chat.getChat.invalidate({ chatId });
        } catch (error) {
          if (animationFrame !== null) {
            window.cancelAnimationFrame(animationFrame);
          }

          cleanup();

          // If aborted (stopped by user), finalize with whatever content we have
          if (abortController.signal.aborted) {
            const stoppedContent =
              displayedContent.trim() || targetContent.trim();
            setNodeMessages((prev) => ({
              ...prev,
              [nodeId]: (prev[nodeId] || []).map((msg) =>
                msg.id === pendingMessage.id
                  ? {
                      id: pendingMessage.id,
                      role: 'assistant',
                      content: stoppedContent || 'Response stopped.',
                    }
                  : msg
              ),
            }));
            return;
          }

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

  const handleStop = useCallback((nodeId: string) => {
    const controller = abortControllersRef.current.get(nodeId);
    if (controller) {
      controller.abort();
    }
  }, []);

  const handleExpand = useCallback((nodeId: string) => {
    setActiveNodeId(nodeId);
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

      setActiveNodeId(nodeId);
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
    (
      nextNodes: Node<ChatNodeData>[],
      msgs: Record<string, ChatMessage[]>,
      currentStreamingIds: Set<string>
    ) =>
      nextNodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          messages: msgs[node.data.customId] || [],
          isStreaming: currentStreamingIds.has(node.data.customId),
          onInteract: handleUserInteraction,
          onResponseHeightChange: handleResponseHeightChange,
          onSend: handleSend,
          onStop: handleStop,
          onExpand: handleExpand,
          onFocusNode: handleNodeFocus,
          onTextSelection: handleTextSelection,
        },
      })),
    [
      handleUserInteraction,
      handleResponseHeightChange,
      handleSend,
      handleStop,
      handleExpand,
      handleNodeFocus,
      handleTextSelection,
    ]
  );

  const [nodes, setNodes] = useState<Node<ChatNodeData>[]>(() =>
    syncNodeInteractionHandler(initialNodes, {}, new Set())
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
    setActiveNodeId(nextNodes[0]?.id || initialNodes[0].id);
    setNodes(syncNodeInteractionHandler(nextNodes, messagesByNode, new Set()));
    setEdges(nextEdges);

    loadedChatIdRef.current = chatId;
    lastSavedCanvasRef.current = JSON.stringify(
      serializeCanvas(nextNodes, nextEdges)
    );

    setTimeout(() => {
      window.requestAnimationFrame(() => {
        if (nextNodes.length > 0) {
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
          nextNodes.forEach((n) => {
            minX = Math.min(minX, n.position.x);
            minY = Math.min(minY, n.position.y);
            maxX = Math.max(maxX, n.position.x + CHAT_NODE_WIDTH);
            maxY = Math.max(maxY, n.position.y + 200);
          });
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          setCenter(centerX, centerY, { duration: 800, zoom: getZoom() });
        }
      });
    }, 100);
  }, [
    chatId,
    chatQuery.data,
    setEdges,
    setNodes,
    syncNodeInteractionHandler,
    setCenter,
    getZoom,
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
      x: sourcePosition.x + sourceNodeWidth + NEW_NODE_HORIZONTAL_GAP,
      y: sourcePosition.y + sourceNodeHeight + NEW_NODE_VERTICAL_GAP,
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
    setActiveNodeId(id);
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
      (sourcePosition.x +
        sourceNodeWidth / 2 +
        newNodePosition.x +
        CHAT_NODE_WIDTH / 2) /
        2,
      (sourcePosition.y +
        sourceNodeHeight / 2 +
        newNodePosition.y +
        sourceNodeHeight / 2) /
        2,
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
    setNodes((nds) =>
      syncNodeInteractionHandler(nds, nodeMessages, streamingNodeIds)
    );
  }, [nodeMessages, streamingNodeIds, syncNodeInteractionHandler]);

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
          nodeMessages,
          streamingNodeIds
        )
      );
    },
    [syncNodeInteractionHandler, nodeMessages, streamingNodeIds]
  );

  const onConnectEnd = useCallback(
    (
      _event: MouseEvent | TouchEvent,
      connectionState: FinalConnectionState
    ) => {
      if (
        connectionState.isValid ||
        !connectionState.fromNode ||
        connectionState.toNode ||
        connectionState.toHandle
      ) {
        return;
      }

      const id = crypto.randomUUID();

      const sourceNodeId = connectionState.fromNode.id;
      const sourceHandleId = connectionState.fromHandle?.id || null;

      const targetHandle =
        connectionState.fromPosition === Position.Left
          ? CHAT_NODE_HANDLE_IDS.right
          : CHAT_NODE_HANDLE_IDS.left;

      const sourceNodePosition =
        connectionState.fromNode.internals.positionAbsolute;
      const sourceNodeWidth =
        connectionState.fromNode.measured.width ?? CHAT_NODE_WIDTH;
      const sourceNodeHeight = connectionState.fromNode.measured.height ?? 180;
      const newNodePosition = {
        x:
          targetHandle === CHAT_NODE_HANDLE_IDS.right
            ? sourceNodePosition.x - CHAT_NODE_WIDTH - NEW_NODE_HORIZONTAL_GAP
            : sourceNodePosition.x + sourceNodeWidth + NEW_NODE_HORIZONTAL_GAP,
        y: sourceNodePosition.y + sourceNodeHeight + NEW_NODE_VERTICAL_GAP,
      };
      const newNode: Node<ChatNodeData> = {
        id,
        type: 'chatNode',
        position: newNodePosition,
        data: {
          customId: id,
          messages: [],
          onInteract: handleUserInteraction,
          onResponseHeightChange: handleResponseHeightChange,
          onSend: handleSend,
          onExpand: handleExpand,
        },
      };
      const sourceNodeCenterX = sourceNodePosition.x + sourceNodeWidth / 2;
      const sourceNodeCenterY = sourceNodePosition.y + sourceNodeHeight / 2;
      const newNodeCenterX = newNode.position.x + CHAT_NODE_WIDTH / 2;
      const newNodeCenterY = newNode.position.y + sourceNodeHeight / 2;

      setHasInteracted(true);
      setActiveNodeId(id);
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

  const handleFocusActiveNode = useCallback(() => {
    const targetNodeId =
      nodes.find((node) => node.id === activeNodeId)?.id || nodes[0]?.id;

    if (!targetNodeId) return;

    const fallbackNode = nodes.find((node) => node.id === targetNodeId);
    const targetNode = getNode(targetNodeId) || fallbackNode;
    const nodePosition = targetNode?.position || fallbackNode?.position;

    if (!nodePosition) return;

    const nodeWidth = targetNode?.measured?.width ?? CHAT_NODE_WIDTH;
    const nodeHeight = targetNode?.measured?.height ?? 220;
    const inputCenterX = nodePosition.x + nodeWidth / 2;
    const inputCenterY = nodePosition.y + Math.max(90, nodeHeight - 72);

    setActiveNodeId(targetNodeId);
    void setCenter(inputCenterX, inputCenterY, {
      duration: 450,
      zoom: CHAT_INPUT_FOCUS_ZOOM,
      ease: (t) => 1 - Math.pow(1 - t, 3),
    });
  }, [activeNodeId, getNode, nodes, setCenter]);

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
        className={`pointer-events-none absolute top-55 right-130 z-20 flex w-100 items-center text-white/70 transition-all duration-500 ease-out ${
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
              className="w-17 opacity-80"
            />
            <div>
              <h1 className="-ml-[16px] text-[35px] font-semibold -tracking-[1px]">
                Relic AI
              </h1>
            </div>
          </div>
          <p className="-mt-3 px-5">
            Welcome back {userQuery.data?.name || 'User'} to relic ai
          </p>
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => {
          handleNodeFocus(node.id);
          handleUserInteraction();
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectEnd={onConnectEnd}
        onPaneClick={handleUserInteraction}
        onNodeDragStart={handleUserInteraction}
        onMoveStart={(event) => {
          if (event) handleUserInteraction();
        }}
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

      <div className="absolute bottom-5 left-25 z-40 flex -translate-x-1/2 items-center gap-1 rounded-[8px] bg-[#151515] p-1 shadow-xl shadow-black/40">
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
        <button
          type="button"
          onClick={handleFocusActiveNode}
          disabled={!nodes.length}
          className="nodrag nopan flex h-9 w-9 items-center justify-center rounded-[6px] text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-white/60"
          title="Focus current node"
        >
          <FiCrosshair size={18} />
        </button>
      </div>

      {expandedNodeId && (
        <FullscreenChat
          nodeId={expandedNodeId}
          messages={nodeMessages[expandedNodeId] || []}
          isStreaming={streamingNodeIds.has(expandedNodeId)}
          onSend={handleSend}
          onStop={handleStop}
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
