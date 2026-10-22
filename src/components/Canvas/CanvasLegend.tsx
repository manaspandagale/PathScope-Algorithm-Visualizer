import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const CanvasLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-10 select-none">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open graph state legend"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium shadow-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <Info className="w-3.5 h-3.5" style={{ color: 'var(--primary-action)' }} />
          <span>Legend</span>
        </button>
      ) : (
        <div
          className="p-3.5 rounded-xl border text-xs shadow-lg space-y-3 w-72 animate-in fade-in duration-150"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
          }}
        >
          <div className="flex items-center justify-between pb-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="font-semibold text-xs tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Graph & Algorithm Legend
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close legend"
              className="p-1 rounded hover:bg-[var(--background-secondary)] cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Vertex States */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Vertex States
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--state-start, #1E4D3A)',
                    color: 'var(--state-start, #1E4D3A)',
                  }}
                >
                  S
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>Source</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center text-[8px] font-bold"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--state-target, #A33B2E)',
                    color: 'var(--state-target, #A33B2E)',
                  }}
                >
                  D
                </span>
                <span style={{ color: 'var(--text-secondary)' }}>Destination</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border-[2.5px]"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--state-current, #D97706)',
                  }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Current</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 border-dashed"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--state-frontier, #2563EB)',
                  }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Frontier</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    borderColor: 'var(--border-strong)',
                  }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Settled / Visited</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full border-2"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: 'var(--state-path, #15803D)',
                  }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Final path</span>
              </div>
            </div>
          </div>

          {/* Edge States */}
          <div className="space-y-1.5 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Edge States
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-0 border-t-2 border-dashed" style={{ borderColor: 'var(--state-current, #D97706)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Inspected edge</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-0.5 rounded" style={{ backgroundColor: 'var(--state-path, #15803D)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Relaxed / Final path edge</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
