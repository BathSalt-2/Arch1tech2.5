import React from 'react';
// NEW: Import InfoIcon for tooltips.
import { InfoIcon } from '../icons/Icons';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  // NEW: Add prop to show info icon.
  hasInfo?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, hasInfo }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
        {label}
        {hasInfo && <InfoIcon className="w-4 h-4 text-slate-500" />}
      </span>
      <div className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-[rgb(var(--color-primary-hover-val))/0.7]' : 'bg-slate-700/50'}`}>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6 bg-[rgb(var(--color-primary-light-val))]' : 'translate-x-1'
          }`}
        />
      </div>
    </label>
  );
};