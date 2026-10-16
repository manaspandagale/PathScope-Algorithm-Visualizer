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

  let strokeColor = '#64748b'; // slate-500 for crisp visibility
  let strokeWidth = 2.5;
  let strokeDasharray = '';
  let filter = '';

  if (state === 'path') {
    strokeColor = '#10b981'; // emerald-500
    strokeWidth = 4.5;
    filter = 'drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.8))';
  } else if (state === 'current') {
    strokeColor = '#f59e0b'; // amber-500
    strokeWidth = 3.5;
    strokeDasharray = '6 6';
    filter = 'drop-shadow(0px 0px 6px rgba(245, 158, 11, 0.7))';
  } else if (state === 'visited') {
    strokeColor = '#06b6d4'; // cyan-500
    strokeWidth = 3;
    filter = 'drop-shadow(0px 0px 4px rgba(6, 182, 212, 0.4))';
  }

  if (selected) {
    strokeColor = '#3b82f6'; // blue-500
    strokeWidth = 3.5;
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
          filter,
          transition: 'stroke 0.25s, stroke-width 0.25s',
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
            title="Click to edit edge weight"
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border-2 shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer ${
              state === 'path'
                ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500/50'
                : state === 'current'
                ? 'bg-amber-950 border-amber-400 text-amber-200 ring-2 ring-amber-500/50'
                : state === 'visited'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-600 text-slate-100 hover:border-blue-400'
            }`}
          >
            {weight}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';
