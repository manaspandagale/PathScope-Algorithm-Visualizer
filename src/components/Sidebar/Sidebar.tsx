import React from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from '../../types/graph';
import { AlgorithmSelector } from './AlgorithmSelector';
import { NodeSelector } from './NodeSelector';
import { GraphTools } from './GraphTools';
import { GraphStats } from './GraphStats';

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
    <aside
      className="w-full h-full flex flex-col overflow-y-auto p-5 space-y-6"
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Section 1: Algorithm Selection */}
      <section>
        <AlgorithmSelector
          selectedAlgorithm={algorithm}
          onSelectAlgorithm={setAlgorithm}
        />
      </section>

      <hr style={{ borderColor: 'var(--border)' }} />

      {/* Section 2: Source & Target */}
      <section>
        <NodeSelector
          nodes={nodes}
          sourceId={sourceId}
          targetId={targetId}
          setSourceId={setSourceId}
          setTargetId={setTargetId}
        />
      </section>

      <hr style={{ borderColor: 'var(--border)' }} />

      {/* Section 3: Presets & Graph Operations */}
      <section>
        <GraphTools
          setNodes={setNodes}
          setEdges={setEdges}
          setSourceId={setSourceId}
          setTargetId={setTargetId}
          onResetVisualization={onResetVisualization}
        />
      </section>

      <hr style={{ borderColor: 'var(--border)' }} />

      {/* Section 4: Topology Statistics */}
      <section>
        <GraphStats
          nodeCount={nodes.length}
          edgeCount={edges.length}
          isDirected={isDirected}
        />
      </section>
    </aside>
  );
};
