import React from 'react';
import type { AlgorithmType } from '../../types/graph';
import { SegmentedSelector } from '../UI/SegmentedSelector';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algo: AlgorithmType) => void;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm,
}) => {
  const options = [
    {
      value: 'bfs' as const,
      label: 'Breadth-First Search',
      badge: 'O(V + E)',
      description: 'Finds minimum-hop shortest path on unweighted graphs.',
    },
    {
      value: 'dijkstra' as const,
      label: "Dijkstra's Algorithm",
      badge: 'O((V+E) log V)',
      description: 'Finds minimum-weight path with non-negative edge costs.',
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Algorithm Engine
        </h3>
        <span className="text-[11px] font-mono text-[var(--primary-action)] font-medium">
          C++17 WASM
        </span>
      </div>

      <SegmentedSelector
        options={options}
        value={selectedAlgorithm}
        onChange={onSelectAlgorithm}
        ariaLabel="Choose pathfinding algorithm"
      />
    </div>
  );
};
