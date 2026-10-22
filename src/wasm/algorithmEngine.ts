import type { Node, Edge } from '@xyflow/react';
import type { AlgorithmType, GraphNodeData, GraphEdgeData, StepSnapshot } from '../types/graph';

// Interface for Emscripten Module
interface PathScopeWasmModule {
  run_bfs_wasm: (inputJson: string) => string;
  run_dijkstra_wasm: (inputJson: string) => string;
}

let wasmModulePromise: Promise<PathScopeWasmModule> | null = null;
let wasmModuleInstance: PathScopeWasmModule | null = null;
let wasmInitError: string | null = null;
let preloadedWasmBinary: Uint8Array | ArrayBuffer | null = null;

/**
 * Injects a preloaded WASM binary (e.g. from Node/Vitest test runner setup).
 * This eliminates the need for the browser bundle to import Node 'fs' or 'path'.
 */
export function setPreloadedWasmBinary(binary: Uint8Array | ArrayBuffer | null): void {
  preloadedWasmBinary = binary;
}

/**
 * Initializes and returns the singleton C++ WebAssembly module.
 */
export async function getWasmModule(): Promise<PathScopeWasmModule> {
  if (wasmModuleInstance) {
    return wasmModuleInstance;
  }
  if (wasmModulePromise) {
    return wasmModulePromise;
  }

  wasmModulePromise = (async () => {
    try {
      // Dynamic import of generated WebAssembly loader
      const loadModule = (await import('./generated/algorithm_wasm.js')).default;
      const moduleOptions: Record<string, unknown> = {};

      if (preloadedWasmBinary) {
        moduleOptions.wasmBinary = preloadedWasmBinary;
      }

      const mod = await loadModule(moduleOptions);
      wasmModuleInstance = mod as PathScopeWasmModule;
      wasmInitError = null;
      return wasmModuleInstance;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      wasmInitError = `Failed to initialize C++ WebAssembly algorithm engine: ${msg}`;
      console.error(wasmInitError, err);
      throw new Error(wasmInitError);
    }
  })();

  return wasmModulePromise;
}

/**
 * Check if the WebAssembly module is already initialized synchronously.
 */
export function isWasmReady(): boolean {
  return wasmModuleInstance !== null;
}

export function getWasmInitError(): string | null {
  return wasmInitError;
}

export interface SerializableGraphPayload {
  nodes: { id: string; label: string }[];
  edges: { id: string; source: string; target: string; weight: number }[];
  isDirected: boolean;
  sourceId: string;
  targetId: string;
}

export function formatGraphPayload(
  nodes: Node<GraphNodeData>[],
  edges: Edge<GraphEdgeData>[],
  sourceId: string,
  targetId: string,
  isDirected = false
): SerializableGraphPayload {
  return {
    nodes: nodes.map((n) => ({
      id: n.id,
      label: n.data?.label || n.id,
    })),
    edges: edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      weight: Number(e.data?.weight ?? 1),
    })),
    isDirected,
    sourceId,
    targetId,
  };
}

/**
 * Executes BFS or Dijkstra entirely within the C++ WebAssembly module.
 * No algorithm logic, priority queue, or graph traversal is performed in TypeScript.
 */
export async function executeAlgorithmWasm(
  algorithm: AlgorithmType,
  nodes: Node<GraphNodeData>[],
  edges: Edge<GraphEdgeData>[],
  sourceId: string,
  targetId: string,
  isDirected = false
): Promise<StepSnapshot[]> {
  if (!sourceId || !targetId || nodes.length === 0) {
    return [];
  }

  if (algorithm !== 'bfs' && algorithm !== 'dijkstra') {
    throw new Error(
      `Algorithm '${algorithm}' is not supported. Only 'bfs' and 'dijkstra' are implemented in C++.`
    );
  }

  const module = await getWasmModule();
  const payload = formatGraphPayload(nodes, edges, sourceId, targetId, isDirected);
  const payloadJson = JSON.stringify(payload);

  let rawJsonResult = '[]';
  if (algorithm === 'bfs') {
    rawJsonResult = module.run_bfs_wasm(payloadJson);
  } else if (algorithm === 'dijkstra') {
    rawJsonResult = module.run_dijkstra_wasm(payloadJson);
  }

  try {
    const snapshots: StepSnapshot[] = JSON.parse(rawJsonResult);
    return snapshots;
  } catch (parseErr) {
    console.error('Failed to parse C++ WebAssembly snapshot output:', parseErr, rawJsonResult);
    throw new Error('Invalid snapshot data returned from C++ WebAssembly module.');
  }
}
