import React from 'react';
import type { StepSnapshot } from '../../types/graph';
import { StatusBadge } from '../UI/StatusBadge';

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
        className="p-6 rounded-xl border text-center space-y-1.5"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Ready to Begin
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Use the playback transport controls below to advance the visualizer and observe algorithm steps.
        </p>
      </div>
    );
  }

  const cleanLabel = (id?: string | null) => {
    if (!id) return null;
    return id.replace(/^node-/, '');
  };

  const humanizeExplanation = (text: string) => {
    let clean = text.replace(/node-([A-Za-z0-9_]+)/g, '$1');
    clean = clean.replace(/dist\['(.*?)'\]/g, 'tentative distance of $1');
    return clean;
  };

  const getStatusBadgeVariant = (): { status: 'idle' | 'running' | 'completed' | 'error'; label: string } => {
    switch (snapshot.status) {
      case 'found':
        return { status: 'completed', label: 'OPTIMAL PATH FOUND' };
      case 'unreachable':
        return { status: 'error', label: 'TARGET UNREACHABLE' };
      case 'invalid':
        return { status: 'error', label: 'INVALID GRAPH' };
      case 'running':
        return { status: 'running', label: 'IN PROGRESS' };
      default:
        return { status: 'idle', label: 'INITIALIZED' };
    }
  };

  const activeVertexLabel = cleanLabel(snapshot.currentNode);
  const edgeSourceLabel = cleanLabel(snapshot.currentEdge?.source);
  const edgeTargetLabel = cleanLabel(snapshot.currentEdge?.target);
  const statusInfo = getStatusBadgeVariant();

  return (
    <div className="space-y-4 text-xs">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <span
          className="font-mono text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          Step {currentStepIndex + 1} of {totalSteps}
        </span>
        <StatusBadge status={statusInfo.status} label={statusInfo.label} />
      </div>

      {/* Primary Narrative Explanation */}
      <div
        className="p-4 rounded-xl border text-xs sm:text-sm leading-relaxed"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border-strong)',
          color: 'var(--text-primary)',
        }}
      >
        <p>{humanizeExplanation(snapshot.explanation)}</p>
      </div>

      {/* Definition Rows for Current State */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between py-2 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Current vertex</span>
          <span
            className="font-semibold text-xs"
            style={{ color: activeVertexLabel ? 'var(--state-current, #D97706)' : 'var(--text-muted)' }}
          >
            {activeVertexLabel ? `Vertex ${activeVertexLabel}` : 'None'}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Current edge inspected</span>
          <span
            className="font-mono font-semibold text-xs"
            style={{ color: edgeSourceLabel ? 'var(--primary-action)' : 'var(--text-muted)' }}
          >
            {edgeSourceLabel && edgeTargetLabel ? `(${edgeSourceLabel}, ${edgeTargetLabel})` : 'None'}
          </span>
        </div>
      </div>

      {/* Traversal Order Log */}
      {snapshot.traversalOrder.length > 0 && (
        <div className="pt-2">
          <div
            className="text-xs font-semibold mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Exploration Sequence ({snapshot.traversalOrder.length} vertices)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {snapshot.traversalOrder.map((nodeId, idx) => (
              <span
                key={`${nodeId}-${idx}`}
                className="px-2 py-0.5 text-xs font-mono font-semibold rounded border"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {cleanLabel(nodeId)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
