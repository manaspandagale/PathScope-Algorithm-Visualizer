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
        className="w-screen h-screen flex flex-col overflow-hidden font-sans"
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
        <div className="flex-1 overflow-hidden relative">
          <React.Suspense
            fallback={
              <div
                className="w-full h-full flex items-center justify-center text-sm font-medium"
                style={{
                  backgroundColor: 'var(--background)',
                  color: 'var(--text-secondary)',
                }}
              >
                Loading...
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
