import React from 'react';
import type { AlgorithmMetadata } from '../../types/graph';

interface PseudocodeViewerProps {
  metadata: AlgorithmMetadata;
  activeLine?: number;
}

export const PseudocodeViewer: React.FC<PseudocodeViewerProps> = ({
  metadata,
  activeLine,
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs overflow-x-auto shadow-inner">
      <div className="text-[10px] uppercase font-semibold text-slate-500 mb-2 tracking-wider flex items-center justify-between">
        <span>Pseudocode Execution</span>
        {activeLine && (
          <span className="text-amber-400 font-bold">Line {activeLine}</span>
        )}
      </div>

      <div className="space-y-0.5">
        {metadata.pseudocode.map((line) => {
          const isActive = line.line === activeLine;

          return (
            <div
              key={line.line}
              className={`flex items-center gap-2 px-2 py-1 rounded transition-colors duration-150 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-200 border-l-2 border-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <span className="w-5 text-right text-[10px] text-slate-600 select-none">
                {line.line}
              </span>
              <span
                style={{ paddingLeft: `${line.indent * 14}px` }}
                className="whitespace-pre"
              >
                {line.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
