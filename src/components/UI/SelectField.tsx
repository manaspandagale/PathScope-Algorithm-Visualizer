import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  id: string;
  options: SelectOption[];
  helperText?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  options,
  helperText,
  className = '',
  style,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium tracking-tight"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          id={id}
          className={`
            w-full min-h-[38px] h-10 pl-3 pr-9 py-1.5 text-xs font-medium rounded-[var(--radius-md)] border appearance-none cursor-pointer transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-1
            ${className}
          `}
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
            ...style,
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-60"
          style={{ color: 'var(--text-secondary)' }}
        />
      </div>
      {helperText && (
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
