import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';
import { executeAlgorithmWasm } from '../wasm/algorithmEngine';

describe('C++ WebAssembly BFS Engine', () => {
  it('should find minimum-hop path regardless of numeric edge weights', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: false } },
      { id: 'D', position: { x: 300, y: 0 }, data: { label: 'D', isSource: false, isTarget: true } },
    ];
    // 1 hop A-D with huge weight 100, vs 3 hops A-B-C-D with small weight 6
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AD', source: 'A', target: 'D', data: { weight: 100 } },
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 2 } },
      { id: 'e-BC', source: 'B', target: 'C', data: { weight: 2 } },
      { id: 'e-CD', source: 'C', target: 'D', data: { weight: 2 } },
    ];

    const snapshots = await executeAlgorithmWasm('bfs', nodes, edges, 'A', 'D');
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('found');
    expect(finalSnap.pathNodes).toEqual(['A', 'D']); // 1 hop
    expect(finalSnap.hopCount).toBe(1);
    expect(finalSnap.totalCost).toBe(100);
  });

  it('should handle disconnected graphs cleanly', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 1 } },
    ];

    const snapshots = await executeAlgorithmWasm('bfs', nodes, edges, 'A', 'C');
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('unreachable');
    expect(finalSnap.pathNodes).toEqual([]);
  });

  it('should handle source equals destination trivially with 0 hops', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [];

    const snapshots = await executeAlgorithmWasm('bfs', nodes, edges, 'A', 'A');
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('found');
    expect(finalSnap.hopCount).toBe(0);
    expect(finalSnap.totalCost).toBe(0);
    expect(finalSnap.pathNodes).toEqual(['A']);
  });

  it('should handle cycles without infinite loops', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: true } },
    ];
    // Triangle cycle A-B-C-A
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 1 } },
      { id: 'e-BC', source: 'B', target: 'C', data: { weight: 1 } },
      { id: 'e-CA', source: 'C', target: 'A', data: { weight: 1 } },
    ];

    const snapshots = await executeAlgorithmWasm('bfs', nodes, edges, 'A', 'C');
    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('found');
    expect(finalSnap.pathNodes).toEqual(['A', 'C']);
  });

  it('should produce deterministic traversal across multiple executions', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 100, y: 100 }, data: { label: 'C', isSource: false, isTarget: false } },
      { id: 'D', position: { x: 200, y: 0 }, data: { label: 'D', isSource: false, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 1 } },
      { id: 'e-AC', source: 'A', target: 'C', data: { weight: 1 } },
      { id: 'e-BD', source: 'B', target: 'D', data: { weight: 1 } },
      { id: 'e-CD', source: 'C', target: 'D', data: { weight: 1 } },
    ];

    const run1 = await executeAlgorithmWasm('bfs', nodes, edges, 'A', 'D');
    const run2 = await executeAlgorithmWasm('bfs', nodes, edges, 'A', 'D');

    expect(run1.length).toBe(run2.length);
    for (let i = 0; i < run1.length; i++) {
      expect(run1[i].stepNumber).toBe(run2[i].stepNumber);
      expect(run1[i].currentNode).toBe(run2[i].currentNode);
      expect(run1[i].explanation).toBe(run2[i].explanation);
      expect(run1[i].visitedNodes).toEqual(run2[i].visitedNodes);
    }
  });
});
