import React, { useState, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import {
  GitCompare,
  AlertTriangle,
  Info,
  Layers,
  Clock,
  HardDrive,
  Footprints,
  Compass,
} from 'lucide-react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData } from '../types/graph';
import { PRESET_GRAPHS } from '../data/presetGraphs';
import { ALGORITHMS_METADATA } from '../data/algorithmsInfo';
import { runBFS } from '../algorithms/bfs';
import { runDFS } from '../algorithms/dfs';
import { runDijkstra } from '../algorithms/dijkstra';
import { runDAGShortestPath } from '../algorithms/dag';
import { runFloydWarshall } from '../algorithms/floydWarshall';

interface ComparisonPageProps {
  theme: 'dark' | 'light';
}

interface AlgorithmResult {
  id: AlgorithmType;
  name: string;
  category: string;
  pathFound: boolean;
  pathString: string;
  totalCost: number | null;
  hopCount: number | null;
  visitedCount: number;
  stepsCount: number;
  timeComplexity: string;
  spaceComplexity: string;
  guarantee: string;
  warning?: string;
  status: string;
  errorNote?: string;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  // Selected Preset
  const [selectedPresetId, setSelectedPresetId] = useState<string>('textbook-classic');
  const currentPreset = useMemo(
    () => PRESET_GRAPHS.find((p) => p.id === selectedPresetId) || PRESET_GRAPHS[0],
    [selectedPresetId]
  );

  // Active source and destination
  const [sourceId, setSourceId] = useState<string>(currentPreset.sourceId);
  const [targetId, setTargetId] = useState<string>(currentPreset.targetId);

  // Sync source and target when preset changes
  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const p = PRESET_GRAPHS.find((item) => item.id === presetId);
    if (p) {
      setSourceId(p.sourceId);
      setTargetId(p.targetId);
    }
  };

  // Enabled algorithms for comparison
  const [enabledAlgos, setEnabledAlgos] = useState<Record<AlgorithmType, boolean>>({
    bfs: true,
    dfs: true,
    dijkstra: true,
    dag: true,
    'floyd-warshall': true,
  });

  const toggleAlgo = (id: AlgorithmType) => {
    setEnabledAlgos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Run all enabled algorithms on the preset graph
  const comparisonResults = useMemo<AlgorithmResult[]>(() => {
    const nodes: Node<GraphNodeData>[] = currentPreset.nodes;
    const edges: Edge<GraphEdgeData>[] = currentPreset.edges;
    const nodeMap = new Map(nodes.map((n) => [n.id, n.data.label || n.id]));
    const getLabel = (id: string) => nodeMap.get(id) || id;

    const results: AlgorithmResult[] = [];

    // Helper for path formatting
    const formatPath = (pathNodes: string[]) => {
      if (!pathNodes || pathNodes.length === 0) return 'No Path Found';
      return pathNodes.map(getLabel).join(' → ');
    };

    // 1. BFS
    if (enabledAlgos.bfs) {
      const snapshots = runBFS(nodes, edges, sourceId, targetId);
      const last = snapshots[snapshots.length - 1];
      const found = last?.status === 'found';
      results.push({
        id: 'bfs',
        name: ALGORITHMS_METADATA.bfs.name,
        category: 'Unweighted Traversal',
        pathFound: found,
        pathString: found ? formatPath(last.pathNodes) : 'Target Unreachable',
        totalCost: found ? (last.totalCost ?? null) : null,
        hopCount: found ? (last.hopCount ?? (last.pathNodes.length > 0 ? last.pathNodes.length - 1 : null)) : null,
        visitedCount: last ? new Set(snapshots.flatMap((s) => s.visitedNodes)).size : 0,
        stepsCount: snapshots.length,
        timeComplexity: ALGORITHMS_METADATA.bfs.timeComplexity.worst,
        spaceComplexity: ALGORITHMS_METADATA.bfs.spaceComplexity,
        guarantee: 'Guarantees MINIMUM HOPS. Ignores numeric edge weights.',
        warning: 'Treats all edges as unit cost 1. May not be minimum weight path.',
        status: last?.status || 'unreachable',
      });
    }

    // 2. DFS
    if (enabledAlgos.dfs) {
      const snapshots = runDFS(nodes, edges, sourceId, targetId);
      const last = snapshots[snapshots.length - 1];
      const found = last?.status === 'found';
      results.push({
        id: 'dfs',
        name: ALGORITHMS_METADATA.dfs.name,
        category: 'Deep Exploration',
        pathFound: found,
        pathString: found ? formatPath(last.pathNodes) : 'Target Unreachable',
        totalCost: found ? (last.totalCost ?? null) : null,
        hopCount: found ? (last.hopCount ?? (last.pathNodes.length > 0 ? last.pathNodes.length - 1 : null)) : null,
        visitedCount: last ? new Set(snapshots.flatMap((s) => s.visitedNodes)).size : 0,
        stepsCount: snapshots.length,
        timeComplexity: ALGORITHMS_METADATA.dfs.timeComplexity.worst,
        spaceComplexity: ALGORITHMS_METADATA.dfs.spaceComplexity,
        guarantee: 'Finds ANY connected path. NO guarantee of optimality.',
        warning: 'CRITICAL: DFS does NOT guarantee shortest path or lowest cost!',
        status: last?.status || 'unreachable',
      });
    }

    // 3. Dijkstra
    if (enabledAlgos.dijkstra) {
      const hasNegativeEdge = edges.some((e) => Number(e.data?.weight ?? 1) < 0);
      const snapshots = runDijkstra(nodes, edges, sourceId, targetId);
      const last = snapshots[snapshots.length - 1];
      const found = last?.status === 'found';
      results.push({
        id: 'dijkstra',
        name: ALGORITHMS_METADATA.dijkstra.name,
        category: 'Single-Source Shortest Path',
        pathFound: found,
        pathString: found ? formatPath(last.pathNodes) : 'Target Unreachable',
        totalCost: found ? (last.totalCost ?? null) : null,
        hopCount: found ? (last.hopCount ?? (last.pathNodes.length > 0 ? last.pathNodes.length - 1 : null)) : null,
        visitedCount: last ? new Set(snapshots.flatMap((s) => s.visitedNodes)).size : 0,
        stepsCount: snapshots.length,
        timeComplexity: ALGORITHMS_METADATA.dijkstra.timeComplexity.worst,
        spaceComplexity: ALGORITHMS_METADATA.dijkstra.spaceComplexity,
        guarantee: 'Guarantees MINIMUM TOTAL WEIGHT for non-negative graphs.',
        warning: hasNegativeEdge ? 'WARNING: Graph contains negative weights; Dijkstra results may be invalid.' : undefined,
        status: last?.status || 'unreachable',
      });
    }

    // 4. DAG Shortest Path
    if (enabledAlgos.dag) {
      const snapshots = runDAGShortestPath(nodes, edges, sourceId, targetId);
      const last = snapshots[snapshots.length - 1];
      const isCycle = last?.status === 'cycle-detected';
      const found = last?.status === 'found';
      results.push({
        id: 'dag',
        name: ALGORITHMS_METADATA.dag.name,
        category: 'Directed Acyclic Shortest Path',
        pathFound: found,
        pathString: isCycle ? 'Cycle Detected (Not a DAG)' : found ? formatPath(last.pathNodes) : 'Target Unreachable',
        totalCost: found ? (last.totalCost ?? null) : null,
        hopCount: found ? (last.hopCount ?? (last.pathNodes.length > 0 ? last.pathNodes.length - 1 : null)) : null,
        visitedCount: last ? new Set(snapshots.flatMap((s) => s.visitedNodes)).size : 0,
        stepsCount: snapshots.length,
        timeComplexity: ALGORITHMS_METADATA.dag.timeComplexity.worst,
        spaceComplexity: ALGORITHMS_METADATA.dag.spaceComplexity,
        guarantee: 'Guarantees MINIMUM TOTAL WEIGHT in linear O(V+E) time, supports negative weights.',
        warning: isCycle ? 'Graph contains cycles! Topological sort failed.' : 'Requires strictly directed acyclic graph.',
        status: last?.status || 'unreachable',
      });
    }

    // 5. Floyd-Warshall
    if (enabledAlgos['floyd-warshall']) {
      // Respect whether preset is intended as directed
      const isDirected = currentPreset.id === 'dag-network';
      const snapshots = runFloydWarshall(nodes, edges, sourceId, targetId, isDirected);
      const last = snapshots[snapshots.length - 1];
      const isCycle = last?.status === 'cycle-detected';
      const found = last?.status === 'found';
      results.push({
        id: 'floyd-warshall',
        name: ALGORITHMS_METADATA['floyd-warshall'].name,
        category: 'All-Pairs Shortest Path',
        pathFound: found,
        pathString: isCycle ? 'Negative Cycle Detected' : found ? formatPath(last.pathNodes) : 'Target Unreachable',
        totalCost: found ? (last.totalCost ?? null) : null,
        hopCount: found ? (last.hopCount ?? (last.pathNodes.length > 0 ? last.pathNodes.length - 1 : null)) : null,
        visitedCount: nodes.length,
        stepsCount: snapshots.length,
        timeComplexity: ALGORITHMS_METADATA['floyd-warshall'].timeComplexity.worst,
        spaceComplexity: ALGORITHMS_METADATA['floyd-warshall'].spaceComplexity,
        guarantee: 'Computes ALL-PAIRS shortest paths simultaneously via DP matrix.',
        warning: isCycle ? 'Negative-weight cycle detected! Shortest paths undefined.' : 'O(V³) complexity makes it suitable for small/dense networks.',
        status: last?.status || 'unreachable',
      });
    }

    return results;
  }, [currentPreset, sourceId, targetId, enabledAlgos]);

  return (
    <div className={`min-h-[calc(100vh-4rem)] overflow-y-auto px-6 py-10 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 border bg-blue-500/10 border-blue-500/30 text-blue-400">
            <GitCompare className="w-3.5 h-3.5" />
            <span>Multi-Algorithm Benchmark & Analysis</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Algorithm Comparison Suite
          </h1>
          <p className={`mt-2 text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Run multiple graph algorithms side by side on identical test topologies to benchmark path cost, hop counts, visited nodes, and computational steps.
          </p>
        </div>

        {/* Configuration Bar */}
        <div className={`p-5 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Preset Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Benchmark Graph Topology
              </label>
              <select
                value={selectedPresetId}
                onChange={(e) => handlePresetChange(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                {PRESET_GRAPHS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.nodes.length} nodes, {p.edges.length} edges)
                  </option>
                ))}
              </select>
            </div>

            {/* Source Node */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Source Vertex (S)
              </label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                {currentPreset.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.data.label || n.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Node */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Destination Vertex (T)
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                {currentPreset.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.data.label || n.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Algorithm Toggles */}
          <div className="mt-4 pt-4 border-t border-slate-500/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2">Include in Comparison:</span>
            {(
              [
                { id: 'bfs', label: 'BFS' },
                { id: 'dfs', label: 'DFS' },
                { id: 'dijkstra', label: 'Dijkstra' },
                { id: 'dag', label: 'DAG Linear' },
                { id: 'floyd-warshall', label: 'Floyd–Warshall' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                onClick={() => toggleAlgo(item.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  enabledAlgos[item.id]
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : isDark
                    ? 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisonResults.map((res) => (
            <div
              key={res.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-500/10">
                  <div>
                    <h2 className="text-base font-bold">{res.name}</h2>
                    <span className="text-[11px] text-slate-400">{res.category}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      res.status === 'found'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : res.status === 'cycle-detected'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {res.status === 'found' ? 'Path Found' : res.status === 'cycle-detected' ? 'Cycle Detected' : 'Unreachable'}
                  </span>
                </div>

                {/* Path String */}
                <div className="mt-4 p-3 rounded-xl bg-slate-500/5 border border-slate-500/10 font-mono text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Resulting Route</div>
                  <div className={`font-semibold ${res.pathFound ? 'text-blue-400' : 'text-slate-400'}`}>
                    {res.pathString}
                  </div>
                </div>

                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <Compass className="w-3 h-3 text-emerald-400" />
                      <span>Total Cost</span>
                    </div>
                    <div className="text-sm font-bold mt-0.5 font-mono">
                      {res.totalCost !== null ? res.totalCost : 'N/A'}
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <Footprints className="w-3 h-3 text-blue-400" />
                      <span>Hop Count</span>
                    </div>
                    <div className="text-sm font-bold mt-0.5 font-mono">
                      {res.hopCount !== null ? `${res.hopCount} hops` : 'N/A'}
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <Layers className="w-3 h-3 text-amber-400" />
                      <span>Explored Nodes</span>
                    </div>
                    <div className="text-sm font-bold mt-0.5 font-mono">
                      {res.visitedCount} nodes
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                      <Clock className="w-3 h-3 text-purple-400" />
                      <span>Snapshot Steps</span>
                    </div>
                    <div className="text-sm font-bold mt-0.5 font-mono">
                      {res.stepsCount} steps
                    </div>
                  </div>
                </div>

                {/* Complexities */}
                <div className="mt-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Time:
                    </span>
                    <span className="font-mono font-semibold text-slate-200">{res.timeComplexity}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" /> Space:
                    </span>
                    <span className="font-mono font-semibold text-slate-200">{res.spaceComplexity}</span>
                  </div>
                </div>
              </div>

              {/* Guarantees & Warnings */}
              <div className="mt-4 pt-3 border-t border-slate-500/10 space-y-2">
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-300">Guarantee: </span>
                  {res.guarantee}
                </div>

                {res.warning && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-1.5 leading-snug">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                    <span>{res.warning}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Theoretical Takeaway & Comparison Insights */}
        <div className={`p-6 sm:p-8 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold">Key DAA Comparison Takeaways</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-blue-400">1. Shortest Hops vs. Minimum Weight</h3>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                BFS optimizes for the <strong>hop count</strong> (minimum number of edges traversed), disregarding edge weights. Dijkstra optimizes strictly for the <strong>sum of weights</strong>. A path with 4 hops can have a lower total weight than a direct 1-hop path with weight 50.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-amber-400">2. DFS Path Guarantee Warning</h3>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Depth-First Search (DFS) provides <strong>NO optimality guarantee</strong> for path length or cost. It explores arbitrarily deep along the first branch it encounters. While it will find a path if one exists, that path is almost always suboptimal for routing.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-emerald-400">3. When to Choose DAG vs. Floyd–Warshall</h3>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                If your graph is guaranteed acyclic (DAG), the linear <strong>O(V + E)</strong> DAG algorithm outperforms Dijkstra and easily handles negative weights. For computing all-pairs shortest paths on small/medium dense graphs, <strong>Floyd–Warshall O(V³)</strong> calculates all distances in a single matrix pass.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
