import React from 'react';
import { X, MousePointer, Plus, Link as LinkIcon, Play, HelpCircle } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-slate-100">
              How to Use PathScope Visualizer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs text-slate-300">
          <div className="flex gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <Plus className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-100">1. Adding & Moving Nodes</div>
              <p className="text-slate-400 mt-0.5">
                Click the <strong>Add Node</strong> button in the canvas header. Drag nodes around the canvas to layout your graph.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <LinkIcon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-100">2. Connecting & Editing Edges</div>
              <p className="text-slate-400 mt-0.5">
                Drag from a node's blue connection handle to another node. Click on any edge's weight pill to edit its weight.
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <MousePointer className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-100">3. Select Source & Destination</div>
              <p className="text-slate-400 mt-0.5">
                Pick the start and target vertices using the left sidebar or select a node on the canvas and click "Set Source" / "Set Target".
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <Play className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-100">4. Playback & Step-by-Step Exploration</div>
              <p className="text-slate-400 mt-0.5">
                Use the bottom playback bar to step forward, step backward, or auto-play. Watch pseudocode highlighting and data structure changes in real time.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
          >
            Got it, let's explore!
          </button>
        </div>
      </div>
    </div>
  );
};
