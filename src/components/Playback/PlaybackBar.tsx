import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Keyboard,
  X,
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
  const [showKeyHelp, setShowKeyHelp] = useState(false);
  const isAtStart = currentStepIndex <= 0;
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  const speeds = [0.5, 1, 1.5, 2, 3];
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <footer
      role="region"
      aria-label="Algorithm playback controls"
      className="relative min-h-[64px] sm:h-[72px] border-t px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-6 select-none z-30 shrink-0"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 1. Coordinated Transport Controls Group */}
      <div
        className="flex items-center gap-1 sm:gap-1.5 p-1 rounded-[var(--radius-md)] border shrink-0"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <IconButton
          icon={<RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          label="Restart from beginning"
          onClick={onRestart}
          disabled={totalSteps === 0 || isAtStart}
          variant="ghost"
          size="sm"
        />

        <IconButton
          icon={<SkipBack className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
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
            px-3 sm:px-4 h-8 sm:h-9 rounded-[var(--radius-sm)] flex items-center gap-1.5 sm:gap-2 text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer
            active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-1
            disabled:opacity-35 disabled:cursor-not-allowed shadow-xs shrink-0
          `}
          style={{
            backgroundColor: 'var(--primary-action)',
            color: '#FFFFFF',
          }}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span className="hidden xs:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span className="hidden xs:inline">Play</span>
            </>
          )}
        </button>

        <IconButton
          icon={<SkipForward className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          label="Next step"
          onClick={onNext}
          disabled={totalSteps === 0 || isAtEnd}
          variant="ghost"
          size="sm"
        />
      </div>

      {/* 2. Interactive Timeline Scrubber */}
      <div className="flex-1 min-w-0 max-w-xl flex items-center gap-1.5 sm:gap-3">
        <span
          className="text-xs font-mono font-medium shrink-0 min-w-[32px] sm:min-w-[44px] text-right"
          style={{ color: 'var(--text-muted)' }}
        >
          {totalSteps > 0 ? `${currentStepIndex + 1}` : '0'}
        </span>

        <div className="relative w-full flex items-center min-w-[60px]">
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

        <span
          className="text-xs font-mono font-medium shrink-0 min-w-[32px] sm:min-w-[44px]"
          style={{ color: 'var(--text-muted)' }}
        >
          / {totalSteps}
        </span>
      </div>

      {/* 3. Speed & Keyboard Shortcuts Help Group */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Speed Selector */}
        <div
          className="flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-[var(--radius-md)] border text-xs"
          style={{
            backgroundColor: 'var(--background-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          <label htmlFor="playback-speed" className="text-xs font-medium hidden md:inline" style={{ color: 'var(--text-muted)' }}>
            Speed:
          </label>
          <select
            id="playback-speed"
            aria-label="Playback speed"
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
            className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border text-xs font-mono font-medium cursor-pointer focus-visible:outline-none min-h-[28px] sm:min-h-[32px]"
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

        {/* Keyboard Help Popover Toggle */}
        <div className="relative">
          <IconButton
            icon={<Keyboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            label="Keyboard shortcuts guide"
            onClick={() => setShowKeyHelp((prev) => !prev)}
            variant="ghost"
            size="sm"
          />

          {showKeyHelp && (
            <div
              role="tooltip"
              className="absolute bottom-12 right-0 w-64 p-3 rounded-xl border shadow-xl text-xs space-y-2 z-50 animate-in fade-in duration-150"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              <div className="flex items-center justify-between pb-1.5 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-semibold text-xs tracking-tight">Keyboard shortcuts</span>
                <button
                  type="button"
                  onClick={() => setShowKeyHelp(false)}
                  aria-label="Close shortcuts guide"
                  className="p-0.5 rounded hover:bg-black/5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Play / Pause</span>
                  <kbd className="px-1.5 py-0.5 font-mono text-[10px] rounded border bg-[var(--background)]">Space</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Previous step</span>
                  <kbd className="px-1.5 py-0.5 font-mono text-[10px] rounded border bg-[var(--background)]">←</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Next step</span>
                  <kbd className="px-1.5 py-0.5 font-mono text-[10px] rounded border bg-[var(--background)]">→</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">First step</span>
                  <kbd className="px-1.5 py-0.5 font-mono text-[10px] rounded border bg-[var(--background)]">Home</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Final step</span>
                  <kbd className="px-1.5 py-0.5 font-mono text-[10px] rounded border bg-[var(--background)]">End</kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default PlaybackBar;
