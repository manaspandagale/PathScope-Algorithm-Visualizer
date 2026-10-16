import React from 'react';
import type { StepSnapshot } from '../../types/graph';
import { AlertCircle, CheckCircle2, PlayCircle, CornerDownRight } from 'lucide-react';

interface StepExplanationProps {
  snapshot: StepSnapshot | null;
  currentStepIndex: number;
  totalSteps: number;
}

export const StepExplanation: React.FC<StepExplanationProps> = ({
  snapshot,
  currentStepIndex,
  totalSteps,
}) => {
  if (!snapshot) {
    return (
      <div
        className="p-6 rounded-md border text-center space-y-2"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        <p className="text-sm font-medium">Ready to begin</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Click Play or Next Step in the playback dock to execute the C++ algorithm engine.
        </p>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (snapshot.status) {
      case 'found':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border"
            style={{
              backgroundColor: 'var(--success-subtle)',
              borderColor: 'var(--success)',
              color: 'var(--success)',
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Path Discovered
          </span>
        );
      case 'unreachable':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border"
            style={{
              backgroundColor: 'var(--danger-subtle)',
              borderColor: 'var(--danger)',
              color: 'var(--danger)',
            }}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            Unreachable
          </span>
        );
      case 'running':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold border"
            style={{
              backgroundColor: 'var(--accent-subtle)',
              borderColor: 'var(--accent)',
              color: 'var(--accent)',
            }}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Active Step
          </span>
        );
      default:
        return (
          <span
            className="px-2 py-0.5 rounded text-xs font-mono font-medium border"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            Initialization
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-sm font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          Step {currentStepIndex + 1}
          <span style={{ color: 'var(--text-muted)' }}> of {totalSteps}</span>
        </span>
        {getStatusBadge()}
      </div>

      {/* Primary Narrative Explanation Box */}
      <div
        className="p-4 rounded-md border text-sm leading-relaxed"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border-strong)',
          color: 'var(--text-primary)',
        }}
      >
        <p className="font-medium">{snapshot.explanation}</p>
      </div>

      {/* Focus Inspection: Current Vertex & Edge */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className="p-3 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
            Active Vertex (u)
          </div>
          <div className="font-mono text-sm font-bold mt-0.5" style={{ color: 'var(--accent)' }}>
            {snapshot.currentNode ? `Vertex ${snapshot.currentNode}` : 'None'}
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
            Inspected Edge (u, v)
          </div>
          <div className="font-mono text-sm font-bold mt-0.5" style={{ color: 'var(--secondary-accent)' }}>
            {snapshot.currentEdge
              ? `(${snapshot.currentEdge.source} ↔ ${snapshot.currentEdge.target})`
              : 'None'}
          </div>
        </div>
      </div>

      {/* Traversal Order Log */}
      {snapshot.traversalOrder.length > 0 && (
        <div className="pt-2">
          <div
            className="flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            <CornerDownRight className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Visited Order Log ({snapshot.traversalOrder.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {snapshot.traversalOrder.map((nodeId, idx) => (
              <span
                key={`${nodeId}-${idx}`}
                className="px-2 py-0.5 text-xs font-mono font-semibold rounded border"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-primary)',
                }}
              >
                {nodeId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
