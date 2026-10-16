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
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span
          className="font-semibold text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {metadata.name} Procedure
        </span>
        {activeLine && (
          <span
            className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold border"
            style={{
              backgroundColor: 'var(--primary-subtle)',
              borderColor: 'var(--primary-action)',
              color: 'var(--primary-action)',
            }}
          >
            Line {activeLine}
          </span>
        )}
      </div>

      <div
        className="rounded-xl border p-3 font-mono text-xs overflow-x-auto shadow-xs"
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="space-y-1 min-w-max">
          {metadata.pseudocode.map((line) => {
            const isActive = line.line === activeLine;

            return (
              <div
                key={line.line}
                className="flex items-center gap-3 px-2 py-1 rounded transition-colors"
                style={{
                  backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary-action)' : '3px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span
                  className="w-5 text-right text-[11px] select-none shrink-0 font-mono"
                  style={{ color: isActive ? 'var(--primary-action)' : 'var(--text-muted)' }}
                >
                  {line.line}
                </span>
                <span
                  style={{ paddingLeft: `${line.indent * 16}px` }}
                  className="whitespace-pre text-[12.5px]"
                >
                  {line.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
