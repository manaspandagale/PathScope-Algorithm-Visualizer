import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';
import { buildAdjacencyList, reconstructPath } from '../utils/graphHelpers';

export function runDFS(
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
        dataStructure: { type: 'stack', items: [] },
        status: 'unreachable',
      },
    ];
  }

  // Trivial case: source === target
  if (sourceId === targetId) {
    steps.push({
      stepNumber: 1,
      codeLine: 7,
      explanation: `Source node '${getLabel(sourceId)}' is identical to destination. Path length is 0. (Note: DFS path is not guaranteed optimal).`,
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
        type: 'stack',
        items: [{ id: sourceId, label: getLabel(sourceId) }],
      },
      status: 'found',
      totalCost: 0,
      hopCount: 0,
    });
    return steps;
  }

  // Stack items store: { node, parent }
  const stack: { node: string; parent: string | null; edgeId?: string }[] = [
    { node: sourceId, parent: null },
  ];
  const visited = new Set<string>();
  const visitedEdges = new Set<string>();
  const predecessors: Record<string, string | null> = {};
  const traversalOrder: string[] = [];

  let stepCount = 1;

  // Step 1: Initial state
  steps.push({
    stepNumber: stepCount++,
    codeLine: 4,
    explanation: `Initialized DFS. Pushed source node '${getLabel(sourceId)}' onto the LIFO Stack.`,
    currentNode: sourceId,
    currentEdge: null,
    visitedNodes: [],
    visitedEdges: [],
    frontierNodes: [sourceId],
    pathNodes: [],
    pathEdges: [],
    distances: {},
    predecessors: {},
    traversalOrder: [],
    dataStructure: {
      type: 'stack',
      items: stack.map((s) => ({ id: s.node, label: getLabel(s.node) })),
    },
    status: 'running',
  });

  let foundTarget = false;

  while (stack.length > 0) {
    const top = stack.pop()!;
    const current = top.node;

    if (visited.has(current)) {
      // Step: Already visited, skipping from stack
      steps.push({
        stepNumber: stepCount++,
        codeLine: 8,
        explanation: `Popped '${getLabel(current)}' from stack, but it was already visited via an earlier path. Skipping.`,
        currentNode: current,
        currentEdge: null,
        visitedNodes: Array.from(visited),
        visitedEdges: Array.from(visitedEdges),
        frontierNodes: stack.map((s) => s.node),
        pathNodes: [],
        pathEdges: [],
        distances: {},
        predecessors: { ...predecessors },
        traversalOrder: [...traversalOrder],
        dataStructure: {
          type: 'stack',
          items: stack.map((s) => ({ id: s.node, label: getLabel(s.node) })),
        },
        status: 'running',
      });
      continue;
    }

    // Mark current as visited
    visited.add(current);
    traversalOrder.push(current);
    if (top.parent !== null) {
      predecessors[current] = top.parent;
    }
    if (top.edgeId) {
      visitedEdges.add(top.edgeId);
    }

    // Step: Visiting node
    steps.push({
      stepNumber: stepCount++,
      codeLine: 9,
      explanation: `Exploring node '${getLabel(current)}'. Added to visited set and recorded in traversal order.`,
      currentNode: current,
      currentEdge: top.parent ? { source: top.parent, target: current } : null,
      visitedNodes: Array.from(visited),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: stack.map((s) => s.node),
      pathNodes: [],
      pathEdges: [],
      distances: {},
      predecessors: { ...predecessors },
      traversalOrder: [...traversalOrder],
      dataStructure: {
        type: 'stack',
        items: stack.map((s) => ({ id: s.node, label: getLabel(s.node) })),
      },
      status: 'running',
    });

    if (current === targetId) {
      foundTarget = true;
      break;
    }

    const neighbors = adj[current] || [];
    const unvisitedNeighbors = neighbors.filter((n) => !visited.has(n.target));

    if (unvisitedNeighbors.length === 0) {
      // Step: Dead-end / Backtracking
      steps.push({
        stepNumber: stepCount++,
        codeLine: 10,
        explanation: `Node '${getLabel(current)}' has no unvisited neighbors. Backtracking to resume exploration from the next node on the stack.`,
        currentNode: current,
        currentEdge: null,
        visitedNodes: Array.from(visited),
        visitedEdges: Array.from(visitedEdges),
        frontierNodes: stack.map((s) => s.node),
        pathNodes: [],
        pathEdges: [],
        distances: {},
        predecessors: { ...predecessors },
        traversalOrder: [...traversalOrder],
        dataStructure: {
          type: 'stack',
          items: stack.map((s) => ({ id: s.node, label: getLabel(s.node) })),
        },
        status: 'running',
      });
    } else {
      // Push in reverse order so that first neighbor is processed first on stack
      for (let i = unvisitedNeighbors.length - 1; i >= 0; i--) {
        const neighbor = unvisitedNeighbors[i];
        stack.push({
          node: neighbor.target,
          parent: current,
          edgeId: neighbor.edgeId,
        });

        steps.push({
          stepNumber: stepCount++,
          codeLine: 13,
          explanation: `Discovered unvisited neighbor '${getLabel(neighbor.target)}' from '${getLabel(current)}'. Pushed onto LIFO Stack.`,
          currentNode: current,
          currentEdge: { source: current, target: neighbor.target },
          visitedNodes: Array.from(visited),
          visitedEdges: Array.from(visitedEdges),
          frontierNodes: stack.map((s) => s.node),
          pathNodes: [],
          pathEdges: [],
          distances: {},
          predecessors: { ...predecessors },
          traversalOrder: [...traversalOrder],
          dataStructure: {
            type: 'stack',
            items: stack.map((s) => ({ id: s.node, label: getLabel(s.node) })),
          },
          status: 'running',
        });
      }
    }
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
      explanation: `Destination '${getLabel(targetId)}' reached via DFS exploration! Path: ${pathNodes.map(getLabel).join(' → ')} (${hops} hops, total weight ${totalCost}). ⚠️ IMPORTANT: DFS does NOT guarantee the shortest path!`,
      currentNode: targetId,
      currentEdge: null,
      visitedNodes: Array.from(visited),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: [],
      pathNodes,
      pathEdges,
      distances: {},
      predecessors: { ...predecessors },
      traversalOrder: [...traversalOrder],
      dataStructure: {
        type: 'stack',
        items: stack.map((s) => ({ id: s.node, label: getLabel(s.node) })),
      },
      status: 'found',
      totalCost,
      hopCount: hops,
    });
  } else {
    steps.push({
      stepNumber: stepCount++,
      codeLine: 14,
      explanation: `Stack is now empty. Destination node '${getLabel(targetId)}' is unreachable from '${getLabel(sourceId)}'. The graph has disconnected components.`,
      currentNode: null,
      currentEdge: null,
      visitedNodes: Array.from(visited),
      visitedEdges: Array.from(visitedEdges),
      frontierNodes: [],
      pathNodes: [],
      pathEdges: [],
      distances: {},
      predecessors: { ...predecessors },
      traversalOrder: [...traversalOrder],
      dataStructure: { type: 'stack', items: [] },
      status: 'unreachable',
    });
  }

  return steps;
}
