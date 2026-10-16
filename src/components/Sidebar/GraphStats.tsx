import React from 'react';

interface GraphStatsProps {
  nodeCount: number;
  edgeCount: number;
  isDirected?: boolean;
}

export const GraphStats: React.FC<GraphStatsProps> = ({
  nodeCount,
  edgeCount,
  isDirected = false,
}) => {
  return (
    <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Graph Properties
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between items-center px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-400">Vertices |V|</span>
          <span className="font-mono font-bold text-slate-200">{nodeCount}</span>
        </div>
        <div className="flex justify-between items-center px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
          <span className="text-slate-400">Edges |E|</span>
          <span className="font-mono font-bold text-slate-200">{edgeCount}</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
        <span>Graph Type:</span>
        <span className="font-medium text-slate-300">
          {isDirected ? 'Directed' : 'Undirected'}, Weighted (w ≥ 0)
        </span>
      </div>
    </div>
  );
};
