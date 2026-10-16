import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('[PathScope] Compiling and running native C++ core algorithm unit tests...');

const outExe = path.join(rootDir, process.platform === 'win32' ? 'cpp_tests.exe' : 'cpp_tests');

try {
  const compileCmd = `g++ -std=c++17 -O2 -I "${path.join(rootDir, 'cpp', 'include')}" ` +
    `"${path.join(rootDir, 'cpp', 'src', 'bfs.cpp')}" ` +
    `"${path.join(rootDir, 'cpp', 'src', 'dijkstra.cpp')}" ` +
    `"${path.join(rootDir, 'cpp', 'tests', 'algorithm_tests.cpp')}" ` +
    `-o "${outExe}"`;

  execSync(compileCmd, { stdio: 'inherit' });
  execSync(`"${outExe}"`, { stdio: 'inherit' });
} finally {
  if (fs.existsSync(outExe)) {
    try { fs.unlinkSync(outExe); } catch { /* ignore */ }
  }
}
