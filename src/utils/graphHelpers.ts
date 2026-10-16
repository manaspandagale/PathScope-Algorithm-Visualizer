import type { Node, Edge } from '@xyflow/react';
import type { AdjacencyList, GraphNodeData, GraphEdgeData } from '../types/graph';

export function buildAdjacencyList(
  nodes: Node<GraphNodeData>[],
  edges: Edge<GraphEdgeData>[],
  isDirected: boolean = false
): AdjacencyList {
  const adj: AdjacencyList = {};

  for (const node of nodes) {
    adj[node.id] = [];
  }

  for (const edge of edges) {
    const source = edge.source;
    const target = edge.target;
    const weight = Number(edge.data?.weight ?? 1);

    if (adj[source]) {
      adj[source].push({ target, weight, edgeId: edge.id });
    }

    if (!isDirected && adj[target]) {
      // In undirected graph, edge can be traversed in reverse
      adj[target].push({ target: source, weight, edgeId: edge.id });
    }
  }

  // Sort neighbors by target ID for deterministic traversal order
  for (const nodeId of Object.keys(adj)) {
    adj[nodeId].sort((a, b) => a.target.localeCompare(b.target));
  }

  return adj;
}

export function findEdgeIdBetween(
  edges: Edge<GraphEdgeData>[],
  u: string,
  v: string,
  isDirected: boolean = false
): string | undefined {
  const edge = edges.find((e) => {
    if (e.source === u && e.target === v) return true;
    if (!isDirected && e.source === v && e.target === u) return true;
    return false;
  });
  return edge?.id;
}

export function reconstructPath(
  predecessors: Record<string, string | null>,
  source: string,
  target: string,
  edges: Edge<GraphEdgeData>[],
  isDirected: boolean = false
): { pathNodes: string[]; pathEdges: string[]; totalCost: number } {
  const pathNodes: string[] = [];
  const pathEdges: string[] = [];
  let curr: string | null = target;

  while (curr !== null) {
    pathNodes.unshift(curr);
    if (curr === source) break;
    const pred: string | null | undefined = predecessors[curr];
    if (!pred) break;
    const edgeId = findEdgeIdBetween(edges, pred, curr, isDirected);
    if (edgeId) pathEdges.unshift(edgeId);
    curr = pred;
  }

  if (pathNodes[0] !== source) {
    return { pathNodes: [], pathEdges: [], totalCost: 0 };
  }

  let totalCost = 0;
  for (const edgeId of pathEdges) {
    const edge = edges.find((e) => e.id === edgeId);
    if (edge) {
      totalCost += Number(edge.data?.weight ?? 1);
    }
  }

  return { pathNodes, pathEdges, totalCost };
}
