import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { Button } from '../UI/Button';
import { IconButton } from '../UI/IconButton';

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

  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const edgeKey = `${edgeId}-${initialWeight}-${isOpen}`;
  if (prevEdgeKey !== edgeKey) {
    setPrevEdgeKey(edgeKey);
    setWeight(String(initialWeight));
    setError(null);
  }

  // Manage focus restoration and native dialog show/close
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      triggerElementRef.current = document.activeElement as HTMLElement | null;
      if (!dialog.open) {
        try {
          dialog.showModal();
        } catch {
          // Fallback if showModal already active
        }
      }
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      if (dialog.open) {
        dialog.close();
      }
      triggerElementRef.current?.focus();
    }
  }, [isOpen]);

  // Focus trap inside the dialog
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'Tab') {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edgeId) return;

    const parsed = Number(weight);
    if (isNaN(parsed)) {
      setError('Weight must be a valid number.');
      inputRef.current?.focus();
      return;
    }
    if (parsed < 0) {
      setError("Dijkstra requires non-negative edge weights (w ≥ 0).");
      inputRef.current?.focus();
      return;
    }
    onSave(edgeId, parsed);
    onClose();
  };

  return (
    <dialog
      id="edge-weight-dialog"
      ref={dialogRef}
      onKeyDown={handleKeyDown}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-labelledby="edge-weight-dialog-title"
      aria-describedby={error ? 'edge-weight-error' : 'edge-weight-hint'}
      className="m-auto rounded-xl border p-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-xs select-none max-w-sm w-[90vw]"
      style={{
        backgroundColor: 'var(--surface-elevated)',
        borderColor: 'var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="p-6">
        <div
          className="flex items-center justify-between pb-3 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <h3
            id="edge-weight-dialog-title"
            className="text-base font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Edit edge weight
          </h3>
          <IconButton
            icon={<X className="w-4 h-4" />}
            label="Close dialog"
            onClick={onClose}
            variant="ghost"
            size="sm"
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="edge-weight-input"
              className="block text-xs font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Weight value (non-negative w ≥ 0)
            </label>
            <input
              id="edge-weight-input"
              ref={inputRef}
              type="number"
              min="0"
              step="any"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                if (error) setError(null);
              }}
              aria-describedby={error ? 'edge-weight-error' : 'edge-weight-hint'}
              className="w-full px-3 py-2 rounded-md border font-mono text-base font-semibold focus-visible:outline-none min-h-[44px]"
              style={{
                backgroundColor: 'var(--background)',
                borderColor: error ? 'var(--error, #DC2626)' : 'var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            {error && (
              <p
                id="edge-weight-error"
                role="alert"
                className="mt-1.5 text-xs font-medium"
                style={{ color: 'var(--error, #DC2626)' }}
              >
                {error}
              </p>
            )}
            <p
              id="edge-weight-hint"
              className="mt-2 text-xs leading-relaxed"
              style={{ color: 'var(--text-muted)' }}
            >
              Dijkstra minimizes cumulative edge weights. BFS treats each edge as 1 hop regardless of numeric weight.
            </p>
          </div>

          <div
            className="flex justify-end gap-2.5 pt-3 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Save weight
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
};
