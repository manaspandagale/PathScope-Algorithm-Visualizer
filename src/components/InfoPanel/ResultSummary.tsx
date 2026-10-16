import React from 'react';
import type { StepSnapshot, AlgorithmType } from '../../types/graph';
import { AlertTriangle, ArrowRight, XCircle } from 'lucide-react';

interface ResultSummaryProps {
  snapshot: StepSnapshot | null;
  algorithm: AlgorithmType;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  snapshot,
  algorithm,
}) => {
  if (!snapshot) {
    return (
      <div
        className="p-6 rounded-md border text-center text-xs"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        No execution result yet. Run the visualizer to completion to observe path discovery.
      </div>
    );
  }

  if (snapshot.status === 'invalid') {
    return (
      <div
        className="p-4 rounded-md border text-xs space-y-2"
        style={{
          backgroundColor: 'var(--danger-subtle)',
          borderColor: 'var(--danger)',
          color: 'var(--danger)',
        }}
      >
        <div className="flex items-center gap-2 font-bold">
          <XCircle className="w-4 h-4" />
          <span>Execution Invalidated</span>
        </div>
        <p className="leading-relaxed">{snapshot.explanation}</p>
      </div>
    );
  }

  if (snapshot.status === 'unreachable') {
    return (
      <div
        className="p-4 rounded-md border text-xs space-y-2"
        style={{
          backgroundColor: 'var(--danger-subtle)',
          borderColor: 'var(--danger)',
          color: 'var(--danger)',
        }}
      >
        <div className="flex items-center gap-2 font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>Destination Unreachable</span>
        </div>
        <p className="leading-relaxed">
          No valid path exists between the selected start and target vertices. The graph topology contains disconnected components.
        </p>
      </div>
    );
  }

  const isPathFound = snapshot.status === 'found';

  const cleanLabel = (id?: string | null) => {
    if (!id) return '';
    return id.replace(/^node-/, '');
  };

  return (
    <div className="space-y-5 text-xs">
      {/* Header status */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <span
          className="font-medium text-xs"
          style={{ color: isPathFound ? 'var(--primary-action)' : 'var(--text-primary)' }}
        >
          {isPathFound ? 'Optimal path found' : 'Intermediate state'}
        </span>
        <span
          className="text-xs font-mono font-medium px-2 py-0.5 rounded border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          {algorithm === 'dijkstra' ? 'Minimum weight' : 'Minimum hops'}
        </span>
      </div>

      {/* Path sequence breadcrumbs */}
      <div>
        <span
          className="text-xs font-medium block mb-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          Path sequence
        </span>
        {snapshot.pathNodes.length === 0 ? (
          <div
            className="p-3 rounded border text-xs italic"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            Path not yet assembled
          </div>
        ) : (
          <div
            className="flex flex-wrap items-center gap-1.5 p-3 rounded-md border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }}
          >
            {snapshot.pathNodes.map((node, index) => (
              <React.Fragment key={`${node}-${index}`}>
                <span
                  className="px-2 py-0.5 font-medium text-xs rounded border"
                  style={{
                    backgroundColor: 'var(--primary-subtle)',
                    borderColor: 'var(--primary-action)',
                    color: 'var(--primary-action)',
                  }}
                >
                  Vertex {cleanLabel(node)}
                </span>
                {index < snapshot.pathNodes.length - 1 && (
                  <ArrowRight className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Metrics List */}
      <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between py-1.5 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Total cost</span>
          <span className="font-mono font-semibold" style={{ color: 'var(--primary-action)' }}>
            {snapshot.totalCost ?? 0}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Hops</span>
          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
            {snapshot.hopCount ?? Math.max(0, snapshot.pathNodes.length - 1)}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Explored vertices</span>
          <span className="font-mono" style={{ color: 'var(--text-secondary)' }}>
            {snapshot.visitedNodes.length}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Complexity</span>
          <span className="font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>
            {algorithm === 'dijkstra' ? 'O((V + E) log V)' : 'O(V + E)'}
          </span>
        </div>
      </div>

      {/* Invariant guarantee note */}
      <div
        className="p-3 rounded-md border text-xs leading-relaxed"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          Theoretical guarantee
        </p>
        <p>
          {algorithm === 'bfs'
            ? 'BFS explores vertices layer by layer, guaranteeing the minimum number of edge hops regardless of edge weights.'
            : 'Dijkstra explores in ascending order of tentative distance, strictly guaranteeing the minimum total weight sum across all valid paths.'}
        </p>
      </div>
    </div>
  );
};
