import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Node, Edge } from '@xyflow/react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { GraphCanvas } from '../components/Canvas/GraphCanvas';
import { InfoPanel } from '../components/InfoPanel/InfoPanel';
import { PlaybackBar } from '../components/Playback/PlaybackBar';
import { EdgeWeightModal } from '../components/Canvas/EdgeWeightModal';
import { useAlgorithmPlayback } from '../hooks/useAlgorithmPlayback';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from '../types/graph';
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  PanelRight,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { IconButton } from '../components/UI/IconButton';
import { CanvasStepBanner } from '../components/Canvas/CanvasStepBanner';

export interface VisualizerPageProps {
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

  // Desktop side panels state
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState<boolean>(true);
  const [desktopInspectorOpen, setDesktopInspectorOpen] = useState<boolean>(true);
  const [inspectorWidth, setInspectorWidth] = useState<number>(420);
  const [isInspectorExpanded, setIsInspectorExpanded] = useState<boolean>(false);
  const [isResizingInspector, setIsResizingInspector] = useState<boolean>(false);

  const handleToggleExpandInspector = () => {
    setIsInspectorExpanded((prev) => {
      const next = !prev;
      setInspectorWidth(next ? 580 : 420);
      return next;
    });
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingInspector(true);
    const startX = e.clientX;
    const startWidth = isInspectorExpanded ? 580 : inspectorWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = startX - moveEvent.clientX;
      const newWidth = Math.min(Math.max(startWidth + delta, 360), Math.min(window.innerWidth - 300, 750));
      setInspectorWidth(newWidth);
      if (newWidth >= 500) {
        setIsInspectorExpanded(true);
      } else {
        setIsInspectorExpanded(false);
      }
    };

    const handleMouseUp = () => {
      setIsResizingInspector(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Mobile off-canvas drawers state
  const [mobileConfigOpen, setMobileConfigOpen] = useState<boolean>(false);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState<boolean>(false);

  // Focus restoration refs for mobile drawer buttons
  const mobileConfigBtnRef = useRef<HTMLButtonElement>(null);
  const mobileInspectorBtnRef = useRef<HTMLButtonElement>(null);
  const mobileConfigDrawerRef = useRef<HTMLDivElement>(null);
  const mobileInspectorDrawerRef = useRef<HTMLDivElement>(null);

  // Read URL params for algorithm initialization
  useEffect(() => {
    const algoParam = searchParams.get('algo') as AlgorithmType;
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
    setEdges((prev: Edge<GraphEdgeData>[]) =>
      prev.map((edge: Edge<GraphEdgeData>) =>
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

  // Playback keyboard shortcuts (Phase 3, item 6)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('dialog') ||
          target.closest('[role="dialog"]'))
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) {
          pause();
        } else {
          play();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToStep(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToStep(Math.max(0, totalSteps - 1));
      } else if (e.key === 'Escape') {
        if (mobileConfigOpen) {
          setMobileConfigOpen(false);
          mobileConfigBtnRef.current?.focus();
        }
        if (mobileInspectorOpen) {
          setMobileInspectorOpen(false);
          mobileInspectorBtnRef.current?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, pause, play, prevStep, nextStep, goToStep, totalSteps, mobileConfigOpen, mobileInspectorOpen]);

  // Trap and return focus for mobile drawers
  useEffect(() => {
    if (mobileConfigOpen) {
      mobileConfigDrawerRef.current?.focus();
    }
  }, [mobileConfigOpen]);

  useEffect(() => {
    if (mobileInspectorOpen) {
      mobileInspectorDrawerRef.current?.focus();
    }
  }, [mobileInspectorOpen]);

  // Screen reader live announcement text
  const liveAnnouncement = currentSnapshot
    ? `Step ${currentStepIndex + 1} of ${totalSteps}. Operation: ${currentSnapshot.operation}. Active vertex: ${
        currentSnapshot.activeVertex || currentSnapshot.currentNode || 'none'
      }. ${currentSnapshot.distanceUpdated ? 'Distance updated.' : ''} ${
        currentSnapshot.status === 'found' ? 'Optimal path found!' : ''
      } ${currentSnapshot.status === 'unreachable' ? 'Target unreachable.' : ''}`
    : '';

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Polite Live Region for screen readers (Phase 5, item 4) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Persistent Error Alert for C++ Engine Validations */}
      {errorMessage && (
        <div
          role="alert"
          className="px-6 py-2.5 border-b text-xs font-medium flex items-center justify-between shrink-0"
          style={{
            backgroundColor: 'var(--error-subtle, #FEF2F2)',
            borderColor: 'var(--error, #DC2626)',
            color: 'var(--error, #DC2626)',
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
          ref={mobileConfigBtnRef}
          type="button"
          onClick={() => {
            const next = !mobileConfigOpen;
            setMobileConfigOpen(next);
            setMobileInspectorOpen(false);
          }}
          aria-expanded={mobileConfigOpen}
          aria-controls="mobile-config-drawer"
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
          ref={mobileInspectorBtnRef}
          type="button"
          onClick={() => {
            const next = !mobileInspectorOpen;
            setMobileInspectorOpen(next);
            setMobileConfigOpen(false);
          }}
          aria-expanded={mobileInspectorOpen}
          aria-controls="mobile-inspector-drawer"
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
              if (mobileConfigOpen) {
                setMobileConfigOpen(false);
                mobileConfigBtnRef.current?.focus();
              }
              if (mobileInspectorOpen) {
                setMobileInspectorOpen(false);
                mobileInspectorBtnRef.current?.focus();
              }
            }}
          />
        )}

        {/* Left Control Panel (Desktop: collapsible 256px, Mobile: off-canvas drawer) */}
        <div
          id="mobile-config-drawer"
          ref={mobileConfigDrawerRef}
          tabIndex={-1}
          aria-hidden={!desktopSidebarOpen && !mobileConfigOpen}
          className={`
            fixed lg:static top-0 lg:top-auto left-0 bottom-0 lg:bottom-auto z-40
            ${desktopSidebarOpen ? 'lg:w-[256px]' : 'lg:w-0'} shrink-0 transition-all duration-200 overflow-hidden
            ${mobileConfigOpen ? 'translate-x-0 w-full max-w-[280px] sm:w-[272px]' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{
            backgroundColor: 'var(--surface)',
            borderRight: desktopSidebarOpen ? '1px solid var(--border)' : 'none',
          }}
        >
          <div className="w-full min-w-0 h-full">
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

          {isLoadingWasm ? (
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
          ) : (
            <CanvasStepBanner
              snapshot={currentSnapshot}
              algorithm={algorithm}
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              onNext={nextStep}
              onPrev={prevStep}
            />
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
            desktopSidebarOpen={desktopSidebarOpen}
            desktopInspectorOpen={desktopInspectorOpen}
          />
        </main>

        {/* Right Inspector (Desktop: resizable & expandable, Mobile: drawer) */}
        <div
          id="mobile-inspector-drawer"
          ref={mobileInspectorDrawerRef}
          tabIndex={-1}
          aria-hidden={!desktopInspectorOpen && !mobileInspectorOpen}
          className={`
            fixed lg:static top-0 lg:top-auto right-0 bottom-0 lg:bottom-auto z-40
            ${desktopInspectorOpen ? '' : 'lg:w-0'} shrink-0 transition-[width] duration-150 overflow-hidden relative
            ${mobileInspectorOpen ? 'translate-x-0 w-full max-w-[360px] sm:w-[360px]' : 'translate-x-full lg:translate-x-0'}
          `}
          style={{
            backgroundColor: 'var(--surface)',
            borderLeft: desktopInspectorOpen ? '1px solid var(--border)' : 'none',
            width: typeof window !== 'undefined' && window.innerWidth >= 1024
              ? (desktopInspectorOpen ? (isInspectorExpanded ? 580 : inspectorWidth) : 0)
              : undefined,
          }}
        >
          {/* Desktop Left-Edge Drag Resize Handle */}
          {desktopInspectorOpen && (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize step inspector panel width"
              onMouseDown={handleMouseDownResize}
              className="hidden lg:block absolute top-0 bottom-0 left-0 w-2.5 -ml-1 hover:w-3 cursor-col-resize z-50 group"
              title="Drag to resize inspector width"
            >
              <div
                className={`w-1 h-full mx-auto transition-colors rounded-full ${
                  isResizingInspector
                    ? 'bg-[var(--primary-action)] opacity-100'
                    : 'opacity-0 group-hover:opacity-80 bg-[var(--primary-action)]'
                }`}
              />
            </div>
          )}

          <div className="w-full min-w-0 h-full">
            <InfoPanel
              algorithm={algorithm}
              snapshot={currentSnapshot}
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              isExpanded={isInspectorExpanded}
              onToggleExpand={handleToggleExpandInspector}
            />
          </div>
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
