import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from 'lucide-react';

interface PlaybackBarProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
  onSeek: (stepIndex: number) => void;
  speedMultiplier: number;
  setSpeedMultiplier: (speed: number) => void;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onRestart,
  onSeek,
  speedMultiplier,
  setSpeedMultiplier,
}) => {
  const isAtStart = currentStepIndex <= 0;
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  const speeds = [0.5, 1, 1.5, 2, 3];

  return (
    <footer
      className="h-[72px] border-t px-6 flex items-center justify-between gap-4 select-none z-30 shrink-0"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 1. Restart, 2. Previous, 3. Play/Pause (Primary), 4. Next */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onRestart}
          title="Restart from beginning"
          aria-label="Restart from beginning"
          disabled={totalSteps === 0 || isAtStart}
          className="w-9 h-9 rounded border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onPrev}
          title="Previous step"
          aria-label="Previous step"
          disabled={totalSteps === 0 || isAtStart}
          className="w-9 h-9 rounded border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Primary Play/Pause Action */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={totalSteps === 0}
          className="px-4 h-9 rounded flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none"
          style={{
            backgroundColor: 'var(--primary-action)',
            color: '#FFFFFF',
          }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Play</span>
            </>
          )}
        </button>

        <button
          onClick={onNext}
          title="Next step"
          aria-label="Next step"
          disabled={totalSteps === 0 || isAtEnd}
          className="w-9 h-9 rounded border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Timeline Scrubber */}
      <div className="flex-1 max-w-xl mx-2 flex items-center">
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onSeek(Number(e.target.value))}
          disabled={totalSteps <= 1}
          aria-label="Timeline step scrubber"
          className="w-full h-1.5 rounded-lg appearance-none cursor-pointer focus-visible:outline-none disabled:opacity-30"
          style={{
            backgroundColor: 'var(--border-strong)',
            accentColor: 'var(--primary-action)',
          }}
        />
      </div>

      {/* 6. Step 1 of 12 & 7. Speed Menu */}
      <div className="flex items-center gap-4">
        <span
          className="text-xs font-mono font-medium whitespace-nowrap"
          style={{ color: 'var(--text-secondary)' }}
        >
          {totalSteps > 0 ? `Step ${currentStepIndex + 1} of ${totalSteps}` : '0 steps'}
        </span>

        {/* Compact Speed Dropdown */}
        <div className="flex items-center gap-1.5 text-xs">
          <label htmlFor="playback-speed" className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Speed:
          </label>
          <select
            id="playback-speed"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
            aria-label="Playback speed"
            className="px-2 py-1 rounded border text-xs font-mono font-medium cursor-pointer focus-visible:outline-none min-h-[32px]"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            {speeds.map((s) => (
              <option key={s} value={s}>
                {s}×
              </option>
            ))}
          </select>
        </div>
      </div>
    </footer>
  );
};
