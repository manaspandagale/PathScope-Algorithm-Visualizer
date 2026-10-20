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

  const { dataStructure, distances, predecessors, visitedNodes, settledNodes, operation } = snapshot;
  const isBfs = dataStructure.type === 'queue';
  const settledList = (!isBfs && settledNodes && settledNodes.length > 0) ? settledNodes : visitedNodes;

  const cleanLabel = (id?: string | null) => {
    if (!id) return '';
    return id.replace(/^node-/, '');
  };

  const formatDistanceValue = (dist?: number | null) => {
    if (dist === null || dist === undefined || dist >= 1e8) return '∞';
    return dist;
  };

  return (
    <div className="space-y-5 text-xs">
      {/* 1. Primary Container: FIFO Queue or Min-Heap Priority Queue */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
            {isBfs ? 'FIFO Queue' : 'Min-Heap Priority Queue'}
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

        {/* Direction Labels */}
        <div className="flex items-center justify-between text-[11px] font-mono px-1" style={{ color: 'var(--text-muted)' }}>
          <span>{isBfs ? '← Front (next to dequeue)' : '▲ Root (minimum distance)'}</span>
          <span>{isBfs ? 'Rear (new enqueue) →' : 'Leaves →'}</span>
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
            Queue is empty
          </div>
        ) : (
          <div
            className="flex flex-wrap gap-2 p-2.5 rounded-md border items-center"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
            }}
          >
            {dataStructure.items.map((item, index) => {
              const isPq = !isBfs;
              const pqItem = item as PriorityQueueItem;
              const label = cleanLabel(item.label || item.id);
              const isExtractedMin = !isBfs && index === 0;
              const isFrontItem = isBfs && index === 0;
              const isRearItem = isBfs && index === dataStructure.items.length - 1;
              const isStale = Boolean(item.isStale);

              let itemBorderColor = 'var(--border)';
              let itemBg = 'var(--surface-elevated)';

              if (isStale) {
                itemBg = 'var(--background-secondary)';
                itemBorderColor = 'var(--border)';
              } else if (isExtractedMin) {
                itemBorderColor = 'var(--primary-action)';
                itemBg = 'var(--primary-subtle)';
              } else if (isFrontItem && operation === 'dequeue') {
                itemBorderColor = 'var(--state-current, #D97706)';
              }

              return (
                <div
                  key={`${item.id}-${index}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs transition-all duration-150 ${
                    isRearItem && operation === 'enqueue' ? 'animate-pulse' : ''
                  }`}
                  style={{
                    backgroundColor: itemBg,
                    borderColor: itemBorderColor,
                    color: isStale ? 'var(--text-muted)' : 'var(--text-primary)',
                    opacity: isStale ? 0.65 : 1,
                  }}
                >
                  {isFrontItem && isBfs && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--primary-action)] mr-0.5">
                      Front:
                    </span>
                  )}
                  {isExtractedMin && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--primary-action)] mr-0.5">
                      Min:
                    </span>
                  )}

                  <span className={`font-semibold ${isStale ? 'line-through' : ''}`}>
                    Vertex {label}
                  </span>

                  {isPq && (
                    <span
                      className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold"
                      style={{
                        backgroundColor: isStale ? 'var(--background)' : 'var(--surface)',
                        color: isStale ? 'var(--text-muted)' : 'var(--primary-action)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      d: {formatDistanceValue(pqItem.priority)}
                    </span>
                  )}

                  {isStale && (
                    <span
                      className="text-[10px] font-sans font-bold px-1 py-0.2 rounded uppercase"
                      style={{
                        backgroundColor: 'var(--warning-subtle, #FEF3C7)',
                        color: 'var(--state-current, #D97706)',
                      }}
                    >
                      Stale
                    </span>
                  )}

                  {isRearItem && isBfs && dataStructure.items.length > 1 && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] ml-0.5">
                      (Rear)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Before / After Structure Snapshot Comparison */}
      {(snapshot.queueOrHeapBefore && snapshot.queueOrHeapAfter && snapshot.queueOrHeapBefore.length > 0) && (
        <div className="space-y-1.5 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
          <span className="font-semibold text-xs block" style={{ color: 'var(--text-secondary)' }}>
            Transition: Before vs After Operation
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded border bg-[var(--background)]" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] uppercase tracking-wide block mb-1 text-[var(--text-muted)]">
                Before ({snapshot.queueOrHeapBefore.length}):
              </span>
              <div className="truncate text-[var(--text-secondary)]">
                {snapshot.queueOrHeapBefore.map((it) => cleanLabel(it.label || it.id)).join(', ') || 'Empty'}
              </div>
            </div>
            <div className="p-2 rounded border bg-[var(--background)]" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[10px] uppercase tracking-wide block mb-1 text-[var(--text-muted)]">
                After ({snapshot.queueOrHeapAfter.length}):
              </span>
              <div className="truncate font-semibold text-[var(--primary-action)]">
                {snapshot.queueOrHeapAfter.map((it) => cleanLabel(it.label || it.id)).join(', ') || 'Empty'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Settled / Visited Vertices */}
      <div className="space-y-2 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
            {isBfs ? 'Visited vertices' : 'Settled vertices'}
          </span>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            {settledList.length}
          </span>
        </div>

        {settledList.length === 0 ? (
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
            {settledList.map((nodeId) => (
              <span
                key={nodeId}
                className="px-2 py-0.5 text-xs font-mono rounded border font-medium"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                Vertex {cleanLabel(nodeId)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4. Distance & Predecessor Map Table */}
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
                  <th className="px-3 py-2 font-medium">{isBfs ? 'Hop distance' : 'Distance'}</th>
                  <th className="px-3 py-2 font-medium">Predecessor</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {Object.entries(distances).map(([nodeId, dist]) => {
                  const isCurrent = snapshot.currentNode === nodeId;
                  const distDisplay = formatDistanceValue(dist);
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
                      <td className="px-3 py-1.5 font-medium">Vertex {label}</td>
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
