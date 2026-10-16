import React from 'react';
import type { StepSnapshot, PriorityQueueItem } from '../../types/graph';
import { Database, Binary, ListOrdered, Table2 } from 'lucide-react';

interface DataStructureViewerProps {
  snapshot: StepSnapshot | null;
}

export const DataStructureViewer: React.FC<DataStructureViewerProps> = ({
  snapshot,
}) => {
  if (!snapshot) {
    return (
      <div
        className="p-6 rounded-md border text-center text-xs"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        No active data structure state available.
      </div>
    );
  }

  const { dataStructure, distances, predecessors, visitedNodes } = snapshot;
  const isBfs = dataStructure.type === 'queue';

  return (
    <div className="space-y-5">
      {/* 1. Primary Container: FIFO Queue or Min-Heap Priority Queue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            {isBfs ? (
              <Database className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            ) : (
              <Binary className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            )}
            <span>
              {isBfs ? 'FIFO Queue (BFS Order)' : 'Binary Min-Heap (Dijkstra)'}
            </span>
          </div>
          <span
            className="text-xs font-mono px-2 py-0.5 rounded border"
            style={{
              backgroundColor: 'var(--background-secondary)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {dataStructure.items.length} {dataStructure.items.length === 1 ? 'element' : 'elements'}
          </span>
        </div>

        <div className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
          {isBfs ? 'Front (Next to dequeue) → Rear' : 'Root (Minimum tentative distance) → Leaves'}
        </div>

        {dataStructure.items.length === 0 ? (
          <div
            className="text-center py-3 text-xs font-mono italic rounded-md border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            Queue is empty
          </div>
        ) : (
          <div
            className="flex flex-wrap gap-2 p-2.5 rounded-md border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border-strong)',
            }}
          >
            {dataStructure.items.map((item, index) => {
              const isPq = 'priority' in item;
              const pqItem = item as PriorityQueueItem;

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-2 px-2.5 py-1 rounded border text-xs font-mono"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: index === 0 ? 'var(--accent)' : 'var(--border)',
                    borderWidth: index === 0 ? '1.5px' : '1px',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span className="font-bold">Vertex {item.label}</span>
                  {isPq && (
                    <span
                      className="text-[11px] px-1.5 py-0.2 rounded font-semibold border"
                      style={{
                        backgroundColor: 'var(--background-secondary)',
                        borderColor: 'var(--border)',
                        color: 'var(--accent)',
                      }}
                    >
                      dist: {pqItem.priority}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Settled / Visited Set */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
          <ListOrdered className="w-3.5 h-3.5" style={{ color: 'var(--secondary-accent)' }} />
          <span>Settled Vertices (Visited Set: {visitedNodes.length})</span>
        </div>

        {visitedNodes.length === 0 ? (
          <div
            className="text-center py-2 text-xs font-mono italic rounded-md border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            None settled yet
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {visitedNodes.map((nodeId) => (
              <span
                key={nodeId}
                className="px-2 py-0.5 text-xs font-mono font-semibold rounded border"
                style={{
                  backgroundColor: 'var(--surface-elevated)',
                  borderColor: 'var(--secondary-accent)',
                  color: 'var(--secondary-accent)',
                }}
              >
                {nodeId}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Distance & Predecessor Map Table */}
      {Object.keys(distances).length > 0 && (
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            <Table2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
            <span>Distance & Predecessor Table</span>
          </div>

          <div
            className="overflow-x-auto rounded-md border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }}
          >
            <table className="w-full text-xs text-left font-mono">
              <thead
                className="text-[11px] uppercase border-b"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                <tr>
                  <th className="px-3 py-2 font-semibold">Vertex</th>
                  <th className="px-3 py-2 font-semibold">Distance d(v)</th>
                  <th className="px-3 py-2 font-semibold">Predecessor π(v)</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {Object.entries(distances).map(([nodeId, dist]) => {
                  const isCurrent = snapshot.currentNode === nodeId;
                  const distDisplay = dist >= 1e8 ? '∞' : dist;

                  return (
                    <tr
                      key={nodeId}
                      style={{
                        backgroundColor: isCurrent ? 'var(--active-step-subtle)' : 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <td className="px-3 py-2 font-bold">{nodeId}</td>
                      <td className="px-3 py-2 font-semibold" style={{ color: 'var(--accent)' }}>
                        {distDisplay}
                      </td>
                      <td className="px-3 py-2" style={{ color: 'var(--text-secondary)' }}>
                        {predecessors[nodeId] ? `Vertex ${predecessors[nodeId]}` : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
