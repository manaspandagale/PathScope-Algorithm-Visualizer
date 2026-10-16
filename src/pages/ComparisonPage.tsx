import React, { useState, useEffect, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { Loader2 } from 'lucide-react';
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
}

export const ComparisonPage: React.FC<ComparisonPageProps> = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('bfs-vs-dijkstra-tradeoff');
  const currentPreset = useMemo(
    () => PRESET_GRAPHS.find((p) => p.id === selectedPresetId) || PRESET_GRAPHS[0],
    [selectedPresetId]
  );

  const [sourceId, setSourceId] = useState<string>(currentPreset.sourceId);
  const [targetId, setTargetId] = useState<string>(currentPreset.targetId);

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
    const nodeMap = new Map(nodes.map((n) => [n.id, (n.data.label || n.id).replace(/^node-/, '')]));
    const getLabel = (id: string) => nodeMap.get(id) || id.replace(/^node-/, '');

    const formatPath = (pathNodes: string[]) => {
      if (!pathNodes || pathNodes.length === 0) return 'No path found';
      return pathNodes.map(getLabel).join(' → ');
    };

    const lastBfs = bfsSnapshots[bfsSnapshots.length - 1];
    const bfsFound = lastBfs?.status === 'found';
    const bfs: BenchmarkResult = {
      id: 'bfs',
      name: ALGORITHMS_METADATA.bfs.name,
      pathFound: bfsFound,
      pathString: bfsFound ? formatPath(lastBfs.pathNodes) : 'Target unreachable',
      totalCost: bfsFound ? (lastBfs.totalCost ?? null) : null,
      hopCount: bfsFound ? (lastBfs.hopCount ?? (lastBfs.pathNodes.length > 0 ? lastBfs.pathNodes.length - 1 : null)) : null,
      visitedCount: lastBfs ? new Set(bfsSnapshots.flatMap((s) => s.visitedNodes)).size : 0,
      stepsCount: bfsSnapshots.length,
      timeComplexity: ALGORITHMS_METADATA.bfs.timeComplexity.worst,
      spaceComplexity: ALGORITHMS_METADATA.bfs.spaceComplexity,
    };

    const lastDijkstra = dijkstraSnapshots[dijkstraSnapshots.length - 1];
    const dijkstraFound = lastDijkstra?.status === 'found';
    const dijkstra: BenchmarkResult = {
      id: 'dijkstra',
      name: ALGORITHMS_METADATA.dijkstra.name,
      pathFound: dijkstraFound,
      pathString: dijkstraFound ? formatPath(lastDijkstra.pathNodes) : 'Target unreachable',
      totalCost: dijkstraFound ? (lastDijkstra.totalCost ?? null) : null,
      hopCount: dijkstraFound ? (lastDijkstra.hopCount ?? (lastDijkstra.pathNodes.length > 0 ? lastDijkstra.pathNodes.length - 1 : null)) : null,
      visitedCount: lastDijkstra ? new Set(dijkstraSnapshots.flatMap((s) => s.visitedNodes)).size : 0,
      stepsCount: dijkstraSnapshots.length,
      timeComplexity: ALGORITHMS_METADATA.dijkstra.timeComplexity.worst,
      spaceComplexity: ALGORITHMS_METADATA.dijkstra.spaceComplexity,
    };

    return { bfs, dijkstra };
  }, [currentPreset, bfsSnapshots, dijkstraSnapshots]);

  const cleanNodeLabel = (id: string, label?: string) => {
    return (label || id).replace(/^node-/, '');
  };

  const metricRows = [
    {
      label: 'Path',
      bfs: results.bfs.pathString,
      dijkstra: results.dijkstra.pathString,
      mono: true,
      highlight: true,
    },
    {
      label: 'Hops',
      bfs: results.bfs.hopCount !== null ? `${results.bfs.hopCount}` : '—',
      dijkstra: results.dijkstra.hopCount !== null ? `${results.dijkstra.hopCount}` : '—',
      mono: true,
    },
    {
      label: 'Cost',
      bfs: results.bfs.totalCost !== null ? `${results.bfs.totalCost}` : '—',
      dijkstra: results.dijkstra.totalCost !== null ? `${results.dijkstra.totalCost}` : '—',
      mono: true,
    },
    {
      label: 'Explored vertices',
      bfs: `${results.bfs.visitedCount}`,
      dijkstra: `${results.dijkstra.visitedCount}`,
      mono: true,
    },
    {
      label: 'Steps',
      bfs: `${results.bfs.stepsCount}`,
      dijkstra: `${results.dijkstra.stepsCount}`,
      mono: true,
    },
    {
      label: 'Time complexity',
      bfs: results.bfs.timeComplexity,
      dijkstra: results.dijkstra.timeComplexity,
      mono: true,
    },
    {
      label: 'Space complexity',
      bfs: results.bfs.spaceComplexity,
      dijkstra: results.dijkstra.spaceComplexity,
      mono: true,
    },
  ];

  return (
    <div
      className="min-h-[calc(100vh-64px)] overflow-y-auto px-6 py-12"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Algorithm Comparison
          </h1>
          <p
            className="mt-2 text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            Compare Breadth-First Search and Dijkstra’s Algorithm side by side on identical graph topologies.
          </p>
        </div>

        {/* Graph Selection Controls */}
        <div
          className="p-4 rounded-lg border grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div>
            <label
              htmlFor="compare-preset"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Graph preset
            </label>
            <select
              id="compare-preset"
              value={selectedPresetId}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-sm font-medium cursor-pointer focus-visible:outline-none min-h-[40px]"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
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
              htmlFor="compare-source"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Start vertex
            </label>
            <select
              id="compare-source"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-sm font-medium cursor-pointer focus-visible:outline-none min-h-[40px]"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              {currentPreset.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  Vertex {cleanNodeLabel(n.id, n.data.label)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="compare-target"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Destination
            </label>
            <select
              id="compare-target"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-sm font-medium cursor-pointer focus-visible:outline-none min-h-[40px]"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
            >
              {currentPreset.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  Vertex {cleanNodeLabel(n.id, n.data.label)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clean Two-Column Comparison Table with Aligned Rows */}
        <div
          className="rounded-lg border overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Table Headers */}
          <div
            className="grid grid-cols-3 border-b text-sm"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="p-4 font-medium" style={{ color: 'var(--text-muted)' }}>
              Metric
            </div>
            <div className="p-4 font-semibold" style={{ color: 'var(--text-primary)' }}>
              Breadth-First Search
            </div>
            <div className="p-4 font-semibold flex items-center justify-between" style={{ color: 'var(--text-primary)' }}>
              <span>Dijkstra’s Algorithm</span>
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--primary-action)]" />}
            </div>
          </div>

          {/* Metric Rows */}
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {metricRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 text-sm items-center hover:bg-[var(--surface-elevated)] transition-colors"
              >
                <div className="p-4 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {row.label}
                </div>
                <div
                  className={`p-4 text-sm ${row.mono ? 'font-mono' : ''}`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {row.bfs}
                </div>
                <div
                  className={`p-4 text-sm ${row.mono ? 'font-mono' : ''}`}
                  style={{
                    color: row.highlight ? 'var(--primary-action)' : 'var(--text-primary)',
                    fontWeight: row.highlight ? 600 : 400,
                  }}
                >
                  {row.dijkstra}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlighted Primary Lesson */}
        <div
          className="p-6 rounded-lg border text-center space-y-2"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            BFS minimizes the number of edges. Dijkstra minimizes total weight.
          </p>
          <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            BFS is optimal for unweighted graphs or uniform transmission networks. When edges carry variable weights such as distance, cost, or latency, Dijkstra guarantees the shortest path by cumulative weight.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
