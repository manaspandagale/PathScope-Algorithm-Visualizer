import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-sm)]',
    md: 'min-h-[40px] h-10 px-4 text-sm font-medium gap-2 rounded-[var(--radius-md)]',
    lg: 'min-h-[44px] h-11 px-5 text-base font-semibold gap-2.5 rounded-[var(--radius-md)]',
  }[size];

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--primary-action)',
      color: '#FFFFFF',
      border: '1px solid transparent',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
    },
    secondary: {
      backgroundColor: 'var(--surface)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.03)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
    danger: {
      backgroundColor: 'var(--surface)',
      color: 'var(--error)',
      border: '1px solid var(--border)',
    },
  };

  const currentVariantStyle = variantStyles[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center font-sans tracking-tight transition-all duration-150 select-none
        cursor-pointer disabled:cursor-not-allowed disabled:opacity-40
        active:translate-y-[0.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2
        ${sizeClasses}
        ${variant === 'ghost' ? 'hover:bg-[var(--background-secondary)] hover:text-[var(--text-primary)]' : ''}
        ${variant === 'secondary' ? 'hover:bg-[var(--background-secondary)] hover:border-[var(--border-strong)]' : ''}
        ${variant === 'primary' ? 'hover:opacity-95 hover:shadow-md' : ''}
        ${variant === 'danger' ? 'hover:bg-[var(--error-subtle)] hover:border-[var(--error)] hover:text-[var(--error)]' : ''}
        ${className}
      `}
      style={{
        ...currentVariantStyle,
        ...style,
      }}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
