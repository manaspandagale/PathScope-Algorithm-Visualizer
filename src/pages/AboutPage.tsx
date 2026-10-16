import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Layers } from 'lucide-react';

interface AboutPageProps {
  theme: 'dark' | 'light';
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  const stackItems = [
    { title: 'C++17 Engine', detail: 'Pure algorithmic core. Graph adjacency lists, FIFO queue traversals, priority queues, and distance relaxation algorithms.' },
    { title: 'WebAssembly (Emscripten)', detail: 'Direct compilation of C++ source files into a high-efficiency WASM module, executing with zero-overhead in browser memory.' },
    { title: 'React 19 & TypeScript', detail: 'Declarative user interface, type-safe WASM bridge contracts, and reactive state management.' },
    { title: 'React Flow (@xyflow/react)', detail: 'Interactive canvas plane for topological node placement, drag-and-drop mechanics, and custom edge connections.' },
    { title: 'Typography & Design System', detail: 'Locally bundled Instrument Sans Variable for interface typography, IBM Plex Mono for pseudocode and technical metrics.' },
    { title: 'Deterministic Testing', detail: '11/11 native C++ validation tests + 19/19 Vitest integration tests ensuring exact step-by-step invariant compliance.' },
  ];

  const phase1Deliverables = [
    'Pure C++17 Graph, BFS, and Dijkstra algorithm modules',
    'Emscripten WebAssembly single-call batch snapshot protocol',
    'Interactive vertex editing (add, delete, drag, auto-label)',
    'Weighted undirected edge creation and real-time weight modification',
    'C++ guard rejecting negative edge weights for Dijkstra with banner notification',
    'Deterministic time-travel scrubber (play/pause, step forward/backward, speed multiplier)',
    '4-tab synchronised inspector (Explanation, Pseudocode with line highlight, Live Data structures, and Result metrics)',
    'Two-algorithm side-by-side comparative analysis benchmark suite',
    'Dual-theme design system: Warm Beige light theme and Neutral Charcoal dark theme',
  ];

  const phase2FutureScope = [
    'Depth-First Search (DFS) with LIFO recursive stack visualization',
    'Directed Acyclic Graph (DAG) Shortest Path via Topological Sorting',
    'Floyd–Warshall All-Pairs Shortest Path dynamic programming matrix',
    'Bellman–Ford algorithm with negative cycle detection',
    'Algorithmic graph generators (grid, binary tree, Erdos–Renyi random)',
    'Interactive challenge mode with step prediction exercises',
    'Custom JSON graph topology export and import',
  ];

  return (
    <div
      className="min-h-[calc(100vh-68px)] overflow-y-auto px-6 py-14"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      <article className="max-w-4xl mx-auto space-y-14">
        {/* Document Header */}
        <header className="border-b pb-8" style={{ borderColor: 'var(--border)' }}>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono font-medium mb-4 border"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border-strong)',
              color: 'var(--text-secondary)',
            }}
          >
            <span>DAA Course Project Specification • Milestone 1</span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            PathScope Architecture & Scope
          </h1>

          <p
            className="mt-4 text-lg leading-relaxed max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            A high-fidelity algorithm visualizer designed to demystify graph traversal, queue mechanics, and greedy relaxation through deterministic C++ WebAssembly execution.
          </p>
        </header>

        {/* Section 1: Academic Purpose & Architecture */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Why C++ WebAssembly?
            </h2>
          </div>

          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Most educational algorithm visualizations in JavaScript use loose setTimeouts, artificial delays, or simplified object references. This obscures how real systems implement graph data structures.
          </p>

          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            PathScope computes all graph logic strictly in <strong>native C++17</strong>. When an algorithm runs, the entire graph topology is serialized and passed across the WebAssembly boundary into compiled C++ code. The C++ engine executes standard library data structures (<code className="font-mono text-xs px-1.5 py-0.5 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>std::queue</code>, <code className="font-mono text-xs px-1.5 py-0.5 rounded border" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border)' }}>std::priority_queue</code>) and generates an immutable sequence of step snapshots. React and TypeScript act exclusively as a presentation and playback dock.
          </p>
        </section>

        {/* Section 2: Technology Specifications Definition List */}
        <section className="space-y-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Technology Specifications
            </h2>
          </div>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {stackItems.map((item, i) => (
              <div
                key={i}
                className="p-5 rounded-md border"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                <dt className="font-mono font-bold text-sm" style={{ color: 'var(--accent)' }}>
                  {item.title}
                </dt>
                <dd className="mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {item.detail}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Section 3: 50% Milestone Scope vs Future Scope */}
        <section className="space-y-6 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Project Milestone Scope Audit
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Strictly representing the 50% course project milestone. Exactly two algorithms are supported in Phase 1.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Completed Deliverables */}
            <div
              className="p-6 rounded-md border space-y-4"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border-strong)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-bold text-base" style={{ color: 'var(--secondary-accent)' }}>
                  Phase 1 (Completed 50%)
                </span>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded border font-semibold"
                  style={{
                    backgroundColor: 'var(--secondary-subtle)',
                    borderColor: 'var(--secondary-accent)',
                    color: 'var(--secondary-accent)',
                  }}
                >
                  DELIVERED
                </span>
              </div>

              <ul className="space-y-2.5">
                {phase1Deliverables.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: 'var(--secondary-accent)' }}
                    />
                    <span className="leading-snug" style={{ color: 'var(--text-primary)' }}>
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Planned Future Deliverables */}
            <div
              className="p-6 rounded-md border space-y-4"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="font-bold text-base" style={{ color: 'var(--text-secondary)' }}>
                  Phase 2 (Future Scope)
                </span>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded border font-semibold"
                  style={{
                    backgroundColor: 'var(--background-secondary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                  }}
                >
                  DEFERRED
                </span>
              </div>

              <ul className="space-y-2.5">
                {phase2FutureScope.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: 'var(--text-muted)' }}
                    />
                    <span className="leading-snug" style={{ color: 'var(--text-secondary)' }}>
                      {d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Footer Navigation Link */}
        <footer className="pt-6 border-t flex justify-end" style={{ borderColor: 'var(--border)' }}>
          <Link
            to="/visualizer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none min-h-[44px]"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#FFFDF8',
            }}
          >
            <span>Open Visualizer Workbench</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default AboutPage;
