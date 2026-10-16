import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const CanvasLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute top-4 left-4 z-10">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open graph legend"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium shadow-sm transition-colors cursor-pointer"
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
          className="p-3.5 rounded-md border text-xs shadow-md space-y-2 w-64"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
          }}
        >
          <div className="flex items-center justify-between pb-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
            <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
              Node & Edge States
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
                className="w-2.5 h-2.5 rounded-sm border"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--success)',
                  borderWidth: '2px',
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm border"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--error)',
                  borderWidth: '2px',
                }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Destination</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: 'var(--active-state)' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm border border-dashed"
                style={{ borderColor: 'var(--primary-action)' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Frontier</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm border"
                style={{ borderColor: 'var(--border-strong)' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm"
                style={{ backgroundColor: 'var(--success)' }}
              />
              <span style={{ color: 'var(--text-secondary)' }}>Shortest path</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasLegend;
