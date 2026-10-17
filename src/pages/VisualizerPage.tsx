import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Node, Edge } from '@xyflow/react';
import { AlertCircle, Loader2, SlidersHorizontal, PanelRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from '../types/graph';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { GraphCanvas } from '../components/Canvas/GraphCanvas';
import { InfoPanel } from '../components/InfoPanel/InfoPanel';
import { PlaybackBar } from '../components/Playback/PlaybackBar';
import { EdgeWeightModal } from '../components/Canvas/EdgeWeightModal';
import { IconButton } from '../components/UI/IconButton';

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

  // Desktop collapsible panels
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [desktopInspectorOpen, setDesktopInspectorOpen] = useState(true);

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
      className="h-full min-h-0 flex flex-col overflow-hidden relative select-none"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Validation Banner (e.g. Negative Weights in Dijkstra) */}
      {errorMessage && (
        <div
          role="alert"
          className="px-6 py-2 flex items-center justify-between text-xs font-medium border-b z-30"
          style={{
            backgroundColor: 'var(--error)',
            color: '#FFFFFF',
          }}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <span className="text-xs font-mono opacity-80">
            C++ Engine Validation
          </span>
        </div>
      )}

      {/* Mobile Drawer Bar for Small Screens */}
      <div
        className="flex lg:hidden items-center justify-between px-4 py-2 border-b text-xs shrink-0 z-20"
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
          aria-expanded={mobileConfigOpen}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium cursor-pointer min-h-[44px]"
          style={{
            backgroundColor: mobileConfigOpen ? 'var(--background-secondary)' : 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Graph controls</span>
        </button>

        <button
          onClick={() => {
            setMobileInspectorOpen(!mobileInspectorOpen);
            setMobileConfigOpen(false);
          }}
          aria-expanded={mobileInspectorOpen}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md border text-xs font-medium cursor-pointer min-h-[44px]"
          style={{
            backgroundColor: mobileInspectorOpen ? 'var(--background-secondary)' : 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          <PanelRight className="w-4 h-4" />
          <span>Step inspector</span>
        </button>
      </div>

      {/* Main Workbench: Left Rail + Center Canvas + Right Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Backdrop for mobile drawer */}
        {(mobileConfigOpen || mobileInspectorOpen) && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs"
            onClick={() => {
              setMobileConfigOpen(false);
              setMobileInspectorOpen(false);
            }}
          />
        )}

        {/* Left Control Panel (Desktop: collapsible 256px, Mobile: off-canvas drawer) */}
        <div
          className={`
            fixed lg:static top-0 lg:top-auto left-0 bottom-0 lg:bottom-auto z-40
            ${desktopSidebarOpen ? 'lg:w-[256px]' : 'lg:w-0'} shrink-0 transition-all duration-200 overflow-hidden
            ${mobileConfigOpen ? 'translate-x-0 w-[272px]' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{
            backgroundColor: 'var(--surface)',
            borderRight: desktopSidebarOpen ? '1px solid var(--border)' : 'none',
          }}
        >
          <div className="w-[256px] h-full">
            <Sidebar
              algorithm={algorithm}
              setAlgorithm={setAlgorithm}
              nodes={nodes}
              setNodes={setNodes}
              setEdges={setEdges}
              sourceId={sourceId}
              targetId={targetId}
              setSourceId={setSourceId}
              setTargetId={setTargetId}
              onResetVisualization={restart}
            />
          </div>
        </div>

        {/* Center Graph Canvas */}
        <main className="flex-1 h-full relative overflow-hidden">
          {/* Quick toggle for desktop left sidebar */}
          <div className="hidden lg:block absolute top-4 left-4 z-20">
            {!desktopSidebarOpen && (
              <IconButton
                icon={<ChevronRight className="w-4 h-4" />}
                label="Expand Graph Controls"
                onClick={() => setDesktopSidebarOpen(true)}
                variant="surface"
                size="sm"
              />
            )}
          </div>

          {/* Quick toggle for desktop right inspector */}
          <div className="hidden lg:block absolute top-4 right-4 z-20">
            {!desktopInspectorOpen && (
              <IconButton
                icon={<ChevronLeft className="w-4 h-4" />}
                label="Expand Step Inspector"
                onClick={() => setDesktopInspectorOpen(true)}
                variant="surface"
                size="sm"
              />
            )}
          </div>

          {isLoadingWasm && (
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-mono font-medium shadow-sm"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--primary-action)]" />
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

        {/* Right Inspector (Desktop: collapsible 340px, Mobile: drawer) */}
        <div
          className={`
            fixed lg:static top-0 lg:top-auto right-0 bottom-0 lg:bottom-auto z-40
            ${desktopInspectorOpen ? 'lg:w-[340px]' : 'lg:w-0'} shrink-0 transition-all duration-200 overflow-hidden
            ${mobileInspectorOpen ? 'translate-x-0 w-[320px]' : 'translate-x-full lg:translate-x-0'}
          `}
          style={{
            backgroundColor: 'var(--surface)',
            borderLeft: desktopInspectorOpen ? '1px solid var(--border)' : 'none',
          }}
        >
          <div className="w-[340px] h-full">
            <InfoPanel
              algorithm={algorithm}
              snapshot={currentSnapshot}
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
            />
          </div>
        </div>
      </div>

      {/* Fixed Playback Dock (72px) */}
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
