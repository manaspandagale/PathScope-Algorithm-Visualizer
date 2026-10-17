import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Layers, GitCompare } from 'lucide-react';
import { Button } from '../components/UI/Button';

interface AboutPageProps {
  theme: 'dark' | 'light';
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <div
      className="h-full min-h-0 overflow-y-auto overscroll-y-contain px-6 pt-6 pb-12 select-none"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      <article className="max-w-3xl mx-auto space-y-10">
        {/* Document Header */}
        <header className="border-b pb-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded border uppercase"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              Academic Documentation
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            About PathScope
          </h1>
          <p
            className="mt-2 text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            An interactive educational laboratory designed for rigorous study of graph shortest path algorithms through deterministic, step-by-step state inspection.
          </p>
        </header>

        {/* 1. Core Purpose */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Layers className="w-4 h-4 text-[var(--primary-action)]" />
            <span>What PathScope does</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Graph algorithms in computer science textbooks are frequently presented as abstract pseudocode or static final paths. PathScope lets students and researchers construct custom topologies, configure non-negative edge costs, choose source and destination vertices, and step through each algorithmic decision (queue push/pop, tentative distance relaxation, and settled vertex marking) in real time.
          </p>
        </section>

        {/* 2. Canonical Algorithms */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <GitCompare className="w-4 h-4 text-[var(--primary-action)]" />
            <span>Why BFS and Dijkstra were selected</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Breadth-First Search (BFS) and Dijkstra’s Algorithm represent the two canonical foundations of single-source shortest path theory:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div
              className="p-4 rounded-xl border text-xs"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="font-semibold text-sm mb-1 text-[var(--text-primary)]">
                Breadth-First Search
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                Operates on unweighted graphs using a FIFO queue (<code className="font-mono">std::queue</code>). It minimizes the number of edge hops in linear time <code className="font-mono font-bold">O(V + E)</code>.
              </p>
            </div>

            <div
              className="p-4 rounded-xl border text-xs"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="font-semibold text-sm mb-1 text-[var(--text-primary)]">
                Dijkstra’s Algorithm
              </div>
              <p className="leading-relaxed text-[var(--text-secondary)]">
                Operates on non-negative weighted graphs using a min-heap (<code className="font-mono">std::priority_queue</code>). It minimizes the cumulative path weight in <code className="font-mono font-bold">O((V + E) log V)</code>.
              </p>
            </div>
          </div>
        </section>

        {/* 3. C++17 & WebAssembly Architecture */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Cpu className="w-4 h-4 text-[var(--primary-action)]" />
            <span>C++ and WebAssembly architecture</span>
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            All graph data structures, validation constraints, and algorithm execution logic are implemented in native C++17 and compiled to WebAssembly via Emscripten. The React/TypeScript frontend serves purely as the presentation, graph editing, and playback interface:
          </p>

          <div
            className="p-4 rounded-xl border font-mono text-xs overflow-x-auto leading-relaxed"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            Graph Editor (React Flow)
            <br />
            &nbsp;&nbsp;→ TypeScript Serialization
            <br />
            &nbsp;&nbsp;→ Emscripten WebAssembly Bridge
            <br />
            &nbsp;&nbsp;→ C++17 Algorithm Engine (bfs.cpp & dijkstra.cpp)
            <br />
            &nbsp;&nbsp;→ Deterministic Step Snapshots (std::vector&lt;StepSnapshot&gt;)
            <br />
            &nbsp;&nbsp;→ Playback Dock & Visual Inspection
          </div>
        </section>

        {/* 4. Current 50% Milestone & Roadmap */}
        <section className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Completed milestone
          </h2>

          <div className="space-y-3">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[var(--primary-action)]">
                  Completed 50% Milestone (Current Production Release)
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--primary-subtle)] text-[var(--primary-action)] font-bold">
                  100% Verified
                </span>
              </div>
              <ul className="list-disc pl-5 text-xs space-y-1.5 text-[var(--text-secondary)]">
                <li>Native C++17 canonical engines for BFS and Dijkstra.</li>
                <li>Bidirectional WebAssembly bridge with batch snapshot memory serialization.</li>
                <li>Interactive graph canvas with custom node geometry and weighted edges.</li>
                <li>Coordinated transport playback dock with scrub slider and speed multiplier.</li>
                <li>Educational inspector with synchronized pseudocode, explanation, and data structures.</li>
                <li>Benchmark comparison tool with side-by-side metric analytics.</li>
              </ul>
            </div>

            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: 'var(--background-secondary)',
                borderColor: 'var(--border)',
                opacity: 0.85,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-[var(--text-muted)]">
                  Future scope
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)]">
                  Future Work
                </span>
              </div>
              <ul className="list-disc pl-5 text-xs space-y-1.5 text-[var(--text-muted)]">
                <li>Depth-First Search (DFS) with recursion call-stack inspection.</li>
                <li>Bellman-Ford algorithm with negative edge detection and arbitrary cycles.</li>
                <li>Floyd-Warshall all-pairs dynamic programming matrix.</li>
                <li>DAG shortest path and topological ordering visualizer.</li>
                <li>A* heuristic search with Euclidean distance estimators.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="pt-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            PathScope v0.5.0
          </span>
          <Link to="/visualizer">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Launch Visualizer
            </Button>
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default AboutPage;
