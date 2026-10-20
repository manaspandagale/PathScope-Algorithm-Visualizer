import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';

export interface PresetGraph {
  id: string;
  name: string;
  category: string;
  description: string;
  sourceId: string;
  targetId: string;
  nodes: Node<GraphNodeData>[];
  edges: Edge<GraphEdgeData>[];
}

export const PRESET_GRAPHS: PresetGraph[] = [
  {
    id: 'bfs-vs-dijkstra-tradeoff',
    name: 'BFS vs Dijkstra Tradeoff (1 Hop @ Cost 18 vs 3 Hops @ Cost 7)',
    category: 'Pedagogical Benchmark',
    description:
      'Direct edge A → D costs 18 (1 hop). Multi-hop path A → B → C → D costs 2 + 2 + 3 = 7 (3 hops). BFS chooses 1 hop (cost 18), while Dijkstra chooses 3 hops (cost 7).',
    sourceId: 'node-A',
    targetId: 'node-D',
    nodes: [
      {
        id: 'node-A',
        type: 'custom',
        position: { x: 100, y: 220 },
        data: { label: 'A', isSource: true, isTarget: false, state: 'default' },
      },
      {
        id: 'node-B',
        type: 'custom',
        position: { x: 300, y: 100 },
        data: { label: 'B', isSource: false, isTarget: false, state: 'default' },
      },
      {
        id: 'node-C',
        type: 'custom',
        position: { x: 500, y: 100 },
        data: { label: 'C', isSource: false, isTarget: false, state: 'default' },
      },
      {
        id: 'node-D',
        type: 'custom',
        position: { x: 700, y: 220 },
        data: { label: 'D', isSource: false, isTarget: true, state: 'default' },
      },
    ],
    edges: [
      {
        id: 'e-AD',
        source: 'node-A',
        target: 'node-D',
        type: 'custom',
        data: { weight: 18, state: 'default' },
      },
      {
        id: 'e-AB',
        source: 'node-A',
        target: 'node-B',
        type: 'custom',
        data: { weight: 2, state: 'default' },
      },
      {
        id: 'e-BC',
        source: 'node-B',
        target: 'node-C',
        type: 'custom',
        data: { weight: 2, state: 'default' },
      },
      {
        id: 'e-CD',
        source: 'node-C',
        target: 'node-D',
        type: 'custom',
        data: { weight: 3, state: 'default' },
      },
    ],
  },
  {
    id: 'textbook-dijkstra',
    name: 'Dijkstra Weighted Path (Textbook 6-Node Network)',
    category: 'Weighted Shortest Path',
    description:
      'Classic non-negative weighted graph illustrating gradual tentative distance relaxation across multiple paths.',
    sourceId: 'node-A',
    targetId: 'node-F',
    nodes: [
      {
        id: 'node-A',
        type: 'custom',
        position: { x: 80, y: 200 },
        data: { label: 'A', isSource: true, isTarget: false, state: 'default' },
      },
      {
        id: 'node-B',
        type: 'custom',
        position: { x: 260, y: 90 },
        data: { label: 'B', isSource: false, isTarget: false, state: 'default' },
      },
      {
        id: 'node-C',
        type: 'custom',
        position: { x: 260, y: 310 },
        data: { label: 'C', isSource: false, isTarget: false, state: 'default' },
      },
      {
        id: 'node-D',
        type: 'custom',
        position: { x: 480, y: 90 },
        data: { label: 'D', isSource: false, isTarget: false, state: 'default' },
      },
      {
        id: 'node-E',
        type: 'custom',
        position: { x: 480, y: 310 },
        data: { label: 'E', isSource: false, isTarget: false, state: 'default' },
      },
      {
        id: 'node-F',
        type: 'custom',
        position: { x: 680, y: 200 },
        data: { label: 'F', isSource: false, isTarget: true, state: 'default' },
      },
    ],
    edges: [
      { id: 'e-AB', source: 'node-A', target: 'node-B', type: 'custom', data: { weight: 4, state: 'default' } },
      { id: 'e-AC', source: 'node-A', target: 'node-C', type: 'custom', data: { weight: 2, state: 'default' } },
      { id: 'e-BC', source: 'node-B', target: 'node-C', type: 'custom', data: { weight: 1, state: 'default' } },
      { id: 'e-BD', source: 'node-B', target: 'node-D', type: 'custom', data: { weight: 5, state: 'default' } },
      { id: 'e-CD', source: 'node-C', target: 'node-D', type: 'custom', data: { weight: 8, state: 'default' } },
      { id: 'e-CE', source: 'node-C', target: 'node-E', type: 'custom', data: { weight: 10, state: 'default' } },
      { id: 'e-DE', source: 'node-D', target: 'node-E', type: 'custom', data: { weight: 2, state: 'default' } },
      { id: 'e-DF', source: 'node-D', target: 'node-F', type: 'custom', data: { weight: 6, state: 'default' } },
      { id: 'e-EF', source: 'node-E', target: 'node-F', type: 'custom', data: { weight: 3, state: 'default' } },
    ],
  },
];
