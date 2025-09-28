import React from 'react';
import { Card } from './ui/Card';
import { THEMES } from '../constants';
import type { ThemeName } from '../types';
import { Button } from './ui/Button';
import { ShieldCheckIcon } from './icons/Icons';
import { Tooltip } from './ui/Tooltip';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeName;
  onThemeChange: (themeName: ThemeName) => void;
  onShowLicense: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  onShowLicense,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header>
          <Card.Title>Theme Customization</Card.Title>
          <Card.Description>Personalize your workspace with a new look.</Card.Description>
        </Card.Header>
        <Card.Content className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {THEMES.map(theme => (
            <Tooltip key={theme.name} content={theme.description}>
              <button
                onClick={() => onThemeChange(theme.name)}
                className={`p-4 border rounded-lg text-center transition-all w-full h-full ${
                  currentTheme === theme.name
                    ? 'border-[rgb(var(--color-accent-val))] ring-2 ring-[rgb(var(--color-accent-val))]'
                    : 'border-[rgb(var(--color-border-val)/0.3)] hover:border-[rgb(var(--color-accent-val))]'
                }`}
              >
                <div className="flex justify-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.colors.primary }}></span>
                  <span className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></span>
                  <span className="w-5 h-5 rounded-full" style={{ backgroundColor: theme.colors.accent }}></span>
                </div>
                <p className="text-sm font-semibold text-slate-200">{theme.displayName}</p>
              </button>
            </Tooltip>
          ))}
        </Card.Content>
        <Card.Footer className="flex justify-between items-center">
          <Button onClick={onShowLicense} className="!bg-transparent hover:!bg-[rgb(var(--color-secondary-val)/0.2)] text-sm font-semibold">
            <ShieldCheckIcon className="w-4 h-4" />
            View OOML License
          </Button>
          <Button onClick={onClose} className="!bg-slate-600 hover:!bg-slate-500 focus:!ring-slate-500">
            Close
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};