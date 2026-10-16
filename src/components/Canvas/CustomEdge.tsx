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
  let strokeWidth = 1.75;
  let strokeDasharray = '';

  if (state === 'path') {
    strokeColor = 'var(--success)';
    strokeWidth = 3;
  } else if (state === 'current') {
    strokeColor = 'var(--active-state)';
    strokeWidth = 2.5;
    strokeDasharray = '5 5';
  } else if (state === 'visited') {
    strokeColor = 'var(--border-strong)';
    strokeWidth = 2;
  }

  if (selected) {
    strokeColor = 'var(--primary-action)';
    strokeWidth = 2.5;
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
          transition: 'stroke 0.15s, stroke-width 0.15s',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button
            type="button"
            onClick={handleWeightClick}
            title="Click to edit weight"
            aria-label={`Edge weight ${weight}. Click to edit.`}
            className="px-2 py-0.5 text-xs font-mono font-medium rounded border transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
            style={{
              backgroundColor: 'var(--surface-elevated)',
              borderColor: state === 'path'
                ? 'var(--success)'
                : state === 'current'
                ? 'var(--active-state)'
                : 'var(--border)',
              color: state === 'path'
                ? 'var(--success)'
                : state === 'current'
                ? 'var(--active-state)'
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
