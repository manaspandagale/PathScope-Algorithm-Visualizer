import React from 'react';
import type { AlgorithmType } from '../../types/graph';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algo: AlgorithmType) => void;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm,
}) => {
  const algorithms: {
    id: AlgorithmType;
    name: string;
    purpose: string;
    complexity: string;
  }[] = [
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      purpose: 'Minimum hops (unweighted)',
      complexity: 'O(V + E)',
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      purpose: 'Minimum total weight (w ≥ 0)',
      complexity: 'O((V+E) log V)',
    },
  ];

  return (
    <div className="space-y-2.5">
      <h3
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-secondary)' }}
      >
        Algorithms
      </h3>

      <div className="space-y-1.5">
        {algorithms.map((algo) => {
          const isSelected = selectedAlgorithm === algo.id;

          return (
            <button
              key={algo.id}
              onClick={() => onSelectAlgorithm(algo.id)}
              className="w-full text-left px-3.5 py-2.5 rounded-md border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              style={{
                backgroundColor: isSelected ? 'var(--background-secondary)' : 'var(--background)',
                borderColor: isSelected ? 'var(--border-strong)' : 'var(--border)',
                borderWidth: isSelected ? '1.5px' : '1px',
              }}
            >
              <div>
                <span
                  className="text-sm font-semibold tracking-tight block"
                  style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                >
                  {algo.name}
                </span>
                <p
                  className="text-xs mt-0.5 leading-snug"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {algo.purpose}
                </p>
                <span
                  className="inline-block mt-1.5 text-xs font-mono font-medium"
                  style={{ color: isSelected ? 'var(--primary-action)' : 'var(--text-secondary)' }}
                >
                  {algo.complexity}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
