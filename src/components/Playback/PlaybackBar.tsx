import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
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
      className="h-[76px] border-t px-6 flex items-center justify-between gap-6 select-none z-30 transition-colors"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Primary Playback Action Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRestart}
          title="Restart to Initial Step"
          aria-label="Restart from Beginning"
          disabled={totalSteps === 0 || isAtStart}
          className="w-10 h-10 rounded-md border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
          title="Previous Step"
          aria-label="Previous Step"
          disabled={totalSteps === 0 || isAtStart}
          className="w-10 h-10 rounded-md border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Strongest Play/Pause Action Button */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause Playback' : 'Play Execution'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={totalSteps === 0}
          className="px-5 h-11 rounded-md flex items-center gap-2 font-semibold transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] shadow-sm"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#FFFDF8',
          }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span className="text-sm">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span className="text-sm">Play</span>
            </>
          )}
        </button>

        <button
          onClick={onNext}
          title="Next Step"
          aria-label="Next Step"
          disabled={totalSteps === 0 || isAtEnd}
          className="w-10 h-10 rounded-md border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Step Scrubber Slider */}
      <div className="flex-1 max-w-xl flex items-center gap-3">
        <span
          className="text-xs font-mono font-bold min-w-[70px]"
          style={{ color: 'var(--text-primary)' }}
        >
          {totalSteps > 0 ? `Step ${currentStepIndex + 1}` : 'No steps'}
        </span>

        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onSeek(Number(e.target.value))}
            disabled={totalSteps <= 1}
            aria-label="Timeline step scrubber"
            className="w-full h-2 rounded-md appearance-none cursor-pointer focus-visible:outline-none disabled:opacity-30"
            style={{
              backgroundColor: 'var(--border-strong)',
              accentColor: 'var(--accent)',
            }}
          />
        </div>

        <span
          className="text-xs font-mono min-w-[60px] text-right"
          style={{ color: 'var(--text-muted)' }}
        >
          {totalSteps > 0 ? `of ${totalSteps}` : '0 of 0'}
        </span>
      </div>

      {/* Speed Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs mr-1" style={{ color: 'var(--text-muted)' }}>
          <Gauge className="w-4 h-4" />
          <span className="hidden sm:inline">Speed:</span>
        </div>
        <div
          className="flex items-center p-1 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeedMultiplier(s)}
              aria-label={`Set speed to ${s}x`}
              className="px-2 py-1 text-xs font-mono font-semibold rounded transition-colors cursor-pointer min-w-[28px]"
              style={{
                backgroundColor: speedMultiplier === s ? 'var(--surface-elevated)' : 'transparent',
                border: speedMultiplier === s ? '1px solid var(--border-strong)' : '1px solid transparent',
                color: speedMultiplier === s ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
