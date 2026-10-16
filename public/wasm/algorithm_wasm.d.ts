export interface PathScopeWasmModule {
  run_bfs_wasm: (inputJson: string) => string;
  run_dijkstra_wasm: (inputJson: string) => string;
}

declare function loadModule(): Promise<PathScopeWasmModule>;
export default loadModule;
