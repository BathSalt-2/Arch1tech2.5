import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        px-4 py-2 rounded-lg font-semibold text-white transition-all
        bg-[rgb(var(--color-primary-val))] hover:bg-[rgb(var(--color-primary-hover-val))]
        disabled:bg-slate-600 disabled:cursor-not-allowed disabled:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)] focus:ring-[rgb(var(--color-primary-val))]
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};