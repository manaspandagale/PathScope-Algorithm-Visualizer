import React from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from '../../types/graph';
import { AlgorithmSelector } from './AlgorithmSelector';
import { NodeSelector } from './NodeSelector';
import { GraphTools } from './GraphTools';

interface SidebarProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  nodes: Node<GraphNodeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<GraphNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<GraphEdgeData>[]>>;
  sourceId: string;
  targetId: string;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
  onResetVisualization: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  algorithm,
  setAlgorithm,
  nodes,
  setNodes,
  setEdges,
  sourceId,
  targetId,
  setSourceId,
  setTargetId,
  onResetVisualization,
}) => {
  return (
    <aside
      className="w-full h-full flex flex-col overflow-y-auto p-4 space-y-5"
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 1. Algorithms */}
      <section>
        <AlgorithmSelector
          selectedAlgorithm={algorithm}
          onSelectAlgorithm={setAlgorithm}
        />
      </section>

      <hr style={{ borderColor: 'var(--border)' }} />

      {/* 2. Start and Destination */}
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

      {/* 3. Graph Configuration */}
      <section>
        <GraphTools
          nodes={nodes}
          setNodes={setNodes}
          setEdges={setEdges}
          sourceId={sourceId}
          targetId={targetId}
          setSourceId={setSourceId}
          setTargetId={setTargetId}
          onResetVisualization={onResetVisualization}
        />
      </section>
    </aside>
  );
};

export default Sidebar;
