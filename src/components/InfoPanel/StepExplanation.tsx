import React from 'react';
import type { StepSnapshot } from '../../types/graph';
import { AlertCircle, CheckCircle2, PlayCircle } from 'lucide-react';

interface StepExplanationProps {
  snapshot: StepSnapshot | null;
  currentStepIndex: number;
  totalSteps: number;
}

export const StepExplanation: React.FC<StepExplanationProps> = ({
  snapshot,
  currentStepIndex,
  totalSteps,
}) => {
  if (!snapshot) {
    return (
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 text-xs text-center">
        Select source and destination, then click Play or Next Step to begin execution.
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (snapshot.status) {
      case 'found':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Path Found
          </span>
        );
      case 'unreachable':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            Unreachable
          </span>
        );
      case 'running':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <PlayCircle className="w-3 h-3 text-blue-400" />
            Exploring
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
            Ready
          </span>
        );
    }
  };

  return (
    <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-200">
            Step {currentStepIndex + 1}
            <span className="text-slate-500 font-normal"> / {totalSteps}</span>
          </span>
        </div>
        {getStatusBadge()}
      </div>

      <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
        {snapshot.explanation}
      </p>

      {/* Traversal sequence */}
      {snapshot.traversalOrder.length > 0 && (
        <div className="pt-1">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1">
            Traversal Order:
          </div>
          <div className="flex flex-wrap gap-1">
            {snapshot.traversalOrder.map((nodeId, idx) => (
              <span
                key={`${nodeId}-${idx}`}
                className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700/60"
              >
                {nodeId}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
