import React from 'react';

interface GraphStatsProps {
  nodeCount: number;
  edgeCount: number;
  isDirected?: boolean;
}

export const GraphStats: React.FC<GraphStatsProps> = ({
  nodeCount,
  edgeCount,
  isDirected = false,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        Graph Properties
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className="flex justify-between items-center px-3 py-2 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Vertices |V|</span>
          <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
            {nodeCount}
          </span>
        </div>
        <div
          className="flex justify-between items-center px-3 py-2 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Edges |E|</span>
          <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
            {edgeCount}
          </span>
        </div>
      </div>
      <div
        className="flex items-center justify-between text-xs pt-1"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>Graph Model:</span>
        <span className="font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>
          {isDirected ? 'Directed' : 'Undirected'} • w ≥ 0
        </span>
      </div>
    </div>
  );
};
