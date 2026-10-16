import React from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../../types/graph';
import { PRESET_GRAPHS } from '../../data/presetGraphs';
import { RotateCcw, Trash2 } from 'lucide-react';

interface GraphToolsProps {
  setNodes: React.Dispatch<React.SetStateAction<Node<GraphNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<GraphEdgeData>[]>>;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
  onResetVisualization: () => void;
}

export const GraphTools: React.FC<GraphToolsProps> = ({
  setNodes,
  setEdges,
  setSourceId,
  setTargetId,
  onResetVisualization,
}) => {
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_GRAPHS.find((p) => p.id === presetId);
    if (!preset) return;

    setNodes(preset.nodes);
    setEdges(preset.edges);
    setSourceId(preset.sourceId);
    setTargetId(preset.targetId);
    onResetVisualization();
  };

  const handleClearGraph = () => {
    if (window.confirm('Clear all vertices and edges from the canvas?')) {
      setNodes([]);
      setEdges([]);
      setSourceId('');
      setTargetId('');
      onResetVisualization();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        Graph Presets & Actions
      </label>

      {/* Preset Graphs Picker */}
      <div className="space-y-1">
        <label className="block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          Load Example Scenario
        </label>
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              handleLoadPreset(e.target.value);
              e.target.value = '';
            }
          }}
          aria-label="Load preset scenario"
          className="w-full px-3 py-2.5 rounded-md border text-xs font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px]"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
          }}
        >
          <option value="" disabled style={{ backgroundColor: 'var(--surface)' }}>
            Choose a preset scenario...
          </option>
          {PRESET_GRAPHS.map((preset) => (
            <option
              key={preset.id}
              value={preset.id}
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            >
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onResetVisualization}
          title="Reset Algorithm State"
          aria-label="Reset Visuals"
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md border text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px]"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border-strong)',
            color: 'var(--text-primary)',
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <span>Reset</span>
        </button>

        <button
          onClick={handleClearGraph}
          title="Clear Canvas"
          aria-label="Clear Graph"
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-md border text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px]"
          style={{
            backgroundColor: 'var(--danger-subtle)',
            borderColor: 'var(--danger)',
            color: 'var(--danger)',
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Canvas</span>
        </button>
      </div>
    </div>
  );
};
