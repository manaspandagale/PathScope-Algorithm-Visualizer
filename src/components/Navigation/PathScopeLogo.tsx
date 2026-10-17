import React from 'react';

interface PathScopeLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

/**
 * PathScope Logo & Brand Mark
 * 
 * An original academic-technology mark combining:
 * 1. An outer optical scope aperture / compass lens
 * 2. Three graph vertices connected by directed shortest-path segments
 * 3. A subtle geometric 'P' topology (originating at bottom stem, looping through top frontier to destination)
 * 4. A terminal destination halo
 */
export const PathScopeLogo: React.FC<PathScopeLogoProps> = ({
  size = 32,
  className = '',
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Brand Mark */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-[1.03]"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 36 36"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="w-full h-full"
        >
          {/* Subtle Outer Scope Ring */}
          <circle
            cx="18"
            cy="18"
            r="16"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeDasharray="2 3"
            className="opacity-35"
          />

          {/* Aperture Crosshairs / Coordinate Ticks */}
          <line x1="18" y1="2" x2="18" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60" />
          <line x1="18" y1="31.5" x2="18" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60" />
          <line x1="2" y1="18" x2="4.5" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60" />
          <line x1="31.5" y1="18" x2="34" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60" />

          {/* Path Edge 1: Vertical Stem (Source at (11, 26) to Upper Node at (11, 10)) */}
          <line
            x1="11"
            y1="26"
            x2="11"
            y2="10"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="text-[var(--primary-action)]"
          />

          {/* Path Edge 2: Loop / Upper Arc to Destination at (24, 15) */}
          <path
            d="M 11 10 C 11 6, 25 6, 25 15 C 25 19, 17 20, 11 19"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--primary-action)]"
          />

          {/* Vertex 1: Source Node (11, 26) */}
          <circle
            cx="11"
            cy="26"
            r="3"
            fill="var(--surface-elevated)"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[var(--text-secondary)]"
          />

          {/* Vertex 2: Intermediate Pivot Node (11, 10) */}
          <circle
            cx="11"
            cy="10"
            r="2.75"
            fill="var(--surface-elevated)"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[var(--primary-action)]"
          />

          {/* Vertex 3: Destination Target with Halo (25, 15) */}
          <circle
            cx="25"
            cy="15"
            r="4.25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="2 1.5"
            className="text-[var(--active-state)] opacity-80"
          />
          <circle
            cx="25"
            cy="15"
            r="2.5"
            fill="var(--active-state)"
          />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <span
          className="text-[20px] font-bold tracking-tight inline-flex items-center"
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 750,
            letterSpacing: '-0.025em',
          }}
        >
          <span className="sr-only">PathScope</span>
          <span aria-hidden="true" style={{ color: 'var(--text-primary)' }}>Path</span>
          <span aria-hidden="true" style={{ color: 'var(--primary-action)' }}>Scope</span>
        </span>
      )}
    </div>
  );
};

export default PathScopeLogo;
