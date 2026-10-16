#pragma once

#include <string>
#include <vector>
#include <map>
#include <algorithm>

namespace pathscope {

struct Node {
    std::string id;
    std::string label;
};

struct Edge {
    std::string id;
    std::string source;
    std::string target;
    double weight = 1.0;
};

struct AdjacencyEdge {
    std::string target;
    double weight = 1.0;
    std::string edgeId;
};

struct Graph {
    std::vector<Node> nodes;
    std::vector<Edge> edges;
    bool isDirected = false;

    std::map<std::string, std::string> getNodeLabelMap() const {
        std::map<std::string, std::string> labels;
        for (const auto& node : nodes) {
            labels[node.id] = node.label.empty() ? node.id : node.label;
        }
        return labels;
    }

    std::map<std::string, std::vector<AdjacencyEdge>> buildAdjacencyList() const {
        std::map<std::string, std::vector<AdjacencyEdge>> adj;
        for (const auto& node : nodes) {
            adj[node.id] = {};
        }

        for (const auto& edge : edges) {
            adj[edge.source].push_back({edge.target, edge.weight, edge.id});
            if (!isDirected) {
                adj[edge.target].push_back({edge.source, edge.weight, edge.id});
            }
        }

        // Sort adjacency lists by target id/label to guarantee stable, deterministic traversal
        for (auto& [_, edgeList] : adj) {
            std::sort(edgeList.begin(), edgeList.end(), [](const AdjacencyEdge& a, const AdjacencyEdge& b) {
                return a.target < b.target;
            });
        }

        return adj;
    }

    std::string findEdgeId(const std::string& u, const std::string& v) const {
        for (const auto& edge : edges) {
            if (edge.source == u && edge.target == v) return edge.id;
            if (!isDirected && edge.source == v && edge.target == u) return edge.id;
        }
        return "";
    }
};

} // namespace pathscope
