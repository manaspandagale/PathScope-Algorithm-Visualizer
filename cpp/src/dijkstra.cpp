#include "dijkstra.hpp"
#include <queue>
#include <map>
#include <unordered_set>
#include <algorithm>
#include <limits>
#include <sstream>
#include <iomanip>
#include <cmath>

namespace pathscope {

struct HeapEntry {
    std::string nodeId;
    double dist;
    int pushOrder = 0;

    // Strict min-heap ordering with deterministic tie-breaking
    bool operator>(const HeapEntry& other) const {
        if (dist != other.dist) {
            return dist > other.dist;
        }
        if (nodeId != other.nodeId) {
            return nodeId > other.nodeId;
        }
        return pushOrder > other.pushOrder;
    }
};

static std::string formatDist(double d) {
    if (std::isinf(d) || d >= 1e18) return "∞";
    std::ostringstream ss;
    if (d == static_cast<long long>(d)) {
        ss << static_cast<long long>(d);
    } else {
        ss << std::fixed << std::setprecision(1) << d;
    }
    return ss.str();
}

static std::vector<DataStructureItem> extractHeapItems(
    std::priority_queue<HeapEntry, std::vector<HeapEntry>, std::greater<HeapEntry>> copyPq,
    const std::map<std::string, std::string>& labelMap,
    const std::unordered_set<std::string>& settledSet,
    const std::map<std::string, double>& distances
) {
    std::vector<DataStructureItem> items;
    while (!copyPq.empty()) {
        auto entry = copyPq.top();
        copyPq.pop();
        auto it = labelMap.find(entry.nodeId);
        std::string lbl = (it != labelMap.end()) ? it->second : entry.nodeId;
        bool isStale = (settledSet.count(entry.nodeId) > 0) ||
                       (entry.dist > (distances.count(entry.nodeId) ? distances.at(entry.nodeId) : entry.dist));
        std::string extra = isStale ? "Stale entry" : "Active frontier";
        items.push_back({entry.nodeId, lbl, entry.dist, extra, isStale});
    }
    return items;
}

std::vector<StepSnapshot> execute_dijkstra(
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

    // 5. Edge validation: invalid endpoints, self-loops, duplicate edges, negative weights, non-finite weights
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
        if (edge.weight < 0.0) {
            return makeInvalidSnapshot("Negative weight detected on edge (" + edge.source + " ↔ " + edge.target +
                ", weight " + formatDist(edge.weight) + "). Dijkstra's algorithm requires non-negative edge weights (w ≥ 0).");
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

    // Canonical priority queue min-heap required by milestone specification
    std::priority_queue<HeapEntry, std::vector<HeapEntry>, std::greater<HeapEntry>> pq;

    std::unordered_set<std::string> settledSet;
    std::vector<std::string> settledNodes;
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
    distances[sourceId] = 0.0;

    int stepCount = 0;
    int pushCounter = 0;

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
        const std::vector<DataStructureItem>& pqBefore,
        const std::vector<DataStructureItem>& pqAfter,
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

        s.visitedNodes = settledNodes;
        s.settledNodes = settledNodes;
        s.visitedEdges = visitedEdges;

        // Frontier nodes are all active nodes currently in the min-heap
        std::vector<std::string> frontier;
        auto tempPq = pq;
        std::unordered_set<std::string> seenFrontier;
        while (!tempPq.empty()) {
            auto top = tempPq.top();
            tempPq.pop();
            if (settledSet.find(top.nodeId) == settledSet.end() && !seenFrontier.count(top.nodeId)) {
                frontier.push_back(top.nodeId);
                seenFrontier.insert(top.nodeId);
            }
        }
        s.frontierNodes = frontier;

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

        s.dataStructureType = "priorityQueue";
        s.dataStructureItems = extractHeapItems(pq, labelMap, settledSet, distances);
        s.queueOrHeapBefore = pqBefore;
        s.queueOrHeapAfter = pqAfter;
        s.bfsLevel = std::nullopt;

        s.status = status;
        s.totalCost = cost;
        s.hopCount = hops;

        snapshots.push_back(s);
    };

    // Step 1: Initialize distances and push source into Min-Heap
    auto pqBeforeInit = extractHeapItems(pq, labelMap, settledSet, distances);
    pq.push({sourceId, 0.0, ++pushCounter});
    auto pqAfterInit = extractHeapItems(pq, labelMap, settledSet, distances);

    recordSnapshot(
        3,
        "initialize",
        "Initialize Dijkstra: Set dist['" + sourceLabel + "'] = 0, all other vertices = ∞. Push source into Min-Heap.",
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
        pqBeforeInit,
        pqAfterInit
    );

    // Trivial Case: Source == Destination
    if (sourceId == targetId) {
        settledSet.insert(sourceId);
        settledNodes.push_back(sourceId);
        recordSnapshot(
            6,
            "complete",
            "Source '" + sourceLabel + "' is the destination! Shortest path cost is 0.0.",
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
            pqAfterInit,
            pqAfterInit,
            {sourceId},
            {},
            0.0,
            0
        );
        return snapshots;
    }

    bool reachedTarget = false;

    while (!pq.empty()) {
        auto pqBeforePop = extractHeapItems(pq, labelMap, settledSet, distances);
        HeapEntry top = pq.top();
        pq.pop();
        auto pqAfterPop = extractHeapItems(pq, labelMap, settledSet, distances);

        std::string current = top.nodeId;
        double currentDist = top.dist;
        std::string currentLbl = labelMap[current];

        // Stale entry check: already settled or higher distance than recorded optimal
        if (settledSet.count(current) > 0 || currentDist > distances[current]) {
            recordSnapshot(
                7,
                "skip-stale-entry",
                "Min-Heap extracted vertex '" + currentLbl + "' with distance " + formatDist(currentDist) +
                    ", but vertex '" + currentLbl + "' has already been settled (optimal distance " +
                    formatDist(distances[current]) + "). Skip stale heap entry.",
                current,
                current,
                false,
                {"", ""},
                "",
                "running",
                distances[current],
                currentDist,
                distances[current],
                std::nullopt,
                false,
                pqBeforePop,
                pqAfterPop
            );
            continue;
        }

        // Settle vertex
        settledSet.insert(current);
        settledNodes.push_back(current);
        traversalOrder.push_back(current);

        recordSnapshot(
            5,
            "extract-min",
            "Extract vertex '" + currentLbl + "' from Min-Heap with confirmed minimum distance " +
                formatDist(currentDist) + ". Vertex is now settled.",
            current,
            current,
            false,
            {"", ""},
            "",
            "running",
            currentDist,
            currentDist,
            currentDist,
            std::nullopt,
            false,
            pqBeforePop,
            pqAfterPop
        );

        if (current == targetId) {
            reachedTarget = true;
            break;
        }

        const auto& neighbors = adj[current];
        for (const auto& edge : neighbors) {
            std::string nbr = edge.target;
            std::string nbrLbl = labelMap[nbr];
            double weight = edge.weight;
            std::string edgeId = edge.edgeId;

            // If neighbor is already settled, it cannot be relaxed further (non-negative edge weights)
            if (settledSet.count(nbr) > 0) {
                auto currentPq = extractHeapItems(pq, labelMap, settledSet, distances);
                recordSnapshot(
                    10,
                    "skip-edge",
                    "Inspect edge (" + currentLbl + " ↔ " + nbrLbl + ", weight " + formatDist(weight) +
                        "). Vertex '" + nbrLbl + "' is already settled with distance " + formatDist(distances[nbr]) + "; skip.",
                    current,
                    nbr,
                    true,
                    {current, nbr},
                    edgeId,
                    "running",
                    distances[nbr],
                    distances[current] + weight,
                    distances[nbr],
                    weight,
                    false,
                    currentPq,
                    currentPq
                );
                continue;
            }

            double candidateDist = distances[current] + weight;
            double prevDist = distances[nbr];
            auto currentPq = extractHeapItems(pq, labelMap, settledSet, distances);

            // Educational Step A: Inspect neighbor and calculate candidate distance
            recordSnapshot(
                9,
                "inspect-edge",
                "Inspect neighbor '" + nbrLbl + "' via edge (" + currentLbl + " ↔ " + nbrLbl +
                    ", weight " + formatDist(weight) + "). Calculate candidate distance: d(" +
                    currentLbl + ") + w = " + formatDist(distances[current]) + " + " +
                    formatDist(weight) + " = " + formatDist(candidateDist) +
                    ". Compare against current tentative distance d(" + nbrLbl + ") = " + formatDist(prevDist) + ".",
                current,
                nbr,
                true,
                {current, nbr},
                edgeId,
                "running",
                prevDist,
                candidateDist,
                prevDist,
                weight,
                false,
                currentPq,
                currentPq
            );

            if (candidateDist < prevDist) {
                distances[nbr] = candidateDist;
                predecessors[nbr] = current;
                predecessorEdgeIds[nbr] = edgeId;
                visitedEdges.push_back(edgeId);

                auto pqBeforePush = extractHeapItems(pq, labelMap, settledSet, distances);
                pq.push({nbr, candidateDist, ++pushCounter});
                auto pqAfterPush = extractHeapItems(pq, labelMap, settledSet, distances);

                recordSnapshot(
                    11,
                    "relax-edge",
                    "Relax edge (" + currentLbl + " ↔ " + nbrLbl + ", weight " + formatDist(weight) +
                        "): Condition met! " + formatDist(candidateDist) + " < " + formatDist(prevDist) +
                        ". Update distance of " + nbrLbl + ": " + formatDist(prevDist) +
                        " → " + formatDist(candidateDist) + ", record predecessor " + currentLbl +
                        ", and push into Min-Heap.",
                    current,
                    nbr,
                    true,
                    {current, nbr},
                    edgeId,
                    "running",
                    prevDist,
                    candidateDist,
                    candidateDist,
                    weight,
                    true,
                    pqBeforePush,
                    pqAfterPush
                );
            } else {
                recordSnapshot(
                    10,
                    "skip-edge",
                    "Skip edge (" + currentLbl + " ↔ " + nbrLbl + ", weight " + formatDist(weight) +
                        "): candidate distance " + formatDist(candidateDist) +
                        " >= current tentative distance " + formatDist(prevDist) +
                        ". Shorter path already known; keep existing distance.",
                    current,
                    nbr,
                    true,
                    {current, nbr},
                    edgeId,
                    "running",
                    prevDist,
                    candidateDist,
                    prevDist,
                    weight,
                    false,
                    currentPq,
                    currentPq
                );
            }
        }
    }

    if (reachedTarget) {
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

        // Emit traceback educational snapshots for each predecessor hop
        std::vector<std::string> animNodes;
        std::vector<std::string> animEdges;
        for (const auto& step : traceSteps) {
            std::string nodeU = step.first;
            std::string nodeV = step.second;
            std::string edgeId = predecessorEdgeIds[nodeU];
            animNodes.push_back(nodeU);
            if (!edgeId.empty()) animEdges.push_back(edgeId);
            if (nodeV == sourceId) animNodes.push_back(sourceId);

            auto currentPq = extractHeapItems(pq, labelMap, settledSet, distances);
            recordSnapshot(
                6,
                "reconstruct-path",
                "Path reconstruction traceback: destination reached from predecessor '" + labelMap[nodeV] +
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
                currentPq,
                currentPq,
                animNodes,
                animEdges,
                distances[targetId],
                static_cast<int>(animNodes.size()) - 1
            );
        }

        int hops = static_cast<int>(pathNodes.size()) - 1;
        double totalCost = distances[targetId];

        auto currentPq = extractHeapItems(pq, labelMap, settledSet, distances);
        recordSnapshot(
            6,
            "complete",
            "Target vertex '" + targetLabel + "' reached! Confirmed optimal shortest path cost: " +
                formatDist(totalCost) + " over " + std::to_string(hops) + " hops.",
            targetId,
            targetId,
            false,
            {"", ""},
            "",
            "found",
            distances[targetId],
            distances[targetId],
            distances[targetId],
            std::nullopt,
            false,
            currentPq,
            currentPq,
            pathNodes,
            pathEdges,
            totalCost,
            hops
        );
    } else {
        auto currentPq = extractHeapItems(pq, labelMap, settledSet, distances);
        recordSnapshot(
            13,
            "unreachable",
            "Min-Heap is empty. Target vertex '" + targetLabel + "' cannot be reached from source '" + sourceLabel + "'.",
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
            currentPq,
            currentPq
        );
    }

    return snapshots;
}

} // namespace pathscope
