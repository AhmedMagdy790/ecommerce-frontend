import { Link } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import React from 'react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  to?: string; // Add this to support navigation
  icon?: React.ReactNode;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className, 
  to,
  icon,
  ...props 
}: ButtonProps) => {
  
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50";
  
  const variants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
    secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
    ghost: "text-zinc-600 hover:text-zinc-900",
    outline: "border border-[var(--color-border)] hover:bg-[var(--color-surface)]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };

  const mergedClasses = cn(baseStyles, variants[variant], sizes[size], className);

  // If 'to' is provided, render as a Link
  if (to) {
    return (
      <Link to={to} className={mergedClasses}>
        {icon}
        {children}
      </Link>
    );
  }

  // Otherwise, render as a standard button
  return (
    <button className={mergedClasses} {...props}>
      {icon}
      {children}
    </button>
  );
};


// components/ui

// Button
// Input
// Modal
// Dropdown
// Card
// Badge
// Avatar
// Loader
// EmptyState
// ErrorState