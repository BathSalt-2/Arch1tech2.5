import React from 'react';
import { Card } from './ui/Card';
import { THEMES } from '../constants';
import type { ThemeName } from '../types';
import { Button } from './ui/Button';
import { ShieldCheckIcon } from './icons/Icons';
import { Tooltip } from './ui/Tooltip';
import { Toggle } from './ui/Toggle';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeName;
  onThemeChange: (themeName: ThemeName) => void;
  onShowLicense: () => void;
  isSonificationAudible: boolean;
  onToggleSonification: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange,
  onShowLicense,
  isSonificationAudible,
  onToggleSonification,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-enter"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header>
          <Card.Title>Settings</Card.Title>
          <Card.Description>Personalize your workspace experience.</Card.Description>
        </Card.Header>
        <Card.Content className="space-y-6">
          <section>
            <h4 className="font-semibold text-slate-300 mb-2">Theme Customization</h4>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              </div>
          </section>
          <section>
             <h4 className="font-semibold text-slate-300 mb-2">Accessibility</h4>
             <div className="bg-slate-800/50 p-3 rounded-lg">
                <Tooltip content="Enables an ambient soundscape that reflects the Σ-Matrix's real-time status.">
                    <Toggle 
                        label="System Sonification" 
                        checked={isSonificationAudible} 
                        onChange={onToggleSonification} 
                        hasInfo
                    />
                </Tooltip>
             </div>
          </section>

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