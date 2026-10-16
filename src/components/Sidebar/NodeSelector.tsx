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
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}
        >
          Start and destination
        </h3>
        {nodes.length >= 2 && (
          <button
            onClick={handleSwap}
            title="Swap start and destination"
            aria-label="Swap start and destination"
            className="flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors px-2 py-1 rounded hover:bg-[var(--background-secondary)]"
            style={{ color: 'var(--primary-action)' }}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* Start vertex */}
        <div>
          <label
            htmlFor="start-vertex-select"
            className="block text-xs font-medium mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Start vertex
          </label>
          <select
            id="start-vertex-select"
            value={sourceId}
            onChange={(e) => setSourceId(e.target.value)}
            className="w-full px-3 py-2 rounded-md border text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[40px]"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            {nodes.length === 0 && <option value="">No vertices</option>}
            {nodes.map((node) => (
              <option key={node.id} value={node.id}>
                Vertex {node.data.label || node.id}
              </option>
            ))}
          </select>
        </div>

        {/* Destination vertex */}
        <div>
          <label
            htmlFor="destination-vertex-select"
            className="block text-xs font-medium mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            Destination
          </label>
          <select
            id="destination-vertex-select"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-3 py-2 rounded-md border text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[40px]"
            style={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
          >
            {nodes.length === 0 && <option value="">No vertices</option>}
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
          className="text-xs p-2 rounded border"
          style={{
            backgroundColor: 'var(--warning-subtle)',
            borderColor: 'var(--warning)',
            color: 'var(--warning)',
          }}
        >
          Start and destination are the same vertex (path cost is 0).
        </p>
      )}
    </div>
  );
};
