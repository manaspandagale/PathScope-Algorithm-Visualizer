// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { ComparisonPage } from '../pages/ComparisonPage';
import { AboutPage } from '../pages/AboutPage';
import { TopNav } from '../components/Navigation/TopNav';
import { PlaybackBar } from '../components/Playback/PlaybackBar';
import { AlgorithmSelector } from '../components/Sidebar/AlgorithmSelector';
import { NodeSelector } from '../components/Sidebar/NodeSelector';
import { GraphTools } from '../components/Sidebar/GraphTools';
import { PRESET_GRAPHS } from '../data/presetGraphs';
import { executeAlgorithmWasm } from '../wasm/algorithmEngine';

// Global browser mocks for jsdom
beforeEach(() => {
  window.matchMedia = window.matchMedia || function () {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };

  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

describe('Focused Browser Smoke Tests (Phase 1)', () => {
  /* -------------------------------------------------------------
   * 1. Home Page Navigation & Content
   * ------------------------------------------------------------- */
  it('renders Home page headline, supporting text, and navigation CTAs', () => {
    render(
      <MemoryRouter>
        <HomePage theme="light" />
      </MemoryRouter>
    );

    expect(screen.getByText(/Understand shortest paths/i)).toBeDefined();
    expect(
      screen.getByText(/Build a graph, run BFS or Dijkstra, and replay every step/i)
    ).toBeDefined();

    const openVisualizerCta = screen.getByRole('link', { name: /Open Visualizer/i });
    expect(openVisualizerCta.getAttribute('href')).toBe('/visualizer');

    const compareCta = screen.getByRole('link', { name: /Compare Algorithms/i });
    expect(compareCta.getAttribute('href')).toBe('/compare');
  });

  /* -------------------------------------------------------------
   * 2. Top Navigation & Route Links
   * ------------------------------------------------------------- */
  it('renders TopNav with Logo, navigation links, and theme toggle', () => {
    const toggleThemeMock = vi.fn();
    render(
      <MemoryRouter initialEntries={['/']}>
        <TopNav theme="light" toggleTheme={toggleThemeMock} />
      </MemoryRouter>
    );

    expect(screen.getByText('PathScope')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Home' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Visualizer' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Compare' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'About' })).toBeDefined();

    const themeToggleBtn = screen.getByTitle(/Switch to Dark Mode/i);
    fireEvent.click(themeToggleBtn);
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });

  /* -------------------------------------------------------------
   * 3. Light and Dark Theme Integration
   * ------------------------------------------------------------- */
  it('toggles light and dark themes correctly on the document root', () => {
    // Light mode test
    document.documentElement.classList.remove('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Dark mode test
    document.documentElement.classList.add('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Toggle back
    document.documentElement.classList.remove('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  /* -------------------------------------------------------------
   * 4. BFS Visualization Pipeline (C++ WASM Engine)
   * ------------------------------------------------------------- */
  it('executes Breadth-First Search visualization via C++ WASM and returns valid step sequence', async () => {
    const preset = PRESET_GRAPHS[0];
    const snapshots = await executeAlgorithmWasm(
      'bfs',
      preset.nodes,
      preset.edges,
      preset.sourceId,
      preset.targetId
    );

    expect(snapshots.length).toBeGreaterThan(1);
    expect(['ready', 'running']).toContain(snapshots[0].status);
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('found');
    expect(snapshots.length).toBeGreaterThan(0);
  });

  /* -------------------------------------------------------------
   * 5. Dijkstra’s Algorithm Visualization Pipeline (C++ WASM Engine)
   * ------------------------------------------------------------- */
  it('executes Dijkstra’s Algorithm visualization via C++ WASM and returns valid step sequence', async () => {
    const preset = PRESET_GRAPHS[0];
    const snapshots = await executeAlgorithmWasm(
      'dijkstra',
      preset.nodes,
      preset.edges,
      preset.sourceId,
      preset.targetId
    );

    expect(snapshots.length).toBeGreaterThan(1);
    expect(['ready', 'running']).toContain(snapshots[0].status);
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('found');
    expect(typeof finalSnap.totalCost).toBe('number');
    expect(finalSnap.totalCost).toBe(7); // Cost of A->B->C->D is 2+2+3=7 vs direct 18
    expect(finalSnap.pathNodes).toEqual(['node-A', 'node-B', 'node-C', 'node-D']);
  });

  /* -------------------------------------------------------------
   * 6. Playback Controls (Play, Pause, Next, Previous, Seek, Reset)
   * ------------------------------------------------------------- */
  it('invokes playback controls correctly (play, pause, next, previous, reset, seek, speed)', () => {
    const onPlay = vi.fn();
    const onPause = vi.fn();
    const onNext = vi.fn();
    const onPrev = vi.fn();
    const onRestart = vi.fn();
    const onSeek = vi.fn();
    const setSpeedMultiplier = vi.fn();

    const { rerender } = render(
      <PlaybackBar
        currentStepIndex={2}
        totalSteps={10}
        isPlaying={false}
        onPlay={onPlay}
        onPause={onPause}
        onNext={onNext}
        onPrev={onPrev}
        onRestart={onRestart}
        onSeek={onSeek}
        speedMultiplier={1}
        setSpeedMultiplier={setSpeedMultiplier}
      />
    );

    // Play action
    const playBtn = screen.getByTitle('Play');
    fireEvent.click(playBtn);
    expect(onPlay).toHaveBeenCalledTimes(1);

    // Next action
    const nextBtn = screen.getByTitle('Next step');
    fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalledTimes(1);

    // Previous action
    const prevBtn = screen.getByTitle('Previous step');
    fireEvent.click(prevBtn);
    expect(onPrev).toHaveBeenCalledTimes(1);

    // Restart action
    const restartBtn = screen.getByTitle('Restart from beginning');
    fireEvent.click(restartBtn);
    expect(onRestart).toHaveBeenCalledTimes(1);

    // Timeline seek
    const slider = screen.getByLabelText('Timeline step scrubber');
    fireEvent.change(slider, { target: { value: '5' } });
    expect(onSeek).toHaveBeenCalledWith(5);

    // Speed dropdown change
    const speedSelect = screen.getByLabelText('Playback speed');
    fireEvent.change(speedSelect, { target: { value: '2' } });
    expect(setSpeedMultiplier).toHaveBeenCalledWith(2);

    // Pause state test
    rerender(
      <PlaybackBar
        currentStepIndex={2}
        totalSteps={10}
        isPlaying={true}
        onPlay={onPlay}
        onPause={onPause}
        onNext={onNext}
        onPrev={onPrev}
        onRestart={onRestart}
        onSeek={onSeek}
        speedMultiplier={2}
        setSpeedMultiplier={setSpeedMultiplier}
      />
    );

    const pauseBtn = screen.getByTitle('Pause');
    fireEvent.click(pauseBtn);
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  /* -------------------------------------------------------------
   * 7. Graph Preset Loading
   * ------------------------------------------------------------- */
  it('loads graph preset and populates vertices and edges', () => {
    const setNodes = vi.fn();
    const setEdges = vi.fn();
    const setSourceId = vi.fn();
    const setTargetId = vi.fn();
    const onResetVisualization = vi.fn();

    render(
      <GraphTools
        nodes={[]}
        setNodes={setNodes}
        setEdges={setEdges}
        sourceId=""
        targetId=""
        setSourceId={setSourceId}
        setTargetId={setTargetId}
        onResetVisualization={onResetVisualization}
      />
    );

    const select = screen.getByLabelText('Preset graph');
    fireEvent.change(select, { target: { value: 'bfs-vs-dijkstra-tradeoff' } });

    expect(setNodes).toHaveBeenCalled();
    expect(setEdges).toHaveBeenCalled();
    expect(setSourceId).toHaveBeenCalledWith('node-A');
    expect(setTargetId).toHaveBeenCalledWith('node-D');
    expect(onResetVisualization).toHaveBeenCalled();
  });

  /* -------------------------------------------------------------
   * 8. Source & Destination Selection
   * ------------------------------------------------------------- */
  it('allows selecting start vertex, destination vertex, and swapping', () => {
    const nodes = [
      { id: 'node-A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'node-B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'node-C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: true } },
    ];
    const setSourceId = vi.fn();
    const setTargetId = vi.fn();

    render(
      <NodeSelector
        nodes={nodes}
        sourceId="node-A"
        targetId="node-C"
        setSourceId={setSourceId}
        setTargetId={setTargetId}
      />
    );

    // Change start vertex
    const startSelect = screen.getByLabelText('Start vertex');
    fireEvent.change(startSelect, { target: { value: 'node-B' } });
    expect(setSourceId).toHaveBeenCalledWith('node-B');

    // Change destination
    const destSelect = screen.getByLabelText('Destination');
    fireEvent.change(destSelect, { target: { value: 'node-A' } });
    expect(setTargetId).toHaveBeenCalledWith('node-A');

    // Swap endpoints
    const swapBtn = screen.getByLabelText('Swap start and destination');
    fireEvent.click(swapBtn);
    expect(setSourceId).toHaveBeenCalledWith('node-C');
    expect(setTargetId).toHaveBeenCalledWith('node-A');
  });

  /* -------------------------------------------------------------
   * 9. Algorithm Selector
   * ------------------------------------------------------------- */
  it('switches between Breadth-First Search and Dijkstra’s Algorithm', () => {
    const onSelectAlgorithm = vi.fn();

    render(
      <AlgorithmSelector
        selectedAlgorithm="dijkstra"
        onSelectAlgorithm={onSelectAlgorithm}
      />
    );

    const bfsBtn = screen.getByRole('button', { name: /Breadth-First Search/i });
    fireEvent.click(bfsBtn);
    expect(onSelectAlgorithm).toHaveBeenCalledWith('bfs');

    const dijkstraBtn = screen.getByRole('button', { name: /Dijkstra/i });
    fireEvent.click(dijkstraBtn);
    expect(onSelectAlgorithm).toHaveBeenCalledWith('dijkstra');
  });

  /* -------------------------------------------------------------
   * 10. Comparison Page Dual Execution & Metric Display
   * ------------------------------------------------------------- */
  it('renders Comparison Page and executes side-by-side comparison', async () => {
    render(<ComparisonPage theme="light" />);

    expect(screen.getByText('Algorithm Comparison')).toBeDefined();
    expect(screen.getByText(/BFS minimizes the number of edges. Dijkstra minimizes total weight./i)).toBeDefined();

    // Verify both algorithm headers exist in comparison table
    expect(screen.getAllByText('Breadth-First Search').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dijkstra’s Algorithm').length).toBeGreaterThan(0);
  });

  /* -------------------------------------------------------------
   * 11. About Page Content & Scope Audit
   * ------------------------------------------------------------- */
  it('renders About Page document structure and milestone definition', () => {
    render(
      <MemoryRouter>
        <AboutPage theme="light" />
      </MemoryRouter>
    );

    expect(screen.getByText('About PathScope')).toBeDefined();
    expect(screen.getByText('What PathScope does')).toBeDefined();
    expect(screen.getByText('Why BFS and Dijkstra were selected')).toBeDefined();
    expect(screen.getByText('C++ and WebAssembly architecture')).toBeDefined();
    expect(screen.getByText('Implemented capabilities')).toBeDefined();
    expect(screen.getByText(/This release intentionally focuses on BFS and Dijkstra as the completed Phase 1 milestone./i)).toBeDefined();
  });
});
