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

  // Determine multi-channel state representations
  let borderColor = 'var(--border-strong)';
  let borderWidth = '1.5px';
  let borderStyle = 'solid';
  let backgroundColor = 'var(--surface)';
  let stateLabel = '';
  let pulseClass = '';

  if (state === 'current') {
    borderColor = 'var(--active-step)';
    borderWidth = '2.5px';
    stateLabel = 'ACTIVE';
    pulseClass = 'node-pulse-current';
    backgroundColor = 'var(--surface-elevated)';
  } else if (state === 'path') {
    borderColor = 'var(--success)';
    borderWidth = '3px';
    stateLabel = 'PATH';
    backgroundColor = 'var(--surface-elevated)';
  } else if (state === 'visited') {
    borderColor = 'var(--secondary-accent)';
    borderWidth = '2px';
    stateLabel = 'VISITED';
  } else if (state === 'frontier') {
    borderColor = 'var(--accent)';
    borderWidth = '2px';
    borderStyle = 'dashed';
    stateLabel = 'FRONTIER';
  } else if (isSource) {
    borderColor = 'var(--success)';
    borderWidth = '2.5px';
  } else if (isTarget) {
    borderColor = 'var(--danger)';
    borderWidth = '2.5px';
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
      className={`relative min-w-[84px] px-3.5 py-2.5 transition-all flex flex-col items-center justify-center select-none ${pulseClass}`}
    >
      {/* React Flow handles for edge connection */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !rounded-full !border-2 !cursor-crosshair"
        style={{
          backgroundColor: 'var(--accent)',
          borderColor: 'var(--surface)',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !rounded-full !border-2 !cursor-crosshair"
        style={{
          backgroundColor: 'var(--accent)',
          borderColor: 'var(--surface)',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !rounded-full !border-2 !cursor-crosshair"
        style={{
          backgroundColor: 'var(--accent)',
          borderColor: 'var(--surface)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !rounded-full !border-2 !cursor-crosshair"
        style={{
          backgroundColor: 'var(--accent)',
          borderColor: 'var(--surface)',
        }}
      />

      {/* Role badges: Source / Target */}
      {(isSource || isTarget) && (
        <span
          className="absolute -top-3 px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded uppercase border"
          style={{
            backgroundColor: isSource ? 'var(--success)' : 'var(--danger)',
            borderColor: isSource ? 'var(--success)' : 'var(--danger)',
            color: '#FFFFFF',
          }}
        >
          {isSource ? 'SOURCE' : 'TARGET'}
        </span>
      )}

      {/* Node label */}
      <span
        className="font-bold text-base tracking-tight font-mono"
        style={{ color: 'var(--text-primary)' }}
      >
        {nodeData.label || id}
      </span>

      {/* Accessible state label & distance badge */}
      <div className="flex items-center gap-1.5 mt-1">
        {stateLabel && !isSource && !isTarget && (
          <span
            className="px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider rounded border"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {stateLabel}
          </span>
        )}

        {distance !== undefined && distance !== null && (
          <div
            className="px-1.5 py-0.5 text-[11px] font-mono font-semibold rounded border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            d: {distance >= 1e8 ? '∞' : distance}
          </div>
        )}
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
