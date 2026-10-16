import React from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../../types/graph';
import { PRESET_GRAPHS } from '../../data/presetGraphs';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';

interface GraphToolsProps {
  nodes: Node<GraphNodeData>[];
  setNodes: React.Dispatch<React.SetStateAction<Node<GraphNodeData>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge<GraphEdgeData>[]>>;
  sourceId: string;
  targetId: string;
  setSourceId: (id: string) => void;
  setTargetId: (id: string) => void;
  onResetVisualization: () => void;
}

export const GraphTools: React.FC<GraphToolsProps> = ({
  nodes,
  setNodes,
  setEdges,
  sourceId,
  targetId,
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

  const handleAddVertex = () => {
    const existingLabels = new Set(nodes.map((n) => n.data.label));
    let nextLabel = 'A';
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(65 + i);
      if (!existingLabels.has(char)) {
        nextLabel = char;
        break;
      }
    }
    if (existingLabels.has(nextLabel)) {
      nextLabel = `V${nodes.length + 1}`;
    }

    const newNodeId = `node-${Date.now()}`;
    const x = 120 + ((nodes.length * 80) % 480);
    const y = 100 + ((nodes.length * 60) % 260);

    const newNode: Node<GraphNodeData> = {
      id: newNodeId,
      type: 'customNode',
      position: { x, y },
      data: {
        label: nextLabel,
        isSource: nodes.length === 0,
        isTarget: nodes.length === 1,
        state: 'default',
      },
    };

    setNodes((prev) => [...prev, newNode]);
    if (!sourceId) setSourceId(newNodeId);
    else if (!targetId && newNodeId !== sourceId) setTargetId(newNodeId);
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
      <h3
        className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-secondary)' }}
      >
        Graph
      </h3>

      {/* Preset selector (The only one in the app) */}
      <div className="space-y-1">
        <label
          htmlFor="graph-preset-select"
          className="block text-xs font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          Preset graph
        </label>
        <select
          id="graph-preset-select"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) {
              handleLoadPreset(e.target.value);
              e.target.value = '';
            }
          }}
          className="w-full px-3 py-2 rounded-md border text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[40px]"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
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

      {/* Primary Add Vertex Button */}
      <button
        onClick={handleAddVertex}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[40px]"
        style={{
          backgroundColor: 'var(--primary-subtle)',
          border: '1px solid var(--border-strong)',
          color: 'var(--primary-action)',
        }}
      >
        <Plus className="w-4 h-4" />
        <span>Add vertex</span>
      </button>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <button
          onClick={onResetVisualization}
          title="Reset algorithm state"
          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer min-h-[38px]"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset view</span>
        </button>

        <button
          onClick={handleClearGraph}
          title="Clear canvas"
          className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md border text-xs font-medium transition-colors cursor-pointer min-h-[38px]"
          style={{
            backgroundColor: 'transparent',
            borderColor: 'var(--error-subtle)',
            color: 'var(--error)',
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear graph</span>
        </button>
      </div>
    </div>
  );
};
