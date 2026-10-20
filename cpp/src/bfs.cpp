#include "bfs.hpp"
#include <queue>
#include <unordered_set>
#include <map>
#include <algorithm>
#include <cmath>
#include <limits>

namespace pathscope {

static std::vector<DataStructureItem> extractQueueItems(
    std::queue<std::string> copyQ,
    const std::map<std::string, std::string>& labelMap,
    const std::map<std::string, double>& distances
) {
    std::vector<DataStructureItem> items;
    while (!copyQ.empty()) {
        std::string id = copyQ.front();
        copyQ.pop();
        auto it = labelMap.find(id);
        std::string lbl = (it != labelMap.end()) ? it->second : id;
        double d = distances.count(id) ? distances.at(id) : 0.0;
        std::string extra = std::isinf(d) ? "∞" : ("Level " + std::to_string(static_cast<int>(d)));
        items.push_back({id, lbl, d, extra, false});
    }
    return items;
}

std::vector<StepSnapshot> execute_bfs(
    const Graph& graph,
    const std::string& sourceId,
    const std::string& targetId
) {
    std::vector<StepSnapshot> snapshots;

    auto makeInvalidSnapshot = [&](const std::string& errorMsg) {
        StepSnapshot snap;
        snap.stepNumber = 1;
        snap.codeLine = 1;
        snap.operation = "invalid";
        snap.status = "invalid";
        snap.explanation = errorMsg;
        snapshots.push_back(snap);
        return snapshots;
    };

    // 1. Empty graph validation
    if (graph.nodes.empty()) {
        return makeInvalidSnapshot("Graph contains no vertices. An empty graph cannot be visualized.");
    }

    // 2. Missing source/target specification
    if (sourceId.empty() || targetId.empty()) {
        return makeInvalidSnapshot("Source or target vertex ID was not specified.");
    }

    // 3. Duplicate node IDs validation
    std::unordered_set<std::string> nodeIds;
    for (const auto& node : graph.nodes) {
        if (nodeIds.count(node.id)) {
            return makeInvalidSnapshot("Duplicate vertex ID '" + node.id + "' detected in graph.");
        }
        nodeIds.insert(node.id);
    }

    // 4. Source and target existence
    if (nodeIds.find(sourceId) == nodeIds.end() || nodeIds.find(targetId) == nodeIds.end()) {
        return makeInvalidSnapshot("Source or destination vertex does not exist in the graph.");
    }

    // 5. Edge validation: invalid endpoints, self-loops, duplicate edges, non-finite weights
    std::map<std::pair<std::string, std::string>, int> edgePairs;
    for (const auto& edge : graph.edges) {
        if (nodeIds.find(edge.source) == nodeIds.end() || nodeIds.find(edge.target) == nodeIds.end()) {
            return makeInvalidSnapshot("Edge '" + edge.id + "' references non-existent vertex endpoint.");
        }
        if (edge.source == edge.target) {
            return makeInvalidSnapshot("Self-loop detected on vertex '" + edge.source + "'. Self-loops are not permitted.");
        }
        if (std::isnan(edge.weight) || std::isinf(edge.weight)) {
            return makeInvalidSnapshot("Edge '" + edge.id + "' has non-finite weight.");
        }

        std::string u = edge.source;
        std::string v = edge.target;
        if (!graph.isDirected && u > v) {
            std::swap(u, v);
        }
        auto pairKey = std::make_pair(u, v);
        if (edgePairs[pairKey] > 0) {
            return makeInvalidSnapshot("Duplicate edge between '" + edge.source + "' and '" + edge.target + "' detected. Parallel edges are not permitted.");
        }
        edgePairs[pairKey]++;
    }

    auto labelMap = graph.getNodeLabelMap();
    auto adj = graph.buildAdjacencyList();
    std::string sourceLabel = labelMap[sourceId];
    std::string targetLabel = labelMap[targetId];

    // Canonical FIFO queue required by milestone specification
    std::queue<std::string> q;

    std::unordered_set<std::string> visitedSet;
    std::vector<std::string> visitedOrder;
    std::vector<std::string> visitedEdges;
    std::map<std::string, double> distances;
    std::map<std::string, std::string> predecessors;
    std::map<std::string, std::string> predecessorEdgeIds;
    std::vector<std::string> traversalOrder;

    constexpr double INF = std::numeric_limits<double>::infinity();
    for (const auto& node : graph.nodes) {
        distances[node.id] = INF;
        predecessors[node.id] = "";
        predecessorEdgeIds[node.id] = "";
    }

    int stepCount = 0;

    auto recordSnapshot = [&](
        int codeLine,
        const std::string& operation,
        const std::string& explanation,
        const std::string& current,
        const std::string& activeVertex,
        bool hasEdge,
        const EdgeRef& edgeRef,
        const std::string& inspectedEdgeId,
        const std::string& status,
        std::optional<double> prevDist,
        std::optional<double> candDist,
        std::optional<double> updDist,
        std::optional<double> edgeWeight,
        bool distUpdated,
        const std::vector<DataStructureItem>& qBefore,
        const std::vector<DataStructureItem>& qAfter,
        std::optional<int> bfsLevel,
        const std::vector<std::string>& pathNodes = {},
        const std::vector<std::string>& pathEdges = {},
        double cost = 0.0,
        int hops = 0
    ) {
        StepSnapshot s;
        s.stepNumber = ++stepCount;
        s.codeLine = codeLine;
        s.operation = operation;
        s.explanation = explanation;
        s.currentNode = current;
        s.activeVertex = activeVertex;
        s.inspectedEdgeId = inspectedEdgeId;
        s.hasCurrentEdge = hasEdge;
        s.currentEdge = edgeRef;

        s.visitedNodes = visitedOrder;
        s.visitedEdges = visitedEdges;

        // Frontier nodes are the current elements in the FIFO queue
        std::vector<std::string> frontier;
        std::queue<std::string> tempQ = q;
        while (!tempQ.empty()) {
            frontier.push_back(tempQ.front());
            tempQ.pop();
        }
        s.frontierNodes = frontier;
        s.settledNodes = visitedOrder;

        s.pathNodes = pathNodes;
        s.pathEdges = pathEdges;

        s.distances = distances;
        s.predecessors = predecessors;
        s.predecessorEdgeIds = predecessorEdgeIds;
        s.traversalOrder = traversalOrder;

        s.previousDistance = prevDist;
        s.candidateDistance = candDist;
        s.updatedDistance = updDist;
        s.edgeWeight = edgeWeight;
        s.distanceUpdated = distUpdated;

        s.dataStructureType = "queue";
        s.dataStructureItems = extractQueueItems(q, labelMap, distances);
        s.queueOrHeapBefore = qBefore;
        s.queueOrHeapAfter = qAfter;
        s.bfsLevel = bfsLevel;

        s.status = status;
        s.totalCost = cost;
        s.hopCount = hops;

        snapshots.push_back(s);
    };

    // Step 1: Initialization
    auto qBeforeInit = extractQueueItems(q, labelMap, distances);
    q.push(sourceId);
    visitedSet.insert(sourceId);
    visitedOrder.push_back(sourceId);
    distances[sourceId] = 0.0;
    auto qAfterInit = extractQueueItems(q, labelMap, distances);

    recordSnapshot(
        4,
        "initialize",
        "Initialize BFS: Enqueue source vertex '" + sourceLabel + "' (Level 0) into FIFO queue. Numeric edge weights are ignored.",
        sourceId,
        sourceId,
        false,
        {"", ""},
        "",
        "running",
        std::nullopt,
        0.0,
        0.0,
        std::nullopt,
        true,
        qBeforeInit,
        qAfterInit,
        0
    );

    // Trivial Case: Source == Destination
    if (sourceId == targetId) {
        recordSnapshot(
            7,
            "complete",
            "Source '" + sourceLabel + "' is the destination! Shortest path requires 0 hops.",
            sourceId,
            sourceId,
            false,
            {"", ""},
            "",
            "found",
            0.0,
            0.0,
            0.0,
            std::nullopt,
            false,
            qAfterInit,
            qAfterInit,
            0,
            {sourceId},
            {},
            0.0,
            0
        );
        return snapshots;
    }

    bool found = false;

    // BFS Queue Loop
    while (!q.empty()) {
        auto qBeforeDequeue = extractQueueItems(q, labelMap, distances);
        std::string current = q.front();
        q.pop();
        auto qAfterDequeue = extractQueueItems(q, labelMap, distances);

        traversalOrder.push_back(current);
        std::string currentLbl = labelMap[current];
        int currentLevel = static_cast<int>(distances[current]);

        recordSnapshot(
            6,
            "dequeue",
            "Dequeue vertex '" + currentLbl + "' (Level " + std::to_string(currentLevel) +
                ") from front of FIFO queue to inspect its outgoing edges.",
            current,
            current,
            false,
            {"", ""},
            "",
            "running",
            std::nullopt,
            std::nullopt,
            std::nullopt,
            std::nullopt,
            false,
            qBeforeDequeue,
            qAfterDequeue,
            currentLevel
        );

        if (current == targetId) {
            found = true;
            break;
        }

        const auto& neighbors = adj[current];
        for (const auto& edge : neighbors) {
            std::string nbr = edge.target;
            std::string nbrLbl = labelMap[nbr];
            std::string edgeId = edge.edgeId;

            auto currentQ = extractQueueItems(q, labelMap, distances);

            // Educational Step A: Inspect neighbor
            recordSnapshot(
                8,
                "inspect-edge",
                "Inspect neighbor '" + nbrLbl + "' via edge (" + currentLbl + " ↔ " + nbrLbl +
                    "). Check if vertex '" + nbrLbl + "' has been visited yet.",
                current,
                nbr,
                true,
                {current, nbr},
                edgeId,
                "running",
                distances[nbr],
                distances[current] + 1.0,
                distances[nbr],
                edge.weight,
                false,
                currentQ,
                currentQ,
                currentLevel
            );

            bool isNew = (visitedSet.find(nbr) == visitedSet.end());

            if (isNew) {
                visitedSet.insert(nbr);
                visitedOrder.push_back(nbr);
                visitedEdges.push_back(edgeId);
                predecessors[nbr] = current;
                predecessorEdgeIds[nbr] = edgeId;
                double oldDist = distances[nbr];
                double newDist = distances[current] + 1.0;
                distances[nbr] = newDist;

                auto qBeforeEnqueue = extractQueueItems(q, labelMap, distances);
                q.push(nbr);
                auto qAfterEnqueue = extractQueueItems(q, labelMap, distances);

                int nbrLevel = static_cast<int>(newDist);

                recordSnapshot(
                    12,
                    "enqueue",
                    "Vertex '" + nbrLbl + "' is unvisited! Assign hop distance = " + std::to_string(nbrLevel) +
                        " (Level " + std::to_string(nbrLevel) + "), mark visited, and enqueue into FIFO queue rear.",
                    nbr,
                    nbr,
                    true,
                    {current, nbr},
                    edgeId,
                    "running",
                    oldDist,
                    newDist,
                    newDist,
                    edge.weight,
                    true,
                    qBeforeEnqueue,
                    qAfterEnqueue,
                    nbrLevel
                );

                if (nbr == targetId) {
                    found = true;
                    break;
                }
            } else {
                recordSnapshot(
                    9,
                    "skip-edge",
                    "Vertex '" + nbrLbl + "' has already been visited (Level " +
                        std::to_string(static_cast<int>(distances[nbr])) + "). Skip redundant edge.",
                    current,
                    nbr,
                    true,
                    {current, nbr},
                    edgeId,
                    "running",
                    distances[nbr],
                    distances[current] + 1.0,
                    distances[nbr],
                    edge.weight,
                    false,
                    currentQ,
                    currentQ,
                    currentLevel
                );
            }
        }

        if (found) {
            break;
        }
    }

    if (found) {
        // Reconstruct path backward using predecessorEdgeIds
        std::vector<std::string> pathNodes;
        std::vector<std::string> pathEdges;
        std::string curr = targetId;

        std::vector<std::pair<std::string, std::string>> traceSteps;
        while (!curr.empty()) {
            pathNodes.push_back(curr);
            if (curr == sourceId) break;
            std::string edgeId = predecessorEdgeIds[curr];
            if (!edgeId.empty()) {
                pathEdges.push_back(edgeId);
            }
            std::string pred = predecessors[curr];
            traceSteps.push_back({curr, pred});
            curr = pred;
        }

        std::reverse(pathNodes.begin(), pathNodes.end());
        std::reverse(pathEdges.begin(), pathEdges.end());

        // Emit traceback educational snapshots
        std::vector<std::string> animNodes;
        std::vector<std::string> animEdges;
        for (const auto& step : traceSteps) {
            std::string nodeU = step.first;
            std::string nodeV = step.second;
            std::string edgeId = predecessorEdgeIds[nodeU];
            animNodes.push_back(nodeU);
            if (!edgeId.empty()) animEdges.push_back(edgeId);
            if (nodeV == sourceId) animNodes.push_back(sourceId);

            auto currentQ = extractQueueItems(q, labelMap, distances);
            recordSnapshot(
                7,
                "reconstruct-path",
                "Path reconstruction traceback: Destination reached from predecessor '" + labelMap[nodeV] +
                    "' to '" + labelMap[nodeU] + "' via edge (" + labelMap[nodeV] + " ↔ " + labelMap[nodeU] + ").",
                nodeU,
                nodeV,
                true,
                {nodeV, nodeU},
                edgeId,
                "running",
                distances[nodeU],
                distances[nodeU],
                distances[nodeU],
                std::nullopt,
                false,
                currentQ,
                currentQ,
                static_cast<int>(distances[nodeU]),
                animNodes,
                animEdges,
                0.0,
                static_cast<int>(animNodes.size()) - 1
            );
        }

        int hops = static_cast<int>(pathNodes.size()) - 1;
        double numericCost = 0.0;
        for (const auto& eId : pathEdges) {
            for (const auto& edge : graph.edges) {
                if (edge.id == eId) {
                    numericCost += edge.weight;
                    break;
                }
            }
        }

        auto currentQ = extractQueueItems(q, labelMap, distances);
        recordSnapshot(
            7,
            "complete",
            "Target vertex '" + targetLabel + "' reached! Minimum-hop shortest path: " +
                std::to_string(hops) + " hops (numeric edge weight sum: " +
                (numericCost == static_cast<int>(numericCost) ? std::to_string(static_cast<int>(numericCost)) : std::to_string(numericCost)) + ").",
            targetId,
            targetId,
            false,
            {"", ""},
            "",
            "found",
            std::nullopt,
            distances[targetId],
            distances[targetId],
            std::nullopt,
            false,
            currentQ,
            currentQ,
            static_cast<int>(distances[targetId]),
            pathNodes,
            pathEdges,
            numericCost,
            hops
        );
    } else {
        auto currentQ = extractQueueItems(q, labelMap, distances);
        recordSnapshot(
            13,
            "unreachable",
            "Queue is empty. Target vertex '" + targetLabel + "' cannot be reached from source '" + sourceLabel + "'.",
            targetId,
            targetId,
            false,
            {"", ""},
            "",
            "unreachable",
            std::nullopt,
            std::nullopt,
            std::nullopt,
            std::nullopt,
            false,
            currentQ,
            currentQ,
            std::nullopt
        );
    }

    return snapshots;
}

} // namespace pathscope
