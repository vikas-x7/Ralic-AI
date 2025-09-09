'use client';

import { useCallback, useState } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  ConnectionMode,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  applyNodeChanges,
} from '@xyflow/react';
import ChatNode, { type ChatNodeData } from './ChatNode';

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

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event: any, connectionState: any) => {
      if (!connectionState.isValid && connectionState.fromNode) {
        const id = crypto.randomUUID();
        const clientX =
          'clientX' in event
            ? event.clientX
            : event.changedTouches?.[0]?.clientX;
        const clientY =
          'clientY' in event
            ? event.clientY
            : event.changedTouches?.[0]?.clientY;

        if (clientX === undefined || clientY === undefined) return;

        const position = screenToFlowPosition({ x: clientX, y: clientY });

        const newNode: Node<ChatNodeData> = {
          id,
          type: 'chatNode',
          position,
          data: { customId: id },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({
            id: `e-${connectionState.fromNode.id}-${id}`,
            source: connectionState.fromNode.id,
            sourceHandle: connectionState.fromHandle?.id || null,
            target: id,
            type: 'floating',
          })
        );
      }
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
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
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
