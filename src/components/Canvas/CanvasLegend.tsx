import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

export const CanvasLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div
      className="absolute top-4 left-4 z-10 rounded-md border text-xs shadow-sm transition-all"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderColor: 'var(--border-strong)',
        color: 'var(--text-primary)',
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-label="Toggle Canvas Legend"
        className="flex items-center gap-2 px-3 py-2 w-full text-left font-semibold cursor-pointer select-none"
      >
        <Info className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
        <span>Canvas Legend</span>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 ml-auto" style={{ color: 'var(--text-muted)' }} />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 ml-auto" style={{ color: 'var(--text-muted)' }} />
        )}
      </button>

      {isExpanded && (
        <div
          className="px-3 pb-3 pt-2 border-t grid grid-cols-2 gap-x-4 gap-y-2 text-xs"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm border"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--success)',
                borderWidth: '2px',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Source (S)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm border"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--danger)',
                borderWidth: '2px',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Target (T)</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm border"
              style={{
                backgroundColor: 'var(--active-step)',
                borderColor: 'var(--active-step)',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Active Vertex</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm border border-dashed"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--accent)',
                borderWidth: '2px',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Frontier / In-Queue</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm border"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'var(--secondary-accent)',
                borderWidth: '2px',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Visited / Settled</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-sm border"
              style={{
                backgroundColor: 'var(--success)',
                borderColor: 'var(--success)',
              }}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Optimal Path</span>
          </div>
        </div>
      )}
    </div>
  );
};
