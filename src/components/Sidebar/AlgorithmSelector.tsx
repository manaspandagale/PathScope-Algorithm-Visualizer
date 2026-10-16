import React from 'react';
import type { AlgorithmType } from '../../types/graph';
import { Network, Gauge, Check } from 'lucide-react';

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
    tag: string;
    complexity: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      tag: 'Minimum Hops (Unweighted)',
      complexity: 'O(V + E)',
      icon: Network,
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      tag: 'Minimum Weight (w ≥ 0)',
      complexity: 'O((V+E) log V)',
      icon: Gauge,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Algorithm Engine
        </label>
        <span
          className="text-[11px] font-mono font-medium px-2 py-0.5 rounded border"
          style={{
            backgroundColor: 'var(--background-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          C++ WASM
        </span>
      </div>

      <div className="space-y-2">
        {algorithms.map((algo) => {
          const isSelected = selectedAlgorithm === algo.id;
          const Icon = algo.icon;

          return (
            <button
              key={algo.id}
              onClick={() => onSelectAlgorithm(algo.id)}
              className="w-full text-left p-3 rounded-md border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[48px]"
              style={{
                backgroundColor: isSelected ? 'var(--surface-elevated)' : 'var(--background)',
                borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                borderWidth: isSelected ? '2px' : '1px',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: isSelected ? 'var(--accent)' : 'var(--background-secondary)',
                      borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                      color: isSelected ? '#FFFDF8' : 'var(--text-secondary)',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div
                      className="text-sm font-semibold leading-snug"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {algo.name}
                    </div>
                    <div
                      className="text-xs leading-none mt-0.5 font-medium"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {algo.tag}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--accent)' }} />
                ) : (
                  <span
                    className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded border"
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {algo.complexity.split(' ')[0]}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
