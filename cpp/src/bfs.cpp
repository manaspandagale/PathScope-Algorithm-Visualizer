#include "bfs.hpp"
#include <queue>
#include <unordered_set>
#include <map>
#include <algorithm>

namespace pathscope {

static std::vector<DataStructureItem> buildQueueItems(
    const std::vector<std::string>& qElements,
    const std::map<std::string, std::string>& labelMap
) {
    std::vector<DataStructureItem> items;
    items.reserve(qElements.size());
    for (const auto& id : qElements) {
        auto it = labelMap.find(id);
        std::string lbl = (it != labelMap.end()) ? it->second : id;
        items.push_back({id, lbl, 0.0, ""});
    }
    return items;
}

std::vector<StepSnapshot> execute_bfs(
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

    std::string sourceLabel = labelMap[sourceId];
    std::string targetLabel = labelMap[targetId];

    // Tracking structures
    std::vector<std::string> qElements; // simulate queue items for visualization
    std::unordered_set<std::string> visitedSet;
    std::vector<std::string> visitedOrder;
    std::vector<std::string> visitedEdges;
    std::map<std::string, double> distances;
    std::map<std::string, std::string> predecessors;
    std::vector<std::string> traversalOrder;

    for (const auto& node : graph.nodes) {
        predecessors[node.id] = "";
    }

    int stepCount = 0;

    // Helper to push snapshot
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
        s.frontierNodes = qElements;
        s.pathNodes = pathNodes;
        s.pathEdges = pathEdges;

        s.distances = distances;
        s.predecessors = predecessors;
        s.traversalOrder = traversalOrder;

        s.dataStructureType = "queue";
        s.dataStructureItems = buildQueueItems(qElements, labelMap);
        s.status = status;
        s.totalCost = cost;
        s.hopCount = hops;

        snapshots.push_back(s);
    };

    // Step 1: Initialization
    qElements.push_back(sourceId);
    visitedSet.insert(sourceId);
    visitedOrder.push_back(sourceId);
    distances[sourceId] = 0.0;

    recordSnapshot(
        4,
        "Initialize BFS: Enqueue source node '" + sourceLabel + "' (hop 0). Numeric edge weights are ignored in BFS.",
        sourceId,
        false,
        {"", ""},
        "running"
    );

    // Trivial Case: Source == Destination
    if (sourceId == targetId) {
        recordSnapshot(
            7,
            "Source '" + sourceLabel + "' is the destination! Shortest path requires 0 hops.",
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

    bool found = false;

    // BFS Queue Loop
    while (!qElements.empty()) {
        std::string current = qElements.front();
        qElements.erase(qElements.begin());
        traversalOrder.push_back(current);
        std::string currentLbl = labelMap[current];

        recordSnapshot(
            6,
            "Dequeue vertex '" + currentLbl + "' from the FIFO queue to inspect its outgoing edges.",
            current,
            false,
            {"", ""},
            "running"
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

            bool isNew = (visitedSet.find(nbr) == visitedSet.end());

            if (isNew) {
                visitedSet.insert(nbr);
                visitedOrder.push_back(nbr);
                visitedEdges.push_back(edgeId);
                predecessors[nbr] = current;
                distances[nbr] = distances[current] + 1.0;
                qElements.push_back(nbr);

                recordSnapshot(
                    12,
                    "Discover unvisited neighbor '" + nbrLbl + "' via edge (" + currentLbl + " ↔ " + nbrLbl + "). Distance = " +
                        std::to_string(static_cast<int>(distances[nbr])) + " hops. Enqueue into FIFO queue.",
                    nbr,
                    true,
                    {current, nbr},
                    "running"
                );

                if (nbr == targetId) {
                    found = true;
                    break;
                }
            } else {
                recordSnapshot(
                    9,
                    "Inspect edge (" + currentLbl + " ↔ " + nbrLbl + "). Vertex '" + nbrLbl + "' has already been visited; skip.",
                    current,
                    true,
                    {current, nbr},
                    "running"
                );
            }
        }

        if (found) {
            break;
        }
    }

    if (found) {
        // Reconstruct path backward from target to source
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
        double numericCost = 0.0;
        for (size_t i = 0; i + 1 < pathNodes.size(); ++i) {
            for (const auto& edge : graph.edges) {
                if ((edge.source == pathNodes[i] && edge.target == pathNodes[i+1]) ||
                    (!graph.isDirected && edge.source == pathNodes[i+1] && edge.target == pathNodes[i])) {
                    numericCost += edge.weight;
                    break;
                }
            }
        }

        recordSnapshot(
            7,
            "Target vertex '" + targetLabel + "' reached! Minimum-hop shortest path: " +
                std::to_string(hops) + " hops (numeric edge weight sum: " + std::to_string(static_cast<int>(numericCost)) + ").",
            targetId,
            false,
            {"", ""},
            "found",
            pathNodes,
            pathEdges,
            numericCost,
            hops
        );
    } else {
        recordSnapshot(
            13,
            "Queue empty! Destination '" + targetLabel + "' is unreachable from source '" + sourceLabel + "'.",
            "",
            false,
            {"", ""},
            "unreachable"
        );
    }

    return snapshots;
}

} // namespace pathscope
