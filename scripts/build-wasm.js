import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const outDir = path.join(rootDir, 'src', 'wasm', 'generated');
fs.mkdirSync(outDir, { recursive: true });

// Check emcc executable
let emccCmd = 'emcc';
try {
  execSync('emcc --version', { stdio: 'ignore' });
} catch {
  // Check common emsdk paths on Windows
  const homeDir = process.env.USERPROFILE || process.env.HOME || '';
  const candidate = path.join(homeDir, 'emsdk', 'upstream', 'emscripten', 'emcc.bat');
  if (fs.existsSync(candidate)) {
    emccCmd = `"${candidate}"`;
  } else {
    console.error('ERROR: emcc not found. Please ensure Emscripten SDK is installed and activated.');
    process.exit(1);
  }
}

console.log(`[PathScope] Compiling C++ algorithm engine to WebAssembly using ${emccCmd}...`);

const compileCmd = `${emccCmd} -std=c++17 -O3 -I "${path.join(rootDir, 'cpp', 'include')}" ` +
  `"${path.join(rootDir, 'cpp', 'src', 'bfs.cpp')}" ` +
  `"${path.join(rootDir, 'cpp', 'src', 'dijkstra.cpp')}" ` +
  `"${path.join(rootDir, 'cpp', 'src', 'bindings.cpp')}" ` +
  `--bind -s MODULARIZE=1 -s EXPORT_ES6=1 -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT=web,webview ` +
  `-o "${path.join(outDir, 'algorithm_wasm.js')}"`;

console.log(`Executing: ${compileCmd}`);
execSync(compileCmd, { stdio: 'inherit' });

// Ensure TypeScript type declaration is preserved
const dtsContent = `export interface PathScopeWasmModule {
  run_bfs_wasm: (inputJson: string) => string;
  run_dijkstra_wasm: (inputJson: string) => string;
}

declare function loadModule(moduleOptions?: Record<string, unknown>): Promise<PathScopeWasmModule>;
export default loadModule;
`;
fs.writeFileSync(path.join(outDir, 'algorithm_wasm.d.ts'), dtsContent);

// Remove stale public/wasm directory to avoid redundant asset duplication
const publicWasmDir = path.join(rootDir, 'public', 'wasm');
if (fs.existsSync(publicWasmDir)) {
  fs.rmSync(publicWasmDir, { recursive: true, force: true });
}

console.log('[PathScope] WebAssembly module successfully built in src/wasm/generated!');
