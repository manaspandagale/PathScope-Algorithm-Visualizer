import React, { useState, useEffect, useRef } from 'react';
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
  const [prevEdgeKey, setPrevEdgeKey] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const edgeKey = `${edgeId}-${initialWeight}-${isOpen}`;
  if (prevEdgeKey !== edgeKey) {
    setPrevEdgeKey(edgeKey);
    setWeight(String(initialWeight));
    setError(null);
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !edgeId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(weight);
    if (isNaN(parsed)) {
      setError('Weight must be a valid numeric value.');
      return;
    }
    if (parsed < 0) {
      setError('Dijkstra requires non-negative edge weights (w ≥ 0).');
      return;
    }
    onSave(edgeId, parsed);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edge-weight-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
    >
      <div
        className="w-full max-w-sm rounded-lg border p-6 shadow-xl"
        style={{
          backgroundColor: 'var(--surface-elevated)',
          borderColor: 'var(--border-strong)',
          color: 'var(--text-primary)',
        }}
      >
        <div
          className="flex items-center justify-between pb-3 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h3
            id="edge-weight-modal-title"
            className="text-base font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Edit Edge Weight
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded hover:bg-[var(--background-secondary)] cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="edge-weight-input"
              className="block text-xs font-mono font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Numeric Weight (Cost w ≥ 0)
            </label>
            <input
              id="edge-weight-input"
              ref={inputRef}
              type="number"
              min="0"
              step="1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md border font-mono text-base font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] min-h-[44px]"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: error ? 'var(--danger)' : 'var(--border-strong)',
                color: 'var(--text-primary)',
              }}
            />
            {error && (
              <p className="mt-1.5 text-xs font-medium" style={{ color: 'var(--danger)' }}>
                {error}
              </p>
            )}
            <p
              className="mt-2 text-xs leading-normal"
              style={{ color: 'var(--text-muted)' }}
            >
              Dijkstra optimizes minimum cumulative weight. BFS ignores weights and treats each edge as 1 hop.
            </p>
          </div>

          <div
            className="flex justify-end gap-2.5 pt-3 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border text-sm font-medium transition-colors cursor-pointer min-h-[40px]"
              style={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer min-h-[40px]"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#FFFDF8',
              }}
            >
              <Check className="w-4 h-4" />
              <span>Save Weight</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
