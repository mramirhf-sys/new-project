import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none whitespace-nowrap cursor-pointer';

  const sizeStyles = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
    md: 'h-10 px-4 text-sm gap-2 rounded-lg',
    lg: 'h-11 px-5 text-base gap-2.5 rounded-lg',
  };

  const variantStyles = {
    primary:
      'bg-[#00488d] text-white hover:bg-[#00386d] shadow-sm hover:shadow ring-1 ring-inset ring-[#00488d]/20',
    secondary:
      'bg-white text-[#505f76] border border-[#cbd5e1] hover:bg-[#f8fafc] hover:text-[#191c21] shadow-xs',
    outline:
      'border border-[#00488d] text-[#00488d] hover:bg-[#d6e3ff]/30 bg-transparent',
    success:
      'bg-[#137333] text-white hover:bg-[#0e5c28] shadow-sm hover:shadow',
    danger:
      'bg-[#ba1a1a] text-white hover:bg-[#991414] shadow-sm hover:shadow',
    ghost:
      'text-[#505f76] hover:text-[#00488d] hover:bg-[#f1f5f9] bg-transparent',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        iconPosition === 'right' && icon
      )}
      {children && <span>{children}</span>}
      {!isLoading && iconPosition === 'left' && icon}
    </button>
  );
};
