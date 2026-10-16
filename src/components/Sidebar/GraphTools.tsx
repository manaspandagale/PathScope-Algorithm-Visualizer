import React from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../../types/graph';
import { PRESET_GRAPHS } from '../../data/presetGraphs';
import { RotateCcw, Trash2, Sparkles } from 'lucide-react';

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
    if (window.confirm('Clear all nodes and edges from the canvas?')) {
      setNodes([]);
      setEdges([]);
      setSourceId('');
      setTargetId('');
      onResetVisualization();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
        Graph Presets & Actions
      </label>

      {/* Preset Graphs Picker */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Load Example Graph</span>
        </div>
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              handleLoadPreset(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          <option value="" disabled>
            Choose a preset scenario...
          </option>
          {PRESET_GRAPHS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onResetVisualization}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Visuals</span>
        </button>

        <button
          onClick={handleClearGraph}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 text-xs font-medium transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Graph</span>
        </button>
      </div>
    </div>
  );
};
