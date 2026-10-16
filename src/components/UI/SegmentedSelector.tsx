
export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  badge?: string;
  description?: string;
}

export interface SegmentedSelectorProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (val: T) => void;
  ariaLabel?: string;
}

export function SegmentedSelector<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = 'Select option',
}: SegmentedSelectorProps<T>) {
  return (
    <div
      aria-label={ariaLabel}
      className="p-1 rounded-[var(--radius-md)] border flex flex-col gap-1.5"
      style={{
        backgroundColor: 'var(--background-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(opt.value)}
            className={`
              w-full text-left p-3 rounded-[var(--radius-sm)] border transition-all duration-150 cursor-pointer
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]
              ${isSelected ? 'shadow-xs border-l-4' : 'hover:bg-[var(--surface)] hover:border-transparent'}
            `}
            style={{
              backgroundColor: isSelected ? 'var(--surface)' : 'transparent',
              borderColor: isSelected ? 'var(--border-strong)' : 'transparent',
              borderLeftColor: isSelected ? 'var(--primary-action)' : 'transparent',
              color: 'var(--text-primary)',
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold tracking-tight">
                {opt.label}
              </span>
              {opt.badge && (
                <span
                  className="text-[11px] font-mono px-2 py-0.5 rounded font-medium border"
                  style={{
                    backgroundColor: isSelected ? 'var(--primary-subtle)' : 'var(--background)',
                    borderColor: isSelected ? 'var(--primary-action)' : 'var(--border)',
                    color: isSelected ? 'var(--primary-action)' : 'var(--text-muted)',
                  }}
                >
                  {opt.badge}
                </span>
              )}
            </div>
            {opt.description && (
              <p
                className="text-xs mt-1 leading-snug"
                style={{ color: 'var(--text-secondary)' }}
              >
                {opt.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
