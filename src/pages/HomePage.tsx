import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Network,
  GitFork,
  Gauge,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  theme: 'dark' | 'light';
}

export const HomePage: React.FC<HomePageProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const algorithms = [
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      type: 'Single-Source Shortest Path',
      desc: 'Greedy algorithm utilizing a Binary Min-Heap Priority Queue to calculate optimal shortest paths on non-negative weighted graphs.',
      time: 'O((V + E) log V)',
      space: 'O(V)',
      icon: Gauge,
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
    },
    {
      id: 'bfs',
      name: 'Breadth-First Search (BFS)',
      type: 'Unweighted Shortest Path (Hops)',
      desc: 'Explores vertices layer-by-layer using a FIFO Queue. Guarantees the shortest path in terms of minimum edge count regardless of weight.',
      time: 'O(V + E)',
      space: 'O(V)',
      icon: Network,
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
    },
    {
      id: 'dfs',
      name: 'Depth-First Search (DFS)',
      type: 'Deep Traversal & Backtracking',
      desc: 'Dives deep down each graph path using a LIFO Stack until hitting dead ends. Does not guarantee the shortest path, demonstrating tree depth exploration.',
      time: 'O(V + E)',
      space: 'O(V)',
      icon: GitFork,
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
    },
  ];

  const highlights = [
    {
      title: 'Interactive Graph Canvas',
      desc: 'Add, drag, connect vertices, and edit edge weights dynamically with real-time validation.',
      icon: Sliders,
    },
    {
      title: 'Deterministic Time-Travel',
      desc: 'Step forward, step backward, pause, restart, or scrub through execution snapshots with zero side-effects.',
      icon: Compass,
    },
    {
      title: 'Internal Data Structure Inspector',
      desc: 'Watch the FIFO Queue, LIFO Stack, and Min-Heap Priority Queue update state alongside tentative distance tables.',
      icon: Sparkles,
    },
    {
      title: 'Live Pseudocode Highlighting',
      desc: 'Follow algorithm execution line-by-line as decision logic unfolds in human-readable commentary.',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className={`min-h-[calc(100vh-4rem)] overflow-y-auto ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 sm:px-12 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6 border bg-blue-500/10 border-blue-500/30 text-blue-400">
          <Sparkles className="w-4 h-4" />
          <span>Computer Engineering DAA Course Project • Phase 1</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans leading-tight">
          Master Graph Algorithms with{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            PathScope
          </span>
        </h1>

        <p className={`mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          An interactive, step-by-step visualizer for Breadth-First Search, Depth-First Search, and Dijkstra&apos;s shortest path algorithms. Built for students to explore graph theory visually.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/visualizer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <span>Start Visualizing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/algorithms"
            className={`px-6 py-3 rounded-xl font-semibold border transition-all ${
              isDark
                ? 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-200'
                : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-800 shadow-sm'
            }`}
          >
            Explore Algorithms
          </Link>
        </div>
      </section>

      {/* Algorithm Showcase Cards */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Supported Core Algorithms
          </h2>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Implemented with exact algorithmic rules, step-by-step state captures, and mathematical guarantees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {algorithms.map((algo) => {
            const Icon = algo.icon;
            return (
              <div
                key={algo.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isDark
                    ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border font-semibold ${algo.badgeColor}`}>
                      {algo.time}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold">{algo.name}</h3>
                  <div className={`text-xs font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {algo.type}
                  </div>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {algo.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-500/10 flex items-center justify-between">
                  <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Space: {algo.space}
                  </span>
                  <Link
                    to={`/visualizer?algo=${algo.id}`}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <span>Visualize</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className={`border-t py-16 px-6 ${isDark ? 'border-slate-800/80 bg-slate-900/30' : 'border-slate-200 bg-slate-100/60'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Designed for Deep Conceptual Learning
            </h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Every state transition is captured as an immutable snapshot for transparent inspection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className={`p-5 rounded-xl border ${
                    isDark ? 'border-slate-800/80 bg-slate-950/70' : 'border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold mb-1.5">{h.title}</h3>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {h.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
