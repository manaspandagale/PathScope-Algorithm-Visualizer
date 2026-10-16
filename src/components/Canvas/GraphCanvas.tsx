import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import { CustomNode } from './CustomNode';
import { CustomEdge } from './CustomEdge';
import { CanvasLegend } from './CanvasLegend';
import type { GraphNodeData, GraphEdgeData, StepSnapshot } from '../../types/graph';
import { Trash2, Flag, Target } from 'lucide-react';

interface GraphCanvasProps {
  nodes: Node<GraphNodeData>[];
  edges: Edge<GraphEdgeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<GraphNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<GraphEdgeData>[]>>;
  sourceId: string;
  targetId: string;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
  currentSnapshot: StepSnapshot | null;
  isDirected?: boolean;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  theme?: 'dark' | 'light';
}

const nodeTypes = {
  customNode: CustomNode,
  default: CustomNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  sourceId,
  targetId,
  setSourceId,
  setTargetId,
  currentSnapshot,
  isDirected = false,
  selectedNodeId,
  setSelectedNodeId,
}) => {
  // Apply snapshot visualization states to nodes
  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      let state: GraphNodeData['state'] = 'default';
      let distance = node.data.distance;

      if (currentSnapshot) {
        if (currentSnapshot.pathNodes.includes(node.id)) {
          state = 'path';
        } else if (currentSnapshot.currentNode === node.id) {
          state = 'current';
        } else if (currentSnapshot.frontierNodes.includes(node.id)) {
          state = 'frontier';
        } else if (currentSnapshot.visitedNodes.includes(node.id)) {
          state = 'visited';
        } else {
          state = 'default';
        }

        if (currentSnapshot.distances && currentSnapshot.distances[node.id] !== undefined) {
          distance = currentSnapshot.distances[node.id];
        }
      }

      return {
        ...node,
        type: 'customNode',
        data: {
          ...node.data,
          isSource: node.id === sourceId,
          isTarget: node.id === targetId,
          state,
          distance,
        },
      };
    });
  }, [nodes, currentSnapshot, sourceId, targetId]);

  // Apply snapshot visualization states to edges
  const displayEdges = useMemo(() => {
    return edges.map((edge) => {
      let state: GraphEdgeData['state'] = 'default';

      if (currentSnapshot) {
        if (currentSnapshot.pathEdges.includes(edge.id)) {
          state = 'path';
        } else if (
          currentSnapshot.currentEdge &&
          ((edge.source === currentSnapshot.currentEdge.source && edge.target === currentSnapshot.currentEdge.target) ||
            (!isDirected &&
              edge.source === currentSnapshot.currentEdge.target &&
              edge.target === currentSnapshot.currentEdge.source))
        ) {
          state = 'current';
        } else if (currentSnapshot.visitedEdges.includes(edge.id)) {
          state = 'visited';
        } else {
          state = 'default';
        }
      }

      return {
        ...edge,
        type: 'customEdge',
        data: {
          ...edge.data,
          weight: edge.data?.weight ?? 1,
          state,
        },
      };
    });
  }, [edges, currentSnapshot, isDirected]);

  const onNodesChange: OnNodesChange<Node<GraphNodeData>> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange<Edge<GraphEdgeData>> = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      if (connection.source === connection.target) return;

      const newEdgeId = `e-${connection.source}-${connection.target}-${Date.now()}`;
      const newEdge: Edge<GraphEdgeData> = {
        id: newEdgeId,
        source: connection.source,
        target: connection.target,
        type: 'customEdge',
        data: {
          weight: 1,
          state: 'default',
        },
      };

      setEdges((prev) => [...prev, newEdge]);
    },
    [setEdges]
  );

  const handleDeleteSelected = useCallback(() => {
    if (!selectedNodeId) return;

    setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
    setEdges((prev) => prev.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));

    if (sourceId === selectedNodeId) {
      const remaining = nodes.filter((n) => n.id !== selectedNodeId);
      setSourceId(remaining[0]?.id || '');
    }
    if (targetId === selectedNodeId) {
      const remaining = nodes.filter((n) => n.id !== selectedNodeId);
      setTargetId(remaining[1]?.id || remaining[0]?.id || '');
    }
    setSelectedNodeId(null);
  }, [selectedNodeId, nodes, sourceId, targetId, setNodes, setEdges, setSourceId, setTargetId, setSelectedNodeId]);

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{
        backgroundColor: 'var(--background)',
      }}
    >
      <CanvasLegend />

      {/* Subtle selection toolbar (only visible when a node is selected) */}
      {selectedNodeId && (
        <div
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-md border shadow-sm text-xs"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
          }}
        >
          <button
            onClick={() => setSourceId(selectedNodeId)}
            title="Set selected vertex as start"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors"
            style={{
              backgroundColor: sourceId === selectedNodeId ? 'var(--primary-subtle)' : 'transparent',
              color: sourceId === selectedNodeId ? 'var(--primary-action)' : 'var(--text-secondary)',
            }}
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Set start</span>
          </button>

          <button
            onClick={() => setTargetId(selectedNodeId)}
            title="Set selected vertex as destination"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors"
            style={{
              backgroundColor: targetId === selectedNodeId ? 'var(--error-subtle)' : 'transparent',
              color: targetId === selectedNodeId ? 'var(--error)' : 'var(--text-secondary)',
            }}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Set destination</span>
          </button>

          <div className="h-4 w-[1px]" style={{ backgroundColor: 'var(--border)' }} />

          <button
            onClick={handleDeleteSelected}
            title="Delete selected vertex"
            className="p-1.5 rounded hover:bg-[var(--error-subtle)] transition-colors cursor-pointer"
            style={{ color: 'var(--error)' }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        fitView
        fitViewOptions={{ padding: 0.35 }}
        minZoom={0.3}
        maxZoom={2.0}
        className="w-full h-full pb-2"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="var(--canvas-grid)"
        />
        <Controls
          showInteractive={false}
          className="!border !shadow-sm !rounded-md"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default GraphCanvas;
