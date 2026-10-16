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

  // Strict educational state language
  let borderColor = 'var(--border-strong)';
  let borderWidth = '2px';
  let borderStyle = 'solid';
  let backgroundColor = 'var(--surface)';
  let stateTag = '';
  let pulseClass = '';

  if (state === 'current') {
    borderColor = 'var(--state-current, #D97706)';
    borderWidth = '3px';
    stateTag = 'CURR';
    pulseClass = 'node-pulse-current';
    backgroundColor = 'var(--surface-elevated)';
  } else if (state === 'path') {
    borderColor = 'var(--state-path, #15803D)';
    borderWidth = '3.5px';
    stateTag = 'PATH';
    backgroundColor = 'var(--surface-elevated)';
  } else if (state === 'frontier') {
    borderColor = 'var(--state-frontier, #2563EB)';
    borderWidth = '2px';
    borderStyle = 'dashed';
    stateTag = 'QUEUE';
  } else if (state === 'visited') {
    borderColor = 'var(--state-visited, #0D9488)';
    borderWidth = '2px';
    stateTag = 'SEEN';
    backgroundColor = 'var(--background-secondary)';
  } else if (isSource) {
    borderColor = 'var(--state-start, #1E4D3A)';
    borderWidth = '3px';
  } else if (isTarget) {
    borderColor = 'var(--state-target, #A33B2E)';
    borderWidth = '3px';
  }

  return (
    <div
      style={{
        backgroundColor,
        borderColor,
        borderWidth,
        borderStyle,
        borderRadius: '50%',
        color: 'var(--text-primary)',
        boxShadow: selected
          ? '0 0 0 3px var(--focus-ring)'
          : '0 2px 6px rgba(0, 0, 0, 0.05)',
      }}
      className={`relative w-[54px] h-[54px] transition-all flex flex-col items-center justify-center select-none ${pulseClass}`}
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

      {/* Start / Destination tag badge above node */}
      {(isSource || isTarget) && (
        <span
          className="absolute -top-4 px-1.5 py-0.5 text-[11px] font-sans font-bold tracking-wider rounded border shadow-xs"
          style={{
            backgroundColor: isSource ? 'var(--state-start, #1E4D3A)' : 'var(--state-target, #A33B2E)',
            borderColor: isSource ? 'var(--state-start, #1E4D3A)' : 'var(--state-target, #A33B2E)',
            color: '#FFFFFF',
          }}
        >
          {isSource ? 'START' : 'DEST'}
        </span>
      )}

      {/* Main Node label (Strongest element) */}
      <span
        className="font-bold text-base tracking-tight font-sans leading-none"
        style={{ color: 'var(--text-primary)' }}
      >
        {nodeData.label || id}
      </span>

      {/* Distance tag badge below node */}
      {distance !== undefined && distance !== null && (
        <div
          className="absolute -bottom-4 px-1.5 py-0.5 rounded border text-[11px] font-mono font-semibold whitespace-nowrap shadow-xs"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border-strong)',
            color: distance === Infinity ? 'var(--text-muted)' : 'var(--text-primary)',
          }}
        >
          {distance === Infinity ? '∞' : distance}
        </div>
      )}

      {/* Transient Step state tag if not start/dest */}
      {stateTag && !isSource && !isTarget && distance === undefined && (
        <span
          className="absolute -bottom-3.5 px-1 py-0.2 text-[10px] font-sans font-semibold rounded border"
          style={{
            backgroundColor: 'var(--background-secondary)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          {stateTag}
        </span>
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
