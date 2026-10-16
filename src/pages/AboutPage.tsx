import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Code2,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface AboutPageProps {
  theme: 'dark' | 'light';
}

export const AboutPage: React.FC<AboutPageProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const techStack = [
    { name: 'React 19', desc: 'Modern reactive UI component architecture and state hooks' },
    { name: 'TypeScript', desc: 'Strict compile-time type safety and algorithmic data models' },
    { name: 'React Flow (@xyflow/react)', desc: 'Interactive node-edge graph canvas, handles, and panning' },
    { name: 'Tailwind CSS v4', desc: 'High-performance utility styling and responsive dark/light modes' },
    { name: 'React Router v7', desc: 'Client-side SPA multi-page navigation without page reloads' },
    { name: 'Vitest', desc: 'Fast automated unit testing for graph algorithm correctness' },
    { name: 'Lucide React', desc: 'Crisp SVG iconography for accessible educational interfaces' },
    { name: 'Vite 8', desc: 'Blazing fast ESM dev server and production bundler' },
  ];

  const phase1Features = [
    'Interactive Graph Editor (Add, Delete, Connect, Drag, Weight Editing)',
    'Breadth-First Search (FIFO Queue, Hop-optimal pathfinding)',
    'Depth-First Search (LIFO Stack, Exploration & Backtracking)',
    "Dijkstra's Algorithm (Min-Heap Priority Queue, Tentative Distance Relaxation)",
    'Deterministic Time-Travel Playback (Play/Pause, Step Next/Prev, Speed Multipliers)',
    'Live Internal State Inspector (Queue, Stack, Min-Heap, Distance Table)',
    'Dynamic Pseudocode Line Highlighting',
    'Responsive Multi-Page Architecture with Dark & Light theme',
  ];

  const phase2Roadmap = [
    'DAG Shortest Path (Topological Sort based O(V+E) algorithm)',
    'Floyd–Warshall (All-Pairs Shortest Path dynamic programming matrix)',
    'Bellman-Ford (Negative edge weights and negative cycle detection)',
    'Algorithm Comparison Dashboard (Synchronized side-by-side execution)',
    'Benchmark Performance Charts (Execution runtime & operations count)',
    'Web Workers (Background thread execution for graphs with 100+ nodes)',
    'Challenge / Quiz Mode (Interactive graph theory student puzzles)',
    'JSON Graph Import & Export (Save and load custom graph topologies)',
  ];

  return (
    <div className={`min-h-[calc(100vh-4rem)] overflow-y-auto px-6 py-12 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border bg-indigo-500/10 border-indigo-500/30 text-indigo-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Third-Year Computer Engineering DAA Project</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About PathScope
          </h1>
          <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Bridging theoretical textbook algorithms with transparent, interactive visualization.
          </p>
        </div>

        {/* Project Objectives & DAA Relevance */}
        <div className={`p-6 sm:p-8 rounded-2xl border space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold">Academic Objectives & DAA Relevance</h2>
          </div>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Graph theory and shortest path algorithms are cornerstone topics in the <strong>Design and Analysis of Algorithms (DAA)</strong> curriculum. While students study greedy algorithms, graph traversals, and dynamic programming on paper, visualizing how priorities shift in a heap, how BFS radiates in hops, or how DFS backtracks from dead-ends is often challenging without visual aids.
          </p>
          <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <strong>PathScope</strong> was created to give students complete control over graph creation, deterministic time-travel stepping, and real-time inspection of internal data structures like FIFO queues, LIFO stacks, and Min-Heap distance tables.
          </p>
        </div>

        {/* Technology Stack Grid */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold">Modern Technology Stack</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  isDark ? 'border-slate-800/80 bg-slate-900/40' : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                <div className="text-xs font-bold text-blue-400 mb-1">{tech.name}</div>
                <div className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {tech.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 1 vs Phase 2 Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phase 1: Completed */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'border-emerald-500/30 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-emerald-400">Phase 1: Completed (40–50%)</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40">
                ACTIVE
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {phase1Features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phase 2: Planned */}
          <div className={`p-6 rounded-2xl border space-y-4 ${
            isDark ? 'border-indigo-500/30 bg-indigo-950/20' : 'border-indigo-200 bg-indigo-50/50'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-indigo-400">Phase 2: Roadmap (50–60%)</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/40">
                PLANNED
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {phase2Roadmap.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-4 text-center">
          <Link
            to="/visualizer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <span>Launch Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
