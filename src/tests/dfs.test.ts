import { describe, it, expect } from 'vitest';
import type { Node, Edge } from '@xyflow/react';
import { runDFS } from '../algorithms/dfs';
import type { GraphNodeData, GraphEdgeData } from '../types/graph';

describe('DFS Algorithm', () => {
  const nodes: Node<GraphNodeData>[] = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1', isSource: true, isTarget: false, state: 'default' } },
    { id: '2', position: { x: 100, y: 0 }, data: { label: 'Node 2', isSource: false, isTarget: false, state: 'default' } },
    { id: '3', position: { x: 200, y: 0 }, data: { label: 'Node 3', isSource: false, isTarget: false, state: 'default' } },
    { id: '4', position: { x: 100, y: 100 }, data: { label: 'Node 4', isSource: false, isTarget: true, state: 'default' } },
    { id: '5', position: { x: 300, y: 100 }, data: { label: 'Isolated', isSource: false, isTarget: false, state: 'default' } },
  ];

  const edges: Edge<GraphEdgeData>[] = [
    { id: 'e1', source: '1', target: '2', data: { weight: 1, state: 'default' } },
    { id: 'e2', source: '2', target: '3', data: { weight: 1, state: 'default' } }, // Dead-end branch
    { id: 'e3', source: '1', target: '4', data: { weight: 1, state: 'default' } },
  ];

  it('should traverse deeply, backtrack from dead ends, and find path to target', () => {
    const steps = runDFS(nodes, edges, '1', '4', false);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.status).toBe('found');
    expect(finalStep.pathNodes.length).toBeGreaterThan(0);
    expect(finalStep.pathNodes[0]).toBe('1');
    expect(finalStep.pathNodes[finalStep.pathNodes.length - 1]).toBe('4');

    // Confirm that steps include backtracking when exploring node 3
    const hasBacktrackStep = steps.some((s) => s.explanation.includes('Backtracking'));
    expect(hasBacktrackStep).toBe(true);
  });

  it('should detect unreachable nodes in disconnected graph', () => {
    const steps = runDFS(nodes, edges, '1', '5', false);
    const finalStep = steps[steps.length - 1];

    expect(finalStep.status).toBe('unreachable');
    expect(finalStep.pathNodes).toEqual([]);
  });
});
