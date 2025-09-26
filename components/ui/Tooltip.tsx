import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  return (
    <div className="tooltip-container">
      {children}
      <span className="tooltip-text">{content}</span>
    </div>
  );
};