export type AlgorithmType = 'bfs' | 'dijkstra';

export type SnapshotOperation =
  | 'initialize'
  | 'enqueue'
  | 'dequeue'
  | 'extract-min'
  | 'inspect-edge'
  | 'relax-edge'
  | 'skip-edge'
  | 'settle-vertex'
  | 'skip-stale-entry'
  | 'reconstruct-path'
  | 'complete'
  | 'unreachable'
  | 'invalid';

export interface GraphNodeData {
  label: string;
  isSource: boolean;
  isTarget: boolean;
  state?: 'default' | 'current' | 'visited' | 'frontier' | 'path';
  distance?: number | null; // For Dijkstra / BFS: tentative distance or hop count (null = ∞)
  predecessor?: string | null;
  bfsLevel?: number | null;
  isSettled?: boolean;
  [key: string]: unknown;
}

export interface GraphEdgeData {
  weight: number;
  isDirected?: boolean;
  state?: 'default' | 'current' | 'visited' | 'path';
  [key: string]: unknown;
}

export type DataStructureType = 'queue' | 'priorityQueue';

export interface QueueItem {
  id: string;
  label: string;
  priority?: number | null;
  extra?: string;
  isStale?: boolean;
}

export interface PriorityQueueItem {
  id: string;
  label: string;
  priority: number | null;
  extra?: string;
  isStale?: boolean;
}

export type DataStructureItem = QueueItem | PriorityQueueItem;

export interface StepSnapshot {
  stepNumber: number;
  codeLine: number;
  operation: SnapshotOperation;
  explanation: string;
  currentNode: string | null;
  activeVertex: string | null;
  inspectedEdgeId: string | null;
  currentEdge: { source: string; target: string } | null;
  visitedNodes: string[];
  settledNodes?: string[];
  visitedEdges: string[]; // Edge IDs
  frontierNodes: string[]; // Nodes currently in queue / priority queue
  pathNodes: string[]; // Reconstructed path when found
  pathEdges: string[]; // Reconstructed path edge IDs
  distances: Record<string, number | null>; // Distances (null represents infinity ∞)
  predecessors: Record<string, string | null>; // Predecessor node mapping
  predecessorEdgeIds?: Record<string, string | null>; // Predecessor edge ID mapping
  traversalOrder: string[]; // Order nodes were processed
  previousDistance?: number | null;
  candidateDistance?: number | null;
  updatedDistance?: number | null;
  edgeWeight?: number | null;
  distanceUpdated?: boolean;
  dataStructure: {
    type: DataStructureType;
    items: DataStructureItem[];
  };
  queueOrHeapBefore?: DataStructureItem[];
  queueOrHeapAfter?: DataStructureItem[];
  bfsLevel?: number | null;
  status: 'ready' | 'running' | 'found' | 'unreachable' | 'invalid';
  totalCost?: number;
  hopCount?: number;
}

export interface AdjacencyEdge {
  target: string;
  weight: number;
  edgeId: string;
}

export type AdjacencyList = Record<string, AdjacencyEdge[]>;

export interface AlgorithmMetadata {
  id: AlgorithmType;
  name: string;
  shortDescription: string;
  category: string;
  guarantee: string;
  warning?: string;
  timeComplexity: {
    worst: string;
    average: string;
    best: string;
  };
  spaceComplexity: string;
  dataStructureName: string;
  pseudocode: { line: number; text: string; indent: number }[];
}
