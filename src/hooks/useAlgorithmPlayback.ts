import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';
import { runBFS } from '../algorithms/bfs';
import { runDFS } from '../algorithms/dfs';
import { runDijkstra } from '../algorithms/dijkstra';
import { runDAGShortestPath } from '../algorithms/dag';
import { runFloydWarshall } from '../algorithms/floydWarshall';

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
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1); // 0.5x, 1x, 1.5x, 2x

  // Generate immutable algorithm snapshots
  const snapshots: StepSnapshot[] = useMemo(() => {
    if (!sourceId || !targetId || nodes.length === 0) {
      return [];
    }

    switch (algorithm) {
      case 'bfs':
        return runBFS(nodes, edges, sourceId, targetId, isDirected);
      case 'dfs':
        return runDFS(nodes, edges, sourceId, targetId, isDirected);
      case 'dijkstra':
        return runDijkstra(nodes, edges, sourceId, targetId, isDirected);
      case 'dag':
        return runDAGShortestPath(nodes, edges, sourceId, targetId);
      case 'floyd-warshall':
        return runFloydWarshall(nodes, edges, sourceId, targetId, isDirected);
      default:
        return [];
    }
  }, [algorithm, nodes, edges, sourceId, targetId, isDirected]);

  // Reset to step 0 when snapshots change (React pattern: adjusting state during render)
  const [prevSnapshots, setPrevSnapshots] = useState(snapshots);
  if (prevSnapshots !== snapshots) {
    setPrevSnapshots(snapshots);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }

  const totalSteps = snapshots.length;
  const currentSnapshot = snapshots[currentStepIndex] || null;

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

    // Base delay is 800ms / speedMultiplier
    const intervalMs = Math.max(150, Math.floor(900 / speedMultiplier));

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
