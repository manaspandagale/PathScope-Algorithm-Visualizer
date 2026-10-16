import React from 'react';
import type { Node } from '@xyflow/react';
import type { GraphNodeData } from '../../types/graph';
import { ArrowLeftRight } from 'lucide-react';

interface NodeSelectorProps {
  nodes: Node<GraphNodeData>[];
  sourceId: string;
  targetId: string;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({
  nodes,
  sourceId,
  targetId,
  setSourceId,
  setTargetId,
}) => {
  const handleSwap = () => {
    const temp = sourceId;
    setSourceId(targetId);
    setTargetId(temp);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Routing Termini
        </label>
        {nodes.length >= 2 && (
          <button
            onClick={handleSwap}
            title="Swap Source and Destination"
            aria-label="Swap Source and Destination"
            className="flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[var(--background-secondary)]"
            style={{ color: 'var(--accent)' }}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {/* Source Picker */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Source Vertex (S)
          </label>
          <select
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            aria-label="Source Vertex"
            className="w-full px-3 py-2.5 rounded-md border font-mono text-sm font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px]"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border-strong)',
              color: 'var(--text-primary)',
            }}
          >
            {nodes.length === 0 && <option value="">No nodes available</option>}
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                Vertex {node.data.label || node.id}
              </option>
            ))}
          </select>
        </div>

        {/* Target Picker */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Destination Vertex (T)
          </label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            aria-label="Destination Vertex"
            className="w-full px-3 py-2.5 rounded-md border font-mono text-sm font-semibold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px]"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border-strong)',
              color: 'var(--text-primary)',
            }}
          >
            {nodes.length === 0 && <option value="">No nodes available</option>}
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                Vertex {node.data.label || node.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sourceId && targetId && sourceId === targetId && (
        <p
          className="text-xs p-2.5 rounded border"
          style={{
            backgroundColor: 'var(--active-step-subtle)',
            borderColor: 'var(--active-step)',
            color: 'var(--active-step)',
          }}
        >
          Notice: Source and Destination are identical (trivial 0-cost path).
        </p>
      )}
    </div>
  );
};
