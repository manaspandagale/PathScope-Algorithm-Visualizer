import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { GraphNodeData } from '../../types/graph';

export const CustomNode = memo(({ id, data, selected }: NodeProps) => {
  const nodeData = data as unknown as GraphNodeData;
  const isSource = Boolean(nodeData.isSource);
  const isTarget = Boolean(nodeData.isTarget);
  const state = nodeData.state || 'default';
  const distance = nodeData.distance;

  // Clean accessible states
  let borderColor = 'var(--border-strong)';
  let borderWidth = '1.5px';
  let borderStyle = 'solid';
  let backgroundColor = 'var(--surface)';
  let stateTag = '';
  let pulseClass = '';

  if (state === 'current') {
    borderColor = 'var(--active-state)';
    borderWidth = '2px';
    stateTag = 'Current';
    pulseClass = 'node-pulse-current';
    backgroundColor = 'var(--surface-elevated)';
  } else if (state === 'path') {
    borderColor = 'var(--success)';
    borderWidth = '2.5px';
    stateTag = 'Path';
    backgroundColor = 'var(--surface-elevated)';
  } else if (state === 'frontier') {
    borderColor = 'var(--primary-action)';
    borderWidth = '1.5px';
    borderStyle = 'dashed';
    stateTag = 'Frontier';
  } else if (state === 'visited') {
    borderColor = 'var(--border-strong)';
    borderWidth = '1.5px';
    stateTag = 'Visited';
  } else if (isSource) {
    borderColor = 'var(--success)';
    borderWidth = '2px';
  } else if (isTarget) {
    borderColor = 'var(--error)';
    borderWidth = '2px';
  }

  return (
    <div
      style={{
        backgroundColor,
        borderColor,
        borderWidth,
        borderStyle,
        borderRadius: 'var(--radius-md)',
        color: 'var(--text-primary)',
        boxShadow: selected ? '0 0 0 2px var(--focus-ring)' : 'none',
      }}
      className={`relative min-w-[76px] px-3 py-2 transition-all flex flex-col items-center justify-center select-none ${pulseClass}`}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !rounded-full !border !cursor-crosshair"
        style={{
          backgroundColor: 'var(--primary-action)',
          borderColor: 'var(--surface)',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !rounded-full !border !cursor-crosshair"
        style={{
          backgroundColor: 'var(--primary-action)',
          borderColor: 'var(--surface)',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2.5 !h-2.5 !rounded-full !border !cursor-crosshair"
        style={{
          backgroundColor: 'var(--primary-action)',
          borderColor: 'var(--surface)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2.5 !h-2.5 !rounded-full !border !cursor-crosshair"
        style={{
          backgroundColor: 'var(--primary-action)',
          borderColor: 'var(--surface)',
        }}
      />

      {/* Start / Destination clean indicator */}
      {(isSource || isTarget) && (
        <span
          className="absolute -top-2.5 px-1.5 py-0.2 text-[10px] font-sans font-semibold tracking-wide rounded uppercase border"
          style={{
            backgroundColor: isSource ? 'var(--success)' : 'var(--error)',
            borderColor: isSource ? 'var(--success)' : 'var(--error)',
            color: '#FFFFFF',
          }}
        >
          {isSource ? 'Start' : 'Dest'}
        </span>
      )}

      {/* Node label in Inter Variable */}
      <span
        className="font-semibold text-base tracking-tight font-sans"
        style={{ color: 'var(--text-primary)' }}
      >
        {nodeData.label || id}
      </span>

      {/* Distance in JetBrains Mono Variable */}
      <div className="flex items-center gap-1 mt-0.5">
        {stateTag && !isSource && !isTarget && (
          <span
            className="px-1 py-0.2 text-[10px] font-sans font-medium rounded border"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {stateTag}
          </span>
        )}

        {distance !== undefined && distance !== null && (
          <span
            className="px-1 py-0.2 text-xs font-mono font-medium rounded border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            d: {distance >= 1e8 ? '∞' : distance}
          </span>
        )}
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
