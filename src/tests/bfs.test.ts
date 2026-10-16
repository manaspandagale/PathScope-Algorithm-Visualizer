import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import { runBFS } from '../algorithms/bfs';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';

describe('BFS Algorithm', () => {
  const nodes: Node<GraphNodeData>[] = [
    { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false, state: 'default' } },
    { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false, state: 'default' } },
    { id: 'C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: false, state: 'default' } },
    { id: 'D', position: { x: 300, y: 0 }, data: { label: 'D', isSource: false, isTarget: true, state: 'default' } },
    { id: 'E', position: { x: 400, y: 0 }, data: { label: 'E', isSource: false, isTarget: false, state: 'default' } },
  ];

  const edges: Edge<GraphEdgeData>[] = [
    { id: 'e1', source: 'A', target: 'B', data: { weight: 5, state: 'default' } },
    { id: 'e2', source: 'B', target: 'C', data: { weight: 2, state: 'default' } },
    { id: 'e3', source: 'C', target: 'D', data: { weight: 1, state: 'default' } },
    { id: 'e4', source: 'A', target: 'D', data: { weight: 20, state: 'default' } }, // Direct hop with high weight
  ];

  it('should find the minimum hop path regardless of edge weights', () => {
    // In this graph, A -> D is 1 hop (weight 20), whereas A -> B -> C -> D is 3 hops (weight 8).
    // BFS prioritizes hop count! So it must find A -> D as the shortest hop path.
    const steps = runBFS(nodes, edges, 'A', 'D', false);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.status).toBe('found');
    expect(finalStep.pathNodes).toEqual(['A', 'D']);
    expect(finalStep.hopCount).toBe(1);
    expect(finalStep.totalCost).toBe(20);
  });

  it('should handle unreachable destination in disconnected graph', () => {
    const steps = runBFS(nodes, edges, 'A', 'E', false);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.status).toBe('unreachable');
    expect(finalStep.pathNodes).toEqual([]);
  });

  it('should handle source === target', () => {
    const steps = runBFS(nodes, edges, 'B', 'B', false);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.status).toBe('found');
    expect(finalStep.pathNodes).toEqual(['B']);
    expect(finalStep.totalCost).toBe(0);
  });
});
