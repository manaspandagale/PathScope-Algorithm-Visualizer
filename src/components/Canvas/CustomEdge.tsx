import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import type { GraphEdgeData } from '../../types/graph';

interface CustomEdgeProps extends EdgeProps {
  data?: GraphEdgeData;
}

export const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
}: CustomEdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const weight = data?.weight ?? 1;
  const state = data?.state || 'default';

  let strokeColor = 'var(--border-strong)';
  let strokeWidth = 2;
  let strokeDasharray = '';
  let opacity = 0.85;

  if (state === 'path') {
    strokeColor = 'var(--state-path, #15803D)';
    strokeWidth = 3.5;
    opacity = 1;
  } else if (state === 'current') {
    strokeColor = 'var(--state-current, #D97706)';
    strokeWidth = 3;
    strokeDasharray = '6 4';
    opacity = 1;
  } else if (state === 'visited') {
    strokeColor = 'var(--border-strong)';
    strokeWidth = 2;
    opacity = 0.55;
  } else if (data?.state === 'default') {
    strokeColor = 'var(--border)';
    opacity = 0.65;
  }

  if (selected) {
    strokeColor = 'var(--primary-action)';
    strokeWidth = 3;
    opacity = 1;
  }

  const handleWeightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.dispatchEvent(
      new CustomEvent('open-edge-weight-modal', {
        detail: { edgeId: id, currentWeight: weight },
      })
    );
  };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
          opacity,
          transition: 'stroke 0.2s, stroke-width 0.2s, opacity 0.2s',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan select-none"
        >
          <button
            type="button"
            onClick={handleWeightClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleWeightClick(e as unknown as React.MouseEvent);
              }
            }}
            title="Click to edit edge weight"
            aria-label={`Edge weight ${weight}. Click to edit.`}
            className={`
              px-2.5 py-1 text-xs font-mono font-semibold rounded-md border transition-all duration-150 cursor-pointer shadow-xs
              hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]
            `}
            style={{
              backgroundColor: state === 'path'
                ? 'var(--primary-subtle)'
                : state === 'current'
                ? 'var(--warning-subtle)'
                : 'var(--surface-elevated)',
              borderColor: state === 'path'
                ? 'var(--state-path, #15803D)'
                : state === 'current'
                ? 'var(--state-current, #D97706)'
                : 'var(--border-strong)',
              color: state === 'path'
                ? 'var(--state-path, #15803D)'
                : state === 'current'
                ? 'var(--state-current, #D97706)'
                : 'var(--text-primary)',
            }}
          >
            {weight}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';
