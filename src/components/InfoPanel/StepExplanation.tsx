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
    if (!id) return '';
    return id.replace(/^node-/, '');
  };

  const humanizeExplanation = (text: string) => {
    let clean = text.replace(/node-([A-Za-z0-9_]+)/g, '$1');
    clean = clean.replace(/dist\['(.*?)'\]/g, 'tentative distance of $1');
    return clean;
  };

  const formatDist = (val?: number | null) => {
    if (val === null || val === undefined || val >= 1e8) return '∞';
    return String(val);
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

  const isBfs = snapshot.dataStructure.type === 'queue';
  const activeVertexLabel = cleanLabel(snapshot.activeVertex || snapshot.currentNode);
  const edgeSourceLabel = cleanLabel(snapshot.currentEdge?.source);
  const edgeTargetLabel = cleanLabel(snapshot.currentEdge?.target);
  const statusInfo = getStatusBadgeVariant();

  // Mathematical details for the "Current decision" card
  const u = cleanLabel(snapshot.currentNode);
  const v = cleanLabel(snapshot.activeVertex || snapshot.currentEdge?.target);
  const uDist = snapshot.distances[snapshot.currentNode ?? ''];
  const w = snapshot.edgeWeight;
  const candidate = snapshot.candidateDistance;
  const prevDist = snapshot.previousDistance;
  const updated = snapshot.distanceUpdated;

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

      {/* COMPACT CURRENT DECISION CARD */}
      <div
        className="p-3.5 rounded-lg border space-y-2"
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Current decision
          </span>
          <span
            className="font-mono text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--primary-action)',
            }}
          >
            {snapshot.operation}
          </span>
        </div>

        {!isBfs ? (
          // Dijkstra Decision Arithmetic
          <div className="space-y-1.5 text-xs font-mono">
            {snapshot.operation === 'relax-edge' || snapshot.operation === 'skip-edge' ? (
              <>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>d({u}) + w({u},{v}) = candidate:</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    {formatDist(uDist)} + {w ?? 0} = {formatDist(candidate)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>Comparison vs current d({v}):</span>
                  <span className="font-semibold">
                    {formatDist(candidate)} {updated ? '<' : '≥'} {formatDist(prevDist)}
                  </span>
                </div>
                <div
                  className="pt-1 mt-1 border-t flex items-center justify-between text-xs font-semibold"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>Decision:</span>
                  <span style={{ color: updated ? 'var(--state-path, #15803D)' : 'var(--text-muted)' }}>
                    {updated ? `Update distance of ${v}: ${formatDist(prevDist)} → ${formatDist(candidate)}` : `Keep existing distance of ${v} (${formatDist(prevDist)})`}
                  </span>
                </div>
              </>
            ) : snapshot.operation === 'skip-stale-entry' ? (
              <div className="text-[11px] text-[var(--state-current, #D97706)]">
                Vertex {activeVertexLabel} is already settled at optimal distance {formatDist(prevDist ?? uDist)}. Skip stale entry ({formatDist(candidate)}).
              </div>
            ) : snapshot.operation === 'extract-min' ? (
              <div className="text-[11px] text-[var(--text-primary)]">
                Extracted vertex {activeVertexLabel} with confirmed minimum distance {formatDist(uDist)}. Settle vertex.
              </div>
            ) : (
              <div className="text-[11px] text-[var(--text-secondary)]">
                Operation: {snapshot.operation}. Frontier updated.
              </div>
            )}
          </div>
        ) : (
          // BFS Decision Details
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span style={{ color: 'var(--text-secondary)' }}>Current level:</span>
              <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                Level {snapshot.bfsLevel ?? 0}
              </span>
            </div>
            {snapshot.operation === 'enqueue' || snapshot.operation === 'skip-edge' ? (
              <>
                <div className="flex items-center justify-between text-[11px]">
                  <span style={{ color: 'var(--text-secondary)' }}>Neighbor inspected:</span>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    Vertex {v}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span style={{ color: 'var(--text-secondary)' }}>Visited status:</span>
                  <span className="font-semibold" style={{ color: updated ? 'var(--state-path, #15803D)' : 'var(--text-muted)' }}>
                    {updated ? 'Unvisited' : 'Already visited'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span style={{ color: 'var(--text-secondary)' }}>Decision:</span>
                  <span className="font-semibold" style={{ color: updated ? 'var(--primary-action)' : 'var(--text-muted)' }}>
                    {updated ? 'Enqueue into FIFO rear' : 'Skip edge'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span style={{ color: 'var(--text-secondary)' }}>Assigned hop distance:</span>
                  <span className="font-mono font-semibold" style={{ color: 'var(--primary-action)' }}>
                    {formatDist(snapshot.updatedDistance ?? candidate)} hops
                  </span>
                </div>
              </>
            ) : snapshot.operation === 'dequeue' ? (
              <div className="text-[11px] text-[var(--text-secondary)]">
                Dequeued vertex {activeVertexLabel} from FIFO queue front to inspect its unvisited neighbors.
              </div>
            ) : (
              <div className="text-[11px] text-[var(--text-secondary)]">
                Operation: {snapshot.operation}. Queue ready.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Definition Rows for Current State */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between py-2 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Current active vertex</span>
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
            {edgeSourceLabel && edgeTargetLabel ? `(${edgeSourceLabel} ↔ ${edgeTargetLabel})` : 'None'}
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
                Vertex {cleanLabel(nodeId)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
