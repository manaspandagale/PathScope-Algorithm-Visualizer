import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface AboutPageProps {
  theme: 'dark' | 'light';
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <div
      className="min-h-[calc(100vh-64px)] overflow-y-auto px-6 py-12"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      <article className="max-w-3xl mx-auto space-y-12">
        {/* Document Header */}
        <header className="border-b pb-8" style={{ borderColor: 'var(--border)' }}>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            About PathScope
          </h1>
          <p
            className="mt-3 text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            An interactive educational visualizer designed for studying graph shortest path algorithms through deterministic, step-by-step execution.
          </p>
        </header>

        {/* 1. What PathScope Does */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            What PathScope does
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            PathScope lets students and developers build arbitrary graphs, set non-negative edge weights, choose a source and destination, and inspect algorithmic state transitions in real time. Rather than observing only the final computed route, users step through each queue push and pop, edge relaxation, and distance update as it occurs.
          </p>
        </section>

        {/* 2. Why BFS and Dijkstra Were Selected */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Why BFS and Dijkstra were selected
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Breadth-First Search (BFS) and Dijkstra’s Algorithm together form the foundation of single-source shortest path theory:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2" style={{ color: 'var(--text-secondary)' }}>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Breadth-First Search:</strong> Operates on unweighted graphs using a standard FIFO queue. It minimizes the total count of traversed edges (hop count) in linear time <code className="font-mono text-xs px-1 py-0.5 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>O(V + E)</code>.
            </li>
            <li>
              <strong style={{ color: 'var(--text-primary)' }}>Dijkstra’s Algorithm:</strong> Operates on graphs with non-negative edge weights using a priority queue (min-heap). It minimizes the cumulative edge weight sum in <code className="font-mono text-xs px-1 py-0.5 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>O((V + E) log V)</code>.
            </li>
          </ul>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Comparing these two algorithms on the same topology highlights the critical distinction between hop-optimality and weight-optimality.
          </p>
        </section>

        {/* 3. C++ / WebAssembly Architecture */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            C++ and WebAssembly architecture
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            All graph representation, validation, and algorithm execution logic is written in native C++17 and compiled to WebAssembly via Emscripten.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            When an execution is initiated, the graph is serialized into C++ memory where standard library structures (<code className="font-mono text-xs px-1 py-0.5 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>std::queue</code> and <code className="font-mono text-xs px-1 py-0.5 rounded border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>std::priority_queue</code>) compute an immutable sequence of step snapshots. React and TypeScript handle user interactions, graph manipulation, and timeline playback.
          </p>
        </section>

        {/* 4. Completed Milestone */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Completed milestone
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            This version represents the completed 50% course project milestone:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
            <li>Native C++17 implementations of BFS and Dijkstra’s Algorithm.</li>
            <li>Bidirectional WebAssembly bridge with batch snapshot serialization.</li>
            <li>Interactive graph editor with vertex positioning and edge weight configuration.</li>
            <li>Full playback dock: play, pause, step forward, step backward, seek, and speed control.</li>
            <li>Synchronized inspector: step explanation, pseudocode highlighting, data structure state, and final metrics.</li>
            <li>Side-by-side comparative analysis benchmark on identical topologies.</li>
          </ul>
        </section>

        {/* 5. Future Scope */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Future scope
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Planned extensions for subsequent project phases:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
            <li>Depth-First Search (DFS) with call stack visualization.</li>
            <li>Bellman–Ford algorithm with negative edge weights and negative cycle detection.</li>
            <li>Floyd–Warshall all-pairs shortest path matrix visualizer.</li>
            <li>Topological sort and DAG shortest path algorithm.</li>
            <li>Graph import and export in JSON format.</li>
          </ul>
        </section>

        {/* Footer CTA */}
        <footer className="pt-8 border-t flex justify-between items-center" style={{ borderColor: 'var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            PathScope Visualizer
          </span>
          <Link
            to="/visualizer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none min-h-[40px]"
            style={{
              backgroundColor: 'var(--primary-action)',
              color: '#FFFFFF',
            }}
          >
            <span>Launch Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </footer>
      </article>
    </div>
  );
};

export default AboutPage;
