# PathScope — Interactive Shortest Path Algorithm Visualizer
> **Academic Milestone 1 (50% Milestone Release)**
> Built with **C++17**, **Emscripten (WebAssembly)**, **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS v4**, and **@xyflow/react**.

---

## 📌 Project Overview & Idea

**PathScope** is an interactive, browser-based algorithm laboratory designed for the Computer Engineering **Design and Analysis of Algorithms (DAA)** curriculum. It bridges theoretical graph algorithms and visual intuition by demonstrating how graph traversals and priority-driven relaxations unfold step by step.

Rather than relying on high-level JavaScript approximations, **all core algorithmic computations, priority-queue logic, and graph traversal decisions are executed in native C++17 compiled to WebAssembly**. React and TypeScript manage the interactive canvas, state visualization, and time-travel playback controls.

---

## 🎯 Problem Being Solved

In standard academic algorithm courses:
1. Students study pseudocode for BFS and Dijkstra on paper but struggle to visualize why priority queues change tentative distances dynamically or why BFS chooses minimum hops over minimum weighted cost.
2. Web visualizers often run JavaScript mockups where algorithm logic is obscured by UI state updates.
3. PathScope provides deterministic, verifiable C++ execution where every algorithmic decision produces an immutable snapshot displaying active vertices, inspected edges, frontier queues/heaps, tentative distance tables, and active pseudocode lines.

---

## ⚖️ Milestone Scope: Completed (50%) vs. Future Scope

This repository represents an **honest academic 50% milestone**. Unimplemented algorithms and advanced features are strictly separated and designated as future scope.

### ✅ Completed in this 50% Milestone
- **Core Algorithms in C++17**:
  - **Breadth-First Search (BFS)**: Unweighted graph traversal using a FIFO queue, finding minimum-hop shortest paths.
  - **Dijkstra's Shortest Path Algorithm**: Greedy single-source shortest path using a Binary Min-Heap Priority Queue with tentative distance relaxation.
- **WebAssembly Engine**:
  - Pure C++17 compiled via Emscripten (`emcc`) using Embind.
  - High-performance, single-boundary batched snapshot generation (`run_bfs_wasm` and `run_dijkstra_wasm`).
  - Pre-execution validation in C++ (negative edge weight rejection for Dijkstra).
- **Interactive Graph Canvas**:
  - Add vertices, drag nodes, connect undirected edges, delete elements.
  - Inline modal for editing non-negative edge weights.
  - Multi-channel accessible state indicators (color, pulsing ring, dashed frontier border, and text badges).
- **Pedagogical Presets (3 Focused Topologies)**:
  1. *BFS vs Dijkstra Tradeoff*: 1 hop with cost 18 vs. 3 hops with cost 7.
  2. *Textbook Weighted Graph*: Classic non-negative 6-node network.
  3. *Disconnected Graph*: Unreachable destination component.
- **Time-Travel Playback Dock**:
  - Play, Pause, Next Step, Previous Step, Restart, Timeline Slider, and Speed Multipliers (0.5x, 1x, 1.5x, 2x, 3x).
- **Synchronized State Inspector**:
  - Live FIFO Queue (BFS) and Binary Min-Heap Priority Queue (Dijkstra).
  - Tentative distance and predecessor table tracking.
  - Active pseudocode line highlighting matching the C++ decision path.
  - Educational step rationale for every state transition.
- **Two-Algorithm Comparison Suite (`/compare`)**:
  - Side-by-side benchmark of BFS and Dijkstra on the identical graph topology.
  - Compares resulting route, hop count, total cost, explored nodes, and WASM step metrics.
- **Automated Test Coverage**:
  - 11 native C++ core algorithm unit tests.
  - 19 frontend and WebAssembly integration tests via Vitest.

### 🔮 Future Scope — Not Implemented in this Milestone
The following features are **intentionally deferred to Phase 2** and are not present as working options in the UI:
- **Depth-First Search (DFS)** with LIFO stack traversal.
- **DAG Shortest Path** using topological sorting for directed acyclic graphs.
- **Floyd–Warshall Algorithm** for all-pairs shortest paths via dynamic programming matrix.
- **Bellman-Ford Algorithm** for negative weight cycles.
- **A* Search Algorithm** with heuristic evaluation.
- **Random, Dense, and Worst-Case Graph Generators**.
- **Challenge / Quiz Mode** for predicting next steps.
- **JSON Graph Import & Export**.
- **Saved Projects & Cloud Persistence**.
- **Web Worker Background Threads** for massive graphs (1000+ nodes).
- **Advanced Recharts Benchmarking Dashboards**.

---

## 💡 Why BFS and Dijkstra Were Selected for Phase 1

1. **Foundational DAA Contrast**: BFS and Dijkstra represent the fundamental duality between **unweighted hop-optimality** and **weighted cost-optimality**.
2. **Pedagogical Invariant**: Demonstrating how BFS selects a 1-hop path of cost 18 while Dijkstra selects a 3-hop path of cost 7 is the primary pedagogical goal of Phase 1.
3. **Data Structure Contrast**: Highlights the difference between a standard FIFO queue ($O(1)$ operations) and a Binary Min-Heap priority queue ($O(\log V)$ insertions and extractions).

---

## 🏗️ C++ & WebAssembly Architecture

```
                 +------------------------------------------------+
                 |       React 19 / TypeScript Presentation       |
                 |  (Graph Canvas, Playback Dock, Inspector UI)   |
                 +------------------------------------------------+
                                        |
                 [Single Batched Call: Graph, Source, Target]
                                        v
                 +------------------------------------------------+
                 |       src/wasm/algorithmEngine.ts (Bridge)     |
                 +------------------------------------------------+
                                        |
                            (Emscripten Embind / WASM)
                                        v
+----------------------------------------------------------------------------------+
|                              C++17 Algorithm Engine                              |
|                                                                                  |
|  +--------------------+   +-----------------------+   +-----------------------+  |
|  |     graph.hpp      |   |        bfs.cpp        |   |     dijkstra.cpp      |  |
|  | - Deterministic    |   | - std::queue          |   | - Min-Heap PQ         |  |
|  |   Adjacency List   |   | - Hop Counting        |   | - Weight Relaxation   |  |
|  | - Undirected/Edges |   | - Immutable Snapshots |   | - Stale Entry Skip    |  |
|  +--------------------+   +-----------------------+   +-----------------------+  |
|                                       |                                          |
|                          +-------------------------+                             |
|                          |      bindings.cpp       |                             |
|                          | - JSON Serializer       |                             |
|                          | - StepSnapshot Vector   |                             |
|                          +-------------------------+                             |
+----------------------------------------------------------------------------------+
                                        |
                      [Immutable StepSnapshot[] Sequence]
                                        v
                 +------------------------------------------------+
                 |         React Playback & State Rendering       |
                 +------------------------------------------------+
```

### Boundary Design
- **Single-Call Invocation**: JavaScript serializes the entire graph topology, source vertex, and destination vertex into a JSON payload and passes it in one boundary crossing to C++.
- **Zero JS Per-Node Callback**: C++ runs the algorithm to completion, records all state transitions into a `std::vector<StepSnapshot>`, and returns the complete immutable array.
- **No Algorithm Duplication**: React does not reconstruct paths or manage priority queues.

---

## 📁 Repository Structure

```
.
├── cpp/                           # Native C++17 Algorithm Engine
│   ├── include/
│   │   ├── algorithm_types.hpp    # StepSnapshot, DataStructureItem models
│   │   ├── bfs.hpp                # BFS interface
│   │   ├── dijkstra.hpp           # Dijkstra interface
│   │   └── graph.hpp              # Node, Edge, Graph, and Adjacency models
│   ├── src/
│   │   ├── bfs.cpp                # Pure C++ BFS implementation
│   │   ├── dijkstra.cpp           # Pure C++ Dijkstra with min-heap
│   │   └── bindings.cpp           # Embind WASM exports and JSON serializer
│   ├── tests/
│   │   └── algorithm_tests.cpp    # 11 Native C++ algorithm unit tests
│   └── CMakeLists.txt             # CMake configuration for native tests & WASM
│
├── scripts/
│   ├── build-wasm.js              # Cross-platform Emscripten WASM build script
│   └── test-cpp.js                # Native GCC test compiler and runner
│
├── src/
│   ├── wasm/                      # TypeScript WebAssembly bridge
│   │   ├── algorithmEngine.ts     # Typed module loader and executor
│   │   └── generated/             # Generated WASM binaries and type definitions
│   ├── types/
│   │   └── graph.ts               # Core TypeScript data contracts
│   ├── hooks/
│   │   └── useAlgorithmPlayback.ts # Playback hook consuming C++ snapshots
│   ├── components/
│   │   ├── Canvas/                # React Flow canvas, custom nodes and edges
│   │   ├── InfoPanel/             # Inspector, pseudocode, and data structure views
│   │   ├── Navigation/            # TopNav, GuideModal, ComingSoonModal
│   │   ├── Playback/              # PlaybackBar dock
│   │   └── Sidebar/               # AlgorithmSelector, GraphTools, NodeSelector
│   ├── pages/
│   │   ├── HomePage.tsx           # Landing page with 50% milestone disclosure
│   │   ├── VisualizerPage.tsx     # Full interactive visualizer workbench
│   │   ├── ComparisonPage.tsx     # BFS vs Dijkstra benchmark suite
│   │   ├── AlgorithmsPage.tsx     # In-depth algorithmic complexity analysis
│   │   ├── LearnPage.tsx          # Graph theory educational fundamentals
│   │   └── AboutPage.tsx          # Architecture, scope boundaries, and roadmap
│   └── data/
│       ├── algorithmsInfo.ts      # Active and future algorithm metadata
│       └── presetGraphs.ts        # 3 Pedagogical presets
│
├── public/wasm/                   # Static WebAssembly assets for web deployment
├── index.html                     # HTML root with local typography imports
└── package.json                   # Build scripts and dependencies
```

---

## 📊 Algorithm Theoretical Complexities

| Algorithm | Engine | Category | Time Complexity | Auxiliary Space | Optimality Guarantee |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Breadth-First Search (BFS)** | C++17 WASM | Unweighted Traversal | $\mathcal{O}(V + E)$ | $\mathcal{O}(V)$ | **Guarantees minimum hops** (edge count). Ignores numeric edge weights. |
| **Dijkstra's Algorithm** | C++17 WASM | Single-Source Shortest Path | $\mathcal{O}((V + E) \log V)$ | $\mathcal{O}(V + E)$ | **Guarantees minimum total weight** for non-negative graphs ($w \ge 0$). Rejects $w < 0$. |

---

## 🛠️ Installation & Setup Prerequisites

### Prerequisites
1. **Node.js**: v18 or higher (v20+ recommended).
2. **C++17 Compiler**: GCC / MinGW / Clang (for native C++ unit tests).
3. **Emscripten SDK (`emsdk`)**: For compiling C++ to WebAssembly.

### Emscripten Setup
If Emscripten is not already installed on your system:
```bash
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
# On Windows PowerShell:
.\emsdk_env.ps1
```

---

## 🚀 Development & Build Commands

### 1. Install Node Dependencies
```bash
npm install
```

### 2. Compile C++ to WebAssembly
```bash
npm run build:wasm
```
*Compiles `cpp/src/*.cpp` into `src/wasm/generated/algorithm_wasm.js` and `.wasm` and synchronizes artifacts to `public/wasm/`.*

### 3. Run Automated Tests
```bash
npm run test
```
*Compiles and runs the 11 native C++ core algorithm tests, followed by the 19 Vitest integration tests (30 total tests).*

To run only the native C++ unit tests:
```bash
npm run test:cpp
```

### 4. Code Quality & Linting
```bash
npm run lint
```
*Evaluates frontend TypeScript and React code using Oxlint (0 errors, 0 warnings).*

### 5. Production Build
```bash
npm run build
```
*Automatically triggers `build:wasm`, runs TypeScript typechecking (`tsc -b`), and bundles production assets via Vite.*

### 6. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📸 Interface Screenshots

| Screen | View | Description |
| :--- | :--- | :--- |
| **Home Page** | `/` | Concise project explanation, 50% milestone disclosure, and BFS & Dijkstra cards. |
| **Visualizer Workbench** | `/visualizer` | Interactive canvas with custom node badges, playback dock, FIFO queue, and min-heap inspector. |
| **Algorithm Comparison** | `/compare` | Side-by-side benchmark contrasting minimum hops vs. minimum total weight on identical graphs. |
| **Algorithms In-Depth** | `/algorithms` | Detailed mathematical formulations, pseudocode, and real-world software applications. |
| **About & Roadmap** | `/about` | Complete audit of completed features versus deferred Phase 2 scope. |

---

## ⚠️ Known Limitations

1. **Non-Negative Weights**: Dijkstra strictly requires $w \ge 0$. If an edge with $w < 0$ is introduced, the C++ engine rejects the graph before execution and alerts the user. Negative weight graphs require Bellman-Ford (planned for Phase 2).
2. **Algorithm Scope**: Only BFS and Dijkstra are implemented. Selecting or configuring DFS, DAG, or Floyd–Warshall is unavailable in this milestone.
3. **Graph Persistence**: Graphs are maintained in client memory during the session; JSON file saving and local storage persistence are deferred to Phase 2.

---

## 📄 License & Coursework Notice

Developed for the **Design and Analysis of Algorithms (DAA)** coursework.
Academic Milestone 1 (50% Milestone Release).
