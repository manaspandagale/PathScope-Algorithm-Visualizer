import fs from 'node:fs';
import path from 'node:path';
import { setPreloadedWasmBinary } from '../wasm/algorithmEngine';

// Preload the WebAssembly binary in Node/Vitest environments so that
// browser production bundles never need to import Node 'fs' or 'path' modules.
try {
  const wasmPath = path.resolve(process.cwd(), 'src', 'wasm', 'generated', 'algorithm_wasm.wasm');
  if (fs.existsSync(wasmPath)) {
    const buffer = fs.readFileSync(wasmPath);
    setPreloadedWasmBinary(buffer);
  }
} catch (err) {
  console.warn('Could not preload WASM binary in test setup:', err);
}
