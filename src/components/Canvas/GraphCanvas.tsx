import React, { useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
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
import { Plus, Trash2, Flag, Target } from 'lucide-react';

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
  theme = 'dark',
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
      if (connection.source === connection.target) return; // Prevent self-loops in Phase 1

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

  const handleAddNode = useCallback(() => {
    const existingLabels = new Set(nodes.map((n) => n.data.label));
    let nextLabel = 'A';
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(65 + i);
      if (!existingLabels.has(char)) {
        nextLabel = char;
        break;
      }
    }
    if (existingLabels.has(nextLabel)) {
      nextLabel = `V${nodes.length + 1}`;
    }

    const newNodeId = `node-${Date.now()}`;
    const x = 120 + ((nodes.length * 90) % 600);
    const y = 140 + ((nodes.length * 60) % 360);

    const newNode: Node<GraphNodeData> = {
      id: newNodeId,
      type: 'customNode',
      position: { x, y },
      data: {
        label: nextLabel,
        isSource: nodes.length === 0,
        isTarget: nodes.length === 1,
        state: 'default',
      },
    };

    setNodes((prev) => [...prev, newNode]);

    if (!sourceId) setSourceId(newNodeId);
    else if (!targetId && newNodeId !== sourceId) setTargetId(newNodeId);
  }, [nodes, sourceId, targetId, setNodes, setSourceId, setTargetId]);

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
    <div className={`relative w-full h-full overflow-hidden select-none ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <CanvasLegend />

      {/* Floating Action Bar */}
      <div className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1.5 rounded-xl border backdrop-blur-md shadow-xl ${theme === 'dark' ? 'border-slate-800 bg-slate-900/90' : 'border-slate-300 bg-white/90'}`}>
        <button
          onClick={handleAddNode}
          title="Add Node"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Node</span>
        </button>

        {selectedNodeId && (
          <>
            <div className={`h-4 w-[1px] mx-1 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <button
              onClick={() => setSourceId(selectedNodeId)}
              title="Set selected node as Source"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                sourceId === selectedNodeId
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-emerald-400" />
              <span>Set Source</span>
            </button>
            <button
              onClick={() => setTargetId(selectedNodeId)}
              title="Set selected node as Target"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                targetId === selectedNodeId
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : theme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-rose-400" />
              <span>Set Target</span>
            </button>
            <button
              onClick={handleDeleteSelected}
              title="Delete selected node"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

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
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2.5}
        className="w-full h-full"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color={theme === 'dark' ? '#334155' : '#cbd5e1'} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-200 !rounded-xl !shadow-xl [&>button]:!border-slate-800 [&>button:hover]:!bg-slate-800" />
        <MiniMap
          nodeColor={(n) => {
            if (n.id === sourceId) return '#10b981';
            if (n.id === targetId) return '#f43f5e';
            return '#3b82f6';
          }}
          maskColor="rgba(2, 6, 23, 0.75)"
          className="!bg-slate-900 !border-slate-800 !rounded-xl !shadow-xl"
        />
      </ReactFlow>
    </div>
  );
};
