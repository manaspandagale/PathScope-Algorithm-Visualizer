import React from 'react';
import type { StepSnapshot, PriorityQueueItem } from '../../types/graph';
import { Database, Grid3X3, ListOrdered } from 'lucide-react';

interface DataStructureViewerProps {
  snapshot: StepSnapshot | null;
}

export const DataStructureViewer: React.FC<DataStructureViewerProps> = ({
  snapshot,
}) => {
  if (!snapshot) return null;

  const { dataStructure, distances, predecessors, matrixState } = snapshot;

  // Render Floyd-Warshall 2D Matrix
  if (dataStructure.type === 'matrix' && matrixState) {
    const { nodes, kNode, iNode, jNode, distMatrix } = matrixState;

    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Grid3X3 className="w-3.5 h-3.5 text-blue-400" />
            <span className="uppercase tracking-wider text-[10px] text-slate-400">
              Floyd–Warshall Distance Matrix
            </span>
          </div>
          {kNode && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              Intermediate k = {kNode}
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/80 p-2">
          <table className="w-full text-center font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-1.5 text-[10px] text-slate-500">i \ j</th>
                {nodes.map((node) => (
                  <th
                    key={node}
                    className={`p-1.5 text-xs font-bold ${
                      node === jNode
                        ? 'bg-blue-500/20 text-blue-300'
                        : node === kNode
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {node}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {nodes.map((rowNode) => (
                <tr key={rowNode}>
                  <td
                    className={`p-1.5 text-xs font-bold border-r border-slate-800 ${
                      rowNode === iNode
                        ? 'bg-blue-500/20 text-blue-300'
                        : rowNode === kNode
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'text-slate-400'
                    }`}
                  >
                    {rowNode}
                  </td>
                  {nodes.map((colNode) => {
                    const val = distMatrix[rowNode]?.[colNode];
                    const valStr = val === Infinity ? '∞' : val;
                    const isCellActive = rowNode === iNode && colNode === jNode;
                    const isDiagonal = rowNode === colNode;

                    return (
                      <td
                        key={colNode}
                        className={`p-1.5 transition-colors ${
                          isCellActive
                            ? 'bg-amber-500/30 text-amber-200 font-bold ring-1 ring-amber-400'
                            : isDiagonal
                            ? 'bg-slate-900 text-slate-500 font-semibold'
                            : rowNode === kNode || colNode === kNode
                            ? 'bg-amber-950/20 text-amber-200/90'
                            : 'text-slate-300'
                        }`}
                      >
                        {valStr}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-slate-500 italic">
          Cell [i][j] shows current shortest distance between vertex i and vertex j via evaluated intermediate vertices.
        </p>
      </div>
    );
  }

  // Render Topological Sort Linear Ordering
  if (dataStructure.type === 'topologicalOrder') {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <ListOrdered className="w-3.5 h-3.5 text-blue-400" />
          <span className="uppercase tracking-wider text-[10px] text-slate-400">
            DAG Topological Linear Order
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-slate-950/80 border border-slate-800">
          {dataStructure.items.length === 0 ? (
            <span className="text-xs text-slate-500 italic">Computing in-degrees...</span>
          ) : (
            dataStructure.items.map((item, idx) => (
              <React.Fragment key={`${item.id}-${idx}`}>
                <span
                  className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${
                    snapshot.currentNode === item.id
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {item.label}
                </span>
                {idx < dataStructure.items.length - 1 && (
                  <span className="text-slate-500 text-xs font-mono">→</span>
                )}
              </React.Fragment>
            ))
          )}
        </div>

        {/* Distance Table for DAG */}
        {Object.keys(distances).length > 0 && (
          <div className="pt-2 border-t border-slate-800">
            <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">
              Tentative Distance Table (Linear Relaxation):
            </div>
            <div className="max-h-32 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/80">
              <table className="w-full text-[11px] text-left font-mono">
                <thead className="text-[10px] uppercase text-slate-500 bg-slate-900 border-b border-slate-800">
                  <tr>
                    <th className="px-2.5 py-1">Node</th>
                    <th className="px-2.5 py-1">Dist</th>
                    <th className="px-2.5 py-1">Predecessor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {Object.entries(distances).map(([nodeId, dist]) => (
                    <tr
                      key={nodeId}
                      className={
                        snapshot.currentNode === nodeId
                          ? 'bg-amber-500/10 text-amber-200 font-bold'
                          : ''
                      }
                    >
                      <td className="px-2.5 py-1">{nodeId}</td>
                      <td className="px-2.5 py-1">
                        {dist === Infinity ? '∞' : dist}
                      </td>
                      <td className="px-2.5 py-1 text-slate-400">
                        {predecessors[nodeId] || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Queue / Stack / Priority Queue (BFS, DFS, Dijkstra)
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
        <Database className="w-3.5 h-3.5 text-blue-400" />
        <span className="uppercase tracking-wider text-[10px] text-slate-400">
          Internal State:{' '}
          {dataStructure.type === 'queue'
            ? 'FIFO Queue'
            : dataStructure.type === 'stack'
            ? 'LIFO Stack'
            : 'Min-Priority Queue'}
        </span>
      </div>

      {/* Queue / Stack / Priority Queue Items */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
          <span>
            {dataStructure.type === 'queue'
              ? 'Front → Back'
              : dataStructure.type === 'stack'
              ? 'Top → Bottom'
              : 'Min-Heap Priority Order'}
          </span>
          <span className="text-slate-500 font-mono">
            Count: {dataStructure.items.length}
          </span>
        </div>

        {dataStructure.items.length === 0 ? (
          <div className="text-center py-2 text-xs font-mono text-slate-500 italic bg-slate-950/50 rounded-lg border border-slate-800/60">
            (Empty)
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-slate-950/60 rounded-lg border border-slate-800/80">
            {dataStructure.items.map((item, index) => {
              const isPq = 'priority' in item;
              const pqItem = item as PriorityQueueItem;

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200"
                >
                  <span className="font-bold">{item.label}</span>
                  {isPq && (
                    <span className="text-[10px] px-1 rounded bg-blue-950 text-blue-300 font-semibold">
                      d={pqItem.priority}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dijkstra Distance & Predecessor Table */}
      {dataStructure.type === 'priorityQueue' && Object.keys(distances).length > 0 && (
        <div className="pt-2 border-t border-slate-800">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">
            Tentative Distance Table:
          </div>
          <div className="max-h-32 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/80">
            <table className="w-full text-[11px] text-left font-mono">
              <thead className="text-[10px] uppercase text-slate-500 bg-slate-900 border-b border-slate-800">
                <tr>
                  <th className="px-2.5 py-1">Node</th>
                  <th className="px-2.5 py-1">Dist</th>
                  <th className="px-2.5 py-1">Predecessor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {Object.entries(distances).map(([nodeId, dist]) => (
                  <tr
                    key={nodeId}
                    className={
                      snapshot.currentNode === nodeId
                        ? 'bg-amber-500/10 text-amber-200 font-bold'
                        : ''
                    }
                  >
                    <td className="px-2.5 py-1">{nodeId}</td>
                    <td className="px-2.5 py-1">
                      {dist === Infinity ? '∞' : dist}
                    </td>
                    <td className="px-2.5 py-1 text-slate-400">
                      {predecessors[nodeId] || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
