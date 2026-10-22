#pragma once

#include <string>
#include <vector>
#include <map>
#include <optional>
#include <limits>

namespace pathscope {

struct DataStructureItem {
    std::string id;
    std::string label;
    double priority = 0.0;
    std::string extra;
    bool isStale = false;
};

struct EdgeRef {
    std::string source;
    std::string target;
};

struct StepSnapshot {
    int stepNumber = 0;
    int codeLine = 0;
    std::string operation; // "initialize", "enqueue", "dequeue", "extract-min", "inspect-edge", "relax-edge", "skip-edge", "settle-vertex", "skip-stale-entry", "reconstruct-path", "complete", "unreachable", "invalid"
    std::string explanation;
    std::string currentNode;
    std::string activeVertex;
    std::string inspectedEdgeId;
    bool hasCurrentEdge = false;
    EdgeRef currentEdge;

    std::vector<std::string> visitedNodes;
    std::vector<std::string> visitedEdges;
    std::vector<std::string> frontierNodes;
    std::vector<std::string> pathNodes;
    std::vector<std::string> pathEdges;

    std::map<std::string, double> distances;
    std::map<std::string, std::string> predecessors;
    std::map<std::string, std::string> predecessorEdgeIds;
    std::vector<std::string> traversalOrder;

    std::optional<double> previousDistance;
    std::optional<double> candidateDistance;
    std::optional<double> updatedDistance;
    std::optional<double> edgeWeight;
    bool distanceUpdated = false;

    std::string dataStructureType; // "queue" or "priorityQueue"
    std::vector<DataStructureItem> dataStructureItems;
    std::vector<DataStructureItem> queueOrHeapBefore;
    std::vector<DataStructureItem> queueOrHeapAfter;

    std::vector<std::string> settledNodes;
    std::optional<int> bfsLevel;

    std::string status; // "ready", "running", "found", "unreachable", "invalid"
    double totalCost = 0.0;
    int hopCount = 0;
};

} // namespace pathscope
