import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import type { Node, Edge } from '@xyflow/react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from './types/graph';
import { PRESET_GRAPHS } from './data/presetGraphs';
import { TopNav } from './components/Navigation/TopNav';
import { HomePage } from './pages/HomePage';
import { VisualizerPage } from './pages/VisualizerPage';
import { AlgorithmsPage } from './pages/AlgorithmsPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { LearnPage } from './pages/LearnPage';
import { AboutPage } from './pages/AboutPage';
import { ComingSoonModal } from './components/Navigation/ComingSoonModal';
import { GuideModal } from './components/Navigation/GuideModal';

export const App: React.FC = () => {
  // Global Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initial graph preset: DAA Textbook Classic
  const initialPreset = PRESET_GRAPHS[0];
  const [nodes, setNodes] = useState<Node<GraphNodeData>[]>(initialPreset.nodes);
  const [edges, setEdges] = useState<Edge<GraphEdgeData>[]>(initialPreset.edges);
  const [sourceId, setSourceId] = useState<string>(initialPreset.sourceId);
  const [targetId, setTargetId] = useState<string>(initialPreset.targetId);

  // Algorithm selection
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modals state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState<boolean>(false);

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_GRAPHS.find((p) => p.id === presetId);
    if (!preset) return;
    setNodes(preset.nodes);
    setEdges(preset.edges);
    setSourceId(preset.sourceId);
    setTargetId(preset.targetId);
    setSelectedNodeId(null);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <BrowserRouter>
      <div className={`w-screen h-screen flex flex-col overflow-hidden font-sans ${isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        {/* Consistent Top Navigation */}
        <TopNav
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenGuide={() => setIsGuideOpen(true)}
          onOpenComingSoon={() => setIsComingSoonOpen(true)}
          onSelectPreset={handleSelectPreset}
        />

        {/* Multi-Page Routes */}
        <div className="flex-1 overflow-hidden relative">
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
                  isGuideOpen={isGuideOpen}
                  setIsGuideOpen={setIsGuideOpen}
                  isComingSoonOpen={isComingSoonOpen}
                  setIsComingSoonOpen={setIsComingSoonOpen}
                />
              }
            />
            <Route path="/algorithms" element={<AlgorithmsPage theme={theme} />} />
            <Route path="/compare" element={<ComparisonPage theme={theme} />} />
            <Route path="/learn" element={<LearnPage theme={theme} />} />
            <Route path="/about" element={<AboutPage theme={theme} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Global Modals */}
        <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        <ComingSoonModal isOpen={isComingSoonOpen} onClose={() => setIsComingSoonOpen(false)} />
      </div>
    </BrowserRouter>
  );
};

export default App;
