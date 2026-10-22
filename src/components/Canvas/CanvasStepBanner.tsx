import React, { useState } from 'react';
import type { StepSnapshot, AlgorithmType } from '../../types/graph';
import {
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CanvasStepBannerProps {
  snapshot: StepSnapshot | null;
  algorithm: AlgorithmType;
  currentStepIndex: number;
  totalSteps: number;
  onNext?: () => void;
  onPrev?: () => void;
}

export const CanvasStepBanner: React.FC<CanvasStepBannerProps> = ({
  snapshot,
  algorithm,
  currentStepIndex,
  totalSteps,
  onNext,
  onPrev,
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  if (!snapshot || totalSteps === 0) return null;

  const operation = snapshot.operation || 'running';
  const cleanLabel = (id?: string | null) => (id ? id.replace(/^node-/, '') : '');

  // Operation badge colors and labels
  let badgeLabel = 'STEP';
  let badgeBg = 'var(--surface)';
  let badgeColor = 'var(--text-secondary)';
  let badgeBorder = 'var(--border)';

  if (operation === 'initialize') {
    badgeLabel = 'INITIALIZE';
    badgeBg = 'var(--primary-subtle)';
    badgeColor = 'var(--primary-action)';
    badgeBorder = 'var(--primary-action)';
  } else if (operation === 'extract-min' || operation === 'dequeue') {
    badgeLabel = algorithm === 'dijkstra' ? 'EXTRACT MIN' : 'DEQUEUE';
    badgeBg = 'var(--warning-subtle)';
    badgeColor = 'var(--state-current, #D97706)';
    badgeBorder = 'var(--state-current, #D97706)';
  } else if (operation === 'inspect-edge') {
    badgeLabel = 'INSPECT NEIGHBOR';
    badgeBg = 'var(--surface-elevated)';
    badgeColor = 'var(--text-primary)';
    badgeBorder = 'var(--border-strong)';
  } else if (operation === 'relax-edge') {
    badgeLabel = 'RELAX EDGE';
    badgeBg = 'var(--primary-subtle)';
    badgeColor = 'var(--state-path, #15803D)';
    badgeBorder = 'var(--state-path, #15803D)';
  } else if (operation === 'enqueue') {
    badgeLabel = 'ENQUEUE';
    badgeBg = 'var(--primary-subtle)';
    badgeColor = 'var(--primary-action)';
    badgeBorder = 'var(--primary-action)';
  } else if (operation === 'skip-edge' || operation === 'skip-stale-entry') {
    badgeLabel = operation === 'skip-stale-entry' ? 'SKIP STALE HEAP ENTRY' : 'SKIP NEIGHBOR';
    badgeBg = 'var(--danger-subtle)';
    badgeColor = 'var(--text-muted)';
    badgeBorder = 'var(--border)';
  } else if (operation === 'reconstruct-path') {
    badgeLabel = 'TRACEBACK PATH';
    badgeBg = 'var(--primary-subtle)';
    badgeColor = 'var(--state-path, #15803D)';
    badgeBorder = 'var(--state-path, #15803D)';
  } else if (operation === 'complete' || snapshot.status === 'found') {
    badgeLabel = 'OPTIMAL PATH FOUND';
    badgeBg = 'var(--primary-subtle)';
    badgeColor = 'var(--state-path, #15803D)';
    badgeBorder = 'var(--state-path, #15803D)';
  } else if (operation === 'unreachable' || snapshot.status === 'unreachable') {
    badgeLabel = 'UNREACHABLE';
    badgeBg = 'var(--danger-subtle)';
    badgeColor = 'var(--danger)';
    badgeBorder = 'var(--danger)';
  }

  const activeVertexLabel = cleanLabel(snapshot.activeVertex || snapshot.currentNode);

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-xl transition-all duration-200 select-none shadow-md rounded-xl border backdrop-blur-md"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderColor: 'var(--border-strong)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b text-xs" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          {/* Step Counter */}
          <span className="font-mono text-[11px] font-semibold text-[var(--text-muted)]">
            Step {currentStepIndex + 1}/{totalSteps}
          </span>

          {/* Operation Badge */}
          <span
            className="px-2 py-0.5 rounded font-mono text-[10.5px] font-bold border tracking-wide uppercase"
            style={{
              backgroundColor: badgeBg,
              borderColor: badgeBorder,
              color: badgeColor,
            }}
          >
            {badgeLabel}
          </span>

          {/* Active Vertex Indicator */}
          {activeVertexLabel && (
            <span
              className="px-1.5 py-0.5 rounded text-[11px] font-medium border hidden sm:inline-flex items-center gap-1"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <span>Vertex:</span>
              <strong className="text-[var(--text-primary)]">{activeVertexLabel}</strong>
            </span>
          )}
        </div>

        {/* Right Action Icons: Step and Minimize */}
        <div className="flex items-center gap-1">
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              disabled={currentStepIndex <= 0}
              title="Reverse banner step"
              aria-label="Reverse banner step"
              className="p-1 rounded text-xs hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              ←
            </button>
          )}

          {onNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={currentStepIndex >= totalSteps - 1}
              title="Advance banner step"
              aria-label="Advance banner step"
              className="p-1 rounded text-xs hover:bg-[var(--background-secondary)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer font-bold"
            >
              →
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMinimized((prev) => !prev)}
            title={isMinimized ? 'Expand explanation banner' : 'Minimize explanation banner'}
            aria-label={isMinimized ? 'Expand explanation banner' : 'Minimize explanation banner'}
            className="p-1 rounded text-xs hover:bg-[var(--background-secondary)] cursor-pointer ml-1"
          >
            {isMinimized ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Educational Explanation */}
      {!isMinimized && (
        <div className="p-3 text-xs space-y-2">
          {/* Main Plain English Explanation */}
          <p className="leading-relaxed font-medium text-[var(--text-primary)] text-xs sm:text-[13px]">
            {snapshot.explanation}
          </p>

          {/* Arithmetic Breakdown for Dijkstra */}
          {algorithm === 'dijkstra' &&
            snapshot.candidateDistance !== undefined &&
            snapshot.candidateDistance !== null &&
            snapshot.previousDistance !== undefined && (
              <div
                className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg border font-mono text-[11.5px]"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--text-muted)]">Math:</span>
                  <span className="font-semibold text-[var(--text-primary)]">
                    d({cleanLabel(snapshot.currentNode)}) + w = {snapshot.candidateDistance}
                  </span>
                  <span className="text-[var(--text-muted)]">vs current d({cleanLabel(snapshot.activeVertex)}):</span>
                  <span>{snapshot.previousDistance === null || snapshot.previousDistance >= 1e8 ? '∞' : snapshot.previousDistance}</span>
                </div>

                <div className="flex items-center gap-1">
                  {snapshot.distanceUpdated ? (
                    <span className="px-1.5 py-0.5 rounded font-bold text-[10.5px] bg-[var(--primary-subtle)] text-[var(--state-path,#15803D)] border border-[var(--state-path,#15803D)]">
                      Updated: {snapshot.previousDistance === null || snapshot.previousDistance >= 1e8 ? '∞' : snapshot.previousDistance} → {snapshot.candidateDistance}
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10.5px] bg-[var(--background-secondary)] text-[var(--text-muted)] border border-[var(--border)]">
                      Kept existing distance
                    </span>
                  )}
                </div>
              </div>
            )}

          {/* Hop Level Indicator for BFS */}
          {algorithm === 'bfs' && snapshot.bfsLevel !== undefined && snapshot.bfsLevel !== null && (
            <div
              className="flex items-center justify-between p-2 rounded-lg border font-mono text-[11px]"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[var(--text-muted)]">BFS Layer:</span>
                <span className="font-bold text-[var(--primary-action)]">Level {snapshot.bfsLevel}</span>
                <span className="text-[var(--text-muted)]">({snapshot.bfsLevel} hop{snapshot.bfsLevel === 1 ? '' : 's'} from start)</span>
              </div>
              <span className="text-[var(--text-muted)] italic text-[10.5px]">
                FIFO Queue Processing
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
