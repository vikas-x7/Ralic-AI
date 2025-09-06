'use client';

import { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  ConnectionMode,
  ReactFlowProvider,
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node<ChatNodeData>>[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds) as Node<ChatNodeData>[]);
    },
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.target) {
        const newNodeId = crypto.randomUUID();
        const reactFlowBounds =
          reactFlowWrapper.current?.getBoundingClientRect();
        if (!reactFlowBounds) return;

        const position = {
          x: dragPosition?.x || reactFlowBounds.width / 2 - 150,
          y: dragPosition?.y || reactFlowBounds.height / 2 - 50,
        };

        const newNode: Node<ChatNodeData> = {
          id: newNodeId,
          type: 'chatNode',
          position,
          data: { customId: newNodeId },
        };

        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) =>
          addEdge(
            {
              ...params,
              target: newNodeId,
            },
            eds
          )
        );
      } else {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [dragPosition, setNodes, setEdges]
  );

  const onMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (isDragging && reactFlowWrapper.current && reactFlowInstance) {
        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        });
        setDragPosition(position);
      }
    },
    [isDragging, reactFlowInstance]
  );

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragPosition(null);
  }, []);

  const onConnectStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onConnectEnd = useCallback(() => {
    if (isDragging && dragPosition) {
      const newNodeId = crypto.randomUUID();
      const newNode: Node<ChatNodeData> = {
        id: newNodeId,
        type: 'chatNode',
        position: dragPosition,
        data: { customId: newNodeId },
      };

      const sourceNode = nodes[nodes.length - 1];
      if (sourceNode) {
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [
          ...eds,
          {
            id: `e-${sourceNode.id}-${newNodeId}`,
            source: sourceNode.id,
            target: newNodeId,
            type: 'smoothstep',
          },
        ]);
      }
    }
    setIsDragging(false);
    setDragPosition(null);
  }, [isDragging, dragPosition, nodes, setNodes, setEdges]);

  return (
    <div
      ref={reactFlowWrapper}
      className="h-full w-full"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
        className="bg-gray-900"
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background className="bg-gray-900" />
        <Controls className="!border-gray-700 !bg-gray-800 [&>button]:!border-gray-700 [&>button]:!bg-gray-800 [&>button>svg]:!fill-gray-300" />
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
