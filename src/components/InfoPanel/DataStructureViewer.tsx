import React from 'react';
import type { StepSnapshot, PriorityQueueItem } from '../../types/graph';

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

  const cleanLabel = (id?: string | null) => {
    if (!id) return '';
    return id.replace(/^node-/, '');
  };

  return (
    <div className="space-y-5 text-xs">
      {/* 1. Primary Container: FIFO Queue or Min-Heap Priority Queue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
            {isBfs ? 'Queue' : 'Priority queue'}
          </span>
          <span
            className="font-mono text-xs px-2 py-0.5 rounded border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {dataStructure.items.length} {dataStructure.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {isBfs ? 'Front (next to dequeue) → Rear' : 'Root (minimum tentative distance) → Leaves'}
        </div>

        {dataStructure.items.length === 0 ? (
          <div
            className="text-center py-3 text-xs italic rounded-md border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            Empty
          </div>
        ) : (
          <div
            className="flex flex-wrap gap-2 p-2.5 rounded-md border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }}
          >
            {dataStructure.items.map((item, index) => {
              const isPq = 'priority' in item;
              const pqItem = item as PriorityQueueItem;
              const label = cleanLabel(item.label || item.id);

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-1.5 px-2 py-1 rounded border text-xs"
                  style={{
                    backgroundColor: 'var(--surface-elevated)',
                    borderColor: index === 0 ? 'var(--primary-action)' : 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span className="font-medium">Vertex {label}</span>
                  {isPq && (
                    <span
                      className="font-mono text-xs px-1 rounded"
                      style={{
                        backgroundColor: 'var(--primary-subtle)',
                        color: 'var(--primary-action)',
                      }}
                    >
                      d: {pqItem.priority}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Settled / Visited Set */}
      <div className="space-y-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
            Visited vertices
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {visitedNodes.length}
          </span>
        </div>

        {visitedNodes.length === 0 ? (
          <div
            className="text-center py-2 text-xs italic rounded-md border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            None yet
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {visitedNodes.map((nodeId) => (
              <span
                key={nodeId}
                className="px-2 py-0.5 text-xs font-mono rounded border"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {cleanLabel(nodeId)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Distance & Predecessor Map Table */}
      {Object.keys(distances).length > 0 && (
        <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="font-semibold text-xs block" style={{ color: 'var(--text-primary)' }}>
            Distance table
          </span>

          <div
            className="overflow-x-auto rounded-md border"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }}
          >
            <table className="w-full text-xs text-left">
              <thead
                className="border-b"
                style={{
                  backgroundColor: 'var(--background-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                <tr>
                  <th className="px-3 py-2 font-medium">Vertex</th>
                  <th className="px-3 py-2 font-medium">Distance</th>
                  <th className="px-3 py-2 font-medium">Predecessor</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {Object.entries(distances).map(([nodeId, dist]) => {
                  const isCurrent = snapshot.currentNode === nodeId;
                  const distDisplay = dist >= 1e8 ? '∞' : dist;
                  const label = cleanLabel(nodeId);
                  const pred = cleanLabel(predecessors[nodeId]);

                  return (
                    <tr
                      key={nodeId}
                      style={{
                        backgroundColor: isCurrent ? 'var(--primary-subtle)' : 'transparent',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <td className="px-3 py-1.5 font-medium">{label}</td>
                      <td className="px-3 py-1.5 font-mono font-semibold" style={{ color: 'var(--primary-action)' }}>
                        {distDisplay}
                      </td>
                      <td className="px-3 py-1.5 font-mono" style={{ color: 'var(--text-secondary)' }}>
                        {pred ? `Vertex ${pred}` : '—'}
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
