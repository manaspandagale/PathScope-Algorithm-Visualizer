import React from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  variant?: 'surface' | 'ghost' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = 'surface',
  size = 'md',
  active = false,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs rounded-[var(--radius-sm)]',
    md: 'w-10 h-10 text-sm rounded-[var(--radius-md)]',
    lg: 'w-11 h-11 text-base rounded-[var(--radius-md)]',
  }[size];

  const getVariantStyles = (): React.CSSProperties => {
    if (active) {
      return {
        backgroundColor: 'var(--primary-subtle)',
        borderColor: 'var(--primary-action)',
        color: 'var(--primary-action)',
      };
    }

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary-action)',
          borderColor: 'transparent',
          color: '#FFFFFF',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: 'var(--text-secondary)',
        };
      case 'surface':
      default:
        return {
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        };
    }
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center border transition-all duration-150 select-none cursor-pointer
        disabled:cursor-not-allowed disabled:opacity-30
        active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2
        ${sizeClasses}
        ${!active && variant === 'surface' ? 'hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]' : ''}
        ${!active && variant === 'ghost' ? 'hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]' : ''}
        ${!active && variant === 'primary' ? 'hover:opacity-95' : ''}
        ${className}
      `}
      style={{
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {icon}
    </button>
  );
};
