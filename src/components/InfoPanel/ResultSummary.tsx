import React from 'react';
import type { StepSnapshot, AlgorithmType } from '../../types/graph';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface ResultSummaryProps {
  snapshot: StepSnapshot | null;
  algorithm: AlgorithmType;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  snapshot,
  algorithm,
}) => {
  if (!snapshot || (snapshot.status !== 'found' && snapshot.status !== 'unreachable')) {
    return null;
  }

  if (snapshot.status === 'unreachable') {
    return (
      <div className="p-3.5 rounded-xl border border-rose-900/60 bg-rose-950/30 text-rose-200 text-xs space-y-1.5 shadow-md">
        <div className="flex items-center gap-1.5 font-bold text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Destination Unreachable</span>
        </div>
        <p className="text-[11px] text-rose-300/80 leading-normal">
          No connecting path exists between the chosen vertices. The graph contains multiple disconnected components.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-xl border border-emerald-900/60 bg-emerald-950/30 text-slate-200 text-xs space-y-2.5 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>Path Discovered</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-300 border border-emerald-700/50">
          {algorithm === 'dijkstra'
            ? 'Optimal Weight'
            : algorithm === 'bfs'
            ? 'Shortest Hops'
            : 'Traversal Path'}
        </span>
      </div>

      {/* Path sequence */}
      <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
        {snapshot.pathNodes.map((node, index) => (
          <React.Fragment key={`${node}-${index}`}>
            <span className="px-2 py-0.5 font-mono font-bold text-xs rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              {node}
            </span>
            {index < snapshot.pathNodes.length - 1 && (
              <ArrowRight className="w-3 h-3 text-slate-500" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Cost & Hops Grid */}
      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-400">Total Weight Cost</div>
          <div className="font-mono font-bold text-base text-emerald-300">
            {snapshot.totalCost ?? 0}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-slate-400">Hop Count (Edges)</div>
          <div className="font-mono font-bold text-base text-slate-100">
            {snapshot.hopCount ?? Math.max(0, snapshot.pathNodes.length - 1)}
          </div>
        </div>
      </div>

      {algorithm === 'dfs' && (
        <p className="text-[10px] text-amber-300/80 bg-amber-950/40 p-2 rounded border border-amber-800/40">
          ⚠️ Reminder: DFS does NOT guarantee the shortest path!
        </p>
      )}
    </div>
  );
};
