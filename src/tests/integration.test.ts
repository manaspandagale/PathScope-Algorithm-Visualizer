import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';
import { getWasmModule, executeAlgorithmWasm } from '../wasm/algorithmEngine';

describe('C++ WebAssembly Integration Tests', () => {
  it('should initialize WebAssembly module successfully', async () => {
    const wasmMod = await getWasmModule();
    expect(wasmMod).toBeDefined();
    expect(typeof wasmMod.run_bfs_wasm).toBe('function');
    expect(typeof wasmMod.run_dijkstra_wasm).toBe('function');
  });

  it('should pass graph input to C++ correctly and return valid StepSnapshot contract', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'u1', position: { x: 0, y: 0 }, data: { label: 'Start', isSource: true, isTarget: false } },
      { id: 'u2', position: { x: 100, y: 0 }, data: { label: 'Mid', isSource: false, isTarget: false } },
      { id: 'u3', position: { x: 200, y: 0 }, data: { label: 'Goal', isSource: false, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'edge-1', source: 'u1', target: 'u2', data: { weight: 5 } },
      { id: 'edge-2', source: 'u2', target: 'u3', data: { weight: 7 } },
    ];

    const snapshots = await executeAlgorithmWasm('dijkstra', nodes, edges, 'u1', 'u3');
    expect(snapshots.length).toBeGreaterThan(0);

    // Verify TypeScript StepSnapshot contract properties on all snapshots
    for (const snap of snapshots) {
      expect(typeof snap.stepNumber).toBe('number');
      expect(typeof snap.codeLine).toBe('number');
      expect(typeof snap.explanation).toBe('string');
      expect(Array.isArray(snap.visitedNodes)).toBe(true);
      expect(Array.isArray(snap.visitedEdges)).toBe(true);
      expect(Array.isArray(snap.frontierNodes)).toBe(true);
      expect(Array.isArray(snap.pathNodes)).toBe(true);
      expect(Array.isArray(snap.pathEdges)).toBe(true);
      expect(typeof snap.distances).toBe('object');
      expect(typeof snap.predecessors).toBe('object');
      expect(snap.dataStructure).toBeDefined();
      expect(typeof snap.dataStructure.type).toBe('string');
      expect(Array.isArray(snap.dataStructure.items)).toBe(true);
      expect(['ready', 'running', 'found', 'unreachable', 'invalid']).toContain(snap.status);
    }

    const last = snapshots[snapshots.length - 1];
    expect(last.status).toBe('found');
    expect(last.totalCost).toBe(12); // 5 + 7
    expect(last.hopCount).toBe(2);
    expect(last.pathNodes).toEqual(['u1', 'u2', 'u3']);
    expect(last.pathEdges).toEqual(['edge-1', 'edge-2']);
  });

  it('should regenerate snapshots upon graph edits (e.g. edge weight modifications)', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'A', position: { x: 0, y: 0 }, data: { label: 'A', isSource: true, isTarget: false } },
      { id: 'B', position: { x: 100, y: 0 }, data: { label: 'B', isSource: false, isTarget: false } },
      { id: 'C', position: { x: 200, y: 0 }, data: { label: 'C', isSource: false, isTarget: true } },
    ];

    // Initial edges: direct A->C is cost 10, A->B->C is 2+2=4 (multi-hop wins)
    const initialEdges: Edge<GraphEdgeData>[] = [
      { id: 'e-AC', source: 'A', target: 'C', data: { weight: 10 } },
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 2 } },
      { id: 'e-BC', source: 'B', target: 'C', data: { weight: 2 } },
    ];
    const snap1 = await executeAlgorithmWasm('dijkstra', nodes, initialEdges, 'A', 'C');
    expect(snap1[snap1.length - 1].pathNodes).toEqual(['A', 'B', 'C']);
    expect(snap1[snap1.length - 1].totalCost).toBe(4);

    // Edit edge: reduce direct A->C to weight 1 (direct edge now wins!)
    const editedEdges: Edge<GraphEdgeData>[] = [
      { id: 'e-AC', source: 'A', target: 'C', data: { weight: 1 } },
      { id: 'e-AB', source: 'A', target: 'B', data: { weight: 2 } },
      { id: 'e-BC', source: 'B', target: 'C', data: { weight: 2 } },
    ];
    const snap2 = await executeAlgorithmWasm('dijkstra', nodes, editedEdges, 'A', 'C');
    expect(snap2[snap2.length - 1].pathNodes).toEqual(['A', 'C']);
    expect(snap2[snap2.length - 1].totalCost).toBe(1);
  });

  it('should match final path highlighting with the returned C++ result', async () => {
    const nodes: Node<GraphNodeData>[] = [
      { id: 'X', position: { x: 0, y: 0 }, data: { label: 'X', isSource: true, isTarget: false } },
      { id: 'Y', position: { x: 100, y: 0 }, data: { label: 'Y', isSource: false, isTarget: false } },
      { id: 'Z', position: { x: 200, y: 0 }, data: { label: 'Z', isSource: false, isTarget: true } },
    ];
    const edges: Edge<GraphEdgeData>[] = [
      { id: 'e-XY', source: 'X', target: 'Y', data: { weight: 3 } },
      { id: 'e-YZ', source: 'Y', target: 'Z', data: { weight: 4 } },
    ];

    const snapshots = await executeAlgorithmWasm('bfs', nodes, edges, 'X', 'Z');
    const finalSnap = snapshots[snapshots.length - 1];

    expect(finalSnap.pathNodes).toEqual(['X', 'Y', 'Z']);
    expect(finalSnap.pathEdges).toEqual(['e-XY', 'e-YZ']);
    expect(finalSnap.hopCount).toBe(2);
  });
});
