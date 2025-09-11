'use client';

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
    position: { x: 250, y: 200 },
    data: { customId: 'root' },
  },
];

function ChatCanvasInner() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<ChatNodeData>>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as Node<ChatNodeData>[]);
    },
    []
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
        data: { customId: id },
      };

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
    [screenToFlowPosition, setNodes, setEdges]
  );

  return (
    <div className="h-full w-full bg-black">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnectEnd={onConnectEnd}
        isValidConnection={() => false}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
        connectOnClick={false}
        className="bg-gray-900"
        defaultEdgeOptions={{
          type: 'floating',
        }}
      ></ReactFlow>
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
