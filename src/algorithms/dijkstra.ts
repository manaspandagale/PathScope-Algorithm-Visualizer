import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';
import { MinPriorityQueue } from '../utils/priorityQueue';
import { buildAdjacencyList, reconstructPath } from '../utils/graphHelpers';

export function runDijkstra(
  nodes: Node<GraphNodeData>[],
  edges: Edge<GraphEdgeData>[],
  sourceId: string,
  targetId: string,
  isDirected: boolean = false
): StepSnapshot[] {
  const steps: StepSnapshot[] = [];
  const adj = buildAdjacencyList(nodes, edges, isDirected);

  const nodeMap = new Map(nodes.map((n) => [n.id, n.data.label || n.id]));
  const getLabel = (id: string) => nodeMap.get(id) || id;

  if (!nodes.some((n) => n.id === sourceId) || !nodes.some((n) => n.id === targetId)) {
    return [
      {
        stepNumber: 1,
        codeLine: 1,
        explanation: 'Source or destination node does not exist in the graph.',
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
        dataStructure: { type: 'priorityQueue', items: [] },
        status: 'unreachable',
      },
    ];
  }

  // Trivial case: source is target
  if (sourceId === targetId) {
    steps.push({
      stepNumber: 1,
      codeLine: 6,
      explanation: `Source node '${getLabel(sourceId)}' is identical to destination. Shortest path cost is 0.`,
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
        type: 'priorityQueue',
        items: [{ id: sourceId, label: getLabel(sourceId), priority: 0 }],
      },
      status: 'found',
      totalCost: 0,
      hopCount: 0,
    });
    return steps;
  }

  // Initialize distances
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string | null> = {};
  for (const node of nodes) {
    distances[node.id] = Infinity;
    predecessors[node.id] = null;
  }
  distances[sourceId] = 0;

  const pq = new MinPriorityQueue<string>();
  pq.push(sourceId, 0);

  const visited = new Set<string>();
  const visitedEdges = new Set<string>();
  const traversalOrder: string[] = [];

  let stepCount = 1;

  const getPqItems = () =>
    pq.toArray().map((item) => ({
      id: item.element,
      label: getLabel(item.element),
      priority: item.priority,
    }));

  // Step 1: Initial state
  steps.push({
    stepNumber: stepCount++,
    codeLine: 2,
    explanation: `Initialized Dijkstra. Set dist['${getLabel(sourceId)}'] = 0 and all other vertices to ∞. Inserted ('${getLabel(sourceId)}', 0) into Min-Priority Queue.`,
    currentNode: sourceId,
    currentEdge: null,
    visitedNodes: [],
    visitedEdges: [],
    frontierNodes: [sourceId],
    pathNodes: [],
    pathEdges: [],
    distances: { ...distances },
    predecessors: { ...predecessors },
    traversalOrder: [],
    dataStructure: {
      type: 'priorityQueue',
      items: getPqItems(),
    },
    status: 'running',
  });

  let foundTarget = false;

  while (!pq.isEmpty()) {
    const minItem = pq.pop()!;
    const current = minItem.element;
    const currentDist = minItem.priority;

    // Check for stale priority queue entry
    if (currentDist > distances[current]) {
      steps.push({
        stepNumber: stepCount++,
        codeLine: 7,
        explanation: `Popped stale entry for '${getLabel(current)}' with distance ${currentDist} (already improved to ${distances[current]}). Skipping.`,
        currentNode: current,
        currentEdge: null,
        visitedNodes: Array.from(visited),
        visitedEdges: Array.from(visitedEdges),
        frontierNodes: pq.toArray().map((i) => i.element),
        pathNodes: [],
        pathEdges: [],
        distances: { ...distances },
        predecessors: { ...predecessors },
        traversalOrder: [...traversalOrder],
        dataStructure: {
          type: 'priorityQueue',
          items: getPqItems(),
        },
        status: 'running',
      });
      continue;
    }

    if (!visited.has(current)) {
      visited.add(current);
      traversalOrder.push(current);
    }

    // Step: Extracted minimum vertex
    steps.push({
      stepNumber: stepCount++,
      codeLine: 5,
      explanation: `Extracted vertex '${getLabel(current)}' with lowest tentative distance (${currentDist}) from Min-Heap. Vertex is now finalized.`,
      currentNode: current,
      currentEdge: null,
      visitedNodes: Array.from(visited),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: pq.toArray().map((i) => i.element),
      pathNodes: [],
      pathEdges: [],
      distances: { ...distances },
      predecessors: { ...predecessors },
      traversalOrder: [...traversalOrder],
      dataStructure: {
        type: 'priorityQueue',
        items: getPqItems(),
      },
      status: 'running',
    });

    if (current === targetId) {
      foundTarget = true;
      break;
    }

    // Relax all outgoing edges
    const neighbors = adj[current] || [];

    for (const neighbor of neighbors) {
      const neighborId = neighbor.target;
      const weight = neighbor.weight;
      const edgeId = neighbor.edgeId;

      const newDist = distances[current] + weight;
      const oldDist = distances[neighborId];

      if (newDist < oldDist) {
        distances[neighborId] = newDist;
        predecessors[neighborId] = current;
        visitedEdges.add(edgeId);
        pq.push(neighborId, newDist);

        const oldDistStr = oldDist === Infinity ? '∞' : oldDist;
        steps.push({
          stepNumber: stepCount++,
          codeLine: 11,
          explanation: `Relaxed edge ('${getLabel(current)}', '${getLabel(neighborId)}') with weight ${weight}: updated dist['${getLabel(neighborId)}'] from ${oldDistStr} down to ${newDist} (via '${getLabel(current)}'). Inserted into Min-Heap.`,
          currentNode: current,
          currentEdge: { source: current, target: neighborId },
          visitedNodes: Array.from(visited),
          visitedEdges: Array.from(visitedEdges),
          frontierNodes: pq.toArray().map((i) => i.element),
          pathNodes: [],
          pathEdges: [],
          distances: { ...distances },
          predecessors: { ...predecessors },
          traversalOrder: [...traversalOrder],
          dataStructure: {
            type: 'priorityQueue',
            items: getPqItems(),
          },
          status: 'running',
        });
      } else {
        const currentDistStr = oldDist === Infinity ? '∞' : oldDist;
        steps.push({
          stepNumber: stepCount++,
          codeLine: 10,
          explanation: `Inspected edge ('${getLabel(current)}', '${getLabel(neighborId)}') with weight ${weight}: new path cost (${distances[current]} + ${weight} = ${newDist}) is not less than current dist['${getLabel(neighborId)}'] (${currentDistStr}). No relaxation.`,
          currentNode: current,
          currentEdge: { source: current, target: neighborId },
          visitedNodes: Array.from(visited),
          visitedEdges: Array.from(visitedEdges),
          frontierNodes: pq.toArray().map((i) => i.element),
          pathNodes: [],
          pathEdges: [],
          distances: { ...distances },
          predecessors: { ...predecessors },
          traversalOrder: [...traversalOrder],
          dataStructure: {
            type: 'priorityQueue',
            items: getPqItems(),
          },
          status: 'running',
        });
      }
    }
  }

  if (foundTarget || distances[targetId] < Infinity) {
    const { pathNodes, pathEdges, totalCost } = reconstructPath(
      predecessors,
      sourceId,
      targetId,
      edges,
      isDirected
    );
    const hops = pathNodes.length - 1;

    steps.push({
      stepNumber: stepCount++,
      codeLine: 6,
      explanation: `Optimal shortest path found! Total weight cost: ${totalCost} (hops: ${hops}). Path: ${pathNodes.map(getLabel).join(' → ')}. Dijkstra guarantees this is the minimum possible total weight.`,
      currentNode: targetId,
      currentEdge: null,
      visitedNodes: Array.from(visited),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: [],
      pathNodes,
      pathEdges,
      distances: { ...distances },
      predecessors: { ...predecessors },
      traversalOrder: [...traversalOrder],
      dataStructure: {
        type: 'priorityQueue',
        items: getPqItems(),
      },
      status: 'found',
      totalCost,
      hopCount: hops,
    });
  } else {
    steps.push({
      stepNumber: stepCount++,
      codeLine: 13,
      explanation: `Priority Queue is empty. Destination node '${getLabel(targetId)}' remains at distance ∞ and is unreachable from '${getLabel(sourceId)}'. The graph has disconnected components.`,
      currentNode: null,
      currentEdge: null,
      visitedNodes: Array.from(visited),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: [],
      pathNodes: [],
      pathEdges: [],
      distances: { ...distances },
      predecessors: { ...predecessors },
      traversalOrder: [...traversalOrder],
      dataStructure: { type: 'priorityQueue', items: [] },
      status: 'unreachable',
    });
  }

  return steps;
}
