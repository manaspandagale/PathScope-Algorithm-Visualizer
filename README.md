# PathScope — Interactive Shortest Path Algorithm Visualizer

A comprehensive, production-grade Computer Engineering Design and Analysis of Algorithms (DAA) course project built with React, TypeScript, Vite, Tailwind CSS, and React Flow (`@xyflow/react`).

PathScope bridges theoretical algorithmic analysis and intuitive visual learning, enabling students and engineers to construct custom graphs, observe deterministic step-by-step executions, inspect underlying data structures, and benchmark algorithms side-by-side.

---

## 🌟 Key Features

### 1. Interactive Graph Visualizer
- **Dynamic Graph Editor**: Add vertices (`A`, `B`, `C`...), drag nodes with physics layout, delete vertices, connect directional handles, and edit edge weights with real-time validation.
- **Custom React Flow Rendering**: High-contrast dark and light mode node states (Source, Destination, Active Frontier, Visited, and Shortest Path).
- **Pedagogical Presets**:
  - *DAA Textbook Classic (7 Nodes)*
  - *Dijkstra vs BFS Tradeoff (1 hop cost 18 vs 3 hops cost 7)*
  - *Disconnected Graph (Unreachable Destination)*
  - *Binary / Branching Graph (DFS vs BFS comparison)*
  - *DAG Shortest Path with Negative Weights*
  - *Floyd–Warshall 4-Node Dense Network*
- **Time-Travel Playback Controls**: Play, pause, step forward, step backward, restart, timeline scrubber, and speed multipliers (0.5x to 3x).
- **Synchronized Data Structure Inspector**:
  - Pseudocode with active line-by-line highlight
  - Live data structure display: FIFO Queue, LIFO Stack, Min-Heap Priority Queue, Topological Ordering Chain, and 2D Floyd–Warshall Distance Matrix ($k, i, j$ cell highlighting).

### 2. Multi-Page Educational Architecture
- **Home (`/`)**: Hero overview, interactive introduction cards, algorithm highlights, and quick access.
- **Visualizer (`/visualizer`)**: Full-featured interactive canvas, graph editor, playback controls, and state inspector.
- **Algorithms (`/algorithms`)**: In-depth theoretical principles, time & space complexities, working mechanics, and real-world software engineering applications.
- **Algorithm Comparison (`/compare`)**: Side-by-side benchmarking suite comparing multiple algorithms simultaneously on identical graph topologies.
- **Learn (`/learn`)**: Beginner-friendly fundamentals covering graph theory, queues, stacks, heaps, DAG topological ordering, and dynamic programming formulations.
- **About (`/about`)**: Architecture overview, project specifications, design choices, and academic references.

---

## 🧮 Implemented Graph Algorithms

PathScope implements 5 foundational graph algorithms with deterministic step snapshot recording:

| Algorithm | Category | Time Complexity | Space Complexity | Optimality Guarantee |
| :--- | :--- | :--- | :--- | :--- |
| **Breadth-First Search (BFS)** | Unweighted Traversal | $O(V + E)$ | $O(V)$ | **Guarantees minimum hops** (edge count). Ignores numeric edge weights. |
| **Depth-First Search (DFS)** | Graph Traversal | $O(V + E)$ | $O(V)$ | **No optimality guarantee**. Discovers any connected path along arbitrary branch order. |
| **Dijkstra's Algorithm** | Single-Source Shortest Path | $O((V + E) \log V)$ | $O(V)$ | **Guarantees minimum total weight** for non-negative edge graphs ($w \ge 0$). |
| **DAG Shortest Path** | Single-Source (Acyclic) | $O(V + E)$ | $O(V)$ | **Guarantees minimum total weight in linear time** using topological sort. Supports negative weights. Detects cycles. |
| **Floyd–Warshall Algorithm** | All-Pairs Shortest Path | $O(V^3)$ | $O(V^2)$ | **Computes shortest paths between all vertex pairs** via dynamic programming. Detects negative cycles ($dist[i][i] < 0$). |

---

## ⚖️ Algorithm Comparison Suite (`/compare`)

The dedicated **Comparison Suite** allows benchmarking algorithms on the same graph topology with identical source and destination pairs:

- **Metrics Compared**:
  - **Resulting Route**: Exact vertex traversal sequence or unreachable status.
  - **Total Path Cost**: True weighted sum vs. hop cost.
  - **Hop Count**: Total number of edges traversed.
  - **Explored Vertices**: Number of unique nodes inspected.
  - **Snapshot Count**: Total discrete algorithmic steps taken.
  - **Theoretical Complexity**: Asymptotic time and space bounds.
- **Educational Takeaways**:
  - Clear distinction between *minimum hops* (BFS) and *minimum numeric weight* (Dijkstra).
  - Explicit warnings that DFS provides **no shortest path guarantees**.
  - When to prefer linear DAG relaxation over Dijkstra or Floyd–Warshall.

---

## 💻 Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Tooling**: Vite 8
- **Graph Canvas & Flow**: `@xyflow/react` (React Flow)
- **Styling**: Tailwind CSS + Custom CSS Variables (Glassmorphism & Dark/Light modes)
- **Icons**: Lucide React
- **Testing**: Vitest
- **Linter**: Oxlint

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Clone Repository
```bash
git clone https://github.com/manaspandagale/PathScope-Algorithm-Visualizer.git
cd PathScope-Algorithm-Visualizer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Testing & Validation

Run unit tests:
```bash
npm run test
```

Run linter:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

### Test Suite Coverage (17 Passing Tests)
- `src/tests/priorityQueue.test.ts`: Min-Heap insertion, extraction, ordering invariants.
- `src/tests/bfs.test.ts`: Minimum hop path discovery, unreachable destination, trivial source === target.
- `src/tests/dfs.test.ts`: Deep branch traversal, backtracking tracking, disconnected component handling.
- `src/tests/dijkstra.test.ts`: Optimal weight path with higher hops, distance relaxation, unreachable nodes.
- `src/tests/dag.test.ts`: Linear topological relaxation, negative edge weights, cycle detection error handling.
- `src/tests/floydWarshall.test.ts`: All-pairs distance matrix computation, negative cycle detection, disconnected pairs.

---

## 📸 Screenshots

| Feature | Description |
| :--- | :--- |
| **Interactive Visualizer** | Live graph editor with custom node highlights, playback timeline, and data structure inspector. |
| **Algorithm Comparison** | Side-by-side metric benchmarking of BFS, DFS, Dijkstra, DAG, and Floyd–Warshall. |
| **Algorithms Deep-Dive** | Mathematical and practical analysis of time/space complexity, pseudocode, and engineering applications. |
| **Fundamentals Guide** | Beginner-friendly explanations of graph theory, queues, heaps, and dynamic programming. |

---

## 🔮 Future Scope

- **Challenge & Quiz Mode**: Interactive graph puzzles where learners predict the next visited vertex or shortest path before revealing the solution.
- **JSON Graph Import & Export**: Save, export, and load custom graph topologies and weight matrices via JSON.
- **Bellman-Ford Algorithm**: Step-by-step visualizer for general graphs with negative weights and negative cycle detection.
- **A* Search Algorithm**: Heuristic-driven pathfinding visualizer with Euclidean and Manhattan distance metrics.

---

## 📄 License

This project is open-source and developed for the Design and Analysis of Algorithms (DAA) coursework.
