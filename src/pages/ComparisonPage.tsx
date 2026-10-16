import React, { useState, useEffect, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import {
  GitCompare,
  Loader2,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';
import { PRESET_GRAPHS } from '../data/presetGraphs';
import { ALGORITHMS_METADATA } from '../data/algorithmsInfo';
import { executeAlgorithmWasm } from '../wasm/algorithmEngine';

interface ComparisonPageProps {
  theme: 'dark' | 'light';
}

interface BenchmarkResult {
  id: AlgorithmType;
  name: string;
  pathFound: boolean;
  pathString: string;
  totalCost: number | null;
  hopCount: number | null;
  visitedCount: number;
  stepsCount: number;
  timeComplexity: string;
  spaceComplexity: string;
  guarantee: string;
  status: string;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = () => {
  // Selected Preset
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bfs-vs-dijkstra-tradeoff');
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

  const [bfsSnapshots, setBfsSnapshots] = useState<StepSnapshot[]>([]);
  const [dijkstraSnapshots, setDijkstraSnapshots] = useState<StepSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Run BFS and Dijkstra simultaneously via C++ WebAssembly
  useEffect(() => {
    let isCancelled = false;
    const runBenchmarks = async () => {
      setIsLoading(true);
      try {
        const nodes: Node<GraphNodeData>[] = currentPreset.nodes;
        const edges: Edge<GraphEdgeData>[] = currentPreset.edges;

        const [bfsRes, dijkstraRes] = await Promise.all([
          executeAlgorithmWasm('bfs', nodes, edges, sourceId, targetId, false),
          executeAlgorithmWasm('dijkstra', nodes, edges, sourceId, targetId, false),
        ]);

        if (!isCancelled) {
          setBfsSnapshots(bfsRes);
          setDijkstraSnapshots(dijkstraRes);
        }
      } catch (err) {
        console.error('Error executing comparison benchmarks via C++ WASM:', err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    runBenchmarks();

    return () => {
      isCancelled = true;
    };
  }, [currentPreset, sourceId, targetId]);

  const results = useMemo<Record<'bfs' | 'dijkstra', BenchmarkResult>>(() => {
    const nodes = currentPreset.nodes;
    const nodeMap = new Map(nodes.map((n) => [n.id, n.data.label || n.id]));
    const getLabel = (id: string) => nodeMap.get(id) || id;

    const formatPath = (pathNodes: string[]) => {
      if (!pathNodes || pathNodes.length === 0) return 'No Path Discovered';
      return pathNodes.map(getLabel).join(' → ');
    };

    // BFS
    const lastBfs = bfsSnapshots[bfsSnapshots.length - 1];
    const bfsFound = lastBfs?.status === 'found';
    const bfs: BenchmarkResult = {
      id: 'bfs',
      name: ALGORITHMS_METADATA.bfs.name,
      pathFound: bfsFound,
      pathString: bfsFound ? formatPath(lastBfs.pathNodes) : 'Target Unreachable',
      totalCost: bfsFound ? (lastBfs.totalCost ?? null) : null,
      hopCount: bfsFound ? (lastBfs.hopCount ?? (lastBfs.pathNodes.length > 0 ? lastBfs.pathNodes.length - 1 : null)) : null,
      visitedCount: lastBfs ? new Set(bfsSnapshots.flatMap((s) => s.visitedNodes)).size : 0,
      stepsCount: bfsSnapshots.length,
      timeComplexity: ALGORITHMS_METADATA.bfs.timeComplexity.worst,
      spaceComplexity: ALGORITHMS_METADATA.bfs.spaceComplexity,
      guarantee: 'Guarantees MINIMUM HOPS. Disregards numeric edge weights.',
      status: lastBfs?.status || 'unreachable',
    };

    // Dijkstra
    const lastDijkstra = dijkstraSnapshots[dijkstraSnapshots.length - 1];
    const dijkstraFound = lastDijkstra?.status === 'found';
    const dijkstra: BenchmarkResult = {
      id: 'dijkstra',
      name: ALGORITHMS_METADATA.dijkstra.name,
      pathFound: dijkstraFound,
      pathString: dijkstraFound ? formatPath(lastDijkstra.pathNodes) : 'Target Unreachable',
      totalCost: dijkstraFound ? (lastDijkstra.totalCost ?? null) : null,
      hopCount: dijkstraFound ? (lastDijkstra.hopCount ?? (lastDijkstra.pathNodes.length > 0 ? lastDijkstra.pathNodes.length - 1 : null)) : null,
      visitedCount: lastDijkstra ? new Set(dijkstraSnapshots.flatMap((s) => s.visitedNodes)).size : 0,
      stepsCount: dijkstraSnapshots.length,
      timeComplexity: ALGORITHMS_METADATA.dijkstra.timeComplexity.worst,
      spaceComplexity: ALGORITHMS_METADATA.dijkstra.spaceComplexity,
      guarantee: 'Guarantees MINIMUM TOTAL WEIGHT for non-negative graphs (w ≥ 0).',
      status: lastDijkstra?.status || 'unreachable',
    };

    return { bfs, dijkstra };
  }, [currentPreset, bfsSnapshots, dijkstraSnapshots]);

  return (
    <div
      className="min-h-[calc(100vh-68px)] overflow-y-auto px-6 py-12"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono font-medium mb-4 border"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border-strong)',
              color: 'var(--text-secondary)',
            }}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--accent)' }} />
            ) : (
              <GitCompare className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            )}
            <span>C++ Engine Dual Execution Benchmark</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            BFS vs. Dijkstra Comparison
          </h1>
          <p
            className="mt-2 text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Both algorithms execute simultaneously on the identical graph topology inside native WebAssembly. Observe the structural differences between hop-optimality and weight-optimality.
          </p>
        </div>

        {/* Shared Graph Configuration Bar */}
        <div
          className="p-5 rounded-lg border"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-xs font-mono font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Benchmark Graph Topology
              </label>
              <select
                value={selectedPresetId}
                onChange={(e) => handlePresetChange(e.target.value)}
                aria-label="Benchmark Graph Topology"
                className="w-full px-3 py-2.5 rounded-md border text-sm font-semibold cursor-pointer focus-visible:outline-none min-h-[44px]"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-primary)',
                }}
              >
                {PRESET_GRAPHS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-xs font-mono font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Source Vertex (S)
              </label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                aria-label="Source Vertex"
                className="w-full px-3 py-2.5 rounded-md border font-mono text-sm font-semibold cursor-pointer focus-visible:outline-none min-h-[44px]"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-primary)',
                }}
              >
                {currentPreset.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    Vertex {n.data.label || n.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-xs font-mono font-bold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Destination Vertex (T)
              </label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                aria-label="Destination Vertex"
                className="w-full px-3 py-2.5 rounded-md border font-mono text-sm font-semibold cursor-pointer focus-visible:outline-none min-h-[44px]"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border-strong)',
                  color: 'var(--text-primary)',
                }}
              >
                {currentPreset.nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    Vertex {n.data.label || n.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Structured Side-by-Side Comparison Table */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border-strong)',
          }}
        >
          {/* Column Headers */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div className="p-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Algorithm 01
              </span>
              <h2 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--text-primary)' }}>
                {results.bfs.name}
              </h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                FIFO Queue • Unweighted Level-Order Traversal
              </p>
            </div>

            <div className="p-6">
              <span className="text-xs font-mono font-bold uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>
                Algorithm 02
              </span>
              <h2 className="text-2xl font-bold tracking-tight mt-1" style={{ color: 'var(--text-primary)' }}>
                {results.dijkstra.name}
              </h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Binary Min-Heap • Greedy Edge Relaxation
              </p>
            </div>
          </div>

          {/* Metric Row: Resulting Path */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="p-5 space-y-1">
              <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                Resulting Traversal Path
              </div>
              <div className="font-mono text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                {results.bfs.pathString}
              </div>
            </div>
            <div className="p-5 space-y-1">
              <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                Resulting Traversal Path
              </div>
              <div className="font-mono text-base font-bold" style={{ color: 'var(--accent)' }}>
                {results.dijkstra.pathString}
              </div>
            </div>
          </div>

          {/* Metric Row: Numeric Cost & Hop Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="p-5 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                  Total Numeric Cost
                </div>
                <div className="font-mono text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {results.bfs.totalCost !== null ? results.bfs.totalCost : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                  Hop Count
                </div>
                <div className="font-mono text-2xl font-bold mt-1" style={{ color: 'var(--secondary-accent)' }}>
                  {results.bfs.hopCount !== null ? `${results.bfs.hopCount} hops` : 'N/A'}
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                  Total Numeric Cost
                </div>
                <div className="font-mono text-2xl font-bold mt-1" style={{ color: 'var(--success)' }}>
                  {results.dijkstra.totalCost !== null ? results.dijkstra.totalCost : 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>
                  Hop Count
                </div>
                <div className="font-mono text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
                  {results.dijkstra.hopCount !== null ? `${results.dijkstra.hopCount} hops` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Metric Row: Explored Vertices & C++ WASM Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="p-5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-mono uppercase text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Explored Nodes:
                </span>
                <span className="font-mono font-bold block text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {results.bfs.visitedCount} vertices
                </span>
              </div>
              <div>
                <span className="font-mono uppercase text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  WASM Snapshots:
                </span>
                <span className="font-mono font-bold block text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {results.bfs.stepsCount} steps
                </span>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-mono uppercase text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  Explored Nodes:
                </span>
                <span className="font-mono font-bold block text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {results.dijkstra.visitedCount} vertices
                </span>
              </div>
              <div>
                <span className="font-mono uppercase text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  WASM Snapshots:
                </span>
                <span className="font-mono font-bold block text-sm mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {results.dijkstra.stepsCount} steps
                </span>
              </div>
            </div>
          </div>

          {/* Metric Row: Complexities */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-b text-xs font-mono" style={{ borderColor: 'var(--border)' }}>
            <div className="p-5 space-y-2">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Time Complexity:</span>
                <span className="font-bold">{results.bfs.timeComplexity}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Space Complexity:</span>
                <span className="font-bold">{results.bfs.spaceComplexity}</span>
              </div>
            </div>

            <div className="p-5 space-y-2">
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Time Complexity:</span>
                <span className="font-bold">{results.dijkstra.timeComplexity}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--text-muted)' }}>Space Complexity:</span>
                <span className="font-bold">{results.dijkstra.spaceComplexity}</span>
              </div>
            </div>
          </div>

          {/* Metric Row: Theoretical Guarantee */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x text-xs leading-relaxed" style={{ borderColor: 'var(--border)' }}>
            <div className="p-5" style={{ backgroundColor: 'var(--surface-elevated)' }}>
              <div className="flex items-center gap-1.5 font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--secondary-accent)' }} />
                <span>BFS Guarantee</span>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                {results.bfs.guarantee}
              </p>
            </div>

            <div className="p-5" style={{ backgroundColor: 'var(--surface-elevated)' }}>
              <div className="flex items-center gap-1.5 font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--success)' }} />
                <span>Dijkstra Guarantee</span>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                {results.dijkstra.guarantee}
              </p>
            </div>
          </div>
        </div>

        {/* Clear Educational Takeaway Box */}
        <div
          className="p-8 rounded-lg border space-y-6"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div>
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider block mb-1"
              style={{ color: 'var(--accent)' }}
            >
              Core Educational Axiom
            </span>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              BFS minimizes hops. Dijkstra minimizes total weight.
            </h2>
          </div>

          {/* Small Visual Tradeoff Example */}
          <div
            className="p-5 rounded-md border text-sm"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div className="font-mono text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
              Topological Tradeoff Case Study
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded border" style={{ borderColor: 'var(--secondary-accent)', color: 'var(--secondary-accent)' }}>
                  Direct Path (1 hop)
                </span>
                <p className="font-mono text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                  A ⎯[weight 18]⎯→ D
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Chosen by BFS because hop count = 1, despite high cost of 18.
                </p>
              </div>

              <div className="font-mono text-xl font-bold text-[var(--accent)] select-none">
                VS
              </div>

              <div className="space-y-1">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded border" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
                  Detour Path (3 hops)
                </span>
                <p className="font-mono text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                  A ⎯[2]⎯→ B ⎯[2]⎯→ C ⎯[3]⎯→ D
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Chosen by Dijkstra because cumulative cost = 7, despite taking 3 hops.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--active-step)' }} />
            <p>
              When edge weights represent physical distance, network latency, or financial tolls, Dijkstra is mathematically optimal. When edge weights are uniform or represent discrete transfer hops, BFS executes in linear O(V + E) time without heap overhead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
