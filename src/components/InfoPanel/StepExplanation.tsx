import React from 'react';
import type { StepSnapshot } from '../../types/graph';

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
        className="p-6 rounded-md border text-center space-y-1.5"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Ready to begin
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Use the playback controls below to start the visualizer and observe each step.
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
    clean = clean.replace(/dist\['(.*?)'\]/g, 'distance of $1');
    return clean;
  };

  const getStatusText = () => {
    switch (snapshot.status) {
      case 'found':
        return 'Shortest path found';
      case 'unreachable':
        return 'Target unreachable';
      case 'running':
        return 'In progress';
      default:
        return 'Initialized';
    }
  };

  const activeVertexLabel = cleanLabel(snapshot.currentNode);
  const edgeSourceLabel = cleanLabel(snapshot.currentEdge?.source);
  const edgeTargetLabel = cleanLabel(snapshot.currentEdge?.target);

  return (
    <div className="space-y-5 text-sm">
      {/* Step Header */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <span
          className="font-medium text-xs uppercase tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          Step {currentStepIndex + 1} of {totalSteps}
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded border"
          style={{
            backgroundColor: snapshot.status === 'found' ? 'var(--primary-subtle)' : 'var(--background)',
            borderColor: snapshot.status === 'found' ? 'var(--primary-action)' : 'var(--border)',
            color: snapshot.status === 'found' ? 'var(--primary-action)' : 'var(--text-secondary)',
          }}
        >
          {getStatusText()}
        </span>
      </div>

      {/* Primary Narrative Explanation */}
      <div
        className="p-4 rounded-md border text-sm leading-relaxed"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        <p>{humanizeExplanation(snapshot.explanation)}</p>
      </div>

      {/* Definition Rows for Current State */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between py-2 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Current vertex</span>
          <span className="font-medium" style={{ color: activeVertexLabel ? 'var(--active-step)' : 'var(--text-muted)' }}>
            {activeVertexLabel ? `Vertex ${activeVertexLabel}` : 'None'}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Current edge</span>
          <span className="font-mono font-medium" style={{ color: edgeSourceLabel ? 'var(--primary-action)' : 'var(--text-muted)' }}>
            {edgeSourceLabel && edgeTargetLabel ? `(${edgeSourceLabel}, ${edgeTargetLabel})` : 'None'}
          </span>
        </div>
      </div>

      {/* Traversal Order Log */}
      {snapshot.traversalOrder.length > 0 && (
        <div className="pt-2">
          <div
            className="text-xs font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Exploration order ({snapshot.traversalOrder.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {snapshot.traversalOrder.map((nodeId, idx) => (
              <span
                key={`${nodeId}-${idx}`}
                className="px-2 py-0.5 text-xs font-mono rounded border"
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
