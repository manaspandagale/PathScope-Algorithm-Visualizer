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
    <footer className="h-18 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-6 flex items-center justify-between gap-6 select-none z-20">
      {/* Playback action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRestart}
          title="Restart from Step 1"
          disabled={totalSteps === 0 || isAtStart}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onPrev}
          title="Previous Step"
          disabled={totalSteps === 0 || isAtStart}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Play'}
          disabled={totalSteps === 0}
          className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
        </button>

        <button
          onClick={onNext}
          title="Next Step"
          disabled={totalSteps === 0 || isAtEnd}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
        >
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      {/* Step Scrubber Slider */}
      <div className="flex-1 max-w-2xl flex items-center gap-3">
        <span className="text-xs font-mono font-semibold text-slate-400 min-w-[70px]">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 disabled:opacity-40"
          />
        </div>
        <span className="text-xs font-mono text-slate-500 min-w-[60px] text-right">
          {totalSteps > 0 ? `of ${totalSteps}` : '0 of 0'}
        </span>
      </div>

      {/* Speed Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
          <Gauge className="w-4 h-4 text-slate-500" />
          <span>Speed:</span>
        </div>
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeedMultiplier(s)}
              className={`px-2 py-1 text-xs font-mono font-semibold rounded-lg transition-colors cursor-pointer ${
                speedMultiplier === s
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
};
