/// <reference types="vite/client" />

declare module '*/algorithm_wasm.js' {
  interface PathScopeWasmModule {
    run_bfs_wasm: (inputJson: string) => string;
    run_dijkstra_wasm: (inputJson: string) => string;
  }
  const loadModule: () => Promise<PathScopeWasmModule>;
  export default loadModule;
}
