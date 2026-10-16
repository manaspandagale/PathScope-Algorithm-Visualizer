import React from 'react';
import { Link } from 'react-router-dom';
import {
  Network,
  GitFork,
  Gauge,
  ArrowRight,
  Database,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { ALGORITHMS_METADATA } from '../data/algorithmsInfo';

interface AlgorithmsPageProps {
  theme: 'dark' | 'light';
}

export const AlgorithmsPage: React.FC<AlgorithmsPageProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const algorithms = [
    {
      id: 'dijkstra',
      meta: ALGORITHMS_METADATA.dijkstra,
      icon: Gauge,
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      purpose: 'Finding the minimum-weight path from a starting vertex to all other reachable vertices (or a specific destination) in non-negative edge weighted graphs.',
      workingPrinciple:
        'Maintains a greedy priority queue of vertices keyed by tentative distance from the source. In each iteration, extracts the vertex with minimum tentative distance and relaxes its outgoing edges, updating distances if a cheaper path is found.',
      dataStructure: 'Binary Min-Heap Priority Queue (or Fibonacci heap in advanced theory) + Distance and Predecessor maps.',
      applications: [
        'GPS Navigation & Route Finding (Google Maps, OpenStreetMap)',
        'Network Routing Protocols (OSPF, IS-IS)',
        'Logistics & Supply Chain Route Optimization',
        'Flight itinerary and travel cost minimization',
      ],
      caution: 'Requires non-negative edge weights (w ≥ 0). Graphs with negative edges produce incorrect distances and require Bellman-Ford.',
    },
    {
      id: 'bfs',
      meta: ALGORITHMS_METADATA.bfs,
      icon: Network,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      purpose: 'Layer-by-layer traversal of vertices to discover reachable nodes and compute shortest paths in unweighted graphs in terms of minimum edge count (hops).',
      workingPrinciple:
        'Initializes a First-In-First-Out (FIFO) queue with the source. Dequeues the front vertex, marks all its unvisited immediate neighbors as visited, sets their predecessor pointers, and enqueues them. Explores radially in concentric rings of distance.',
      dataStructure: 'FIFO Queue + Visited Boolean Set + Predecessor / Distance array.',
      applications: [
        'Shortest Path in Unweighted Networks & Peer-to-Peer discovery',
        'Social Networking connection degrees (LinkedIn 1st/2nd/3rd connections)',
        'Web Crawlers indexing pages by hyperlink depth',
        'Garbage collection algorithms (Cheney’s copying collector)',
      ],
      caution: 'Treats every edge as having uniform weight (1 hop). On weighted graphs, it does NOT minimize numeric weight sums.',
    },
    {
      id: 'dfs',
      meta: ALGORITHMS_METADATA.dfs,
      icon: GitFork,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      purpose: 'Deep traversal exploring branches as far as possible along each path before backtracking. Ideal for topology analysis and connectivity.',
      workingPrinciple:
        'Uses a Last-In-First-Out (LIFO) stack (or recursion call stack). Visits a neighbor, pushes it, and continues deeply down that branch until reaching a dead-end (no unvisited neighbors), then backtracks to previous decision points.',
      dataStructure: 'LIFO Stack (explicit or call stack) + Visited Boolean Set.',
      applications: [
        'Cycle Detection in Directed and Undirected graphs',
        'Topological Sorting for task scheduling and package dependencies',
        'Connected Components & Strongly Connected Components (Kosaraju / Tarjan)',
        'Maze generation and puzzle pathfinding',
      ],
      caution: 'CRITICAL: DFS does NOT guarantee the shortest path! It returns the first path discovered by its arbitrary exploration order.',
    },
    {
      id: 'dag',
      meta: ALGORITHMS_METADATA.dag,
      icon: Network,
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      purpose: 'Single-source shortest path algorithm for Directed Acyclic Graphs operating in linear O(V + E) time. Uniquely supports negative edge weights.',
      workingPrinciple:
        'Computes a topological ordering of vertices via in-degree reduction (Kahn’s algorithm). Then iterates through vertices in topological order, relaxing all outgoing edges. Because edges only point forward in topological order, each vertex is settled in a single pass.',
      dataStructure: 'Topological Sort Queue + In-Degree Array + Distance and Predecessor maps.',
      applications: [
        'Critical Path Method (CPM) and PERT Project Scheduling',
        'Build systems dependency resolution and compiler optimization (Make, Bazel)',
        'Data pipelining execution ordering (Apache Airflow, Spark DAGs)',
        'Financial arbitrage modeling in acyclic transaction graphs',
      ],
      caution: 'Requires the graph to be strictly directed and acyclic. If any cycle exists, topological sort fails and shortest paths cannot be computed with this method.',
    },
    {
      id: 'floyd-warshall',
      meta: ALGORITHMS_METADATA['floyd-warshall'],
      icon: Gauge,
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      purpose: 'Dynamic programming algorithm to compute All-Pairs Shortest Paths (APSP) between every possible pair of vertices in O(V³) time.',
      workingPrinciple:
        'Maintains an n×n distance matrix. Iteratively tests whether routing through vertex k provides a shorter path between every pair (i, j): dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). Also detects negative cycles if any diagonal entry dist[i][i] becomes negative.',
      dataStructure: '2D Distance Matrix (n×n) + Predecessor / Next Matrix (n×n).',
      applications: [
        'All-Pairs Transitive Closure and Dense Network routing',
        'Computing Graph Diameter, Radius, and Centrality indices',
        'Urban transportation matrix modeling and transit travel-time tables',
        'Detecting negative cycles in financial asset exchange rate loops',
      ],
      caution: 'O(V³) cubic time complexity. Highly efficient for small or medium dense graphs, but impractical for massive sparse networks (|V| > 1000).',
    },
  ];

  return (
    <div className={`min-h-[calc(100vh-4rem)] overflow-y-auto px-6 py-12 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Graph Algorithms In Depth
          </h1>
          <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Detailed theoretical principles, time & space complexities, algorithmic trade-offs, and practical engineering applications.
          </p>
        </div>

        {/* Algorithm Detail Sections */}
        <div className="space-y-8">
          {algorithms.map((algo) => {
            const Icon = algo.icon;
            return (
              <div
                key={algo.id}
                className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                  isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                {/* Title & Badge */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-500/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{algo.meta.name}</h2>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {algo.meta.category}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/visualizer?algo=${algo.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all hover:scale-105"
                  >
                    <span>Visualize {algo.meta.id.toUpperCase()}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Left Column: Purpose & Principle */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Core Purpose</span>
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {algo.purpose}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 text-blue-400" />
                        <span>Working Principle</span>
                      </h3>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {algo.workingPrinciple}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Data Structure Used
                      </h3>
                      <p className={`text-xs font-mono font-medium ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                        {algo.dataStructure}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Complexities & Applications */}
                  <div className="space-y-4">
                    {/* Complexity Boxes */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`p-3 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Time Complexity</div>
                        <div className="text-xs font-mono font-bold text-blue-400 mt-0.5">
                          {algo.meta.timeComplexity.worst}
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Space Complexity</div>
                        <div className="text-xs font-mono font-bold text-indigo-400 mt-0.5">
                          {algo.meta.spaceComplexity}
                        </div>
                      </div>
                    </div>

                    {/* Applications */}
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Real-World Applications
                      </h3>
                      <ul className="space-y-1.5 text-xs">
                        {algo.applications.map((app, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Important Caution Box */}
                <div className={`mt-6 p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                  algo.id === 'dfs'
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                    : 'border-blue-500/30 bg-blue-500/10 text-blue-200'
                }`}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">{algo.caution}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
