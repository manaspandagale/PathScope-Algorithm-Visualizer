import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Compass, Network, Gauge } from 'lucide-react';

interface HomePageProps {
  theme: 'dark' | 'light';
}

export const HomePage: React.FC<HomePageProps> = () => {
  const algorithms = [
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      abbr: 'BFS',
      purpose: 'Discovers the shortest path by layer-by-layer traversal without considering edge costs.',
      dataStructure: 'FIFO Queue (std::queue in C++)',
      complexity: 'O(V + E) time • O(V) space',
      bestFor: 'Unweighted graphs, minimum-hop packet routing, bipartite checking, and network broadcast.',
      guarantee: 'Guarantees strictly minimum number of hops.',
      icon: Network,
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      abbr: 'Dijkstra',
      purpose: 'Greedily explores vertices in order of tentative distance to minimize total edge weight.',
      dataStructure: 'Binary Min-Heap Priority Queue (std::priority_queue in C++)',
      complexity: 'O((V + E) log V) time • O(V + E) space',
      bestFor: 'Road networks, latency-weighted routing, transit schedules with non-negative weights.',
      guarantee: 'Guarantees minimum cumulative weight for non-negative edges (w ≥ 0).',
      icon: Gauge,
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Build a Graph',
      desc: 'Plot vertices onto an interactive coordinate plane, connect undirected edges, and configure non-negative weights (w ≥ 0).',
    },
    {
      num: '02',
      title: 'Select an Algorithm',
      desc: 'Choose between Breadth-First Search for minimum-hop paths or Dijkstra for minimum-weight path optimization.',
    },
    {
      num: '03',
      title: 'Replay Every Decision',
      desc: 'Step forward and backward through immutable C++ engine snapshots. Observe the priority queue, distance relaxation, and pseudocode in sync.',
    },
  ];

  return (
    <div
      className="min-h-[calc(100vh-68px)] overflow-y-auto"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Editorial Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono font-medium mb-6 border"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border-strong)',
              color: 'var(--text-secondary)',
            }}
          >
            <Compass className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Academic Laboratory • C++17 WebAssembly Core</span>
          </div>

          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]"
            style={{ color: 'var(--text-primary)' }}
          >
            See shortest-path algorithms think.
          </h1>

          <p
            className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            PathScope translates abstract textbook graph theory into transparent, step-by-step reality. Construct custom topologies or load classic DAA benchmarks, then step through each queue operation and relaxation decision computed directly in native C++.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/visualizer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[48px]"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFDF8',
              }}
            >
              <span>Open Visualizer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/compare"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md text-base font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[48px]"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              <span>Compare Algorithms</span>
              <ArrowUpRight className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </Link>
          </div>

          <div
            className="mt-10 pt-6 border-t flex items-center gap-6 text-xs font-mono"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <span>• 100% Deterministic C++ WASM</span>
            <span>• Two Core Algorithms (BFS & Dijkstra)</span>
            <span>• Time-Travel Scrubber</span>
          </div>
        </div>
      </section>

      {/* Two-Algorithm Editorial Comparison Section */}
      <section
        className="border-t border-b py-20 px-6"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider block mb-2"
              style={{ color: 'var(--accent)' }}
            >
              Phase 1 Core Scope
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Two foundational shortest-path models.
            </h2>
            <p
              className="mt-2 text-base max-w-2xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              Carefully engineered to highlight the fundamental tradeoff between minimum hops (level-order BFS) and minimum total weight (greedy relaxation Dijkstra).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {algorithms.map((algo) => {
              const Icon = algo.icon;
              return (
                <div
                  key={algo.id}
                  className="p-8 rounded-lg border flex flex-col justify-between"
                  style={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-10 h-10 rounded-md border flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--background-secondary)',
                          borderColor: 'var(--border-strong)',
                          color: 'var(--accent)',
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className="font-mono text-xs px-2.5 py-1 rounded border font-semibold"
                        style={{
                          backgroundColor: 'var(--background-secondary)',
                          borderColor: 'var(--border)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {algo.complexity.split('•')[0].trim()}
                      </span>
                    </div>

                    <h3
                      className="text-2xl font-bold tracking-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {algo.name}
                    </h3>
                    <p
                      className="mt-3 text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {algo.purpose}
                    </p>

                    <dl className="mt-6 space-y-3 border-t pt-4 text-xs" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <dt className="font-mono text-[11px] uppercase" style={{ color: 'var(--text-muted)' }}>
                          Core Data Structure
                        </dt>
                        <dd className="font-mono font-medium mt-0.5" style={{ color: 'var(--text-primary)' }}>
                          {algo.dataStructure}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[11px] uppercase" style={{ color: 'var(--text-muted)' }}>
                          Best For
                        </dt>
                        <dd className="mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {algo.bestFor}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[11px] uppercase" style={{ color: 'var(--text-muted)' }}>
                          Theoretical Guarantee
                        </dt>
                        <dd className="mt-0.5 font-medium" style={{ color: 'var(--secondary-accent)' }}>
                          {algo.guarantee}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    <Link
                      to={`/visualizer?algo=${algo.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-none"
                      style={{ color: 'var(--accent)' }}
                    >
                      <span>Launch in Visualizer</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works: Simple Three-Step Sequence */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="mb-14">
          <span
            className="text-xs font-mono font-bold uppercase tracking-wider block mb-2"
            style={{ color: 'var(--accent)' }}
          >
            Workflow
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            How it works
          </h2>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            A disciplined three-stage interactive laboratory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className="pt-6 border-t-2"
              style={{ borderColor: 'var(--border-strong)' }}
            >
              <span
                className="font-mono text-2xl font-bold block mb-3"
                style={{ color: 'var(--accent)' }}
              >
                {step.num}
              </span>
              <h3
                className="text-xl font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {step.title}
              </h3>
              <p
                className="mt-2.5 text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Compact Educational CTA */}
      <section
        className="border-t py-16 px-6"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Ready to explore graph routing?
            </h2>
            <p
              className="mt-1 text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Choose a classic benchmark or assemble your own vertices and edges.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/visualizer"
              className="px-5 py-3 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px] flex items-center justify-center"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFDF8',
              }}
            >
              Open Visualizer
            </Link>
            <Link
              to="/about"
              className="px-5 py-3 rounded-md text-sm font-medium border transition-colors focus-visible:outline-none min-h-[44px] flex items-center justify-center"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              Read Project Specs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
