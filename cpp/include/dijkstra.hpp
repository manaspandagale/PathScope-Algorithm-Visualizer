#pragma once

#include "graph.hpp"
#include "algorithm_types.hpp"
#include <vector>
#include <string>

namespace pathscope {

/**
 * Execute Dijkstra's Shortest Path Algorithm in C++.
 * Emits step-by-step immutable snapshots capturing Min-Heap priority queue state,
 * edge relaxation, tentative distance updates, and minimum-weight shortest path.
 * Rejects negative edge weights before execution.
 */
std::vector<StepSnapshot> execute_dijkstra(
    const Graph& graph,
    const std::string& sourceId,
    const std::string& targetId
);

} // namespace pathscope
