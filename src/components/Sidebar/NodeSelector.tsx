import React from 'react';
import type { Node } from '@xyflow/react';
import type { GraphNodeData } from '../../types/graph';
import { ArrowLeftRight, Flag, Target } from 'lucide-react';

interface NodeSelectorProps {
  nodes: Node<GraphNodeData>[];
  sourceId: string;
  targetId: string;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({
  nodes,
  sourceId,
  targetId,
  setSourceId,
  setTargetId,
}) => {
  const handleSwap = () => {
    const temp = sourceId;
    setSourceId(targetId);
    setTargetId(temp);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Source & Target Vertices
        </label>
        {nodes.length >= 2 && (
          <button
            onClick={handleSwap}
            title="Swap Source and Target"
            className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer"
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>Swap</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Source Picker */}
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Flag className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-slate-300">Source (Start)</span>
          </div>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono font-semibold text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {nodes.length === 0 && <option value="">No nodes</option>}
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.data.label || node.id}
              </option>
            ))}
          </select>
        </div>

        {/* Target Picker */}
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-medium text-slate-300">Destination</span>
          </div>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono font-semibold text-slate-100 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            {nodes.length === 0 && <option value="">No nodes</option>}
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.data.label || node.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sourceId && targetId && sourceId === targetId && (
        <p className="text-[11px] text-amber-400/90 bg-amber-950/30 border border-amber-800/50 rounded-lg p-2">
          Note: Source and Destination are the same vertex (trivial path of length 0).
        </p>
      )}
    </div>
  );
};
