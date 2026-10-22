#include "../include/graph.hpp"
#include "../include/bfs.hpp"
#include "../include/dijkstra.hpp"

#include <iostream>
#include <cassert>
#include <vector>
#include <string>
#include <cmath>
#include <limits>

using namespace pathscope;

// ==========================================
// BFS Tests
// ==========================================

void test_bfs_real_fifo() {
    std::cout << "[TEST] BFS: Real FIFO queue behavior...\n";
    Graph g;
    g.nodes = {{"S", "S"}, {"A", "A"}, {"B", "B"}, {"C", "C"}, {"T", "T"}};
    // S connects to A, B, C; only C connects to T so A, B, and C must all be dequeued in FIFO order
    g.edges = {
        {"e1", "S", "A", 1.0},
        {"e2", "S", "B", 1.0},
        {"e3", "S", "C", 1.0},
        {"e4", "C", "T", 1.0}
    };
    g.isDirected = true;

    auto snaps = execute_bfs(g, "S", "T");
    assert(!snaps.empty());

    // Check dequeued order from S's neighbors: must be A, B, C in FIFO order
    std::vector<std::string> dequeued;
    for (const auto& s : snaps) {
        if (s.operation == "dequeue" && s.activeVertex != "S") {
            dequeued.push_back(s.activeVertex);
        }
    }
    assert(dequeued.size() >= 3);
    assert(dequeued[0] == "A" && dequeued[1] == "B" && dequeued[2] == "C");
    std::cout << "  -> PASSED: FIFO order strictly maintained.\n";
}

void test_bfs_deterministic_neighbor_order() {
    std::cout << "[TEST] BFS: Deterministic neighbor order...\n";
    Graph g;
    g.nodes = {{"S", "S"}, {"Z", "Z"}, {"M", "M"}, {"A", "A"}, {"D", "D"}};
    // Edges defined in arbitrary order
    g.edges = {
        {"e1", "S", "Z", 1.0},
        {"e2", "S", "A", 1.0},
        {"e3", "S", "M", 1.0},
        {"e4", "A", "D", 1.0}
    };
    g.isDirected = false;

    auto snaps1 = execute_bfs(g, "S", "D");
    auto snaps2 = execute_bfs(g, "S", "D");
    assert(snaps1.size() == snaps2.size());
    for (size_t i = 0; i < snaps1.size(); ++i) {
        assert(snaps1[i].stepNumber == snaps2[i].stepNumber);
        assert(snaps1[i].operation == snaps2[i].operation);
        assert(snaps1[i].activeVertex == snaps2[i].activeVertex);
        assert(snaps1[i].codeLine == snaps2[i].codeLine);
    }
    std::cout << "  -> PASSED: Deterministic neighbor traversal verified.\n";
}

void test_bfs_minimum_hop() {
    std::cout << "[TEST] BFS: Minimum-hop path...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}, {"D", "D"}};
    g.edges = {
        {"e1", "A", "D", 100.0},
        {"e2", "A", "B", 1.0},
        {"e3", "B", "D", 1.0}
    };
    g.isDirected = false;

    auto snaps = execute_bfs(g, "A", "D");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(last.hopCount == 1);
    assert(last.pathNodes.size() == 2);
    assert(last.pathNodes[0] == "A" && last.pathNodes[1] == "D");
    assert(last.pathEdges.size() == 1 && last.pathEdges[0] == "e1");
    std::cout << "  -> PASSED: 1-hop path chosen over 2-hop path.\n";
}

void test_bfs_disconnected() {
    std::cout << "[TEST] BFS: Disconnected graph...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}};
    g.edges = {{"e1", "A", "B", 1.0}};
    g.isDirected = false;

    auto snaps = execute_bfs(g, "A", "C");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "unreachable");
    assert(last.operation == "unreachable");
    assert(last.pathNodes.empty());
    std::cout << "  -> PASSED: Disconnected graph correctly reported unreachable.\n";
}

void test_bfs_source_equals_destination() {
    std::cout << "[TEST] BFS: Source equals destination...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}};
    g.edges = {{"e1", "A", "B", 1.0}};
    g.isDirected = false;

    auto snaps = execute_bfs(g, "A", "A");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(last.operation == "complete");
    assert(last.hopCount == 0);
    assert(last.pathNodes.size() == 1 && last.pathNodes[0] == "A");
    std::cout << "  -> PASSED: Source == destination 0-hop case.\n";
}

void test_bfs_cycle_handling() {
    std::cout << "[TEST] BFS: Cycle handling...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}};
    g.edges = {
        {"e1", "A", "B", 1.0},
        {"e2", "B", "C", 1.0},
        {"e3", "C", "A", 1.0}
    };
    g.isDirected = false;

    auto snaps = execute_bfs(g, "A", "C");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(last.hopCount == 1);
    std::cout << "  -> PASSED: Cycle handled correctly.\n";
}

void test_bfs_empty_graph() {
    std::cout << "[TEST] BFS: Empty graph rejection...\n";
    Graph g;
    auto snaps = execute_bfs(g, "A", "B");
    assert(!snaps.empty());
    assert(snaps[0].status == "invalid");
    assert(snaps[0].operation == "invalid");
    std::cout << "  -> PASSED: Empty graph rejected.\n";
}

void test_bfs_missing_endpoints() {
    std::cout << "[TEST] BFS: Missing endpoint validation...\n";
    Graph g;
    g.nodes = {{"A", "A"}};
    auto snaps = execute_bfs(g, "A", "NonExistent");
    assert(!snaps.empty());
    assert(snaps[0].status == "invalid");
    std::cout << "  -> PASSED: Non-existent endpoint rejected.\n";
}

void test_bfs_invalid_edge_endpoints() {
    std::cout << "[TEST] BFS: Invalid edge endpoint rejection...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}};
    g.edges = {{"e1", "A", "GhostNode", 1.0}};
    auto snaps = execute_bfs(g, "A", "B");
    assert(!snaps.empty());
    assert(snaps[0].status == "invalid");
    std::cout << "  -> PASSED: Invalid edge endpoint rejected.\n";
}

void test_bfs_duplicate_parallel_edges() {
    std::cout << "[TEST] BFS: Duplicate/parallel edge rejection...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}};
    g.edges = {
        {"e1", "A", "B", 1.0},
        {"e2", "B", "A", 2.0} // Undirected duplicate
    };
    g.isDirected = false;
    auto snaps = execute_bfs(g, "A", "B");
    assert(!snaps.empty());
    assert(snaps[0].status == "invalid");
    std::cout << "  -> PASSED: Parallel edge rejected.\n";
}

void test_bfs_self_loop() {
    std::cout << "[TEST] BFS: Self-loop rejection...\n";
    Graph g;
    g.nodes = {{"A", "A"}};
    g.edges = {{"e1", "A", "A", 1.0}};
    auto snaps = execute_bfs(g, "A", "A");
    assert(!snaps.empty());
    assert(snaps[0].status == "invalid");
    std::cout << "  -> PASSED: Self-loop rejected.\n";
}

// ==========================================
// Dijkstra Tests
// ==========================================

void test_dijkstra_real_min_heap_extraction() {
    std::cout << "[TEST] Dijkstra: Real min-heap extraction order...\n";
    Graph g;
    g.nodes = {{"S", "S"}, {"A", "A"}, {"B", "B"}, {"C", "C"}, {"T", "T"}};
    // S connects to A (cost 10), B (cost 2), C (cost 7)
    g.edges = {
        {"e1", "S", "A", 10.0},
        {"e2", "S", "B", 2.0},
        {"e3", "S", "C", 7.0},
        {"e4", "A", "T", 1.0},
        {"e5", "B", "T", 10.0},
        {"e6", "C", "T", 1.0}
    };
    g.isDirected = true;

    auto snaps = execute_dijkstra(g, "S", "T");
    assert(!snaps.empty());

    // Verified settled extraction order: S (0), B (2), C (7), T (8)
    std::vector<std::string> extracted;
    for (const auto& s : snaps) {
        if (s.operation == "extract-min" && s.activeVertex != "S") {
            extracted.push_back(s.activeVertex);
        }
    }
    assert(extracted.size() >= 2);
    assert(extracted[0] == "B"); // B has lowest tentative distance 2.0
    assert(extracted[1] == "C"); // C has tentative distance 7.0
    std::cout << "  -> PASSED: Min-heap strictly extracted lowest tentative distance first.\n";
}

void test_dijkstra_equal_priority_tie_breaking() {
    std::cout << "[TEST] Dijkstra: Equal-priority tie breaking...\n";
    Graph g;
    g.nodes = {{"S", "S"}, {"Z", "Z"}, {"A", "A"}, {"T", "T"}};
    // Both Z and A have identical edge weights of 5.0 from S
    g.edges = {
        {"e1", "S", "Z", 5.0},
        {"e2", "S", "A", 5.0},
        {"e3", "Z", "T", 2.0},
        {"e4", "A", "T", 2.0}
    };
    g.isDirected = true;

    auto snaps1 = execute_dijkstra(g, "S", "T");
    auto snaps2 = execute_dijkstra(g, "S", "T");
    assert(snaps1.size() == snaps2.size());

    // Deterministic tie breaker: "A" < "Z" alphabetically
    std::vector<std::string> extracted;
    for (const auto& s : snaps1) {
        if (s.operation == "extract-min" && s.activeVertex != "S") {
            extracted.push_back(s.activeVertex);
        }
    }
    assert(extracted.size() >= 2);
    assert(extracted[0] == "A"); // A extracted before Z due to deterministic tie-breaker
    assert(extracted[1] == "Z");
    std::cout << "  -> PASSED: Deterministic tie-breaking verified.\n";
}

void test_dijkstra_zero_weight_edges() {
    std::cout << "[TEST] Dijkstra: Zero-weight edges...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}};
    g.edges = {
        {"e1", "A", "B", 0.0},
        {"e2", "B", "C", 0.0}
    };
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "C");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(last.totalCost == 0.0);
    assert(last.hopCount == 2);
    std::cout << "  -> PASSED: Zero-weight edges handled accurately.\n";
}

void test_dijkstra_decimal_weights() {
    std::cout << "[TEST] Dijkstra: Decimal weights...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}};
    g.edges = {
        {"e1", "A", "B", 1.5},
        {"e2", "B", "C", 2.25},
        {"e3", "A", "C", 4.0}
    };
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "C");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(std::abs(last.totalCost - 3.75) < 1e-6); // 1.5 + 2.25 = 3.75 < 4.0
    std::cout << "  -> PASSED: Decimal weights calculated correctly (3.75).\n";
}

void test_dijkstra_stale_pq_entries() {
    std::cout << "[TEST] Dijkstra: Stale priority-queue entries...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}, {"D", "D"}};
    // Direct A->B has cost 5.0, but A->C->B has cost 1.0 + 1.0 = 2.0.
    // B is pushed twice: once with 5.0, once with 2.0.
    // With B->D cost 4.0, total cost to D is 6.0.
    // Min-heap will pop stale entry {B, 5.0} before {D, 6.0}.
    g.edges = {
        {"e1", "A", "B", 5.0},
        {"e2", "A", "C", 1.0},
        {"e3", "C", "B", 1.0},
        {"e4", "B", "D", 4.0}
    };
    g.isDirected = true;

    auto snaps = execute_dijkstra(g, "A", "D");
    assert(!snaps.empty());

    bool staleFound = false;
    for (const auto& s : snaps) {
        if (s.operation == "skip-stale-entry") {
            staleFound = true;
            assert(s.activeVertex == "B");
            assert(s.codeLine == 7);
        }
    }
    assert(staleFound);
    assert(snaps.back().totalCost == 6.0); // A->C->B->D = 1 + 1 + 4 = 6
    std::cout << "  -> PASSED: Stale heap entry correctly detected, skipped, and recorded.\n";
}

void test_dijkstra_already_settled_duplicate_entries() {
    std::cout << "[TEST] Dijkstra: Already-settled entries...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}};
    g.edges = {
        {"e1", "A", "B", 2.0},
        {"e2", "B", "C", 3.0},
        {"e3", "A", "C", 10.0}
    };
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "C");
    assert(!snaps.empty());
    assert(snaps.back().status == "found");
    assert(snaps.back().totalCost == 5.0);
    std::cout << "  -> PASSED: Settled vertices handled without redundant relaxation.\n";
}

void test_dijkstra_cheaper_multihop() {
    std::cout << "[TEST] Dijkstra: Cheaper multi-hop vs direct...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}, {"D", "D"}};
    g.edges = {
        {"e1", "A", "D", 18.0},
        {"e2", "A", "B", 2.0},
        {"e3", "B", "C", 2.0},
        {"e4", "C", "D", 3.0}
    };
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "D");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(last.totalCost == 7.0);
    assert(last.hopCount == 3);
    std::cout << "  -> PASSED: 3-hop cost 7.0 chosen over 1-hop cost 18.0.\n";
}

void test_dijkstra_disconnected() {
    std::cout << "[TEST] Dijkstra: Disconnected graph...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}};
    g.edges = {{"e1", "A", "B", 4.0}};
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "C");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "unreachable");
    assert(last.operation == "unreachable");
    std::cout << "  -> PASSED: Disconnected graph handled cleanly.\n";
}

void test_dijkstra_source_equals_dest() {
    std::cout << "[TEST] Dijkstra: Source equals destination...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}};
    g.edges = {{"e1", "A", "B", 5.0}};
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "A");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(last.totalCost == 0.0);
    assert(last.hopCount == 0);
    std::cout << "  -> PASSED: Source == destination cost 0.0.\n";
}

void test_dijkstra_negative_weight_rejection() {
    std::cout << "[TEST] Dijkstra: Negative-weight rejection...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}};
    g.edges = {{"e1", "A", "B", -3.0}};
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "B");
    assert(!snaps.empty());
    assert(snaps[0].status == "invalid");
    assert(snaps[0].operation == "invalid");
    std::cout << "  -> PASSED: Negative edge weight rejected.\n";
}

void test_dijkstra_very_large_valid_distances() {
    std::cout << "[TEST] Dijkstra: Very large valid distances...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}};
    g.edges = {{"e1", "A", "B", 1e8}};
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "B");
    assert(!snaps.empty());
    assert(snaps.back().status == "found");
    assert(snaps.back().totalCost == 1e8);
    std::cout << "  -> PASSED: Large distance 1e8 processed without overflow.\n";
}

void test_dijkstra_predecessor_edge_reconstruction() {
    std::cout << "[TEST] Dijkstra: Predecessor edge reconstruction...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}};
    g.edges = {
        {"edge_ab", "A", "B", 3.0},
        {"edge_bc", "B", "C", 4.0}
    };
    g.isDirected = true;

    auto snaps = execute_dijkstra(g, "A", "C");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(last.pathEdges.size() == 2);
    assert(last.pathEdges[0] == "edge_ab");
    assert(last.pathEdges[1] == "edge_bc");
    std::cout << "  -> PASSED: Exact predecessor edge IDs matched in pathEdges.\n";
}

void test_dijkstra_duplicate_parallel_edges() {
    std::cout << "[TEST] Dijkstra: Duplicate/parallel edge rejection...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}};
    g.edges = {
        {"e1", "A", "B", 3.0},
        {"e2", "A", "B", 5.0}
    };
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "B");
    assert(!snaps.empty());
    assert(snaps[0].status == "invalid");
    std::cout << "  -> PASSED: Parallel edge rejected.\n";
}

void test_dijkstra_self_loop() {
    std::cout << "[TEST] Dijkstra: Self-loop rejection...\n";
    Graph g;
    g.nodes = {{"A", "A"}};
    g.edges = {{"e1", "A", "A", 2.0}};

    auto snaps = execute_dijkstra(g, "A", "A");
    assert(!snaps.empty());
    assert(snaps[0].status == "invalid");
    std::cout << "  -> PASSED: Self-loop rejected.\n";
}

int main() {
    std::cout << "========================================\n";
    std::cout << "  PathScope C++ Core Algorithm Tests\n";
    std::cout << "========================================\n";

    // BFS Tests
    test_bfs_real_fifo();
    test_bfs_deterministic_neighbor_order();
    test_bfs_minimum_hop();
    test_bfs_disconnected();
    test_bfs_source_equals_destination();
    test_bfs_cycle_handling();
    test_bfs_empty_graph();
    test_bfs_missing_endpoints();
    test_bfs_invalid_edge_endpoints();
    test_bfs_duplicate_parallel_edges();
    test_bfs_self_loop();

    // Dijkstra Tests
    test_dijkstra_real_min_heap_extraction();
    test_dijkstra_equal_priority_tie_breaking();
    test_dijkstra_zero_weight_edges();
    test_dijkstra_decimal_weights();
    test_dijkstra_stale_pq_entries();
    test_dijkstra_already_settled_duplicate_entries();
    test_dijkstra_cheaper_multihop();
    test_dijkstra_disconnected();
    test_dijkstra_source_equals_dest();
    test_dijkstra_negative_weight_rejection();
    test_dijkstra_very_large_valid_distances();
    test_dijkstra_predecessor_edge_reconstruction();
    test_dijkstra_duplicate_parallel_edges();
    test_dijkstra_self_loop();

    std::cout << "========================================\n";
    std::cout << "  ALL C++ ALGORITHM TESTS PASSED! (25/25)\n";
    std::cout << "========================================\n";
    return 0;
}
