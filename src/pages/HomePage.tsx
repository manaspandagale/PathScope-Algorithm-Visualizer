import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '../components/UI/Button';

interface HomePageProps {
  theme: 'dark' | 'light';
}

export const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div
      className="min-h-[calc(100vh-64px)] overflow-y-auto select-none"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-14 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border mb-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
          }}
        >
          <Compass className="w-3.5 h-3.5 text-[var(--primary-action)]" />
          <span>Interactive DAA Laboratory • 50% Milestone</span>
        </div>

        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Understand shortest paths,
          <br />
          one decision at a time.
        </h1>

        <p
          className="mt-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Build a graph, run BFS or Dijkstra, and replay every step of the algorithm.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link to="/visualizer">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Open Visualizer
            </Button>
          </Link>

          <Link to="/compare">
            <Button
              variant="secondary"
              size="lg"
            >
              Compare Algorithms
            </Button>
          </Link>
        </div>

        {/* Graph Decision Preview */}
        <div
          className="mt-12 p-6 sm:p-8 rounded-xl border max-w-2xl mx-auto shadow-sm"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <svg
            viewBox="0 0 540 220"
            className="w-full h-auto select-none"
            aria-label="Graph decision preview showing unweighted BFS vs weighted Dijkstra shortest path"
          >
            {/* Background Edges */}
            <line x1="80" y1="110" x2="220" y2="50" stroke="var(--border)" strokeWidth="2.5" />
            <line x1="80" y1="110" x2="220" y2="170" stroke="var(--state-path, #15803D)" strokeWidth="3.5" />
            <line x1="220" y1="50" x2="360" y2="50" stroke="var(--border)" strokeWidth="2.5" />
            <line x1="220" y1="170" x2="360" y2="170" stroke="var(--state-path, #15803D)" strokeWidth="3.5" />
            <line x1="360" y1="50" x2="460" y2="110" stroke="var(--border)" strokeWidth="2.5" />
            <line x1="360" y1="170" x2="460" y2="110" stroke="var(--state-path, #15803D)" strokeWidth="3.5" />
            <line x1="220" y1="50" x2="360" y2="170" stroke="var(--border)" strokeWidth="2" strokeDasharray="5 5" />

            {/* Edge Weight Badges */}
            <g transform="translate(136, 68)">
              <rect x="-14" y="-10" width="28" height="20" rx="4" fill="var(--surface-elevated)" stroke="var(--border-strong)" strokeWidth="1" />
              <text textAnchor="middle" y="4" fontSize="12" fontFamily="JetBrains Mono Variable, monospace" fontWeight="600" fill="var(--text-secondary)">8</text>
            </g>

            <g transform="translate(136, 148)">
              <rect x="-14" y="-10" width="28" height="20" rx="4" fill="var(--primary-subtle)" stroke="var(--state-path, #15803D)" strokeWidth="1.5" />
              <text textAnchor="middle" y="4" fontSize="12" fontFamily="JetBrains Mono Variable, monospace" fontWeight="700" fill="var(--state-path, #15803D)">2</text>
            </g>

            <g transform="translate(290, 40)">
              <rect x="-14" y="-10" width="28" height="20" rx="4" fill="var(--surface-elevated)" stroke="var(--border-strong)" strokeWidth="1" />
              <text textAnchor="middle" y="4" fontSize="12" fontFamily="JetBrains Mono Variable, monospace" fontWeight="600" fill="var(--text-secondary)">5</text>
            </g>

            <g transform="translate(290, 170)">
              <rect x="-14" y="-10" width="28" height="20" rx="4" fill="var(--primary-subtle)" stroke="var(--state-path, #15803D)" strokeWidth="1.5" />
              <text textAnchor="middle" y="4" fontSize="12" fontFamily="JetBrains Mono Variable, monospace" fontWeight="700" fill="var(--state-path, #15803D)">3</text>
            </g>

            <g transform="translate(410, 68)">
              <rect x="-14" y="-10" width="28" height="20" rx="4" fill="var(--surface-elevated)" stroke="var(--border-strong)" strokeWidth="1" />
              <text textAnchor="middle" y="4" fontSize="12" fontFamily="JetBrains Mono Variable, monospace" fontWeight="600" fill="var(--text-secondary)">6</text>
            </g>

            <g transform="translate(410, 148)">
              <rect x="-14" y="-10" width="28" height="20" rx="4" fill="var(--primary-subtle)" stroke="var(--state-path, #15803D)" strokeWidth="1.5" />
              <text textAnchor="middle" y="4" fontSize="12" fontFamily="JetBrains Mono Variable, monospace" fontWeight="700" fill="var(--state-path, #15803D)">1</text>
            </g>

            {/* Node A (Start) */}
            <circle cx="80" cy="110" r="26" fill="var(--surface)" stroke="var(--state-start, #1E4D3A)" strokeWidth="3" />
            <text x="80" y="115" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--text-primary)">A</text>
            <rect x="62" y="70" width="36" height="15" rx="3" fill="var(--state-start, #1E4D3A)" />
            <text x="80" y="81" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">START</text>

            {/* Node B */}
            <circle cx="220" cy="50" r="24" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="220" y="55" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--text-primary)">B</text>

            {/* Node C (Path) */}
            <circle cx="220" cy="170" r="25" fill="var(--primary-subtle)" stroke="var(--state-path, #15803D)" strokeWidth="3" />
            <text x="220" y="175" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--text-primary)">C</text>

            {/* Node D */}
            <circle cx="360" cy="50" r="24" fill="var(--surface)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="360" y="55" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--text-primary)">D</text>

            {/* Node E (Path) */}
            <circle cx="360" cy="170" r="25" fill="var(--primary-subtle)" stroke="var(--state-path, #15803D)" strokeWidth="3" />
            <text x="360" y="175" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--text-primary)">E</text>

            {/* Node F (Destination) */}
            <circle cx="460" cy="110" r="26" fill="var(--surface)" stroke="var(--state-target, #A33B2E)" strokeWidth="3" />
            <text x="460" y="115" textAnchor="middle" fontSize="16" fontWeight="700" fill="var(--text-primary)">F</text>
            <rect x="442" y="70" width="36" height="15" rx="3" fill="var(--state-target, #A33B2E)" />
            <text x="460" y="81" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF">DEST</text>
          </svg>

          <div
            className="mt-4 pt-3 border-t flex flex-wrap items-center justify-between text-xs font-mono"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
          >
            <span>Optimal Path: A → C → E → F</span>
            <span className="font-semibold text-[var(--state-path, #15803D)]">
              Cost: 6.0 • 3 hops
            </span>
          </div>
        </div>
      </section>

      {/* Concise BFS vs Dijkstra Section */}
      <section
        className="border-t py-14 px-6"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2
              className="text-2xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Breadth-First Search vs Dijkstra’s Algorithm
            </h2>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Two foundational shortest-path algorithms with distinct optimization objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Breadth-First Search Card */}
            <div
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Breadth-First Search
                </h3>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded border font-medium"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  O(V + E)
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Explores vertices level by level using a FIFO queue. Guarantees the path with the minimum number of edge hops. Does not consider numeric edge weights.
              </p>

              <div className="mt-4 pt-3 border-t text-xs space-y-2" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Data structure:</span>
                  <span className="font-mono font-medium">std::queue&lt;int&gt;</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Optimization:</span>
                  <span className="font-medium text-[var(--primary-action)]">Minimum edge hops</span>
                </div>
              </div>
            </div>

            {/* Dijkstra’s Algorithm Card */}
            <div
              className="p-6 rounded-xl border"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Dijkstra’s Algorithm
                </h3>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded border font-medium"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  O((V + E) log V)
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Greedily explores vertices in order of accumulated tentative distance using a min-heap priority queue. Guarantees the lowest total weight for graphs with non-negative edge costs.
              </p>

              <div className="mt-4 pt-3 border-t text-xs space-y-2" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Data structure:</span>
                  <span className="font-mono font-medium">std::priority_queue</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Optimization:</span>
                  <span className="font-medium text-[var(--primary-action)]">Minimum cumulative weight</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
