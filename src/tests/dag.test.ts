import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';
import { runDAGShortestPath } from '../algorithms/dag';

describe('DAG Shortest Path Algorithm', () => {
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

  it('computes shortest path on a linear DAG with negative edge weights', () => {
    // A -> B (weight 3), B -> C (weight -2), A -> C (weight 5)
    // Shortest path A to C: A -> B -> C (3 + -2 = 1) vs direct A -> C (5)
    const nodes: Node<GraphNodeData>[] = [
      createNode('A', 'A'),
      createNode('B', 'B'),
      createNode('C', 'C'),
    ];

    const edges: Edge<GraphEdgeData>[] = [
      createEdge('e1', 'A', 'B', 3),
      createEdge('e2', 'B', 'C', -2),
      createEdge('e3', 'A', 'C', 5),
    ];

    const snapshots = runDAGShortestPath(nodes, edges, 'A', 'C');
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('found');
    expect(finalSnap.pathNodes).toEqual(['A', 'B', 'C']);
    expect(finalSnap.totalCost).toBe(1);
    expect(finalSnap.distances['C']).toBe(1);
    expect(finalSnap.distances['B']).toBe(3);
  });

  it('detects cycles and terminates with cycle-detected status', () => {
    // Directed cycle: A -> B -> C -> A
    const nodes: Node<GraphNodeData>[] = [
      createNode('A', 'A'),
      createNode('B', 'B'),
      createNode('C', 'C'),
    ];

    const edges: Edge<GraphEdgeData>[] = [
      createEdge('e1', 'A', 'B', 1),
      createEdge('e2', 'B', 'C', 2),
      createEdge('e3', 'C', 'A', 3),
    ];

    const snapshots = runDAGShortestPath(nodes, edges, 'A', 'C');
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('cycle-detected');
    expect(finalSnap.explanation).toMatch(/Cycle detected/i);
    expect(finalSnap.pathNodes).toEqual([]);
  });

  it('handles unreachable destination correctly', () => {
    // A -> B, and isolated node C
    const nodes: Node<GraphNodeData>[] = [
      createNode('A', 'A'),
      createNode('B', 'B'),
      createNode('C', 'C'),
    ];

    const edges: Edge<GraphEdgeData>[] = [
      createEdge('e1', 'A', 'B', 4),
    ];

    const snapshots = runDAGShortestPath(nodes, edges, 'A', 'C');
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('unreachable');
    expect(finalSnap.pathNodes).toEqual([]);
    expect(finalSnap.distances['C']).toBe(Infinity);
  });
});
