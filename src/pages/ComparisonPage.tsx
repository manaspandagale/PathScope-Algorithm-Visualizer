import React, { useState, useEffect, useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { Loader2, Award, ArrowRight } from 'lucide-react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';
import { PRESET_GRAPHS } from '../data/presetGraphs';
import { ALGORITHMS_METADATA } from '../data/algorithmsInfo';
import { executeAlgorithmWasm } from '../wasm/algorithmEngine';
import { SelectField } from '../components/UI/SelectField';

interface ComparisonPageProps {
  theme: 'dark' | 'light';
}

interface BenchmarkResult {
  id: AlgorithmType;
  name: string;
  pathFound: boolean;
  pathNodes: string[];
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

  const nodeMap = useMemo(() => {
    return new Map(currentPreset.nodes.map((n) => [n.id, (n.data.label || n.id).replace(/^node-/, '')]));
  }, [currentPreset.nodes]);

  const cleanNodeLabel = (id: string) => nodeMap.get(id) || id.replace(/^node-/, '');

  const results = useMemo<Record<'bfs' | 'dijkstra', BenchmarkResult>>(() => {
    const lastBfs = bfsSnapshots[bfsSnapshots.length - 1];
    const bfsFound = lastBfs?.status === 'found';
    const bfs: BenchmarkResult = {
      id: 'bfs',
      name: ALGORITHMS_METADATA.bfs.name,
      pathFound: bfsFound,
      pathNodes: bfsFound ? lastBfs.pathNodes : [],
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
      pathNodes: dijkstraFound ? lastDijkstra.pathNodes : [],
      totalCost: dijkstraFound ? (lastDijkstra.totalCost ?? null) : null,
      hopCount: dijkstraFound ? (lastDijkstra.hopCount ?? (lastDijkstra.pathNodes.length > 0 ? lastDijkstra.pathNodes.length - 1 : null)) : null,
      visitedCount: lastDijkstra ? new Set(dijkstraSnapshots.flatMap((s) => s.visitedNodes)).size : 0,
      stepsCount: dijkstraSnapshots.length,
      timeComplexity: ALGORITHMS_METADATA.dijkstra.timeComplexity.worst,
      spaceComplexity: ALGORITHMS_METADATA.dijkstra.spaceComplexity,
    };

    return { bfs, dijkstra };
  }, [bfsSnapshots, dijkstraSnapshots]);

  const isBfsFewerHops = results.bfs.hopCount !== null && results.dijkstra.hopCount !== null && results.bfs.hopCount < results.dijkstra.hopCount;
  const isDijkstraLowerCost = results.bfs.totalCost !== null && results.dijkstra.totalCost !== null && results.dijkstra.totalCost < results.bfs.totalCost;

  const renderPathChips = (pathNodes: string[]) => {
    if (pathNodes.length === 0) {
      return <span className="text-xs italic text-[var(--text-muted)]">No path found</span>;
    }
    return (
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
        {pathNodes.map((id, idx) => (
          <React.Fragment key={`${id}-${idx}`}>
            <span
              className="px-2 py-0.5 rounded border font-semibold"
              style={{
                backgroundColor: 'var(--surface-elevated)',
                borderColor: 'var(--border-strong)',
                color: 'var(--text-primary)',
              }}
            >
              {cleanNodeLabel(id)}
            </span>
            {idx < pathNodes.length - 1 && (
              <ArrowRight className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const presetOptions = PRESET_GRAPHS.map((p) => ({ value: p.id, label: p.name }));
  const nodeOptions = currentPreset.nodes.map((n) => ({
    value: n.id,
    label: `Vertex ${cleanNodeLabel(n.id)}`,
  }));

  return (
    <div
      className="min-h-[calc(100vh-64px)] overflow-y-auto px-6 py-10 select-none"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded border uppercase"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              Pedagogical Benchmark
            </span>
          </div>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Algorithm Comparison
          </h1>
          <p
            className="mt-1 text-sm sm:text-base"
            style={{ color: 'var(--text-secondary)' }}
          >
            Evaluate Breadth-First Search and Dijkstra’s Algorithm side by side under identical graph topologies.
          </p>
        </div>

        {/* Primary Educational Insight Banner */}
        <div
          className="p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 border mt-0.5"
              style={{
                backgroundColor: 'var(--primary-subtle)',
                borderColor: 'var(--primary-action)',
                color: 'var(--primary-action)',
              }}
            >
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                BFS minimizes the number of edges. Dijkstra minimizes total weight.
              </p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                When edges have uniform weights, BFS is optimal and faster. When weights vary, Dijkstra finds lower-cost paths that may traverse more hops.
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--primary-action)] shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Simulating in C++...</span>
            </div>
          )}
        </div>

        {/* Graph Selection Controls */}
        <div
          className="p-5 rounded-xl border grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <SelectField
            id="compare-preset"
            label="Preset scenario"
            value={selectedPresetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            options={presetOptions}
          />

          <SelectField
            id="compare-source"
            label="Start vertex"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            options={nodeOptions}
          />

          <SelectField
            id="compare-target"
            label="Destination vertex"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            options={nodeOptions}
          />
        </div>

        {/* Desktop Comparison Table */}
        <div
          className="hidden md:block rounded-xl border overflow-hidden shadow-xs"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Header Row */}
          <div
            className="grid grid-cols-12 border-b text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            <div className="col-span-3 p-4">Metric</div>
            <div className="col-span-4 p-4 text-[var(--text-primary)]">
              Breadth-First Search
            </div>
            <div className="col-span-5 p-4 text-[var(--text-primary)]">
              Dijkstra’s Algorithm
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y text-xs" style={{ borderColor: 'var(--border)' }}>
            {/* Discovered Path */}
            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-3 font-medium text-[var(--text-secondary)]">Discovered path</div>
              <div className="col-span-4">{renderPathChips(results.bfs.pathNodes)}</div>
              <div className="col-span-5">{renderPathChips(results.dijkstra.pathNodes)}</div>
            </div>

            {/* Edge Hops */}
            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-3 font-medium text-[var(--text-secondary)]">Edge hops</div>
              <div className="col-span-4 font-mono text-sm">
                <span className={`px-2 py-0.5 rounded font-bold ${isBfsFewerHops ? 'bg-[var(--primary-subtle)] text-[var(--primary-action)] border border-[var(--primary-action)]' : ''}`}>
                  {results.bfs.hopCount !== null ? `${results.bfs.hopCount} hops` : '—'}
                  {isBfsFewerHops && ' (Minimum)'}
                </span>
              </div>
              <div className="col-span-5 font-mono text-sm">
                <span>
                  {results.dijkstra.hopCount !== null ? `${results.dijkstra.hopCount} hops` : '—'}
                </span>
              </div>
            </div>

            {/* Cumulative Cost */}
            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-3 font-medium text-[var(--text-secondary)]">Total cost (weight)</div>
              <div className="col-span-4 font-mono text-sm">
                <span>
                  {results.bfs.totalCost !== null ? `${results.bfs.totalCost}` : '—'}
                </span>
              </div>
              <div className="col-span-5 font-mono text-sm">
                <span className={`px-2 py-0.5 rounded font-bold ${isDijkstraLowerCost ? 'bg-[var(--primary-subtle)] text-[var(--primary-action)] border border-[var(--primary-action)]' : ''}`}>
                  {results.dijkstra.totalCost !== null ? `${results.dijkstra.totalCost}` : '—'}
                  {isDijkstraLowerCost && ' (Optimal cost)'}
                </span>
              </div>
            </div>

            {/* Visited Vertices */}
            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-3 font-medium text-[var(--text-secondary)]">Explored vertices</div>
              <div className="col-span-4 font-mono">{results.bfs.visitedCount} of {currentPreset.nodes.length}</div>
              <div className="col-span-5 font-mono">{results.dijkstra.visitedCount} of {currentPreset.nodes.length}</div>
            </div>

            {/* Execution Steps */}
            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-3 font-medium text-[var(--text-secondary)]">C++ Engine snapshots</div>
              <div className="col-span-4 font-mono">{results.bfs.stepsCount} steps</div>
              <div className="col-span-5 font-mono">{results.dijkstra.stepsCount} steps</div>
            </div>

            {/* Complexity */}
            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-3 font-medium text-[var(--text-secondary)]">Time complexity</div>
              <div className="col-span-4 font-mono">{results.bfs.timeComplexity}</div>
              <div className="col-span-5 font-mono">{results.dijkstra.timeComplexity}</div>
            </div>

            {/* Space Complexity */}
            <div className="grid grid-cols-12 p-4 items-center">
              <div className="col-span-3 font-medium text-[var(--text-secondary)]">Space complexity</div>
              <div className="col-span-4 font-mono">{results.bfs.spaceComplexity}</div>
              <div className="col-span-5 font-mono">{results.dijkstra.spaceComplexity}</div>
            </div>
          </div>
        </div>

        {/* Mobile Stacked Algorithm Cards */}
        <div className="block md:hidden space-y-4">
          {/* BFS Card */}
          <div
            className="p-5 rounded-xl border space-y-3"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="font-bold text-sm">Breadth-First Search</span>
              <span className="font-mono text-xs">{results.bfs.timeComplexity}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-muted)] block mb-1">Path:</span>
              {renderPathChips(results.bfs.pathNodes)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-[var(--text-muted)] block">Hops:</span>
                <span className="font-mono font-bold">{results.bfs.hopCount !== null ? `${results.bfs.hopCount}` : '—'}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Total cost:</span>
                <span className="font-mono">{results.bfs.totalCost !== null ? `${results.bfs.totalCost}` : '—'}</span>
              </div>
            </div>
          </div>

          {/* Dijkstra Card */}
          <div
            className="p-5 rounded-xl border space-y-3"
            style={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="font-bold text-sm">Dijkstra’s Algorithm</span>
              <span className="font-mono text-xs">{results.dijkstra.timeComplexity}</span>
            </div>
            <div>
              <span className="text-xs text-[var(--text-muted)] block mb-1">Path:</span>
              {renderPathChips(results.dijkstra.pathNodes)}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div>
                <span className="text-[var(--text-muted)] block">Hops:</span>
                <span className="font-mono">{results.dijkstra.hopCount !== null ? `${results.dijkstra.hopCount}` : '—'}</span>
              </div>
              <div>
                <span className="text-[var(--text-muted)] block">Total cost:</span>
                <span className="font-mono font-bold text-[var(--primary-action)]">
                  {results.dijkstra.totalCost !== null ? `${results.dijkstra.totalCost}` : '—'} (Optimal)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonPage;
