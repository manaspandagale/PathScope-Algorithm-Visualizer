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

  // Determine styles strictly satisfying all requirements:
  // 1. Dark node backgrounds with readable white/light text
  // 2. Clearly visible in dark & light mode
  // 3. Highlight source nodes in green
  // 4. Highlight destination nodes in red/pink
  // 5. Highlight currently active node in amber/yellow
  // 6. Highlight visited nodes in cyan/blue
  // 7. Highlight final shortest path in emerald green
  let containerStyles = 'bg-slate-900 border-slate-700 text-slate-100 shadow-lg';
  let badgeStyles = 'bg-slate-800 text-slate-200 border-slate-600';
  let pulseClass = '';

  if (state === 'current') {
    // Active node: vivid amber background, bright yellow/amber border & animated ring
    containerStyles = 'bg-amber-950 border-amber-400 text-amber-100 shadow-xl shadow-amber-500/50 ring-4 ring-amber-400/50';
    pulseClass = 'node-pulse-current';
  } else if (state === 'path') {
    // Shortest path node: rich emerald background, glowing emerald border & ring
    containerStyles = 'bg-emerald-950 border-emerald-400 text-emerald-100 shadow-xl shadow-emerald-500/50 ring-4 ring-emerald-400/40';
  } else if (state === 'visited') {
    // Visited/settled node: dark cyan background, cyan border & subtle glow
    containerStyles = 'bg-cyan-950 border-cyan-400 text-cyan-100 shadow-md shadow-cyan-500/30';
  } else if (state === 'frontier') {
    // Frontier node (in Queue / Stack / Min-Heap): dark indigo background, indigo border & ring
    containerStyles = 'bg-indigo-950 border-indigo-400 text-indigo-100 shadow-md ring-2 ring-indigo-400/50';
  } else if (isSource) {
    // Source node: dark green background, solid green border
    containerStyles = 'bg-emerald-950 border-emerald-500 text-emerald-100 shadow-md shadow-emerald-500/30';
  } else if (isTarget) {
    // Target node: dark rose background, solid rose border
    containerStyles = 'bg-rose-950 border-rose-500 text-rose-100 shadow-md shadow-rose-500/30';
  }

  if (isSource) {
    badgeStyles = 'bg-emerald-500 text-slate-950 font-black border-emerald-300';
  } else if (isTarget) {
    badgeStyles = 'bg-rose-500 text-white font-black border-rose-300';
  }

  return (
    <div
      style={{
        backgroundColor: state === 'current'
          ? '#451a03' // amber-950
          : state === 'path'
          ? '#022c22' // emerald-950
          : state === 'visited'
          ? '#083344' // cyan-950
          : state === 'frontier'
          ? '#1e1b4b' // indigo-950
          : isSource
          ? '#022c22' // emerald-950
          : isTarget
          ? '#4c0519' // rose-950
          : '#0f172a', // slate-900
      }}
      className={`relative min-w-[76px] px-4 py-2.5 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center select-none ${containerStyles} ${pulseClass} ${
        selected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950 scale-105' : ''
      }`}
    >
      {/* React Flow handles for edge connection */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3.5 !h-3.5 !bg-blue-400 !border-2 !border-slate-900 hover:!bg-blue-300 !cursor-crosshair"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3.5 !h-3.5 !bg-blue-400 !border-2 !border-slate-900 hover:!bg-blue-300 !cursor-crosshair"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3.5 !h-3.5 !bg-blue-400 !border-2 !border-slate-900 hover:!bg-blue-300 !cursor-crosshair"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3.5 !h-3.5 !bg-blue-400 !border-2 !border-slate-900 hover:!bg-blue-300 !cursor-crosshair"
      />

      {/* Role badges: Source / Target */}
      {(isSource || isTarget) && (
        <span
          className={`absolute -top-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md border ${badgeStyles}`}
        >
          {isSource ? 'SOURCE' : 'TARGET'}
        </span>
      )}

      {/* Node label */}
      <span className="font-extrabold text-base tracking-tight font-mono text-white drop-shadow">
        {nodeData.label || id}
      </span>

      {/* Distance chip (for Dijkstra or BFS) */}
      {distance !== undefined && distance !== null && (
        <div className="mt-1 px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-slate-950/90 border border-slate-700 text-slate-200 shadow-inner">
          d: {distance === Infinity ? '∞' : distance}
        </div>
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
