#include "bfs.hpp"
#include "dijkstra.hpp"
#include "graph.hpp"
#include "algorithm_types.hpp"

#include <string>
#include <vector>
#include <sstream>
#include <iomanip>
#include <cctype>

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
#endif

namespace pathscope {

// Escape string for valid JSON
static std::string escapeJson(const std::string& s) {
    std::ostringstream o;
    for (char c : s) {
        if (c == '"') o << "\\\"";
        else if (c == '\\') o << "\\\\";
        else if (c == '\b') o << "\\b";
        else if (c == '\f') o << "\\f";
        else if (c == '\n') o << "\\n";
        else if (c == '\r') o << "\\r";
        else if (c == '\t') o << "\\t";
        else if (static_cast<unsigned char>(c) <= 0x1f) {
            o << "\\u" << std::hex << std::setw(4) << std::setfill('0') << static_cast<int>(c);
        } else {
            o << c;
        }
    }
    return o.str();
}

// Minimal, robust JSON parser for the specific Graph payload
struct GraphPayload {
    Graph graph;
    std::string sourceId;
    std::string targetId;
};

// Helper tokenizer / parser
static GraphPayload parseGraphJson(const std::string& json) {
    GraphPayload payload;

    // Helper to find a string value after a key
    auto findStringField = [&](const std::string& key, size_t startPos = 0) -> std::pair<std::string, size_t> {
        std::string pattern = "\"" + key + "\"";
        size_t p = json.find(pattern, startPos);
        if (p == std::string::npos) return {"", std::string::npos};
        size_t colon = json.find(':', p);
        if (colon == std::string::npos) return {"", std::string::npos};
        size_t quote1 = json.find('"', colon + 1);
        if (quote1 == std::string::npos) return {"", std::string::npos};
        size_t quote2 = json.find('"', quote1 + 1);
        if (quote2 == std::string::npos) return {"", std::string::npos};
        return {json.substr(quote1 + 1, quote2 - quote1 - 1), quote2 + 1};
    };

    // Helper to find a boolean field
    auto findBoolField = [&](const std::string& key) -> bool {
        std::string pattern = "\"" + key + "\"";
        size_t p = json.find(pattern);
        if (p == std::string::npos) return false;
        size_t colon = json.find(':', p);
        if (colon == std::string::npos) return false;
        size_t valStart = json.find_first_not_of(" \t\r\n", colon + 1);
        if (valStart != std::string::npos && json.substr(valStart, 4) == "true") {
            return true;
        }
        return false;
    };

    payload.sourceId = findStringField("sourceId").first;
    payload.targetId = findStringField("targetId").first;
    payload.graph.isDirected = findBoolField("isDirected");

    // Parse nodes array
    size_t nodesPos = json.find("\"nodes\"");
    if (nodesPos != std::string::npos) {
        size_t arrStart = json.find('[', nodesPos);
        size_t arrEnd = json.find(']', arrStart);
        if (arrStart != std::string::npos && arrEnd != std::string::npos) {
            std::string nodesArr = json.substr(arrStart, arrEnd - arrStart + 1);
            size_t objPos = 0;
            while ((objPos = nodesArr.find('{', objPos)) != std::string::npos) {
                size_t objEnd = nodesArr.find('}', objPos);
                if (objEnd == std::string::npos) break;
                std::string nodeObj = nodesArr.substr(objPos, objEnd - objPos + 1);

                // extract id and label
                std::string id, label;
                size_t pId = nodeObj.find("\"id\"");
                if (pId != std::string::npos) {
                    size_t q1 = nodeObj.find('"', nodeObj.find(':', pId) + 1);
                    size_t q2 = nodeObj.find('"', q1 + 1);
                    if (q1 != std::string::npos && q2 != std::string::npos) {
                        id = nodeObj.substr(q1 + 1, q2 - q1 - 1);
                    }
                }
                size_t pLbl = nodeObj.find("\"label\"");
                if (pLbl != std::string::npos) {
                    size_t q1 = nodeObj.find('"', nodeObj.find(':', pLbl) + 1);
                    size_t q2 = nodeObj.find('"', q1 + 1);
                    if (q1 != std::string::npos && q2 != std::string::npos) {
                        label = nodeObj.substr(q1 + 1, q2 - q1 - 1);
                    }
                }
                if (label.empty()) label = id;

                if (!id.empty()) {
                    payload.graph.nodes.push_back({id, label});
                }
                objPos = objEnd + 1;
            }
        }
    }

    // Parse edges array
    size_t edgesPos = json.find("\"edges\"");
    if (edgesPos != std::string::npos) {
        size_t arrStart = json.find('[', edgesPos);
        size_t arrEnd = json.find(']', arrStart);
        if (arrStart != std::string::npos && arrEnd != std::string::npos) {
            std::string edgesArr = json.substr(arrStart, arrEnd - arrStart + 1);
            size_t objPos = 0;
            while ((objPos = edgesArr.find('{', objPos)) != std::string::npos) {
                size_t objEnd = edgesArr.find('}', objPos);
                if (objEnd == std::string::npos) break;
                std::string edgeObj = edgesArr.substr(objPos, objEnd - objPos + 1);

                std::string id, source, target;
                double weight = 1.0;

                // id
                size_t pId = edgeObj.find("\"id\"");
                if (pId != std::string::npos) {
                    size_t q1 = edgeObj.find('"', edgeObj.find(':', pId) + 1);
                    size_t q2 = edgeObj.find('"', q1 + 1);
                    if (q1 != std::string::npos && q2 != std::string::npos) {
                        id = edgeObj.substr(q1 + 1, q2 - q1 - 1);
                    }
                }
                // source
                size_t pSrc = edgeObj.find("\"source\"");
                if (pSrc != std::string::npos) {
                    size_t q1 = edgeObj.find('"', edgeObj.find(':', pSrc) + 1);
                    size_t q2 = edgeObj.find('"', q1 + 1);
                    if (q1 != std::string::npos && q2 != std::string::npos) {
                        source = edgeObj.substr(q1 + 1, q2 - q1 - 1);
                    }
                }
                // target
                size_t pTgt = edgeObj.find("\"target\"");
                if (pTgt != std::string::npos) {
                    size_t q1 = edgeObj.find('"', edgeObj.find(':', pTgt) + 1);
                    size_t q2 = edgeObj.find('"', q1 + 1);
                    if (q1 != std::string::npos && q2 != std::string::npos) {
                        target = edgeObj.substr(q1 + 1, q2 - q1 - 1);
                    }
                }
                // weight
                size_t pW = edgeObj.find("\"weight\"");
                if (pW != std::string::npos) {
                    size_t colon = edgeObj.find(':', pW);
                    if (colon != std::string::npos) {
                        size_t numStart = edgeObj.find_first_not_of(" \t", colon + 1);
                        size_t numEnd = edgeObj.find_first_of(",} \t\r\n", numStart);
                        if (numStart != std::string::npos) {
                            std::string wStr = edgeObj.substr(numStart, (numEnd == std::string::npos) ? std::string::npos : numEnd - numStart);
                            try {
                                weight = std::stod(wStr);
                            } catch (...) {
                                weight = 1.0;
                            }
                        }
                    }
                }

                if (!id.empty() && !source.empty() && !target.empty()) {
                    payload.graph.edges.push_back({id, source, target, weight});
                }
                objPos = objEnd + 1;
            }
        }
    }

    return payload;
}

// Serialize std::vector<StepSnapshot> to JSON string
static std::string serializeSnapshotsToJson(const std::vector<StepSnapshot>& snapshots) {
    std::ostringstream ss;
    ss << "[";

    for (size_t i = 0; i < snapshots.size(); ++i) {
        if (i > 0) ss << ",";
        const auto& s = snapshots[i];

        ss << "{";
        ss << "\"stepNumber\":" << s.stepNumber << ",";
        ss << "\"codeLine\":" << s.codeLine << ",";
        ss << "\"explanation\":\"" << escapeJson(s.explanation) << "\",";

        if (s.currentNode.empty()) {
            ss << "\"currentNode\":null,";
        } else {
            ss << "\"currentNode\":\"" << escapeJson(s.currentNode) << "\",";
        }

        if (s.hasCurrentEdge) {
            ss << "\"currentEdge\":{\"source\":\"" << escapeJson(s.currentEdge.source)
               << "\",\"target\":\"" << escapeJson(s.currentEdge.target) << "\"},";
        } else {
            ss << "\"currentEdge\":null,";
        }

        // visitedNodes
        ss << "\"visitedNodes\":[";
        for (size_t j = 0; j < s.visitedNodes.size(); ++j) {
            if (j > 0) ss << ",";
            ss << "\"" << escapeJson(s.visitedNodes[j]) << "\"";
        }
        ss << "],";

        // visitedEdges
        ss << "\"visitedEdges\":[";
        for (size_t j = 0; j < s.visitedEdges.size(); ++j) {
            if (j > 0) ss << ",";
            ss << "\"" << escapeJson(s.visitedEdges[j]) << "\"";
        }
        ss << "],";

        // frontierNodes
        ss << "\"frontierNodes\":[";
        for (size_t j = 0; j < s.frontierNodes.size(); ++j) {
            if (j > 0) ss << ",";
            ss << "\"" << escapeJson(s.frontierNodes[j]) << "\"";
        }
        ss << "],";

        // pathNodes
        ss << "\"pathNodes\":[";
        for (size_t j = 0; j < s.pathNodes.size(); ++j) {
            if (j > 0) ss << ",";
            ss << "\"" << escapeJson(s.pathNodes[j]) << "\"";
        }
        ss << "],";

        // pathEdges
        ss << "\"pathEdges\":[";
        for (size_t j = 0; j < s.pathEdges.size(); ++j) {
            if (j > 0) ss << ",";
            ss << "\"" << escapeJson(s.pathEdges[j]) << "\"";
        }
        ss << "],";

        // distances
        ss << "\"distances\":{";
        bool firstD = true;
        for (const auto& [nodeId, dist] : s.distances) {
            if (!firstD) ss << ",";
            firstD = false;
            ss << "\"" << escapeJson(nodeId) << "\":" << dist;
        }
        ss << "},";

        // predecessors
        ss << "\"predecessors\":{";
        bool firstP = true;
        for (const auto& [nodeId, predId] : s.predecessors) {
            if (!firstP) ss << ",";
            firstP = false;
            ss << "\"" << escapeJson(nodeId) << "\":";
            if (predId.empty()) {
                ss << "null";
            } else {
                ss << "\"" << escapeJson(predId) << "\"";
            }
        }
        ss << "},";

        // traversalOrder
        ss << "\"traversalOrder\":[";
        for (size_t j = 0; j < s.traversalOrder.size(); ++j) {
            if (j > 0) ss << ",";
            ss << "\"" << escapeJson(s.traversalOrder[j]) << "\"";
        }
        ss << "],";

        // dataStructure
        ss << "\"dataStructure\":{";
        ss << "\"type\":\"" << escapeJson(s.dataStructureType) << "\",";
        ss << "\"items\":[";
        for (size_t j = 0; j < s.dataStructureItems.size(); ++j) {
            if (j > 0) ss << ",";
            const auto& item = s.dataStructureItems[j];
            ss << "{";
            ss << "\"id\":\"" << escapeJson(item.id) << "\",";
            ss << "\"label\":\"" << escapeJson(item.label) << "\",";
            ss << "\"priority\":" << item.priority;
            if (!item.extra.empty()) {
                ss << ",\"extra\":\"" << escapeJson(item.extra) << "\"";
            }
            ss << "}";
        }
        ss << "]},";

        // status, totalCost, hopCount
        ss << "\"status\":\"" << escapeJson(s.status) << "\",";
        ss << "\"totalCost\":" << s.totalCost << ",";
        ss << "\"hopCount\":" << s.hopCount;
        ss << "}";
    }

    ss << "]";
    return ss.str();
}

// Exported WebAssembly wrappers
std::string run_bfs_wasm(const std::string& inputJson) {
    GraphPayload p = parseGraphJson(inputJson);
    auto snapshots = execute_bfs(p.graph, p.sourceId, p.targetId);
    return serializeSnapshotsToJson(snapshots);
}

std::string run_dijkstra_wasm(const std::string& inputJson) {
    GraphPayload p = parseGraphJson(inputJson);
    auto snapshots = execute_dijkstra(p.graph, p.sourceId, p.targetId);
    return serializeSnapshotsToJson(snapshots);
}

} // namespace pathscope

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(pathscope_module) {
    emscripten::function("run_bfs_wasm", &pathscope::run_bfs_wasm);
    emscripten::function("run_dijkstra_wasm", &pathscope::run_dijkstra_wasm);
}
#endif
