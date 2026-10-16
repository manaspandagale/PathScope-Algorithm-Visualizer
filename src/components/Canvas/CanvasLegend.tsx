import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export const CanvasLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="absolute top-4 left-4 z-10 rounded-xl border border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-lg text-xs text-slate-300 transition-all duration-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 w-full text-left font-medium text-slate-200 hover:text-white cursor-pointer select-none"
      >
        <Info className="w-3.5 h-3.5 text-blue-400" />
        <span>Canvas Legend</span>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 ml-auto text-slate-400" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 ml-auto text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            <span>Source Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span>Target Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400/50" />
            <span>Current / Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span>In Queue / Stack / PQ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-500" />
            <span>Visited / Settled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30" />
            <span>Shortest Path</span>
          </div>
        </div>
      )}
    </div>
  );
};
