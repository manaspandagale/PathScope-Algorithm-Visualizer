import React from 'react';
import type { StepSnapshot, AlgorithmType } from '../../types/graph';
import { CheckCircle2, AlertTriangle, ArrowRight, XCircle, ShieldCheck } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      {/* Header status */}
      <div className="flex items-center justify-between">
        <div
          className="flex items-center gap-2 font-bold text-sm"
          style={{ color: isPathFound ? 'var(--success)' : 'var(--text-primary)' }}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isPathFound ? 'Optimal Path Discovered' : 'Intermediate State'}</span>
        </div>
        <span
          className="text-xs font-mono font-medium px-2 py-0.5 rounded border"
          style={{
            backgroundColor: 'var(--background-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          {algorithm === 'dijkstra' ? 'Minimum Weight' : 'Minimum Hops'}
        </span>
      </div>

      {/* Path sequence breadcrumbs */}
      <div>
        <div
          className="text-xs font-mono font-bold uppercase tracking-wider mb-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          Path Sequence
        </div>
        {snapshot.pathNodes.length === 0 ? (
          <div
            className="p-3 rounded border text-xs font-mono italic"
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
              borderColor: 'var(--border-strong)',
            }}
          >
            {snapshot.pathNodes.map((node, index) => (
              <React.Fragment key={`${node}-${index}`}>
                <span
                  className="px-2.5 py-1 font-mono font-bold text-xs rounded border"
                  style={{
                    backgroundColor: 'var(--success-subtle)',
                    borderColor: 'var(--success)',
                    color: 'var(--success)',
                  }}
                >
                  Vertex {node}
                </span>
                {index < snapshot.pathNodes.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className="p-3 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
            Numeric Cost (Sum w)
          </div>
          <div className="font-mono text-lg font-bold mt-0.5" style={{ color: 'var(--success)' }}>
            {snapshot.totalCost ?? 0}
          </div>
        </div>

        <div
          className="p-3 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
            Edge Hops (Length)
          </div>
          <div className="font-mono text-lg font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
            {snapshot.hopCount ?? Math.max(0, snapshot.pathNodes.length - 1)}
          </div>
        </div>

        <div
          className="p-3 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
            Settled Vertices
          </div>
          <div className="font-mono text-base font-bold mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {snapshot.visitedNodes.length} nodes
          </div>
        </div>

        <div
          className="p-3 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
            Algorithm Model
          </div>
          <div className="font-mono text-xs font-semibold mt-1" style={{ color: 'var(--accent)' }}>
            {algorithm === 'dijkstra' ? 'O((V+E) log V)' : 'O(V + E)'}
          </div>
        </div>
      </div>

      {/* Invariant guarantee note */}
      <div
        className="p-3 rounded-md border text-xs leading-relaxed space-y-1"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--text-primary)' }}>
          <ShieldCheck className="w-4 h-4" style={{ color: 'var(--secondary-accent)' }} />
          <span>Algorithmic Invariant</span>
        </div>
        <p>
          {algorithm === 'bfs'
            ? 'BFS explores vertices layer-by-layer. It strictly guarantees minimum hops. Numeric edge weights were ignored in routing decisions.'
            : 'Dijkstra explores in ascending order of accumulated distance. It strictly guarantees the minimum total weight sum across all valid paths.'}
        </p>
      </div>
    </div>
  );
};
