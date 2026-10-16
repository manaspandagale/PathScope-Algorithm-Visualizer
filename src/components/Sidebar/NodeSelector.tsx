import React from 'react';
import type { Node } from '@xyflow/react';
import type { GraphNodeData } from '../../types/graph';
import { ArrowLeftRight } from 'lucide-react';
import { SelectField } from '../UI/SelectField';

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

  const nodeOptions = nodes.map((node) => ({
    value: node.id,
    label: `Vertex ${node.data.label || node.id}`,
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Endpoints
        </h3>
        {nodes.length >= 2 && (
          <button
            type="button"
            onClick={handleSwap}
            title="Swap start and destination"
            aria-label="Swap start and destination"
            className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer px-2 py-1 rounded transition-colors hover:bg-[var(--background-secondary)]"
            style={{ color: 'var(--primary-action)' }}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        <SelectField
          id="start-vertex-select"
          label="Start vertex"
          value={sourceId}
          onChange={(e) => setSourceId(e.target.value)}
          options={nodeOptions.length > 0 ? nodeOptions : [{ value: '', label: 'No vertices available' }]}
        />

        <SelectField
          id="destination-vertex-select"
          label="Destination"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          options={nodeOptions.length > 0 ? nodeOptions : [{ value: '', label: 'No vertices available' }]}
        />
      </div>
    </div>
  );
};
