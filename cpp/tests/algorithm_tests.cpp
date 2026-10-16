#include "../include/graph.hpp"
#include "../include/bfs.hpp"
#include "../include/dijkstra.hpp"

#include <iostream>
#include <cassert>
#include <vector>
#include <string>

using namespace pathscope;

// Helper to run BFS on a simple graph
void test_bfs_minimum_hop() {
    std::cout << "[TEST] BFS: Minimum-hop path...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}, {"D", "D"}};
    // Direct 1-hop path A-D with huge weight 100, vs 2-hop A-B-D with small weight 2
    // BFS must choose 1-hop A-D because it minimizes hops!
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
    std::cout << "  -> PASSED: BFS correctly chose 1-hop path A->D regardless of weight.\n";
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
    assert(last.pathNodes.empty());
    std::cout << "  -> PASSED: BFS handles unreachable target cleanly.\n";
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
    assert(last.hopCount == 0);
    assert(last.pathNodes.size() == 1 && last.pathNodes[0] == "A");
    std::cout << "  -> PASSED: BFS 0-hop trivial case.\n";
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
    assert(last.hopCount == 1); // Direct edge A-C in cycle
    std::cout << "  -> PASSED: BFS handles cycles without infinite loops.\n";
}

void test_bfs_deterministic_traversal() {
    std::cout << "[TEST] BFS: Deterministic traversal...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}, {"D", "D"}};
    g.edges = {
        {"e1", "A", "D", 1.0},
        {"e2", "A", "B", 1.0},
        {"e3", "A", "C", 1.0}
    };
    g.isDirected = false;

    auto snaps1 = execute_bfs(g, "A", "D");
    auto snaps2 = execute_bfs(g, "A", "D");
    assert(snaps1.size() == snaps2.size());
    for (size_t i = 0; i < snaps1.size(); ++i) {
        assert(snaps1[i].stepNumber == snaps2[i].stepNumber);
        assert(snaps1[i].currentNode == snaps2[i].currentNode);
        assert(snaps1[i].explanation == snaps2[i].explanation);
    }
    std::cout << "  -> PASSED: BFS produces identical deterministic snapshot sequences.\n";
}

void test_dijkstra_minimum_weight() {
    std::cout << "[TEST] Dijkstra: Minimum-weight path...\n";
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
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(last.totalCost == 5.0); // 2 + 3 = 5 < 10
    assert(last.hopCount == 2);
    assert(last.pathNodes.size() == 3);
    assert(last.pathNodes[0] == "A" && last.pathNodes[1] == "B" && last.pathNodes[2] == "C");
    std::cout << "  -> PASSED: Dijkstra found minimum-weight path (cost 5.0).\n";
}

void test_dijkstra_cheaper_multihop_vs_expensive_direct() {
    std::cout << "[TEST] Dijkstra: Cheaper multi-hop path vs expensive direct edge...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}, {"D", "D"}};
    // Direct A-D is 18.0 (1 hop). Multi-hop A-B-C-D is 2 + 2 + 3 = 7.0 (3 hops).
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
    std::cout << "  -> PASSED: Dijkstra chose 3-hop cost 7.0 over 1-hop cost 18.0.\n";
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
    std::cout << "  -> PASSED: Dijkstra handles disconnected graph.\n";
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
    std::cout << "  -> PASSED: Dijkstra trivial 0.0 cost.\n";
}

void test_dijkstra_stale_entry_and_cycle() {
    std::cout << "[TEST] Dijkstra: Stale priority-queue entry & cycle...\n";
    Graph g;
    // Diamond with cross edge
    g.nodes = {{"A", "A"}, {"B", "B"}, {"C", "C"}, {"D", "D"}};
    g.edges = {
        {"e1", "A", "B", 5.0},
        {"e2", "A", "C", 1.0},
        {"e3", "C", "B", 1.0}, // makes path to B via C cheaper (2.0 vs 5.0), causing stale entry for B
        {"e4", "B", "D", 2.0}
    };
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "D");
    assert(!snaps.empty());
    const auto& last = snaps.back();
    assert(last.status == "found");
    assert(last.totalCost == 4.0); // A->C (1) -> B (1) -> D (2) = 4
    std::cout << "  -> PASSED: Stale entries correctly handled, optimal path A->C->B->D found.\n";
}

void test_dijkstra_negative_weight_rejection() {
    std::cout << "[TEST] Dijkstra: Negative-weight rejection...\n";
    Graph g;
    g.nodes = {{"A", "A"}, {"B", "B"}};
    g.edges = {{"e1", "A", "B", -3.0}};
    g.isDirected = false;

    auto snaps = execute_dijkstra(g, "A", "B");
    assert(!snaps.empty());
    const auto& first = snaps[0];
    assert(first.status == "invalid");
    std::cout << "  -> PASSED: Negative edge weight rejected before execution.\n";
}

int main() {
    std::cout << "========================================\n";
    std::cout << "  PathScope C++ Core Algorithm Tests\n";
    std::cout << "========================================\n";

    test_bfs_minimum_hop();
    test_bfs_disconnected();
    test_bfs_source_equals_destination();
    test_bfs_cycle_handling();
    test_bfs_deterministic_traversal();

    test_dijkstra_minimum_weight();
    test_dijkstra_cheaper_multihop_vs_expensive_direct();
    test_dijkstra_disconnected();
    test_dijkstra_source_equals_dest();
    test_dijkstra_stale_entry_and_cycle();
    test_dijkstra_negative_weight_rejection();

    std::cout << "========================================\n";
    std::cout << "  ALL C++ ALGORITHM TESTS PASSED! (11/11)\n";
    std::cout << "========================================\n";
    return 0;
}
