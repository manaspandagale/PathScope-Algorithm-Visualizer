import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';
import { buildAdjacencyList, reconstructPath } from '../utils/graphHelpers';

export function runDAGShortestPath(
  nodes: Node<GraphNodeData>[],
  edges: Edge<GraphEdgeData>[],
  sourceId: string,
  targetId: string
): StepSnapshot[] {
  const steps: StepSnapshot[] = [];
  // DAG is strictly directed
  const adj = buildAdjacencyList(nodes, edges, true);

  const nodeMap = new Map(nodes.map((n) => [n.id, n.data.label || n.id]));
  const getLabel = (id: string) => nodeMap.get(id) || id;

  if (!nodes.some((n) => n.id === sourceId) || !nodes.some((n) => n.id === targetId)) {
    return [
      {
        stepNumber: 1,
        codeLine: 1,
        explanation: 'Source or destination vertex does not exist in the graph.',
        currentNode: null,
        currentEdge: null,
        visitedNodes: [],
        visitedEdges: [],
        frontierNodes: [],
        pathNodes: [],
        pathEdges: [],
        distances: {},
        predecessors: {},
        traversalOrder: [],
        dataStructure: { type: 'topologicalOrder', items: [] },
        status: 'unreachable',
      },
    ];
  }

  // Handle immediate trivial case: source === target
  if (sourceId === targetId) {
    steps.push({
      stepNumber: 1,
      codeLine: 4,
      explanation: `Source node '${getLabel(sourceId)}' is identical to destination. Path cost is 0.`,
      currentNode: sourceId,
      currentEdge: null,
      visitedNodes: [sourceId],
      visitedEdges: [],
      frontierNodes: [],
      pathNodes: [sourceId],
      pathEdges: [],
      distances: { [sourceId]: 0 },
      predecessors: { [sourceId]: null },
      traversalOrder: [sourceId],
      dataStructure: {
        type: 'topologicalOrder',
        items: [{ id: sourceId, label: getLabel(sourceId) }],
      },
      status: 'found',
      totalCost: 0,
      hopCount: 0,
    });
    return steps;
  }

  let stepCount = 1;

  // Step 1: Topological Sort via Kahn's Algorithm
  // Calculate in-degrees
  const inDegree: Record<string, number> = {};
  for (const n of nodes) {
    inDegree[n.id] = 0;
  }
  for (const u of Object.keys(adj)) {
    for (const edge of adj[u]) {
      if (inDegree[edge.target] !== undefined) {
        inDegree[edge.target]++;
      }
    }
  }

  const zeroInDegreeQueue: string[] = nodes
    .filter((n) => inDegree[n.id] === 0)
    .map((n) => n.id)
    .sort((a, b) => a.localeCompare(b));

  const topoOrder: string[] = [];

  steps.push({
    stepNumber: stepCount++,
    codeLine: 2,
    explanation: `Starting Topological Sort. Computed in-degrees for all vertices. Identified initial vertices with in-degree 0: [${zeroInDegreeQueue.map(getLabel).join(', ') || 'none'}].`,
    currentNode: null,
    currentEdge: null,
    visitedNodes: [],
    visitedEdges: [],
    frontierNodes: [...zeroInDegreeQueue],
    pathNodes: [],
    pathEdges: [],
    distances: {},
    predecessors: {},
    traversalOrder: [],
    dataStructure: {
      type: 'topologicalOrder',
      items: zeroInDegreeQueue.map((id) => ({ id, label: getLabel(id) })),
    },
    status: 'running',
  });

  const tempInDegree = { ...inDegree };
  const queue = [...zeroInDegreeQueue];

  while (queue.length > 0) {
    const u = queue.shift()!;
    topoOrder.push(u);

    for (const edge of adj[u] || []) {
      const v = edge.target;
      tempInDegree[v]--;
      if (tempInDegree[v] === 0) {
        queue.push(v);
        queue.sort((a, b) => a.localeCompare(b));
      }
    }
  }

  // Cycle check: If topoOrder.length !== nodes.length, graph has a directed cycle
  if (topoOrder.length !== nodes.length) {
    steps.push({
      stepNumber: stepCount++,
      codeLine: 3,
      explanation: `Directed cycle detected! Only ${topoOrder.length} of ${nodes.length} vertices could be topologically ordered. The DAG Shortest Path algorithm requires an acyclic graph.`,
      currentNode: null,
      currentEdge: null,
      visitedNodes: [...topoOrder],
      visitedEdges: [],
      frontierNodes: [],
      pathNodes: [],
      pathEdges: [],
      distances: {},
      predecessors: {},
      traversalOrder: [...topoOrder],
      dataStructure: {
        type: 'topologicalOrder',
        items: topoOrder.map((id) => ({ id, label: getLabel(id) })),
      },
      status: 'cycle-detected',
    });
    return steps;
  }

  steps.push({
    stepNumber: stepCount++,
    codeLine: 2,
    explanation: `Topological Sort complete! Valid linear ordering of vertices: [${topoOrder.map(getLabel).join(' → ')}]. Zero cycles detected.`,
    currentNode: null,
    currentEdge: null,
    visitedNodes: [...topoOrder],
    visitedEdges: [],
    frontierNodes: [],
    pathNodes: [],
    pathEdges: [],
    distances: {},
    predecessors: {},
    traversalOrder: [...topoOrder],
    dataStructure: {
      type: 'topologicalOrder',
      items: topoOrder.map((id) => ({ id, label: getLabel(id) })),
    },
    status: 'running',
  });

  // Step 2: Initialize distances
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  for (const n of nodes) {
    distances[n.id] = Infinity;
    predecessors[n.id] = null;
  }
  distances[sourceId] = 0;

  steps.push({
    stepNumber: stepCount++,
    codeLine: 4,
    explanation: `Initialized distances: dist['${getLabel(sourceId)}'] = 0, and all other vertices = ∞.`,
    currentNode: sourceId,
    currentEdge: null,
    visitedNodes: [sourceId],
    visitedEdges: [],
    frontierNodes: [sourceId],
    pathNodes: [],
    pathEdges: [],
    distances: { ...distances },
    predecessors: { ...predecessors },
    traversalOrder: [...topoOrder],
    dataStructure: {
      type: 'topologicalOrder',
      items: topoOrder.map((id) => ({ id, label: getLabel(id) })),
    },
    status: 'running',
  });

  // Step 3: Relax vertices in topological order
  const visitedNodes = new Set<string>();
  const visitedEdges = new Set<string>();

  for (const u of topoOrder) {
    visitedNodes.add(u);

    // If u has dist Infinity, it's not reachable from source yet
    if (distances[u] === Infinity) {
      steps.push({
        stepNumber: stepCount++,
        codeLine: 5,
        explanation: `Processing vertex '${getLabel(u)}' in topological order. dist['${getLabel(u)}'] = ∞ (unreachable from source so far). Skipping outgoing edge relaxations.`,
        currentNode: u,
        currentEdge: null,
        visitedNodes: Array.from(visitedNodes),
        visitedEdges: Array.from(visitedEdges),
        frontierNodes: [u],
        pathNodes: [],
        pathEdges: [],
        distances: { ...distances },
        predecessors: { ...predecessors },
        traversalOrder: [...topoOrder],
        dataStructure: {
          type: 'topologicalOrder',
          items: topoOrder.map((id) => ({ id, label: getLabel(id) })),
        },
        status: 'running',
      });
      continue;
    }

    steps.push({
      stepNumber: stepCount++,
      codeLine: 6,
      explanation: `Processing vertex '${getLabel(u)}' with current shortest distance ${distances[u]}. Relaxing outgoing directed edges.`,
      currentNode: u,
      currentEdge: null,
      visitedNodes: Array.from(visitedNodes),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: [u],
      pathNodes: [],
      pathEdges: [],
      distances: { ...distances },
      predecessors: { ...predecessors },
      traversalOrder: [...topoOrder],
      dataStructure: {
        type: 'topologicalOrder',
        items: topoOrder.map((id) => ({ id, label: getLabel(id) })),
      },
      status: 'running',
    });

    for (const edge of adj[u] || []) {
      const v = edge.target;
      const weight = edge.weight;
      const edgeId = edge.edgeId;

      const newDist = distances[u] + weight;
      const oldDist = distances[v];

      if (newDist < oldDist) {
        distances[v] = newDist;
        predecessors[v] = u;
        visitedEdges.add(edgeId);

        const oldDistStr = oldDist === Infinity ? '∞' : oldDist;
        steps.push({
          stepNumber: stepCount++,
          codeLine: 8,
          explanation: `Relaxed edge ('${getLabel(u)}' → '${getLabel(v)}') with weight ${weight}: updated dist['${getLabel(v)}'] from ${oldDistStr} down to ${newDist} (via '${getLabel(u)}').`,
          currentNode: u,
          currentEdge: { source: u, target: v },
          visitedNodes: Array.from(visitedNodes),
          visitedEdges: Array.from(visitedEdges),
          frontierNodes: [v],
          pathNodes: [],
          pathEdges: [],
          distances: { ...distances },
          predecessors: { ...predecessors },
          traversalOrder: [...topoOrder],
          dataStructure: {
            type: 'topologicalOrder',
            items: topoOrder.map((id) => ({ id, label: getLabel(id) })),
          },
          status: 'running',
        });
      } else {
        const oldDistStr = oldDist === Infinity ? '∞' : oldDist;
        steps.push({
          stepNumber: stepCount++,
          codeLine: 7,
          explanation: `Checked edge ('${getLabel(u)}' → '${getLabel(v)}') with weight ${weight}: new cost (${distances[u]} + ${weight} = ${newDist}) is not less than current dist['${getLabel(v)}'] (${oldDistStr}). No relaxation.`,
          currentNode: u,
          currentEdge: { source: u, target: v },
          visitedNodes: Array.from(visitedNodes),
          visitedEdges: Array.from(visitedEdges),
          frontierNodes: [v],
          pathNodes: [],
          pathEdges: [],
          distances: { ...distances },
          predecessors: { ...predecessors },
          traversalOrder: [...topoOrder],
          dataStructure: {
            type: 'topologicalOrder',
            items: topoOrder.map((id) => ({ id, label: getLabel(id) })),
          },
          status: 'running',
        });
      }
    }
  }

  // Final path check
  if (distances[targetId] < Infinity) {
    const { pathNodes, pathEdges, totalCost } = reconstructPath(
      predecessors,
      sourceId,
      targetId,
      edges,
      true
    );
    const hops = pathNodes.length - 1;

    steps.push({
      stepNumber: stepCount++,
      codeLine: 9,
      explanation: `Optimal DAG Shortest Path found! Total cost: ${totalCost} across ${hops} directed hop(s): ${pathNodes.map(getLabel).join(' → ')}. DAG Shortest Path runs in linear O(V + E) time.`,
      currentNode: targetId,
      currentEdge: null,
      visitedNodes: Array.from(visitedNodes),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: [],
      pathNodes,
      pathEdges,
      distances: { ...distances },
      predecessors: { ...predecessors },
      traversalOrder: [...topoOrder],
      dataStructure: {
        type: 'topologicalOrder',
        items: topoOrder.map((id) => ({ id, label: getLabel(id) })),
      },
      status: 'found',
      totalCost,
      hopCount: hops,
    });
  } else {
    steps.push({
      stepNumber: stepCount++,
      codeLine: 10,
      explanation: `Topological relaxation finished. Destination vertex '${getLabel(targetId)}' remains at distance ∞ and is unreachable from '${getLabel(sourceId)}' in this directed graph.`,
      currentNode: null,
      currentEdge: null,
      visitedNodes: Array.from(visitedNodes),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: [],
      pathNodes: [],
      pathEdges: [],
      distances: { ...distances },
      predecessors: { ...predecessors },
      traversalOrder: [...topoOrder],
      dataStructure: {
        type: 'topologicalOrder',
        items: topoOrder.map((id) => ({ id, label: getLabel(id) })),
      },
      status: 'unreachable',
    });
  }

  return steps;
}
