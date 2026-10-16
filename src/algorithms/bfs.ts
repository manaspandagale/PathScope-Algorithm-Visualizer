import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';
import { buildAdjacencyList, reconstructPath } from '../utils/graphHelpers';

export function runBFS(
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
        dataStructure: { type: 'queue', items: [] },
        status: 'unreachable',
      },
    ];
  }

  // Handle immediate trivial case: source is target
  if (sourceId === targetId) {
    steps.push({
      stepNumber: 1,
      codeLine: 7,
      explanation: `Source node '${getLabel(sourceId)}' is identical to destination. Path length is 0.`,
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
        type: 'queue',
        items: [{ id: sourceId, label: getLabel(sourceId) }],
      },
      status: 'found',
      totalCost: 0,
      hopCount: 0,
    });
    return steps;
  }

  const queue: string[] = [sourceId];
  const visited = new Set<string>([sourceId]);
  const visitedEdges = new Set<string>();
  const predecessors: Record<string, string | null> = { [sourceId]: null };
  const traversalOrder: string[] = [];
  const distances: Record<string, number> = { [sourceId]: 0 };

  let stepCount = 1;

  // Step 1: Initial state
  steps.push({
    stepNumber: stepCount++,
    codeLine: 4,
    explanation: `Initialized BFS. Enqueued source node '${getLabel(sourceId)}' into the FIFO queue. Set parent to null.`,
    currentNode: sourceId,
    currentEdge: null,
    visitedNodes: Array.from(visited),
    visitedEdges: [],
    frontierNodes: [...queue],
    pathNodes: [],
    pathEdges: [],
    distances: { ...distances },
    predecessors: { ...predecessors },
    traversalOrder: [],
    dataStructure: {
      type: 'queue',
      items: queue.map((id) => ({ id, label: getLabel(id) })),
    },
    status: 'running',
  });

  let foundTarget = false;

  while (queue.length > 0) {
    const current = queue.shift()!;
    traversalOrder.push(current);

    // Step: Node dequeued
    steps.push({
      stepNumber: stepCount++,
      codeLine: 6,
      explanation: `Dequeued node '${getLabel(current)}' from the front of the queue to inspect its neighbors.`,
      currentNode: current,
      currentEdge: null,
      visitedNodes: Array.from(visited),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: [...queue],
      pathNodes: [],
      pathEdges: [],
      distances: { ...distances },
      predecessors: { ...predecessors },
      traversalOrder: [...traversalOrder],
      dataStructure: {
        type: 'queue',
        items: queue.map((id) => ({ id, label: getLabel(id) })),
      },
      status: 'running',
    });

    if (current === targetId) {
      foundTarget = true;
      break;
    }

    const neighbors = adj[current] || [];

    for (const neighbor of neighbors) {
      const neighborId = neighbor.target;
      const edgeId = neighbor.edgeId;

      if (!visited.has(neighborId)) {
        visited.add(neighborId);
        visitedEdges.add(edgeId);
        predecessors[neighborId] = current;
        distances[neighborId] = (distances[current] ?? 0) + 1;
        queue.push(neighborId);

        steps.push({
          stepNumber: stepCount++,
          codeLine: 12,
          explanation: `Discovered unvisited neighbor '${getLabel(neighborId)}' via node '${getLabel(current)}'. Set predecessor to '${getLabel(current)}' and enqueued into FIFO Queue.`,
          currentNode: current,
          currentEdge: { source: current, target: neighborId },
          visitedNodes: Array.from(visited),
          visitedEdges: Array.from(visitedEdges),
          frontierNodes: [...queue],
          pathNodes: [],
          pathEdges: [],
          distances: { ...distances },
          predecessors: { ...predecessors },
          traversalOrder: [...traversalOrder],
          dataStructure: {
            type: 'queue',
            items: queue.map((id) => ({ id, label: getLabel(id) })),
          },
          status: 'running',
        });

        // Check if we just discovered the target
        if (neighborId === targetId) {
          foundTarget = true;
          break;
        }
      } else {
        // Step: Already visited neighbor
        steps.push({
          stepNumber: stepCount++,
          codeLine: 9,
          explanation: `Neighbor '${getLabel(neighborId)}' has already been visited or is in the queue. Skipping edge.`,
          currentNode: current,
          currentEdge: { source: current, target: neighborId },
          visitedNodes: Array.from(visited),
          visitedEdges: Array.from(visitedEdges),
          frontierNodes: [...queue],
          pathNodes: [],
          pathEdges: [],
          distances: { ...distances },
          predecessors: { ...predecessors },
          traversalOrder: [...traversalOrder],
          dataStructure: {
            type: 'queue',
            items: queue.map((id) => ({ id, label: getLabel(id) })),
          },
          status: 'running',
        });
      }
    }

    if (foundTarget) break;
  }

  if (foundTarget) {
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
      codeLine: 7,
      explanation: `Target '${getLabel(targetId)}' reached! BFS guaranteed shortest path by hop count: ${hops} hop(s) (${pathNodes.map(getLabel).join(' → ')}). Displayed edge weight sum: ${totalCost}.`,
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
        type: 'queue',
        items: queue.map((id) => ({ id, label: getLabel(id) })),
      },
      status: 'found',
      totalCost,
      hopCount: hops,
    });
  } else {
    steps.push({
      stepNumber: stepCount++,
      codeLine: 13,
      explanation: `Queue is now empty. Destination node '${getLabel(targetId)}' cannot be reached from '${getLabel(sourceId)}'. The graph has disconnected components.`,
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
      dataStructure: { type: 'queue', items: [] },
      status: 'unreachable',
    });
  }

  return steps;
}
