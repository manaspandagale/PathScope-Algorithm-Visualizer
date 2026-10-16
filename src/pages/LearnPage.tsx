import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  CircleDot,
  Minus,
  Weight,
  Layers,
  ArrowDownUp,
  Milestone,
} from 'lucide-react';

interface LearnPageProps {
  theme: 'dark' | 'light';
}

export const LearnPage: React.FC<LearnPageProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  const topics = [
    {
      id: 'nodes-vertices',
      title: '1. Vertices (Nodes)',
      icon: CircleDot,
      summary: 'The fundamental building blocks or points in a network.',
      explanation:
        'In graph theory, a vertex (plural: vertices) represents an entity, location, or state. In real life, vertices can represent cities on a map, computers in a LAN, routers on the Internet, or users in a social network.',
      diagramText: 'Node A ──── Node B\n(Vertices are the circles/points)',
    },
    {
      id: 'edges',
      title: '2. Edges (Connections)',
      icon: Minus,
      summary: 'Links or pathways connecting pairs of vertices.',
      explanation:
        'An edge represents a relationship or navigable pathway between two vertices. Graphs can be undirected (two-way roads where you can travel in both directions) or directed (one-way streets with arrows). Phase 1 PathScope focuses on undirected graphs.',
      diagramText: 'Undirected: (A) ─────── (B)   [Travel A↔B]\nDirected:   (A) ──────> (B)   [Travel A→B only]',
    },
    {
      id: 'weights',
      title: '3. Edge Weights (Costs)',
      icon: Weight,
      summary: 'Numeric values assigned to edges representing distance, time, or cost.',
      explanation:
        'A weighted graph assigns a real number to each edge. This number could indicate the physical mileage between two cities, the latency in milliseconds between two servers, or fuel expenditure. Dijkstra finds paths minimizing the sum of weights, whereas BFS counts hops regardless of weight.',
      diagramText: '(A) ──[Cost: 4]── (B) ──[Cost: 2]── (C)\nTotal Cost: 4 + 2 = 6',
    },
    {
      id: 'queue-stack',
      title: '4. Queues vs. Stacks (Data Structures)',
      icon: Layers,
      summary: 'How ordering dictates graph exploration strategy.',
      explanation:
        'A Queue operates on FIFO (First-In, First-Out): the oldest inserted node is explored first, producing the radial level-by-level sweep of BFS. A Stack operates on LIFO (Last-In, First-Out): the newest node is explored first, causing DFS to plunge deeply into a single branch until it dead-ends.',
      diagramText: 'Queue: [Front] A → B → C [Back] (BFS explores oldest first)\nStack: [Top] C → B → A [Bottom] (DFS explores newest first)',
    },
    {
      id: 'priority-queue',
      title: '5. Min-Heap Priority Queue',
      icon: ArrowDownUp,
      summary: 'Dynamic sorting data structure powering Dijkstra.',
      explanation:
        'A Min-Heap is a binary tree where the parent node is always smaller than or equal to its children. This allows extracting the vertex with the lowest tentative distance in O(log V) time, ensuring greedy expansion of the cheapest unexplored frontier vertex.',
      diagramText: '       (Cost: 2)\n      /         \\\n  (Cost: 5)   (Cost: 7)\n(Root is always the minimum)',
    },
    {
      id: 'shortest-path',
      title: '6. What Defines a "Shortest Path"?',
      icon: Milestone,
      summary: 'Comparing hop count optimality vs. weight sum optimality.',
      explanation:
        'Depending on the objective function, the definition changes:\n• Unweighted Shortest Path (BFS): Minimum number of edge traversals (hops).\n• Weighted Shortest Path (Dijkstra): Minimum sum of edge weights. Notice that a path with 3 hops could have a lower total weight (e.g. 2+2+2 = 6) than a direct 1-hop path with weight 15!',
      diagramText: 'Path 1: S ──[15]── T             (1 hop,  weight 15)\nPath 2: S ─[2]─ A ─[2]─ B ─[2]─ T (3 hops, weight 6) [Optimal!]',
    },
    {
      id: 'dag-topological',
      title: '7. Directed Acyclic Graphs (DAGs) & Linear Relaxation',
      icon: Layers,
      summary: 'Why topological ordering allows computing shortest paths in O(V + E) linear time.',
      explanation:
        'A Directed Acyclic Graph (DAG) has no directed cycles. Using Kahn’s algorithm (in-degrees), we can order vertices such that every directed edge u → v comes before v. By relaxing vertices in this topological order, each vertex’s shortest distance is finalized when reached — even with negative edge weights!',
      diagramText: 'Topological Order: [A] ──> [B] ──> [C] ──> [D]\n(Edges only flow left to right, eliminating cycles and enabling O(V+E) relaxation)',
    },
    {
      id: 'all-pairs-apsp',
      title: '8. All-Pairs Shortest Paths (Floyd–Warshall DP)',
      icon: Milestone,
      summary: 'Dynamic programming formulation computing paths between every pair of vertices.',
      explanation:
        'Instead of running a single-source search |V| times, Floyd–Warshall asks: "Does routing from i to j through intermediate vertex k produce a shorter path?"\nFormula: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).\nIf after all k iterations dist[i][i] < 0, a negative cycle exists.',
      diagramText: '      (k: intermediate candidate)\n       ^               \\\n      /                 v\n    (i) ───────────────> (j)\nCheck: dist[i][k] + dist[k][j] < dist[i][j]',
    },
  ];

  return (
    <div className={`min-h-[calc(100vh-4rem)] overflow-y-auto px-6 py-12 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border bg-blue-500/10 border-blue-500/30 text-blue-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Beginner-Friendly Fundamentals</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Learn Graph Theory Fundamentals
          </h1>
          <p className={`mt-3 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Essential concepts, terminology, and visual analogies to help you intuitively grasp how shortest path visualizers operate.
          </p>
        </div>

        {/* Topics List */}
        <div className="space-y-6">
          {topics.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                className={`p-6 rounded-2xl border transition-all ${
                  isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">{t.title}</h2>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {t.summary}
                    </p>
                  </div>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed mt-3 whitespace-pre-line ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {t.explanation}
                </p>

                {/* ASCII Diagram Box */}
                <div className={`mt-4 p-3 rounded-xl border font-mono text-xs overflow-x-auto ${
                  isDark ? 'bg-slate-950 border-slate-800 text-emerald-400' : 'bg-slate-900 border-slate-700 text-emerald-300'
                }`}>
                  <pre className="whitespace-pre">{t.diagramText}</pre>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Steps CTA */}
        <div className={`p-8 rounded-2xl border text-center space-y-4 ${
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-sm'
        }`}>
          <h2 className="text-xl font-bold">Ready to see these concepts in action?</h2>
          <p className={`text-xs max-w-md mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Jump right into the interactive canvas to construct graphs, drag vertices, and watch BFS, DFS, and Dijkstra step through data structures in real time.
          </p>
          <div className="pt-2">
            <Link
              to="/visualizer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all hover:scale-105"
            >
              <span>Launch Graph Visualizer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
