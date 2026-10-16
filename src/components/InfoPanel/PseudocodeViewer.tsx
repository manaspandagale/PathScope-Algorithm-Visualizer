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
      <div className="flex items-center justify-between text-xs font-mono">
        <span
          className="font-bold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          {metadata.name} Pseudocode
        </span>
        {activeLine && (
          <span
            className="px-2 py-0.5 rounded font-bold border"
            style={{
              backgroundColor: 'var(--active-step-subtle)',
              borderColor: 'var(--active-step)',
              color: 'var(--active-step)',
            }}
          >
            Executing Line {activeLine}
          </span>
        )}
      </div>

      <div
        className="rounded-md border p-3 font-mono text-xs overflow-x-auto"
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border-strong)',
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
                  backgroundColor: isActive ? 'var(--active-step-subtle)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--active-step)' : '3px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span
                  className="w-5 text-right text-[11px] select-none shrink-0"
                  style={{ color: isActive ? 'var(--active-step)' : 'var(--text-muted)' }}
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
