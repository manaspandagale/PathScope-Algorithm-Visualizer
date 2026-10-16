#pragma once

#include "graph.hpp"
#include "algorithm_types.hpp"
#include <vector>
#include <string>

namespace pathscope {

/**
 * Execute Breadth-First Search (BFS) in C++.
 * Emits step-by-step immutable snapshots capturing FIFO queue state,
 * active edges, visited nodes, and minimum-hop shortest path.
 */
std::vector<StepSnapshot> execute_bfs(
    const Graph& graph,
    const std::string& sourceId,
    const std::string& targetId
);

} // namespace pathscope
