import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Node, Edge } from '@xyflow/react';
import { AlertCircle, Loader2, SlidersHorizontal, PanelRight } from 'lucide-react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from '../types/graph';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { GraphCanvas } from '../components/Canvas/GraphCanvas';
import { InfoPanel } from '../components/InfoPanel/InfoPanel';
import { PlaybackBar } from '../components/Playback/PlaybackBar';
import { EdgeWeightModal } from '../components/Canvas/EdgeWeightModal';

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
}) => {
  const [searchParams] = useSearchParams();

  // Mobile / tablet panel drawers
  const [mobileConfigOpen, setMobileConfigOpen] = useState(false);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);

  // Sync algorithm query parameter (e.g. /visualizer?algo=bfs)
  useEffect(() => {
    const algoParam = searchParams.get('algo');
    if (algoParam === 'bfs' || algoParam === 'dijkstra') {
      setAlgorithm(algoParam);
    }
  }, [searchParams, setAlgorithm]);

  // Edge weight modal state
  const [edgeModalState, setEdgeModalState] = useState<{
    isOpen: boolean;
    edgeId: string | null;
    currentWeight: number;
  }>({
    isOpen: false,
    edgeId: null,
    currentWeight: 1,
  });

  // C++ WebAssembly playback engine hook
  const {
    currentSnapshot,
    currentStepIndex,
    totalSteps,
    isPlaying,
    isLoadingWasm,
    errorMessage,
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

  return (
    <div
      className="flex-1 flex flex-col h-[calc(100vh-68px)] overflow-hidden relative select-none"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Validation Banner (e.g. Negative Weights in Dijkstra) */}
      {errorMessage && (
        <div
          className="px-6 py-2.5 flex items-center justify-between text-xs font-medium border-b z-30"
          style={{
            backgroundColor: 'var(--danger-subtle)',
            borderColor: 'var(--danger)',
            color: 'var(--danger)',
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
          <span
            className="text-[11px] font-mono px-2 py-0.5 rounded border"
            style={{
              borderColor: 'var(--danger)',
              backgroundColor: 'var(--surface)',
            }}
          >
            C++ Engine Guard
          </span>
        </div>
      )}

      {/* Mobile Drawer Bar for Small Screens */}
      <div
        className="flex xl:hidden items-center justify-between px-4 py-2 border-b text-xs"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <button
          onClick={() => {
            setMobileConfigOpen(!mobileConfigOpen);
            setMobileInspectorOpen(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-medium cursor-pointer"
          style={{
            backgroundColor: mobileConfigOpen ? 'var(--background-secondary)' : 'var(--background)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
          }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span>Configuration Rail</span>
        </button>

        <button
          onClick={() => {
            setMobileInspectorOpen(!mobileInspectorOpen);
            setMobileConfigOpen(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border font-medium cursor-pointer"
          style={{
            backgroundColor: mobileInspectorOpen ? 'var(--background-secondary)' : 'var(--background)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
          }}
        >
          <PanelRight className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
          <span>Inspector Tabs</span>
        </button>
      </div>

      {/* Main Workbench: Left Rail + Center Canvas + Right Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Configuration Rail (Desktop: persistent 280px, Mobile: drawer) */}
        <div
          className={`
            fixed xl:static top-[110px] xl:top-auto left-0 bottom-[76px] xl:bottom-auto z-30
            w-80 xl:w-[280px] shrink-0 transition-transform duration-200
            ${mobileConfigOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
          `}
          style={{
            backgroundColor: 'var(--surface)',
            borderRight: '1px solid var(--border)',
          }}
        >
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
            onResetVisualization={restart}
            isDirected={false}
          />
        </div>

        {/* Center Graph Canvas */}
        <main className="flex-1 h-full relative overflow-hidden">
          {isLoadingWasm && (
            <div
              className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono font-medium shadow-sm"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border-strong)',
                color: 'var(--text-secondary)',
              }}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--accent)' }} />
              <span>Computing in C++ WASM...</span>
            </div>
          )}

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

        {/* Right Inspector (Desktop: persistent 360px, Mobile: drawer) */}
        <div
          className={`
            fixed xl:static top-[110px] xl:top-auto right-0 bottom-[76px] xl:bottom-auto z-30
            w-96 xl:w-[360px] shrink-0 transition-transform duration-200
            ${mobileInspectorOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
          `}
          style={{
            backgroundColor: 'var(--surface)',
            borderLeft: '1px solid var(--border)',
          }}
        >
          <InfoPanel
            algorithm={algorithm}
            snapshot={currentSnapshot}
            currentStepIndex={currentStepIndex}
            totalSteps={totalSteps}
          />
        </div>
      </div>

      {/* Fixed Playback Dock */}
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

      {/* Functional Modal for Edge Weights */}
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

export default VisualizerPage;
