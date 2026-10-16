export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra' | 'dag' | 'floyd-warshall';

export interface GraphNodeData {
  label: string;
  isSource: boolean;
  isTarget: boolean;
  state?: 'default' | 'current' | 'visited' | 'frontier' | 'path';
  distance?: number | null; // For Dijkstra/DAG: tentative distance
  predecessor?: string | null;
  [key: string]: unknown;
}

export interface GraphEdgeData {
  weight: number;
  isDirected?: boolean;
  state?: 'default' | 'current' | 'visited' | 'path';
  [key: string]: unknown;
}

export type DataStructureType = 'queue' | 'stack' | 'priorityQueue' | 'topologicalOrder' | 'matrix';

export interface QueueItem {
  id: string;
  label: string;
}

export interface StackItem {
  id: string;
  label: string;
}

export interface PriorityQueueItem {
  id: string;
  label: string;
  priority: number;
}

export interface GenericItem {
  id: string;
  label: string;
  extra?: string;
}

export type DataStructureItem = QueueItem | StackItem | PriorityQueueItem | GenericItem;

export interface FloydMatrixCell {
  dist: number;
  next: string | null;
}

export interface StepSnapshot {
  stepNumber: number;
  codeLine: number;
  explanation: string;
  currentNode: string | null;
  currentEdge: { source: string; target: string } | null;
  visitedNodes: string[];
  visitedEdges: string[]; // Edge IDs
  frontierNodes: string[]; // Nodes currently in queue/stack/priority queue/current intermediate
  pathNodes: string[]; // Reconstructed path when found
  pathEdges: string[]; // Reconstructed path edge IDs
  distances: Record<string, number>; // Tentative distances (Dijkstra, DAG)
  predecessors: Record<string, string | null>; // Predecessor mapping
  traversalOrder: string[]; // Order nodes were processed / topo order
  dataStructure: {
    type: DataStructureType;
    items: DataStructureItem[];
  };
  matrixState?: {
    nodes: string[];
    kNode: string | null; // intermediate node k being considered
    iNode: string | null; // current source i
    jNode: string | null; // current target j
    distMatrix: Record<string, Record<string, number>>;
    nextMatrix: Record<string, Record<string, string | null>>;
  };
  status: 'ready' | 'running' | 'found' | 'unreachable' | 'complete' | 'cycle-detected';
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
