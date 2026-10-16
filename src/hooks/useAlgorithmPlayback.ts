import { useState, useEffect, useRef, useCallback } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';
import { executeAlgorithmWasm, getWasmInitError } from '../wasm/algorithmEngine';

interface UseAlgorithmPlaybackProps {
  algorithm: AlgorithmType;
  nodes: Node<GraphNodeData>[];
  edges: Edge<GraphEdgeData>[];
  sourceId: string;
  targetId: string;
  isDirected?: boolean;
}

export function useAlgorithmPlayback({
  algorithm,
  nodes,
  edges,
  sourceId,
  targetId,
  isDirected = false,
}: UseAlgorithmPlaybackProps) {
  const [snapshots, setSnapshots] = useState<StepSnapshot[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 0.5x, 1x, 1.5x, 2x, 3x
  const [isLoadingWasm, setIsLoadingWasm] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  // Execute C++ WebAssembly algorithm on input changes
  useEffect(() => {
    let isCancelled = false;
    clearTimer();

    if (!sourceId || !targetId || nodes.length === 0) {
      Promise.resolve().then(() => {
        if (!isCancelled) {
          setSnapshots([]);
          setCurrentStepIndex(0);
          setIsPlaying(false);
          setErrorMessage(null);
        }
      });
      return;
    }

    const runWasm = async () => {
      setIsLoadingWasm(true);
      setErrorMessage(null);

      try {
        const result = await executeAlgorithmWasm(
          algorithm,
          nodes,
          edges,
          sourceId,
          targetId,
          isDirected
        );

        if (isCancelled) return;

        setSnapshots(result);
        setCurrentStepIndex(0);

        // Check if algorithm returned an invalid status snapshot
        if (result.length > 0 && result[0].status === 'invalid') {
          setErrorMessage(result[0].explanation);
        } else {
          setErrorMessage(null);
        }
      } catch (err: unknown) {
        if (isCancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        const wasmErr = getWasmInitError();
        setErrorMessage(wasmErr || msg);
        setSnapshots([]);
      } finally {
        if (!isCancelled) {
          setIsLoadingWasm(false);
        }
      }
    };

    runWasm();

    return () => {
      isCancelled = true;
      clearTimer();
    };
  }, [algorithm, nodes, edges, sourceId, targetId, isDirected, pause, clearTimer]);

  const totalSteps = snapshots.length;
  const currentSnapshot = snapshots[currentStepIndex] || null;

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      } else {
        pause();
        return prev;
      }
    });
  }, [totalSteps, pause]);

  const prevStep = useCallback(() => {
    pause();
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, [pause]);

  const restart = useCallback(() => {
    pause();
    setCurrentStepIndex(0);
  }, [pause]);

  const goToStep = useCallback(
    (index: number) => {
      pause();
      if (index >= 0 && index < totalSteps) {
        setCurrentStepIndex(index);
      }
    },
    [totalSteps, pause]
  );

  const play = useCallback(() => {
    if (totalSteps === 0) return;
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, totalSteps]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Interval timer for auto-play
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    const intervalMs = Math.max(120, Math.floor(900 / speedMultiplier));

    timerRef.current = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        } else {
          pause();
          return prev;
        }
      });
    }, intervalMs);

    return () => {
      clearTimer();
    };
  }, [isPlaying, speedMultiplier, totalSteps, pause, clearTimer]);

  return {
    snapshots,
    currentSnapshot,
    currentStepIndex,
    totalSteps,
    isPlaying,
    isLoadingWasm,
    errorMessage,
    play,
    pause,
    togglePlay,
    nextStep,
    prevStep,
    restart,
    goToStep,
    speedMultiplier,
    setSpeedMultiplier,
  };
}
