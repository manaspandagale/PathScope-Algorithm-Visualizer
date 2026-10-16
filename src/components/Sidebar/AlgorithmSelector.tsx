import React from 'react';
import type { AlgorithmType } from '../../types/graph';
import { Network, GitFork, Gauge, GitCommit, Grid3X3 } from 'lucide-react';

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
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      tag: 'Optimal Shortest Path (Weighted)',
      complexity: 'O((V+E) log V)',
      icon: Gauge,
    },
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      tag: 'Shortest Hops (Unweighted)',
      complexity: 'O(V + E)',
      icon: Network,
    },
    {
      id: 'dfs',
      name: 'Depth-First Search',
      tag: 'Deep Traversal (Not Shortest)',
      complexity: 'O(V + E)',
      icon: GitFork,
    },
    {
      id: 'dag',
      name: 'DAG Shortest Path',
      tag: 'Linear Time (Directed Acyclic)',
      complexity: 'O(V + E)',
      icon: GitCommit,
    },
    {
      id: 'floyd-warshall',
      name: 'Floyd–Warshall',
      tag: 'All-Pairs Shortest Path Matrix',
      complexity: 'O(V³)',
      icon: Grid3X3,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Algorithm Selection
      </label>
      <div className="grid grid-cols-1 gap-2">
        {algorithms.map((algo) => {
          const isSelected = selectedAlgorithm === algo.id;
          const Icon = algo.icon;

          return (
            <button
              key={algo.id}
              onClick={() => onSelectAlgorithm(algo.id)}
              className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500/80 text-white shadow-md shadow-blue-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{algo.name}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{algo.tag}</div>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50 shrink-0 ml-1">
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
