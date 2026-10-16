import React from 'react';
import type { Node, Edge } from '@xyflow/react';
import type { GraphNodeData, GraphEdgeData } from '../../types/graph';
import { PRESET_GRAPHS } from '../../data/presetGraphs';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { SelectField } from '../UI/SelectField';

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

  const presetOptions = [
    { value: '', label: 'Select a benchmark preset...' },
    ...PRESET_GRAPHS.map((p) => ({ value: p.id, label: p.name })),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-muted)' }}
        >
          Graph Presets & Edits
        </h3>
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {nodes.length} vertices
        </span>
      </div>

      {/* Preset selector */}
      <SelectField
        id="graph-preset-select"
        label="Preset graph"
        options={presetOptions}
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            handleLoadPreset(e.target.value);
            e.target.value = '';
          }
        }}
      />

      {/* Vertex actions */}
      <div className="flex flex-col gap-2 pt-1">
        <Button
          type="button"
          variant="secondary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAddVertex}
          className="w-full justify-center"
        >
          Add vertex
        </Button>

        <Button
          type="button"
          variant="danger"
          size="sm"
          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          onClick={handleClearGraph}
          className="w-full justify-center"
        >
          Clear canvas
        </Button>
      </div>
    </div>
  );
};
