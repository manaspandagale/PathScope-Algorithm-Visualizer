import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Node, Edge } from '@xyflow/react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from './types/graph';
import { PRESET_GRAPHS } from './data/presetGraphs';
import { TopNav } from './components/Navigation/TopNav';

// Route-level code splitting for production bundle optimization
const HomePage = React.lazy(() => import('./pages/HomePage'));
const VisualizerPage = React.lazy(() => import('./pages/VisualizerPage'));
const ComparisonPage = React.lazy(() => import('./pages/ComparisonPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));

export const App: React.FC = () => {
  // Theme state with localStorage persistence and prefers-color-scheme check
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('pathscope-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light'; // Default to our beautiful warm beige
  });

  useEffect(() => {
    localStorage.setItem('pathscope-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Initial graph preset: DAA Textbook Classic
  const initialPreset = PRESET_GRAPHS[0];
  const [nodes, setNodes] = useState<Node<GraphNodeData>[]>(initialPreset.nodes);
  const [edges, setEdges] = useState<Edge<GraphEdgeData>[]>(initialPreset.edges);
  const [sourceId, setSourceId] = useState<string>(initialPreset.sourceId);
  const [targetId, setTargetId] = useState<string>(initialPreset.targetId);

  // Algorithm selection
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <BrowserRouter>
      <div
        className="w-full h-dvh flex flex-col overflow-hidden font-sans"
        style={{
          backgroundColor: 'var(--background)',
          color: 'var(--text-primary)',
        }}
      >
        {/* Top Navigation */}
        <TopNav
          theme={theme}
          toggleTheme={toggleTheme}
        />

        {/* Primary Page Routes with Suspense Boundary */}
        <div className="flex-1 min-h-0 overflow-hidden relative">
          <React.Suspense
            fallback={
              <div
                className="w-full h-full flex flex-col select-none"
                style={{
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-secondary)',
                }}
              >
                {/* Subtle top progress bar */}
                <div className="w-full h-[2px] bg-black/5 dark:bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-[var(--primary-action)] animate-pulse"
                    style={{ width: '60%' }}
                  />
                </div>
                {/* Layout skeleton */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-mono"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderColor: 'var(--border)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 border-t-transparent animate-spin"
                      style={{
                        borderColor: 'var(--border-strong)',
                        borderTopColor: 'var(--primary-action)',
                      }}
                    />
                    <span>Loading module...</span>
                  </div>
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<HomePage theme={theme} />} />
              <Route
                path="/visualizer"
                element={
                  <VisualizerPage
                    theme={theme}
                    nodes={nodes}
                    setNodes={setNodes}
                    edges={edges}
                    setEdges={setEdges}
                    sourceId={sourceId}
                    setSourceId={setSourceId}
                    targetId={targetId}
                    setTargetId={setTargetId}
                    algorithm={algorithm}
                    setAlgorithm={setAlgorithm}
                    selectedNodeId={selectedNodeId}
                    setSelectedNodeId={setSelectedNodeId}
                  />
                }
              />
              <Route path="/compare" element={<ComparisonPage theme={theme} />} />
              <Route path="/about" element={<AboutPage theme={theme} />} />
              {/* Redirect any legacy routes to visualizer or home */}
              <Route path="/algorithms" element={<Navigate to="/visualizer" replace />} />
              <Route path="/learn" element={<Navigate to="/about" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
