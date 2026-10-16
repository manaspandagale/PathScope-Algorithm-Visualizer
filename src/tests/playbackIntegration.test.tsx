// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { PRESET_GRAPHS } from '../data/presetGraphs';

describe('Real Algorithm Playback Integration Test', () => {
  const preset = PRESET_GRAPHS[0]; // BFS vs Dijkstra tradeoff preset
  const nodes = preset.nodes;
  const edges = preset.edges;
  const sourceId = preset.sourceId;
  const targetId = preset.targetId;

  beforeEach(() => {
    window.matchMedia = window.matchMedia || function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('proves the 10-step playback lifecycle: Play -> auto-advance -> Pause -> speed change -> final result', async () => {
    // 1. Load the visualizer playback hook with Dijkstra on the standard preset
    const { result } = renderHook(() =>
      useAlgorithmPlayback({
        algorithm: 'dijkstra',
        nodes,
        edges,
        sourceId,
        targetId,
        isDirected: false,
      })
    );

    // 2. Wait for WASM snapshots to compute
    await vi.waitFor(() => {
      expect(result.current.isLoadingWasm).toBe(false);
      expect(result.current.totalSteps).toBeGreaterThan(1);
    });

    const initialTotalSteps = result.current.totalSteps;
    expect(result.current.currentStepIndex).toBe(0);
    expect(result.current.isPlaying).toBe(false);

    // 3. Click Play
    act(() => {
      result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);

    // 4. Verify the visible step changes automatically over time (1x speed = 900ms)
    act(() => {
      vi.advanceTimersByTime(950);
    });
    expect(result.current.currentStepIndex).toBe(1);

    act(() => {
      vi.advanceTimersByTime(950);
    });
    expect(result.current.currentStepIndex).toBe(2);

    // 5. Click Pause
    act(() => {
      result.current.pause();
    });
    expect(result.current.isPlaying).toBe(false);

    // 6. Verify the step stops advancing while paused
    const pausedStep = result.current.currentStepIndex;
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.currentStepIndex).toBe(pausedStep);

    // 7. Change playback speed (2x speed = 450ms)
    act(() => {
      result.current.setSpeedMultiplier(2);
    });
    expect(result.current.speedMultiplier).toBe(2);

    // 8. Verify the interval changes: resume play and advance by 460ms
    act(() => {
      result.current.play();
    });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      vi.advanceTimersByTime(460);
    });
    expect(result.current.currentStepIndex).toBe(pausedStep + 1);

    // 9. Allow playback to reach the final step
    act(() => {
      vi.advanceTimersByTime(initialTotalSteps * 500);
    });

    // 10. Verify playback completed and the final result state is displayed
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.currentStepIndex).toBe(initialTotalSteps - 1);
    expect(result.current.currentSnapshot?.status).toBe('found');
    expect(result.current.currentSnapshot?.pathNodes.length).toBeGreaterThan(0);
  });
});
