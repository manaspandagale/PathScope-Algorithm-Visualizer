#include "dijkstra.hpp"
#include <queue>
#include <map>
#include <unordered_set>
#include <algorithm>
#include <limits>
#include <sstream>
#include <iomanip>

namespace pathscope {

struct HeapEntry {
    std::string nodeId;
    double dist;

    // Min-heap ordering: smaller distance first. Tie-breaker on nodeId for determinism.
    bool operator>(const HeapEntry& other) const {
        if (dist != other.dist) {
            return dist > other.dist;
        }
        return nodeId > other.nodeId;
    }
};

static std::string formatDist(double d) {
    if (d >= 1e9) return "∞";
    std::ostringstream ss;
    if (d == static_cast<int>(d)) {
        ss << static_cast<int>(d);
    } else {
        ss << std::fixed << std::setprecision(1) << d;
    }
    return ss.str();
}

std::vector<StepSnapshot> execute_dijkstra(
    const Graph& graph,
    const std::string& sourceId,
    const std::string& targetId
) {
    std::vector<StepSnapshot> snapshots;
    auto labelMap = graph.getNodeLabelMap();
    auto adj = graph.buildAdjacencyList();

    // Check if source and target exist
    if (adj.find(sourceId) == adj.end() || adj.find(targetId) == adj.end()) {
        StepSnapshot snap;
        snap.stepNumber = 1;
        snap.codeLine = 13;
        snap.status = "unreachable";
        snap.explanation = "Source or destination node does not exist in the graph.";
        snapshots.push_back(snap);
        return snapshots;
    }

    // Negative weight validation
    for (const auto& edge : graph.edges) {
        if (edge.weight < 0) {
            StepSnapshot snap;
            snap.stepNumber = 1;
            snap.codeLine = 1;
            snap.status = "invalid";
            snap.explanation = "Negative weight detected on edge (" + edge.source + " ↔ " + edge.target +
                ", weight " + formatDist(edge.weight) + "). Dijkstra's algorithm requires non-negative weights (w ≥ 0).";
            snapshots.push_back(snap);
            return snapshots;
        }
    }

    std::string sourceLabel = labelMap[sourceId];
    std::string targetLabel = labelMap[targetId];

    // Priority queue min-heap simulation
    // We maintain a sorted vector of active heap entries to inspect in visualization
    std::vector<HeapEntry> heapEntries;
    std::unordered_set<std::string> visitedSet;
    std::vector<std::string> visitedOrder;
    std::vector<std::string> visitedEdges;
    std::map<std::string, double> distances;
    std::map<std::string, std::string> predecessors;
    std::vector<std::string> traversalOrder;

    constexpr double INF = 1e9;
    for (const auto& node : graph.nodes) {
        distances[node.id] = INF;
        predecessors[node.id] = "";
    }
    distances[sourceId] = 0.0;

    int stepCount = 0;

    auto buildPqItems = [&]() -> std::vector<DataStructureItem> {
        std::vector<DataStructureItem> items;
        for (const auto& entry : heapEntries) {
            std::string lbl = labelMap[entry.nodeId];
            items.push_back({
                entry.nodeId,
                lbl + " (" + formatDist(entry.dist) + ")",
                entry.dist,
                "dist: " + formatDist(entry.dist)
            });
        }
        return items;
    };

    auto recordSnapshot = [&](
        int codeLine,
        const std::string& explanation,
        const std::string& current,
        bool hasEdge,
        const EdgeRef& edgeRef,
        const std::string& status,
        const std::vector<std::string>& pathNodes = {},
        const std::vector<std::string>& pathEdges = {},
        double cost = 0.0,
        int hops = 0
    ) {
        StepSnapshot s;
        s.stepNumber = ++stepCount;
        s.codeLine = codeLine;
        s.explanation = explanation;
        s.currentNode = current;
        s.hasCurrentEdge = hasEdge;
        s.currentEdge = edgeRef;

        s.visitedNodes = visitedOrder;
        s.visitedEdges = visitedEdges;

        std::vector<std::string> frontiers;
        for (const auto& e : heapEntries) {
            frontiers.push_back(e.nodeId);
        }
        s.frontierNodes = frontiers;
        s.pathNodes = pathNodes;
        s.pathEdges = pathEdges;

        s.distances = distances;
        s.predecessors = predecessors;
        s.traversalOrder = traversalOrder;

        s.dataStructureType = "priorityQueue";
        s.dataStructureItems = buildPqItems();
        s.status = status;
        s.totalCost = cost;
        s.hopCount = hops;

        snapshots.push_back(s);
    };

    // Helper to push into heap simulation maintaining min-heap order
    auto heapPush = [&](const std::string& id, double d) {
        heapEntries.push_back({id, d});
        std::sort(heapEntries.begin(), heapEntries.end(), [](const HeapEntry& a, const HeapEntry& b) {
            if (a.dist != b.dist) return a.dist < b.dist;
            return a.nodeId < b.nodeId;
        });
    };

    // Step 1: Initialize distances and push source
    heapPush(sourceId, 0.0);

    recordSnapshot(
        3,
        "Initialize Dijkstra: Set dist['" + sourceLabel + "'] = 0, all other vertices = ∞. Push source into Min-Heap.",
        sourceId,
        false,
        {"", ""},
        "running"
    );

    // Trivial Case: Source == Destination
    if (sourceId == targetId) {
        recordSnapshot(
            6,
            "Source '" + sourceLabel + "' is the destination! Shortest path cost is 0.0.",
            sourceId,
            false,
            {"", ""},
            "found",
            {sourceId},
            {},
            0.0,
            0
        );
        return snapshots;
    }

    bool reachedTarget = false;

    while (!heapEntries.empty()) {
        HeapEntry top = heapEntries.front();
        heapEntries.erase(heapEntries.begin());

        std::string current = top.nodeId;
        double currentDist = top.dist;
        std::string currentLbl = labelMap[current];

        // Stale entry check: if currentDist > distances[current], skip
        if (currentDist > distances[current]) {
            recordSnapshot(
                7,
                "Min-Heap extracted vertex '" + currentLbl + "' with distance " + formatDist(currentDist) +
                    ", but a shorter path (" + formatDist(distances[current]) + ") has already been processed. Skip stale heap entry.",
                current,
                false,
                {"", ""},
                "running"
            );
            continue;
        }

        // Add to visited
        if (visitedSet.find(current) == visitedSet.end()) {
            visitedSet.insert(current);
            visitedOrder.push_back(current);
            traversalOrder.push_back(current);
        }

        recordSnapshot(
            5,
            "Extract vertex '" + currentLbl + "' from Min-Heap with confirmed minimum distance " +
                formatDist(currentDist) + ".",
            current,
            false,
            {"", ""},
            "running"
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

            double newDist = distances[current] + weight;

            if (newDist < distances[nbr]) {
                distances[nbr] = newDist;
                predecessors[nbr] = current;
                visitedEdges.push_back(edgeId);
                heapPush(nbr, newDist);

                recordSnapshot(
                    11,
                    "Relax edge (" + currentLbl + " ↔ " + nbrLbl + ", weight " + formatDist(weight) + "): Found shorter path to '" +
                        nbrLbl + "' (dist = " + formatDist(newDist) + "). Push (" + nbrLbl + ", " + formatDist(newDist) + ") into Min-Heap.",
                    nbr,
                    true,
                    {current, nbr},
                    "running"
                );
            } else {
                recordSnapshot(
                    10,
                    "Inspect edge (" + currentLbl + " ↔ " + nbrLbl + ", weight " + formatDist(weight) + "): Candidate distance " +
                        formatDist(newDist) + " is not shorter than existing dist['" + nbrLbl + "'] = " + formatDist(distances[nbr]) + ". No relaxation.",
                    current,
                    true,
                    {current, nbr},
                    "running"
                );
            }
        }
    }

    if (reachedTarget) {
        std::vector<std::string> pathNodes;
        std::vector<std::string> pathEdges;
        std::string curr = targetId;

        while (!curr.empty()) {
            pathNodes.push_back(curr);
            std::string p = predecessors[curr];
            if (!p.empty()) {
                std::string eId = graph.findEdgeId(p, curr);
                if (!eId.empty()) {
                    pathEdges.push_back(eId);
                }
            }
            if (curr == sourceId) break;
            curr = p;
        }

        std::reverse(pathNodes.begin(), pathNodes.end());
        std::reverse(pathEdges.begin(), pathEdges.end());

        int hops = static_cast<int>(pathNodes.size()) - 1;
        double totalCost = distances[targetId];

        recordSnapshot(
            6,
            "Target vertex '" + targetLabel + "' reached! Optimal shortest path cost: " +
                formatDist(totalCost) + " across " + std::to_string(hops) + " hops.",
            targetId,
            false,
            {"", ""},
            "found",
            pathNodes,
            pathEdges,
            totalCost,
            hops
        );
    } else {
        recordSnapshot(
            13,
            "Min-Heap empty! Destination vertex '" + targetLabel + "' is unreachable from source '" + sourceLabel + "'.",
            "",
            false,
            {"", ""},
            "unreachable"
        );
    }

    return snapshots;
}

} // namespace pathscope
