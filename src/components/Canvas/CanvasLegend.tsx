import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const CanvasLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-10 select-none">
      {!isOpen ? (
        <button
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
          className="p-3.5 rounded-md border text-xs shadow-md space-y-2.5 w-64 animate-in fade-in duration-150"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
          }}
        >
          <div className="flex items-center justify-between pb-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
              Algorithm States
            </span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close legend"
              className="p-0.5 rounded hover:bg-[var(--background-secondary)] cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--state-start, #1E4D3A)',
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--state-target, #A33B2E)',
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'var(--state-current, #D97706)' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full border-2 border-dashed"
                style={{ borderColor: 'var(--state-frontier, #2563EB)' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Queue/Frontier</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'var(--state-visited, #0D9488)' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: 'var(--state-path, #15803D)' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Shortest path</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
