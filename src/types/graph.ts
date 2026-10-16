export type AlgorithmType = 'bfs' | 'dijkstra';

export interface GraphNodeData {
  label: string;
  isSource: boolean;
  isTarget: boolean;
  state?: 'default' | 'current' | 'visited' | 'frontier' | 'path';
  distance?: number | null; // For Dijkstra: tentative distance
  predecessor?: string | null;
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
}

export interface PriorityQueueItem {
  id: string;
  label: string;
  priority: number;
  extra?: string;
}

export type DataStructureItem = QueueItem | PriorityQueueItem;

export interface StepSnapshot {
  stepNumber: number;
  codeLine: number;
  explanation: string;
  currentNode: string | null;
  currentEdge: { source: string; target: string } | null;
  visitedNodes: string[];
  visitedEdges: string[]; // Edge IDs
  frontierNodes: string[]; // Nodes currently in queue / priority queue
  pathNodes: string[]; // Reconstructed path when found
  pathEdges: string[]; // Reconstructed path edge IDs
  distances: Record<string, number>; // Tentative distances
  predecessors: Record<string, string | null>; // Predecessor mapping
  traversalOrder: string[]; // Order nodes were processed
  dataStructure: {
    type: DataStructureType;
    items: DataStructureItem[];
  };
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
