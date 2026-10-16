import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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

  // Stable graph topology fingerprint to avoid recomputing WASM snapshots on dimension or drag changes
  const graphTopologyKey = useMemo(() => {
    const nodeIds = nodes.map((n) => n.id).sort().join(',');
    const edgeSpecs = edges
      .map((e) => `${e.id}:${e.source}->${e.target}:${e.data?.weight ?? 1}`)
      .sort()
      .join(';');
    return `${algorithm}|${sourceId}|${targetId}|${isDirected ? 'dir' : 'undir'}|${nodeIds}|${edgeSpecs}`;
  }, [algorithm, sourceId, targetId, isDirected, nodes, edges]);

  // Keep latest state in refs for bulletproof interval execution
  const currentStepRef = useRef(currentStepIndex);
  const totalStepsRef = useRef(snapshots.length);

  useEffect(() => {
    currentStepRef.current = currentStepIndex;
  }, [currentStepIndex]);

  useEffect(() => {
    totalStepsRef.current = snapshots.length;
  }, [snapshots.length]);

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

  // Execute C++ WebAssembly algorithm only when graph topology or algorithm parameters change
  useEffect(() => {
    let isCancelled = false;

    if (!sourceId || !targetId || nodes.length === 0) {
      Promise.resolve().then(() => {
        if (!isCancelled) {
          setSnapshots([]);
          setCurrentStepIndex(0);
          setIsPlaying(false);
          setErrorMessage(null);
          clearTimer();
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
    };
    // Deliberately run strictly on topology change, not on internal node reference/dimension changes
  }, [graphTopologyKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalSteps = snapshots.length;
  const currentSnapshot = snapshots[currentStepIndex] || null;

  const nextStep = useCallback(() => {
    pause();
    setCurrentStepIndex((prev) => Math.min(totalStepsRef.current - 1, prev + 1));
  }, [pause]);

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
      if (index >= 0 && index < totalStepsRef.current) {
        setCurrentStepIndex(index);
      }
    },
    [pause]
  );

  const play = useCallback(() => {
    if (totalStepsRef.current <= 1) return;
    // If at the end, restart from beginning
    if (currentStepRef.current >= totalStepsRef.current - 1) {
      setCurrentStepIndex(0);
      currentStepRef.current = 0;
    }
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  // Dedicated playback interval ticker
  useEffect(() => {
    if (!isPlaying) {
      clearTimer();
      return;
    }

    if (totalSteps <= 1) {
      Promise.resolve().then(() => {
        setIsPlaying(false);
        clearTimer();
      });
      return;
    }

    const intervalMs = Math.max(120, Math.floor(900 / speedMultiplier));

    timerRef.current = window.setInterval(() => {
      const current = currentStepRef.current;
      const total = totalStepsRef.current;

      if (current < total - 1) {
        const next = current + 1;
        currentStepRef.current = next;
        setCurrentStepIndex(next);
      } else {
        // Reached end of snapshots
        setIsPlaying(false);
        clearTimer();
      }
    }, intervalMs);

    return () => {
      clearTimer();
    };
  }, [isPlaying, speedMultiplier, totalSteps, clearTimer]);

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
