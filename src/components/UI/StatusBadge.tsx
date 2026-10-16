import React from 'react';

export type StatusVariant = 'idle' | 'running' | 'completed' | 'error' | 'frontier' | 'current';

export interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
}) => {
  const getStyle = (): { bg: string; text: string; border: string; dot: string } => {
    switch (status) {
      case 'running':
      case 'current':
        return {
          bg: 'var(--warning-subtle)',
          text: 'var(--warning)',
          border: 'var(--warning)',
          dot: 'var(--warning)',
        };
      case 'completed':
        return {
          bg: 'var(--success-subtle)',
          text: 'var(--success)',
          border: 'var(--success)',
          dot: 'var(--success)',
        };
      case 'error':
      case 'invalid':
        return {
          bg: 'var(--error-subtle)',
          text: 'var(--error)',
          border: 'var(--error)',
          dot: 'var(--error)',
        };
      case 'frontier':
        return {
          bg: 'rgba(37, 99, 235, 0.1)',
          text: '#2563EB',
          border: '#2563EB',
          dot: '#2563EB',
        };
      case 'idle':
      default:
        return {
          bg: 'var(--background-secondary)',
          text: 'var(--text-secondary)',
          border: 'var(--border)',
          dot: 'var(--text-muted)',
        };
    }
  };

  const current = getStyle();
  const textLabel = label || status.toUpperCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium border ${className}`}
      style={{
        backgroundColor: current.bg,
        color: current.text,
        borderColor: current.border,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: current.dot }}
      />
      <span>{textLabel}</span>
    </span>
  );
};
