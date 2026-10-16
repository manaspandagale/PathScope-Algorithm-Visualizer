import type { AlgorithmMetadata, AlgorithmType } from '../types/graph';

export const ALGORITHMS_METADATA: Record<AlgorithmType, AlgorithmMetadata> = {
  bfs: {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    shortDescription:
      'Explores the graph layer by layer using a FIFO Queue. Guarantees the shortest path in terms of minimum number of edges (hops) on unweighted/unit-cost graphs.',
    category: 'Graph Traversal / Unweighted Shortest Path',
    guarantee: 'Guarantees minimum hops (edge count). Numeric weights are ignored.',
    warning:
      'Note: BFS treats each edge as exactly 1 hop, ignoring numeric edge weights. In weighted graphs, the BFS path may have fewer hops but a higher total numeric cost than Dijkstra.',
    timeComplexity: {
      worst: 'O(V + E)',
      average: 'O(V + E)',
      best: 'O(1) (Target is Source)',
    },
    spaceComplexity: 'O(V) auxiliary space',
    dataStructureName: 'FIFO Queue',
    pseudocode: [
      { line: 1, text: 'function BFS(graph, source, target):', indent: 0 },
      { line: 2, text: 'let queue = new Queue()', indent: 1 },
      { line: 3, text: 'let visited = new Set([source])', indent: 1 },
      { line: 4, text: 'queue.enqueue(source)', indent: 1 },
      { line: 5, text: 'while queue is not empty:', indent: 1 },
      { line: 6, text: 'current = queue.dequeue()', indent: 2 },
      { line: 7, text: 'if current == target: return reconstructPath(target)', indent: 2 },
      { line: 8, text: 'for neighbor in graph.neighbors(current):', indent: 2 },
      { line: 9, text: 'if neighbor not in visited:', indent: 3 },
      { line: 10, text: 'visited.add(neighbor)', indent: 4 },
      { line: 11, text: 'parent[neighbor] = current', indent: 4 },
      { line: 12, text: 'queue.enqueue(neighbor)', indent: 4 },
      { line: 13, text: 'return "Target Unreachable"', indent: 1 },
    ],
  },
  dijkstra: {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path Algorithm",
    shortDescription:
      'Greedy shortest path algorithm for graphs with non-negative edge weights. Always expands the vertex with the lowest tentative distance using a Min-Heap Priority Queue.',
    category: 'Single-Source Shortest Path (Non-Negative Weights)',
    guarantee: 'Guarantees optimal (minimum total weight) shortest path for non-negative weights (w ≥ 0).',
    warning:
      'Requires non-negative edge weights (w ≥ 0). Negative weights are detected and rejected by the C++ engine before execution.',
    timeComplexity: {
      worst: 'O((V + E) log V)',
      average: 'O((V + E) log V)',
      best: 'O(log V) (Target is Source)',
    },
    spaceComplexity: 'O(V + E) practical storage',
    dataStructureName: 'Binary Min-Heap Priority Queue',
    pseudocode: [
      { line: 1, text: 'function Dijkstra(graph, source, target):', indent: 0 },
      { line: 2, text: 'dist = { v: ∞ for v in graph.vertices }; dist[source] = 0', indent: 1 },
      { line: 3, text: 'pq = new MinPriorityQueue(); pq.push(source, 0)', indent: 1 },
      { line: 4, text: 'while pq is not empty:', indent: 1 },
      { line: 5, text: '(current, currentDist) = pq.pop()', indent: 2 },
      { line: 6, text: 'if current == target: return reconstructPath(target)', indent: 2 },
      { line: 7, text: 'if currentDist > dist[current]: continue (stale entry)', indent: 2 },
      { line: 8, text: 'for (neighbor, weight) in graph.neighbors(current):', indent: 2 },
      { line: 9, text: 'newDist = dist[current] + weight', indent: 3 },
      { line: 10, text: 'if newDist < dist[neighbor]:', indent: 3 },
      { line: 11, text: 'dist[neighbor] = newDist; parent[neighbor] = current', indent: 4 },
      { line: 12, text: 'pq.push(neighbor, newDist)', indent: 4 },
      { line: 13, text: 'return "Target Unreachable"', indent: 1 },
    ],
  },
};

export interface FutureScopeAlgorithm {
  id: string;
  name: string;
  status: 'Deferred / Phase 2' | 'Not Yet Implemented';
  category: string;
  plannedComplexity: string;
  plannedDataStructure: string;
  description: string;
}

export const FUTURE_SCOPE_ALGORITHMS: FutureScopeAlgorithm[] = [
  {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    status: 'Deferred / Phase 2',
    category: 'Graph Traversal / Backtracking',
    plannedComplexity: 'O(V + E)',
    plannedDataStructure: 'LIFO Stack',
    description:
      'Deep exploration along connected branches before backtracking. Intentionally deferred to Phase 2 to focus Phase 1 strictly on shortest path optimality principles.',
  },
  {
    id: 'dag',
    name: 'DAG Shortest Path',
    status: 'Deferred / Phase 2',
    category: 'Directed Acyclic Graphs',
    plannedComplexity: 'O(V + E)',
    plannedDataStructure: 'Topological Sort + Linear Relaxation',
    description:
      'Linear single-source shortest path using topological order. Planned for Phase 2 for acyclic graph modules.',
  },
  {
    id: 'floyd-warshall',
    name: 'Floyd–Warshall Algorithm',
    status: 'Deferred / Phase 2',
    category: 'All-Pairs Shortest Path',
    plannedComplexity: 'O(V³)',
    plannedDataStructure: '2D Distance & Next Matrices',
    description:
      'Dynamic programming all-pairs shortest path matrix algorithm. Planned for Phase 2 dense network analysis.',
  },
];
