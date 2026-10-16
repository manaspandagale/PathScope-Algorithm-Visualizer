import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Node, Edge } from '@xyflow/react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from '../types/graph';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { GraphCanvas } from '../components/Canvas/GraphCanvas';
import { InfoPanel } from '../components/InfoPanel/InfoPanel';
import { PlaybackBar } from '../components/Playback/PlaybackBar';
import { EdgeWeightModal } from '../components/Canvas/EdgeWeightModal';
import { GuideModal } from '../components/Navigation/GuideModal';
import { ComingSoonModal } from '../components/Navigation/ComingSoonModal';

interface VisualizerPageProps {
  theme: 'dark' | 'light';
  nodes: Node<GraphNodeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<GraphNodeData>[]>>;
  edges: Edge<GraphEdgeData>[];
  setEdges: React.Dispatch<React.SetStateAction<Edge<GraphEdgeData>[]>>;
  sourceId: string;
  setSourceId: (id: string) => void;
  targetId: string;
  setTargetId: (id: string) => void;
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  isGuideOpen: boolean;
  setIsGuideOpen: (open: boolean) => void;
  isComingSoonOpen: boolean;
  setIsComingSoonOpen: (open: boolean) => void;
}

export const VisualizerPage: React.FC<VisualizerPageProps> = ({
  theme,
  nodes,
  setNodes,
  edges,
  setEdges,
  sourceId,
  setSourceId,
  targetId,
  setTargetId,
  algorithm,
  setAlgorithm,
  selectedNodeId,
  setSelectedNodeId,
  isGuideOpen,
  setIsGuideOpen,
  isComingSoonOpen,
  setIsComingSoonOpen,
}) => {
  const [searchParams] = useSearchParams();

  // Read URL query params e.g. /visualizer?algo=bfs
  useEffect(() => {
    const algoParam = searchParams.get('algo');
    if (algoParam === 'bfs' || algoParam === 'dfs' || algoParam === 'dijkstra') {
      setAlgorithm(algoParam);
    }
  }, [searchParams, setAlgorithm]);

  const [edgeModalState, setEdgeModalState] = React.useState<{
    isOpen: boolean;
    edgeId: string | null;
    currentWeight: number;
  }>({
    isOpen: false,
    edgeId: null,
    currentWeight: 1,
  });

  // Playback engine
  const {
    currentSnapshot,
    currentStepIndex,
    totalSteps,
    isPlaying,
    play,
    pause,
    nextStep,
    prevStep,
    restart,
    goToStep,
    speedMultiplier,
    setSpeedMultiplier,
  } = useAlgorithmPlayback({
    algorithm,
    nodes,
    edges,
    sourceId,
    targetId,
    isDirected: false,
  });

  // Listen for custom edge weight modal events
  useEffect(() => {
    const handleOpenModal = (e: Event) => {
      const customEvent = e as CustomEvent<{ edgeId: string; currentWeight: number }>;
      setEdgeModalState({
        isOpen: true,
        edgeId: customEvent.detail.edgeId,
        currentWeight: customEvent.detail.currentWeight,
      });
    };

    window.addEventListener('open-edge-weight-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-edge-weight-modal', handleOpenModal);
    };
  }, []);

  const handleSaveEdgeWeight = (edgeId: string, newWeight: number) => {
    setEdges((prev) =>
      prev.map((edge) =>
        edge.id === edgeId
          ? {
              ...edge,
              data: {
                ...edge.data,
                weight: newWeight,
              },
            }
          : edge
      )
    );
  };

  const handleResetVisualization = () => {
    restart();
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden relative">
      {/* Main Workspace: Left Sidebar + Center Canvas + Right Info Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          setEdges={setEdges}
          sourceId={sourceId}
          targetId={targetId}
          setSourceId={setSourceId}
          setTargetId={setTargetId}
          onResetVisualization={handleResetVisualization}
          isDirected={false}
        />

        <main className="flex-1 h-full relative">
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            sourceId={sourceId}
            targetId={targetId}
            setSourceId={setSourceId}
            setTargetId={setTargetId}
            currentSnapshot={currentSnapshot}
            isDirected={false}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
            theme={theme}
          />
        </main>

        <InfoPanel
          algorithm={algorithm}
          snapshot={currentSnapshot}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
        />
      </div>

      {/* Bottom Playback Controls */}
      <PlaybackBar
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        onPlay={play}
        onPause={pause}
        onNext={nextStep}
        onPrev={prevStep}
        onRestart={restart}
        onSeek={goToStep}
        speedMultiplier={speedMultiplier}
        setSpeedMultiplier={setSpeedMultiplier}
      />

      {/* Modals */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={() => setIsComingSoonOpen(false)}
      />

      <EdgeWeightModal
        isOpen={edgeModalState.isOpen}
        edgeId={edgeModalState.edgeId}
        initialWeight={edgeModalState.currentWeight}
        onSave={handleSaveEdgeWeight}
        onClose={() => setEdgeModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
