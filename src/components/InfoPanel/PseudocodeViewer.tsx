import React, { useState } from 'react';
import type { AlgorithmMetadata } from '../../types/graph';
import { WrapText } from 'lucide-react';

interface PseudocodeViewerProps {
  metadata: AlgorithmMetadata;
  activeLine?: number;
}

export const PseudocodeViewer: React.FC<PseudocodeViewerProps> = ({
  metadata,
  activeLine,
}) => {
  const [wrapLines, setWrapLines] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span
          className="font-semibold text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          {metadata.name} Procedure
        </span>
        <div className="flex items-center gap-2">
          {/* Line Wrap Toggle */}
          <button
            type="button"
            onClick={() => setWrapLines((prev) => !prev)}
            title={wrapLines ? 'Switch to single-line view (scrollable)' : 'Wrap code lines'}
            aria-label={wrapLines ? 'Switch to single-line view (scrollable)' : 'Wrap code lines'}
            className="px-2 py-0.5 rounded border text-[11px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
            style={{
              backgroundColor: wrapLines ? 'var(--primary-subtle)' : 'var(--background)',
              borderColor: wrapLines ? 'var(--primary-action)' : 'var(--border)',
              color: wrapLines ? 'var(--primary-action)' : 'var(--text-secondary)',
            }}
          >
            <WrapText className="w-3 h-3" />
            <span>{wrapLines ? 'Wrapped' : 'Wrap'}</span>
          </button>

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
      </div>

      <div
        className="rounded-xl border p-3 font-mono text-xs overflow-x-auto shadow-xs"
        style={{
          backgroundColor: 'var(--background)',
          borderColor: 'var(--border)',
        }}
      >
        <div className={`space-y-1 ${wrapLines ? 'w-full' : 'min-w-max'}`}>
          {metadata.pseudocode.map((line) => {
            const isActive = line.line === activeLine;

            return (
              <div
                key={line.line}
                className="flex items-start gap-2.5 px-2 py-1 rounded transition-colors"
                style={{
                  backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--primary-action)' : '3px solid transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <span
                  className="w-5 text-right text-[11px] select-none shrink-0 font-mono pt-0.5"
                  style={{ color: isActive ? 'var(--primary-action)' : 'var(--text-muted)' }}
                >
                  {line.line}
                </span>
                <span
                  style={{ paddingLeft: `${line.indent * 12}px` }}
                  className={`text-[12px] ${wrapLines ? 'whitespace-pre-wrap break-words leading-relaxed' : 'whitespace-pre'}`}
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
