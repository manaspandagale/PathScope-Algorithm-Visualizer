import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';
import { findEdgeIdBetween } from '../utils/graphHelpers';

export function runFloydWarshall(
  nodes: Node<GraphNodeData>[],
  edges: Edge<GraphEdgeData>[],
  sourceId: string,
  targetId: string,
  isDirected: boolean = false
): StepSnapshot[] {
  const steps: StepSnapshot[] = [];
  const nodeIds = nodes.map((n) => n.id).sort((a, b) => a.localeCompare(b));
  const nodeMap = new Map(nodes.map((n) => [n.id, n.data.label || n.id]));
  const getLabel = (id: string) => nodeMap.get(id) || id;

  if (nodes.length === 0) {
    return [];
  }

  // Initialize distance matrix dist[i][j] and next[i][j]
  const dist: Record<string, Record<string, number>> = {};
  const next: Record<string, Record<string, string | null>> = {};

  for (const u of nodeIds) {
    dist[u] = {};
    next[u] = {};
    for (const v of nodeIds) {
      if (u === v) {
        dist[u][v] = 0;
        next[u][v] = u;
      } else {
        dist[u][v] = Infinity;
        next[u][v] = null;
      }
    }
  }

  // Populate direct edge weights
  for (const edge of edges) {
    const u = edge.source;
    const v = edge.target;
    const weight = Number(edge.data?.weight ?? 1);

    if (dist[u] && dist[u][v] !== undefined && weight < dist[u][v]) {
      dist[u][v] = weight;
      next[u][v] = v;
    }

    if (!isDirected && dist[v] && dist[v][u] !== undefined && weight < dist[v][u]) {
      dist[v][u] = weight;
      next[v][u] = u;
    }
  }

  const cloneDist = (): Record<string, Record<string, number>> => {
    const copy: Record<string, Record<string, number>> = {};
    for (const u of nodeIds) {
      copy[u] = { ...dist[u] };
    }
    return copy;
  };

  const cloneNext = (): Record<string, Record<string, string | null>> => {
    const copy: Record<string, Record<string, string | null>> = {};
    for (const u of nodeIds) {
      copy[u] = { ...next[u] };
    }
    return copy;
  };

  let stepCount = 1;

  // Step 1: Initialization
  steps.push({
    stepNumber: stepCount++,
    codeLine: 2,
    explanation: `Initialized Floyd–Warshall distance matrix with direct edge costs and diagonal 0s. Ready to consider each vertex as an intermediate point.`,
    currentNode: null,
    currentEdge: null,
    visitedNodes: [],
    visitedEdges: [],
    frontierNodes: [],
    pathNodes: [],
    pathEdges: [],
    distances: dist[sourceId] ? { ...dist[sourceId] } : {},
    predecessors: {},
    traversalOrder: [],
    dataStructure: {
      type: 'matrix',
      items: nodeIds.map((id) => ({ id, label: getLabel(id) })),
    },
    matrixState: {
      nodes: nodeIds,
      kNode: null,
      iNode: null,
      jNode: null,
      distMatrix: cloneDist(),
      nextMatrix: cloneNext(),
    },
    status: 'running',
  });

  // Floyd-Warshall Triple Loop
  for (const k of nodeIds) {
    // Intermediate vertex k
    steps.push({
      stepNumber: stepCount++,
      codeLine: 3,
      explanation: `Phase k = '${getLabel(k)}': Considering vertex '${getLabel(k)}' as an intermediate hop between all pairs (i, j).`,
      currentNode: k,
      currentEdge: null,
      visitedNodes: [k],
      visitedEdges: [],
      frontierNodes: [k],
      pathNodes: [],
      pathEdges: [],
      distances: dist[sourceId] ? { ...dist[sourceId] } : {},
      predecessors: {},
      traversalOrder: [k],
      dataStructure: {
        type: 'matrix',
        items: [{ id: k, label: `k=${getLabel(k)}` }],
      },
      matrixState: {
        nodes: nodeIds,
        kNode: k,
        iNode: null,
        jNode: null,
        distMatrix: cloneDist(),
        nextMatrix: cloneNext(),
      },
      status: 'running',
    });

    for (const i of nodeIds) {
      if (dist[i][k] === Infinity) continue; // No path from i to k

      for (const j of nodeIds) {
        if (dist[k][j] === Infinity) continue; // No path from k to j

        const throughK = dist[i][k] + dist[k][j];
        if (throughK < dist[i][j]) {
          const oldVal = dist[i][j] === Infinity ? '∞' : dist[i][j];
          dist[i][j] = throughK;
          next[i][j] = next[i][k];

          steps.push({
            stepNumber: stepCount++,
            codeLine: 5,
            explanation: `Relaxed path (${getLabel(i)} → ${getLabel(j)}) via '${getLabel(k)}': dist[${getLabel(i)}][${getLabel(j)}] updated from ${oldVal} to ${throughK} (${dist[i][k]} + ${dist[k][j]}).`,
            currentNode: k,
            currentEdge: { source: i, target: j },
            visitedNodes: [i, k, j],
            visitedEdges: [],
            frontierNodes: [k],
            pathNodes: [],
            pathEdges: [],
            distances: dist[sourceId] ? { ...dist[sourceId] } : {},
            predecessors: {},
            traversalOrder: [k],
            dataStructure: {
              type: 'matrix',
              items: [{ id: k, label: `k=${getLabel(k)}, i=${getLabel(i)}, j=${getLabel(j)}` }],
            },
            matrixState: {
              nodes: nodeIds,
              kNode: k,
              iNode: i,
              jNode: j,
              distMatrix: cloneDist(),
              nextMatrix: cloneNext(),
            },
            status: 'running',
          });
        }
      }
    }
  }

  // Check for negative weight cycles (diagonal < 0)
  for (const u of nodeIds) {
    if (dist[u][u] < 0) {
      steps.push({
        stepNumber: stepCount++,
        codeLine: 6,
        explanation: `Negative weight cycle detected! dist[${getLabel(u)}][${getLabel(u)}] = ${dist[u][u]} < 0. Shortest paths are undefined for graphs with negative cycles.`,
        currentNode: u,
        currentEdge: null,
        visitedNodes: [u],
        visitedEdges: [],
        frontierNodes: [u],
        pathNodes: [],
        pathEdges: [],
        distances: dist[sourceId] ? { ...dist[sourceId] } : {},
        predecessors: {},
        traversalOrder: [],
        dataStructure: {
          type: 'matrix',
          items: [{ id: u, label: `Cycle at ${getLabel(u)}` }],
        },
        matrixState: {
          nodes: nodeIds,
          kNode: null,
          iNode: u,
          jNode: u,
          distMatrix: cloneDist(),
          nextMatrix: cloneNext(),
        },
        status: 'cycle-detected',
      });
      return steps;
    }
  }

  // Path reconstruction between selected sourceId and targetId
  const pathNodes: string[] = [];
  const pathEdges: string[] = [];

  if (sourceId && targetId && dist[sourceId] && dist[sourceId][targetId] < Infinity) {
    let curr: string | null = sourceId;
    pathNodes.push(curr);

    const visitedInPath = new Set<string>();
    while (curr !== targetId && curr !== null) {
      visitedInPath.add(curr);
      const nextNode: string | null = next[curr][targetId];
      if (!nextNode || visitedInPath.has(nextNode)) break;

      const edgeId = findEdgeIdBetween(edges, curr, nextNode, isDirected);
      if (edgeId) pathEdges.push(edgeId);

      curr = nextNode;
      pathNodes.push(curr);
    }

    const totalCost = dist[sourceId][targetId];
    steps.push({
      stepNumber: stepCount++,
      codeLine: 7,
      explanation: `All-Pairs Shortest Paths computed! Shortest path from '${getLabel(sourceId)}' to '${getLabel(targetId)}' is: ${pathNodes.map(getLabel).join(' → ')} with total cost ${totalCost}.`,
      currentNode: targetId,
      currentEdge: null,
      visitedNodes: [...pathNodes],
      visitedEdges: [...pathEdges],
      frontierNodes: [],
      pathNodes,
      pathEdges,
      distances: { ...dist[sourceId] },
      predecessors: {},
      traversalOrder: [...nodeIds],
      dataStructure: {
        type: 'matrix',
        items: nodeIds.map((id) => ({ id, label: getLabel(id) })),
      },
      matrixState: {
        nodes: nodeIds,
        kNode: null,
        iNode: sourceId,
        jNode: targetId,
        distMatrix: cloneDist(),
        nextMatrix: cloneNext(),
      },
      status: 'found',
      totalCost,
      hopCount: pathNodes.length - 1,
    });
  } else {
    steps.push({
      stepNumber: stepCount++,
      codeLine: 8,
      explanation: `All-Pairs Shortest Paths computed! No directed path exists from '${getLabel(sourceId)}' to '${getLabel(targetId)}' (dist = ∞).`,
      currentNode: null,
      currentEdge: null,
      visitedNodes: [],
      visitedEdges: [],
      frontierNodes: [],
      pathNodes: [],
      pathEdges: [],
      distances: dist[sourceId] ? { ...dist[sourceId] } : {},
      predecessors: {},
      traversalOrder: [...nodeIds],
      dataStructure: {
        type: 'matrix',
        items: nodeIds.map((id) => ({ id, label: getLabel(id) })),
      },
      matrixState: {
        nodes: nodeIds,
        kNode: null,
        iNode: sourceId,
        jNode: targetId,
        distMatrix: cloneDist(),
        nextMatrix: cloneNext(),
      },
      status: 'unreachable',
    });
  }

  return steps;
}
