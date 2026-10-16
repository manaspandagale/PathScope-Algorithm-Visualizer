import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';
import { runFloydWarshall } from '../algorithms/floydWarshall';

describe('Floyd-Warshall Algorithm', () => {
  const createNode = (id: string, label: string): Node<GraphNodeData> => ({
    id,
    position: { x: 0, y: 0 },
    data: { label, isSource: false, isTarget: false, state: 'default' },
  });

  const createEdge = (
    id: string,
    source: string,
    target: string,
    weight: number
  ): Edge<GraphEdgeData> => ({
    id,
    source,
    target,
    data: { weight },
  });

  it('computes all-pairs shortest paths on a weighted directed graph', () => {
    // 3 nodes: 0 -> 1 (4), 0 -> 2 (11), 1 -> 2 (2)
    // Shortest path 0 to 2 should be 0 -> 1 -> 2 with total cost 6
    const nodes: Node<GraphNodeData>[] = [
      createNode('0', '0'),
      createNode('1', '1'),
      createNode('2', '2'),
    ];

    const edges: Edge<GraphEdgeData>[] = [
      createEdge('e1', '0', '1', 4),
      createEdge('e2', '0', '2', 11),
      createEdge('e3', '1', '2', 2),
    ];

    const snapshots = runFloydWarshall(nodes, edges, '0', '2', true);
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('found');
    expect(finalSnap.totalCost).toBe(6);
    expect(finalSnap.pathNodes).toEqual(['0', '1', '2']);
    expect(finalSnap.matrixState?.distMatrix['0']['2']).toBe(6);
  });

  it('detects negative cycles when dist[i][i] < 0', () => {
    // Negative cycle: A -> B (1), B -> C (-5), C -> A (2)
    // Sum = 1 - 5 + 2 = -2 < 0
    const nodes: Node<GraphNodeData>[] = [
      createNode('A', 'A'),
      createNode('B', 'B'),
      createNode('C', 'C'),
    ];

    const edges: Edge<GraphEdgeData>[] = [
      createEdge('e1', 'A', 'B', 1),
      createEdge('e2', 'B', 'C', -5),
      createEdge('e3', 'C', 'A', 2),
    ];

    const snapshots = runFloydWarshall(nodes, edges, 'A', 'B', true);
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('cycle-detected');
    expect(finalSnap.explanation).toMatch(/Negative.*weight cycle detected/i);
  });

  it('handles disconnected/unreachable nodes', () => {
    const nodes: Node<GraphNodeData>[] = [
      createNode('A', 'A'),
      createNode('B', 'B'),
    ];

    const edges: Edge<GraphEdgeData>[] = [];

    const snapshots = runFloydWarshall(nodes, edges, 'A', 'B', true);
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('unreachable');
    expect(finalSnap.pathNodes).toEqual([]);
    expect(finalSnap.matrixState?.distMatrix['A']['B']).toBe(Infinity);
  });
});
