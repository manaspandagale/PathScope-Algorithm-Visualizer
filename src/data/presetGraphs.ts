import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';

export interface PresetGraph {
  id: string;
  name: string;
  description: string;
  sourceId: string;
  targetId: string;
  nodes: Node<GraphNodeData>[];
  edges: Edge<GraphEdgeData>[];
}

export const PRESET_GRAPHS: PresetGraph[] = [
  {
    id: 'daa-classic',
    name: 'DAA Textbook Classic (7 Nodes)',
    description:
      'A classic single-source shortest path problem. Great for comparing Dijkstra (optimal weight) vs BFS (minimum hops).',
    sourceId: 'A',
    targetId: 'G',
    nodes: [
      { id: 'A', type: 'customNode', position: { x: 50, y: 180 }, data: { label: 'A', isSource: true, isTarget: false, state: 'default' } },
      { id: 'B', type: 'customNode', position: { x: 220, y: 60 }, data: { label: 'B', isSource: false, isTarget: false, state: 'default' } },
      { id: 'C', type: 'customNode', position: { x: 220, y: 300 }, data: { label: 'C', isSource: false, isTarget: false, state: 'default' } },
      { id: 'D', type: 'customNode', position: { x: 420, y: 60 }, data: { label: 'D', isSource: false, isTarget: false, state: 'default' } },
      { id: 'E', type: 'customNode', position: { x: 420, y: 300 }, data: { label: 'E', isSource: false, isTarget: false, state: 'default' } },
      { id: 'F', type: 'customNode', position: { x: 580, y: 180 }, data: { label: 'F', isSource: false, isTarget: false, state: 'default' } },
      { id: 'G', type: 'customNode', position: { x: 740, y: 180 }, data: { label: 'G', isSource: false, isTarget: true, state: 'default' } },
    ],
    edges: [
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 4, state: 'default' } },
      { id: 'e-AC', source: 'A', target: 'C', data: { weight: 2, state: 'default' } },
      { id: 'e-BC', source: 'B', target: 'C', data: { weight: 1, state: 'default' } },
      { id: 'e-BD', source: 'B', target: 'D', data: { weight: 5, state: 'default' } },
      { id: 'e-CE', source: 'C', target: 'E', data: { weight: 8, state: 'default' } },
      { id: 'e-CD', source: 'C', target: 'D', data: { weight: 8, state: 'default' } },
      { id: 'e-DE', source: 'D', target: 'E', data: { weight: 2, state: 'default' } },
      { id: 'e-DF', source: 'D', target: 'F', data: { weight: 6, state: 'default' } },
      { id: 'e-EF', source: 'E', target: 'F', data: { weight: 3, state: 'default' } },
      { id: 'e-FG', source: 'F', target: 'G', data: { weight: 2, state: 'default' } },
    ],
  },
  {
    id: 'diamond-tradeoff',
    name: 'Dijkstra vs BFS Tradeoff',
    description:
      'Direct path (1 hop) has cost 18. Alternate path (3 hops) has cost 2+3+2 = 7. BFS chooses the 1-hop path, whereas Dijkstra finds the cost-7 path.',
    sourceId: 'S',
    targetId: 'T',
    nodes: [
      { id: 'S', type: 'customNode', position: { x: 80, y: 180 }, data: { label: 'S', isSource: true, isTarget: false, state: 'default' } },
      { id: 'N1', type: 'customNode', position: { x: 300, y: 70 }, data: { label: 'N1', isSource: false, isTarget: false, state: 'default' } },
      { id: 'N2', type: 'customNode', position: { x: 520, y: 70 }, data: { label: 'N2', isSource: false, isTarget: false, state: 'default' } },
      { id: 'T', type: 'customNode', position: { x: 740, y: 180 }, data: { label: 'T', isSource: false, isTarget: true, state: 'default' } },
      { id: 'M1', type: 'customNode', position: { x: 410, y: 290 }, data: { label: 'M1', isSource: false, isTarget: false, state: 'default' } },
    ],
    edges: [
      { id: 'e-ST', source: 'S', target: 'T', data: { weight: 18, state: 'default' } },
      { id: 'e-SN1', source: 'S', target: 'N1', data: { weight: 2, state: 'default' } },
      { id: 'e-N1N2', source: 'N1', target: 'N2', data: { weight: 3, state: 'default' } },
      { id: 'e-N2T', source: 'N2', target: 'T', data: { weight: 2, state: 'default' } },
      { id: 'e-SM1', source: 'S', target: 'M1', data: { weight: 6, state: 'default' } },
      { id: 'e-M1T', source: 'M1', target: 'T', data: { weight: 8, state: 'default' } },
    ],
  },
  {
    id: 'disconnected-graph',
    name: 'Disconnected Graph (Unreachable Target)',
    description:
      'Demonstrates algorithm robustness when the target node resides in an isolated component. Notice the clean unreachable state detection.',
    sourceId: 'C1_A',
    targetId: 'C2_X',
    nodes: [
      // Component 1
      { id: 'C1_A', type: 'customNode', position: { x: 70, y: 120 }, data: { label: 'A', isSource: true, isTarget: false, state: 'default' } },
      { id: 'C1_B', type: 'customNode', position: { x: 240, y: 60 }, data: { label: 'B', isSource: false, isTarget: false, state: 'default' } },
      { id: 'C1_C', type: 'customNode', position: { x: 240, y: 200 }, data: { label: 'C', isSource: false, isTarget: false, state: 'default' } },
      { id: 'C1_D', type: 'customNode', position: { x: 400, y: 130 }, data: { label: 'D', isSource: false, isTarget: false, state: 'default' } },
      // Component 2 (Isolated)
      { id: 'C2_X', type: 'customNode', position: { x: 580, y: 80 }, data: { label: 'X', isSource: false, isTarget: true, state: 'default' } },
      { id: 'C2_Y', type: 'customNode', position: { x: 730, y: 180 }, data: { label: 'Y', isSource: false, isTarget: false, state: 'default' } },
      { id: 'C2_Z', type: 'customNode', position: { x: 580, y: 260 }, data: { label: 'Z', isSource: false, isTarget: false, state: 'default' } },
    ],
    edges: [
      { id: 'e-C1_AB', source: 'C1_A', target: 'C1_B', data: { weight: 3, state: 'default' } },
      { id: 'e-C1_AC', source: 'C1_A', target: 'C1_C', data: { weight: 4, state: 'default' } },
      { id: 'e-C1_BD', source: 'C1_B', target: 'C1_D', data: { weight: 2, state: 'default' } },
      { id: 'e-C1_CD', source: 'C1_C', target: 'C1_D', data: { weight: 1, state: 'default' } },
      // Component 2 edges
      { id: 'e-C2_XY', source: 'C2_X', target: 'C2_Y', data: { weight: 5, state: 'default' } },
      { id: 'e-C2_YZ', source: 'C2_Y', target: 'C2_Z', data: { weight: 3, state: 'default' } },
      { id: 'e-C2_ZX', source: 'C2_Z', target: 'C2_X', data: { weight: 4, state: 'default' } },
    ],
  },
  {
    id: 'tree-branching',
    name: 'Binary / Branching Graph (DFS vs BFS)',
    description:
      'Tree structure highlighting how DFS dives deep down a single branch before backtracking, while BFS sweeps level by level.',
    sourceId: 'Root',
    targetId: 'Leaf_R2',
    nodes: [
      { id: 'Root', type: 'customNode', position: { x: 420, y: 50 }, data: { label: 'Root', isSource: true, isTarget: false, state: 'default' } },
      { id: 'L1', type: 'customNode', position: { x: 230, y: 170 }, data: { label: 'L1', isSource: false, isTarget: false, state: 'default' } },
      { id: 'R1', type: 'customNode', position: { x: 610, y: 170 }, data: { label: 'R1', isSource: false, isTarget: false, state: 'default' } },
      { id: 'Leaf_L1', type: 'customNode', position: { x: 140, y: 290 }, data: { label: 'L1-A', isSource: false, isTarget: false, state: 'default' } },
      { id: 'Leaf_L2', type: 'customNode', position: { x: 310, y: 290 }, data: { label: 'L1-B', isSource: false, isTarget: false, state: 'default' } },
      { id: 'Leaf_R1', type: 'customNode', position: { x: 520, y: 290 }, data: { label: 'R1-A', isSource: false, isTarget: false, state: 'default' } },
      { id: 'Leaf_R2', type: 'customNode', position: { x: 690, y: 290 }, data: { label: 'R1-B', isSource: false, isTarget: true, state: 'default' } },
    ],
    edges: [
      { id: 'e-RL1', source: 'Root', target: 'L1', data: { weight: 2, state: 'default' } },
      { id: 'e-RR1', source: 'Root', target: 'R1', data: { weight: 3, state: 'default' } },
      { id: 'e-L1_A', source: 'L1', target: 'Leaf_L1', data: { weight: 1, state: 'default' } },
      { id: 'e-L1_B', source: 'L1', target: 'Leaf_L2', data: { weight: 4, state: 'default' } },
      { id: 'e-R1_A', source: 'R1', target: 'Leaf_R1', data: { weight: 2, state: 'default' } },
      { id: 'e-R1_B', source: 'R1', target: 'Leaf_R2', data: { weight: 1, state: 'default' } },
    ],
  },
  {
    id: 'dag-network',
    name: 'Directed Acyclic Graph (with Negative Weight)',
    description:
      'A valid DAG demonstrating topological sort and linear time shortest path relaxation, including a negative weight edge (w = -2) where Dijkstra fails but DAG succeeds.',
    sourceId: 'S',
    targetId: 'D',
    nodes: [
      { id: 'S', type: 'customNode', position: { x: 80, y: 150 }, data: { label: 'S', isSource: true, isTarget: false, state: 'default' } },
      { id: 'A', type: 'customNode', position: { x: 260, y: 60 }, data: { label: 'A', isSource: false, isTarget: false, state: 'default' } },
      { id: 'B', type: 'customNode', position: { x: 260, y: 240 }, data: { label: 'B', isSource: false, isTarget: false, state: 'default' } },
      { id: 'C', type: 'customNode', position: { x: 460, y: 60 }, data: { label: 'C', isSource: false, isTarget: false, state: 'default' } },
      { id: 'D', type: 'customNode', position: { x: 640, y: 150 }, data: { label: 'D', isSource: false, isTarget: true, state: 'default' } },
    ],
    edges: [
      { id: 'e-SA', source: 'S', target: 'A', data: { weight: 3, isDirected: true, state: 'default' } },
      { id: 'e-SB', source: 'S', target: 'B', data: { weight: 2, isDirected: true, state: 'default' } },
      { id: 'e-AC', source: 'A', target: 'C', data: { weight: 4, isDirected: true, state: 'default' } },
      { id: 'e-BC', source: 'B', target: 'C', data: { weight: 1, isDirected: true, state: 'default' } },
      { id: 'e-CD', source: 'C', target: 'D', data: { weight: 2, isDirected: true, state: 'default' } },
      { id: 'e-BD', source: 'B', target: 'D', data: { weight: 6, isDirected: true, state: 'default' } },
      { id: 'e-AD', source: 'A', target: 'D', data: { weight: -2, isDirected: true, state: 'default' } }, // Negative weight edge
    ],
  },
  {
    id: 'floyd-4node',
    name: 'Floyd–Warshall 4-Node Network',
    description:
      'Compact 4-vertex network ideal for inspecting dynamic all-pairs distance matrix updates across intermediate nodes k = 1..4.',
    sourceId: '1',
    targetId: '4',
    nodes: [
      { id: '1', type: 'customNode', position: { x: 120, y: 80 }, data: { label: '1', isSource: true, isTarget: false, state: 'default' } },
      { id: '2', type: 'customNode', position: { x: 420, y: 80 }, data: { label: '2', isSource: false, isTarget: false, state: 'default' } },
      { id: '3', type: 'customNode', position: { x: 120, y: 280 }, data: { label: '3', isSource: false, isTarget: false, state: 'default' } },
      { id: '4', type: 'customNode', position: { x: 420, y: 280 }, data: { label: '4', isSource: false, isTarget: true, state: 'default' } },
    ],
    edges: [
      { id: 'e-12', source: '1', target: '2', data: { weight: 5, state: 'default' } },
      { id: 'e-13', source: '1', target: '3', data: { weight: 9, state: 'default' } },
      { id: 'e-23', source: '2', target: '3', data: { weight: 2, state: 'default' } },
      { id: 'e-24', source: '2', target: '4', data: { weight: 4, state: 'default' } },
      { id: 'e-34', source: '3', target: '4', data: { weight: 3, state: 'default' } },
    ],
  },
];

