import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import { runDijkstra } from '../algorithms/dijkstra';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';

describe('Dijkstra Algorithm', () => {
  const nodes: Node<GraphNodeData>[] = [
    { id: 'S', position: { x: 0, y: 0 }, data: { label: 'Start', isSource: true, isTarget: false, state: 'default' } },
    { id: 'A', position: { x: 100, y: -50 }, data: { label: 'A', isSource: false, isTarget: false, state: 'default' } },
    { id: 'B', position: { x: 200, y: -50 }, data: { label: 'B', isSource: false, isTarget: false, state: 'default' } },
    { id: 'T', position: { x: 300, y: 0 }, data: { label: 'Target', isSource: false, isTarget: true, state: 'default' } },
    { id: 'U', position: { x: 400, y: 200 }, data: { label: 'Unreachable', isSource: false, isTarget: false, state: 'default' } },
  ];

  // S -> T directly has weight 10 (1 hop)
  // S -> A -> B -> T has weights 2 + 3 + 2 = 7 (3 hops)
  // Dijkstra MUST choose S -> A -> B -> T because 7 < 10!
  const edges: Edge<GraphEdgeData>[] = [
    { id: 'e1', source: 'S', target: 'T', data: { weight: 10, state: 'default' } },
    { id: 'e2', source: 'S', target: 'A', data: { weight: 2, state: 'default' } },
    { id: 'e3', source: 'A', target: 'B', data: { weight: 3, state: 'default' } },
    { id: 'e4', source: 'B', target: 'T', data: { weight: 2, state: 'default' } },
  ];

  it('should find the minimum-weight path even if it has more hops', () => {
    const steps = runDijkstra(nodes, edges, 'S', 'T', false);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.status).toBe('found');
    expect(finalStep.pathNodes).toEqual(['S', 'A', 'B', 'T']);
    expect(finalStep.totalCost).toBe(7);
    expect(finalStep.hopCount).toBe(3);
  });

  it('should detect unreachable destination in disconnected graph', () => {
    const steps = runDijkstra(nodes, edges, 'S', 'U', false);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.status).toBe('unreachable');
    expect(finalStep.pathNodes).toEqual([]);
    expect(finalStep.distances['U']).toBe(Infinity);
  });

  it('should handle source === target', () => {
    const steps = runDijkstra(nodes, edges, 'A', 'A', false);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.status).toBe('found');
    expect(finalStep.pathNodes).toEqual(['A']);
    expect(finalStep.totalCost).toBe(0);
  });
});
