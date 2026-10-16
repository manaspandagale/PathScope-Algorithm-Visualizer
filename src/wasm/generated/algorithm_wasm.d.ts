export interface PathScopeWasmModule {
  run_bfs_wasm: (inputJson: string) => string;
  run_dijkstra_wasm: (inputJson: string) => string;
}

declare function loadModule(moduleOptions?: Record<string, unknown>): Promise<PathScopeWasmModule>;
export default loadModule;
