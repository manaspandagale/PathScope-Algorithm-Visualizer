import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
  theme: 'dark' | 'light';
}

export const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div
      className="min-h-[calc(100vh-64px)] overflow-y-auto"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Understand shortest paths,
          <br />
          one decision at a time.
        </h1>

        <p
          className="mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          Build a graph, run BFS or Dijkstra, and replay every step of the algorithm.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            to="/visualizer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-colors focus-visible:outline-none min-h-[44px]"
            style={{
              backgroundColor: 'var(--primary-action)',
              color: '#FFFFFF',
            }}
          >
            <span>Open Visualizer</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/compare"
            className="inline-flex items-center px-6 py-3 rounded-md text-sm font-medium border transition-colors focus-visible:outline-none min-h-[44px]"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            Compare Algorithms
          </Link>
        </div>

        {/* Clean Graph Preview */}
        <div
          className="mt-12 p-8 rounded-lg border max-w-2xl mx-auto"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <svg
            viewBox="0 0 540 200"
            className="w-full h-auto select-none"
            aria-label="Clean graph topology preview showing vertices and shortest path"
          >
            {/* Edges */}
            <line x1="80" y1="100" x2="220" y2="40" stroke="var(--border-strong)" strokeWidth="2" />
            <line x1="80" y1="100" x2="220" y2="160" stroke="var(--primary-action)" strokeWidth="2.5" />
            <line x1="220" y1="40" x2="360" y2="40" stroke="var(--border-strong)" strokeWidth="2" />
            <line x1="220" y1="160" x2="360" y2="160" stroke="var(--primary-action)" strokeWidth="2.5" />
            <line x1="360" y1="40" x2="460" y2="100" stroke="var(--border-strong)" strokeWidth="2" />
            <line x1="360" y1="160" x2="460" y2="100" stroke="var(--primary-action)" strokeWidth="2.5" />
            <line x1="220" y1="40" x2="360" y2="160" stroke="var(--border-strong)" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Edge Weight Badges */}
            <rect x="135" y="58" width="28" height="18" rx="4" fill="var(--surface-elevated)" stroke="var(--border)" strokeWidth="1" />
            <text x="149" y="71" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono Variable, monospace" fill="var(--text-secondary)">8</text>

            <rect x="135" y="132" width="28" height="18" rx="4" fill="var(--surface-elevated)" stroke="var(--primary-action)" strokeWidth="1" />
            <text x="149" y="145" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono Variable, monospace" fill="var(--primary-action)" fontWeight="600">2</text>

            <rect x="276" y="28" width="28" height="18" rx="4" fill="var(--surface-elevated)" stroke="var(--border)" strokeWidth="1" />
            <text x="290" y="41" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono Variable, monospace" fill="var(--text-secondary)">5</text>

            <rect x="276" y="152" width="28" height="18" rx="4" fill="var(--surface-elevated)" stroke="var(--primary-action)" strokeWidth="1" />
            <text x="290" y="165" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono Variable, monospace" fill="var(--primary-action)" fontWeight="600">3</text>

            <rect x="395" y="58" width="28" height="18" rx="4" fill="var(--surface-elevated)" stroke="var(--border)" strokeWidth="1" />
            <text x="409" y="71" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono Variable, monospace" fill="var(--text-secondary)">6</text>

            <rect x="395" y="132" width="28" height="18" rx="4" fill="var(--surface-elevated)" stroke="var(--primary-action)" strokeWidth="1" />
            <text x="409" y="145" textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono Variable, monospace" fill="var(--primary-action)" fontWeight="600">1</text>

            {/* Node A (Start) */}
            <circle cx="80" cy="100" r="22" fill="var(--primary-subtle)" stroke="var(--primary-action)" strokeWidth="2.5" />
            <text x="80" y="105" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--primary-action)">A</text>

            {/* Node B */}
            <circle cx="220" cy="40" r="20" fill="var(--surface-elevated)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="220" y="45" textAnchor="middle" fontSize="14" fontWeight="500" fill="var(--text-primary)">B</text>

            {/* Node C (Shortest Path) */}
            <circle cx="220" cy="160" r="20" fill="var(--primary-subtle)" stroke="var(--primary-action)" strokeWidth="2.5" />
            <text x="220" y="165" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--primary-action)">C</text>

            {/* Node D */}
            <circle cx="360" cy="40" r="20" fill="var(--surface-elevated)" stroke="var(--border-strong)" strokeWidth="2" />
            <text x="360" y="45" textAnchor="middle" fontSize="14" fontWeight="500" fill="var(--text-primary)">D</text>

            {/* Node E (Shortest Path) */}
            <circle cx="360" cy="160" r="20" fill="var(--primary-subtle)" stroke="var(--primary-action)" strokeWidth="2.5" />
            <text x="360" y="165" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--primary-action)">E</text>

            {/* Node F (Destination) */}
            <circle cx="460" cy="100" r="22" fill="var(--primary-subtle)" stroke="var(--primary-action)" strokeWidth="2.5" />
            <text x="460" y="105" textAnchor="middle" fontSize="14" fontWeight="600" fill="var(--primary-action)">F</text>
          </svg>

          <p className="mt-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            Path: A → C → E → F (Total cost: 6 • 3 hops)
          </p>
        </div>
      </section>

      {/* Concise BFS vs Dijkstra Section */}
      <section
        className="border-t py-16 px-6"
        style={{
          backgroundColor: 'var(--background-secondary)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-bold tracking-tight text-center mb-8"
            style={{ color: 'var(--text-primary)' }}
          >
            BFS versus Dijkstra
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Breadth-First Search */}
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Breadth-First Search
                </h3>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  O(V + E)
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Explores vertices level by level using a FIFO queue. Guarantees the path with the minimum number of edges. Ignores numeric edge weights.
              </p>

              <div className="mt-4 pt-3 border-t text-xs space-y-1.5" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Data structure:</span>
                  <span className="font-mono font-medium">std::queue</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Best for:</span>
                  <span>Unweighted graphs, minimum hops</span>
                </div>
              </div>
            </div>

            {/* Dijkstra's Algorithm */}
            <div
              className="p-6 rounded-lg border"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Dijkstra’s Algorithm
                </h3>
                <span
                  className="font-mono text-xs px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  O((V + E) log V)
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Greedily explores vertices in order of accumulated distance using a priority queue. Guarantees the minimum total weight for non-negative edges.
              </p>

              <div className="mt-4 pt-3 border-t text-xs space-y-1.5" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Data structure:</span>
                  <span className="font-mono font-medium">std::priority_queue</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Best for:</span>
                  <span>Weighted road networks, lowest latency</span>
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
