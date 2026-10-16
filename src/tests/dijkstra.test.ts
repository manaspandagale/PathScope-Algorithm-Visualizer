import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';
import { executeAlgorithmWasm } from '../wasm/algorithmEngine';

describe('C++ WebAssembly Dijkstra Engine', () => {
  it('should find optimal minimum-weight path', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 2 } },
      { id: 'e-BC', source: 'B', target: 'C', data: { weight: 3 } },
      { id: 'e-AC', source: 'A', target: 'C', data: { weight: 10 } },
    ];

    const snapshots = await executeAlgorithmWasm('dijkstra', nodes, edges, 'A', 'C');
    expect(snapshots.length).toBeGreaterThan(0);

    const finalSnap = snapshots[snapshots.length - 1];
    expect(finalSnap.status).toBe('found');
    expect(finalSnap.totalCost).toBe(5); // 2 + 3 = 5 < 10
    expect(finalSnap.pathNodes).toEqual(['A', 'B', 'C']);
  });

  it('should prefer cheaper multi-hop path over expensive direct edge', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: false } },
      { id: 'D', position: { x: 300, y: 0 }, data: { label: 'D', isSource: false, isTarget: true } },
    ];
    // Direct 1 hop A-D has weight 18. Multi-hop A-B-C-D has weight 2 + 2 + 3 = 7
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AD', source: 'A', target: 'D', data: { weight: 18 } },
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 2 } },
      { id: 'e-BC', source: 'B', target: 'C', data: { weight: 2 } },
      { id: 'e-CD', source: 'C', target: 'D', data: { weight: 3 } },
    ];

    const snapshots = await executeAlgorithmWasm('dijkstra', nodes, edges, 'A', 'D');
    const finalSnap = snapshots[snapshots.length - 1];

    expect(finalSnap.status).toBe('found');
    expect(finalSnap.totalCost).toBe(7);
    expect(finalSnap.hopCount).toBe(3);
    expect(finalSnap.pathNodes).toEqual(['A', 'B', 'C', 'D']);
  });

  it('should handle disconnected destinations as unreachable', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 4 } },
    ];

    const snapshots = await executeAlgorithmWasm('dijkstra', nodes, edges, 'A', 'C');
    const finalSnap = snapshots[snapshots.length - 1];

    expect(finalSnap.status).toBe('unreachable');
    expect(finalSnap.pathNodes).toEqual([]);
  });

  it('should handle source equals destination trivially with 0 cost', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [];

    const snapshots = await executeAlgorithmWasm('dijkstra', nodes, edges, 'A', 'A');
    const finalSnap = snapshots[snapshots.length - 1];

    expect(finalSnap.status).toBe('found');
    expect(finalSnap.totalCost).toBe(0);
    expect(finalSnap.hopCount).toBe(0);
    expect(finalSnap.pathNodes).toEqual(['A']);
  });

  it('should correctly handle stale priority queue entries and cycles', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 100, y: 100 }, data: { label: 'C', isSource: false, isTarget: false } },
      { id: 'D', position: { x: 200, y: 0 }, data: { label: 'D', isSource: false, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 5 } },
      { id: 'e-AC', source: 'A', target: 'C', data: { weight: 1 } },
      { id: 'e-CB', source: 'C', target: 'B', data: { weight: 1 } },
      { id: 'e-BD', source: 'B', target: 'D', data: { weight: 2 } },
    ];

    const snapshots = await executeAlgorithmWasm('dijkstra', nodes, edges, 'A', 'D');
    const finalSnap = snapshots[snapshots.length - 1];

    expect(finalSnap.status).toBe('found');
    expect(finalSnap.totalCost).toBe(4); // A->C(1) + C->B(1) + B->D(2) = 4
    expect(finalSnap.pathNodes).toEqual(['A', 'C', 'B', 'D']);
  });

  it('should reject negative edge weights before execution', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: -5 } },
    ];

    const snapshots = await executeAlgorithmWasm('dijkstra', nodes, edges, 'A', 'B');
    expect(snapshots.length).toBeGreaterThan(0);
    expect(snapshots[0].status).toBe('invalid');
    expect(snapshots[0].explanation).toContain('Negative weight detected');
  });

  it('should produce deterministic results across multiple runs', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 3 } },
      { id: 'e-BC', source: 'B', target: 'C', data: { weight: 4 } },
      { id: 'e-AC', source: 'A', target: 'C', data: { weight: 8 } },
    ];

    const run1 = await executeAlgorithmWasm('dijkstra', nodes, edges, 'A', 'C');
    const run2 = await executeAlgorithmWasm('dijkstra', nodes, edges, 'A', 'C');

    expect(run1.length).toBe(run2.length);
    for (let i = 0; i < run1.length; i++) {
      expect(run1[i].stepNumber).toBe(run2[i].stepNumber);
      expect(run1[i].currentNode).toBe(run2[i].currentNode);
      expect(run1[i].distances).toEqual(run2[i].distances);
    }
  });
});
