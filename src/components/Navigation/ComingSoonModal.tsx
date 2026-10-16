import React from 'react';
import { X, Rocket, Cpu, GitCompare, FileCode, CheckCircle } from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const features = [
    {
      title: 'DAG Shortest Path Algorithm',
      desc: 'Topological sort-based linear time O(V + E) shortest path algorithm for Directed Acyclic Graphs.',
      icon: GitCompare,
    },
    {
      title: 'Floyd–Warshall Algorithm',
      desc: 'All-Pairs Shortest Path dynamic programming matrix visualizer with O(V³) complexity.',
      icon: Cpu,
    },
    {
      title: 'Bellman-Ford & Negative Weight Detection',
      desc: 'Handles negative weights and detects negative weight cycles with detailed edge relaxation passes.',
      icon: FileCode,
    },
    {
      title: 'Algorithm Comparison Dashboard & Benchmarks',
      desc: 'Side-by-side simultaneous execution, runtime metric charts, and operation counters.',
      icon: Rocket,
    },
    {
      title: 'Web Workers & Large Graph Generators',
      desc: 'Offloaded background thread processing for graphs with 100+ vertices without UI blocking.',
      icon: Cpu,
    },
    {
      title: 'JSON Graph Import / Export & Quizzes',
      desc: 'Save and share custom graphs, plus algorithmic puzzle challenges and quiz modes.',
      icon: FileCode,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Phase 2 Roadmap (Coming Soon)
              </h3>
              <p className="text-[11px] text-slate-400">
                PathScope Phase 1 (40–50%) is complete with BFS, DFS, Dijkstra & Interactive Editor.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 flex flex-col justify-between space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {feat.title}
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  {feat.desc}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-medium">
                  <CheckCircle className="w-3 h-3" />
                  <span>Scheduled for Phase 2</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
