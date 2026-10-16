import React from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from '../../types/graph';
import { AlgorithmSelector } from './AlgorithmSelector';
import { NodeSelector } from './NodeSelector';
import { GraphTools } from './GraphTools';
import { GraphStats } from './GraphStats';
import { Layers } from 'lucide-react';

interface SidebarProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  nodes: Node<GraphNodeData>[];
  edges: Edge<GraphEdgeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<GraphNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<GraphEdgeData>[]>>;
  sourceId: string;
  targetId: string;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
  onResetVisualization: () => void;
  isDirected?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  algorithm,
  setAlgorithm,
  nodes,
  edges,
  setNodes,
  setEdges,
  sourceId,
  targetId,
  setSourceId,
  setTargetId,
  onResetVisualization,
  isDirected = false,
}) => {
  return (
    <aside className="w-80 h-full border-r border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col overflow-y-auto p-4 space-y-5">
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
        <Layers className="w-4 h-4 text-blue-400" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Control Panel
        </h2>
      </div>

      <AlgorithmSelector
        selectedAlgorithm={algorithm}
        onSelectAlgorithm={setAlgorithm}
      />

      <NodeSelector
        nodes={nodes}
        sourceId={sourceId}
        targetId={targetId}
        setSourceId={setSourceId}
        setTargetId={setTargetId}
      />

      <GraphTools
        setNodes={setNodes}
        setEdges={setEdges}
        setSourceId={setSourceId}
        setTargetId={setTargetId}
        onResetVisualization={onResetVisualization}
      />

      <GraphStats
        nodeCount={nodes.length}
        edgeCount={edges.length}
        isDirected={isDirected}
      />
    </aside>
  );
};
