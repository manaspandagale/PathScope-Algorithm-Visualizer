import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface EdgeWeightModalProps {
  isOpen: boolean;
  edgeId: string | null;
  initialWeight: number;
  onSave: (edgeId: string, newWeight: number) => void;
  onClose: () => void;
}

export const EdgeWeightModal: React.FC<EdgeWeightModalProps> = ({
  isOpen,
  edgeId,
  initialWeight,
  onSave,
  onClose,
}) => {
  const [weight, setWeight] = useState<string>(String(initialWeight));
  const [error, setError] = useState<string | null>(null);
  const [prevKey, setPrevKey] = useState<string>('');
  const currentKey = `${edgeId}-${initialWeight}-${isOpen}`;
  if (prevKey !== currentKey) {
    setPrevKey(currentKey);
    setWeight(String(initialWeight));
    setError(null);
  }

  if (!isOpen || !edgeId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(weight);
    if (isNaN(parsed)) {
      setError('Weight must be a valid number.');
      return;
    }
    if (parsed < 0) {
      setError('Phase 1 supports non-negative edge weights (w ≥ 0).');
      return;
    }
    onSave(edgeId, parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-base font-semibold text-slate-100">Edit Edge Weight</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Weight (Cost)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              autoFocus
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
            <p className="mt-1 text-[11px] text-slate-500">
              Dijkstra uses edge weights to find minimum cost. BFS treats each edge as 1 hop regardless of weight.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-medium text-white shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Weight
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
