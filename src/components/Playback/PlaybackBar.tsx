import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
} from 'lucide-react';
import { IconButton } from '../UI/IconButton';

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
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <footer
      role="region"
      aria-label="Algorithm playback controls"
      className="h-[72px] border-t px-6 flex items-center justify-between gap-6 select-none z-30 shrink-0"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 1. Coordinated Transport Controls Group */}
      <div className="flex items-center gap-1.5 p-1 rounded-[var(--radius-md)] border"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <IconButton
          icon={<RotateCcw className="w-4 h-4" />}
          label="Restart from beginning"
          onClick={onRestart}
          disabled={totalSteps === 0 || isAtStart}
          variant="ghost"
          size="sm"
        />

        <IconButton
          icon={<SkipBack className="w-4 h-4" />}
          label="Previous step"
          onClick={onPrev}
          disabled={totalSteps === 0 || isAtStart}
          variant="ghost"
          size="sm"
        />

        {/* Primary Play/Pause Button */}
        <button
          type="button"
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          disabled={totalSteps <= 1}
          className={`
            px-4 h-9 rounded-[var(--radius-sm)] flex items-center gap-2 text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer
            active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-1
            disabled:opacity-35 disabled:cursor-not-allowed shadow-xs
          `}
          style={{
            backgroundColor: 'var(--primary-action)',
            color: '#FFFFFF',
          }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play</span>
            </>
          )}
        </button>

        <IconButton
          icon={<SkipForward className="w-4 h-4" />}
          label="Next step"
          onClick={onNext}
          disabled={totalSteps === 0 || isAtEnd}
          variant="ghost"
          size="sm"
        />
      </div>

      {/* 2. Interactive Timeline Scrubber with Visible Progress Fill */}
      <div className="flex-1 max-w-xl flex items-center gap-3">
        <span className="text-xs font-mono font-medium shrink-0 min-w-[50px] text-right"
          style={{ color: 'var(--text-muted)' }}
        >
          {totalSteps > 0 ? `${currentStepIndex + 1}` : '0'}
        </span>

        <div className="relative w-full flex items-center">
          {/* Custom Track Background */}
          <div
            className="w-full h-2 rounded-full overflow-hidden pointer-events-none"
            style={{ backgroundColor: 'var(--border)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: 'var(--primary-action)',
              }}
            />
          </div>

          {/* Transparent Native Range Slider */}
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onSeek(Number(e.target.value))}
            disabled={totalSteps <= 1}
            aria-label="Timeline step scrubber"
            className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </div>

        <span className="text-xs font-mono font-medium shrink-0 min-w-[50px]"
          style={{ color: 'var(--text-muted)' }}
        >
          / {totalSteps}
        </span>
      </div>

      {/* 3. Speed & Status Section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-[var(--radius-md)] border text-xs"
          style={{
            backgroundColor: 'var(--background-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          <label htmlFor="playback-speed" className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            Speed:
          </label>
          <select
            id="playback-speed"
            aria-label="Playback speed"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
            className="px-2 py-1 rounded border text-xs font-mono font-medium cursor-pointer focus-visible:outline-none min-h-[32px]"
            style={{
              backgroundColor: 'var(--surface)',
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

export default PlaybackBar;
