#pragma once

#include <string>
#include <vector>
#include <map>
#include <optional>

namespace pathscope {

struct DataStructureItem {
    std::string id;
    std::string label;
    double priority = 0.0;
    std::string extra;
};

struct EdgeRef {
    std::string source;
    std::string target;
};

struct StepSnapshot {
    int stepNumber = 0;
    int codeLine = 0;
    std::string explanation;
    std::string currentNode;
    bool hasCurrentEdge = false;
    EdgeRef currentEdge;

    std::vector<std::string> visitedNodes;
    std::vector<std::string> visitedEdges;
    std::vector<std::string> frontierNodes;
    std::vector<std::string> pathNodes;
    std::vector<std::string> pathEdges;

    std::map<std::string, double> distances;
    std::map<std::string, std::string> predecessors;
    std::vector<std::string> traversalOrder;

    std::string dataStructureType; // "queue" or "priorityQueue"
    std::vector<DataStructureItem> dataStructureItems;

    std::string status; // "ready", "running", "found", "unreachable", "invalid"
    double totalCost = 0.0;
    int hopCount = 0;
};

} // namespace pathscope
