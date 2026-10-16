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
    <div className="space-y-2">
      <h3
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-secondary)' }}
      >
        Graph properties
      </h3>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className="flex justify-between items-center px-2.5 py-1.5 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Vertices</span>
          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
            {nodeCount}
          </span>
        </div>
        <div
          className="flex justify-between items-center px-2.5 py-1.5 rounded-md border"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Edges</span>
          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
            {edgeCount}
          </span>
        </div>
      </div>
      <div
        className="flex items-center justify-between text-xs pt-0.5"
        style={{ color: 'var(--text-muted)' }}
      >
        <span>Type:</span>
        <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
          {isDirected ? 'Directed' : 'Undirected'} • w ≥ 0
        </span>
      </div>
    </div>
  );
};

export default GraphStats;
