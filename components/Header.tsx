import React from 'react';
import { Button } from './ui/Button';
import { GalleryIcon, SettingsIcon, BotIcon, CubeIcon, WorkflowIcon, AppIcon, LibraryIcon } from './icons/Icons';
import type { CreationMode, SystemStatus } from '../types';
import { SigmaMatrix } from './features/SigmaMatrix';

interface HeaderProps {
  onShowGallery: () => void;
  onShowSettings: () => void;
  onShowKnowledgeBase: () => void;
  creationMode: CreationMode;
  onCreationModeChange: (mode: CreationMode) => void;
  systemStatus: SystemStatus;
}

const creationModes: { mode: CreationMode; icon: React.ReactNode; label: string }[] = [
  { mode: 'llm', icon: <CubeIcon className="w-5 h-5" />, label: 'LLM' },
  { mode: 'agent', icon: <BotIcon className="w-5 h-5" />, label: 'Agent' },
  { mode: 'workflow', icon: <WorkflowIcon className="w-5 h-5" />, label: 'Workflow' },
  { mode: 'app', icon: <AppIcon className="w-5 h-5" />, label: 'App' },
];

export const Header: React.FC<HeaderProps> = ({ onShowGallery, onShowSettings, onShowKnowledgeBase, creationMode, onCreationModeChange, systemStatus }) => {
  return (
    <header className="flex-shrink-0 border-b border-[rgb(var(--color-border-val)/0.2)] p-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={LOGO_IMAGE_BASE64} alt="Or4cl3 AI Solutions Logo" className="w-10 h-10" />
          <span className="font-bold text-xl hidden sm:inline text-white">Or4cl3</span>
        </div>

        {/* NEW: Integrate SigmaMatrix component */}
        <div className="hidden lg:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
            <div className="flex-grow flex justify-center items-center">
                <div className="bg-black/20 p-1 rounded-lg flex items-center gap-1 border border-[rgb(var(--color-border-val)/0.1)]">
                    {creationModes.map(({ mode, icon, label }) => (
                        <button
                            key={mode}
                            onClick={() => onCreationModeChange(mode)}
                            className={`
                                px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 transition-all
                                ${creationMode === mode
                                    ? 'bg-[rgb(var(--color-primary-val))] text-white shadow-md'
                                    : 'text-slate-300 hover:bg-slate-700/50'
                                }
                            `}
                            title={`Switch to ${label} Creation Mode`}
                        >
                            {icon}
                            <span className="hidden md:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <SigmaMatrix status={systemStatus} />
        </div>


        <div className="flex items-center gap-2">
           <Button onClick={onShowKnowledgeBase} className="!bg-transparent hover:!bg-[rgb(var(--color-secondary-val)/0.2)]" title="Open Knowledge Base">
            <LibraryIcon className="w-5 h-5" />
             <span className="hidden lg:inline">Knowledge Base</span>
          </Button>
          <Button onClick={onShowGallery} className="!bg-transparent hover:!bg-[rgb(var(--color-secondary-val)/0.2)]" title="Open Gallery">
            <GalleryIcon className="w-5 h-5" />
            <span className="hidden lg:inline">Gallery</span>
          </Button>
          <Button onClick={onShowSettings} className="!bg-transparent hover:!bg-[rgb(var(--color-secondary-val)/0.2)]" title="Open Settings">
            <SettingsIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

const LOGO_IMAGE_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxvZ29HcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0icmdiKDYsIDE4MiwgMjEyKSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSJyZ2IoMjE5LCAzOSwgMTE5KSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8ZmlsdGVyIGlkPSJnbG93Ij4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMiIgaW49IlNvdXJjZUdyYXBoaWMiIHJlc3VsdD0iYmx1cnJlZCIgLz4KICAgICAgPGZlTWVyZ2U+CiAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJibHVycmVkIiAvPgogICAgICAgIDxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyIgLz4KICAgICAgPC9mZU1lcmdlPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjbG9nb0dyYWQpIiBzdHJva2Utd2lkdGg9IjYiIC8+CiAgPHRleHQgeD0iNTAiIHk9IjY4IiBmb250LWZhbWlseT0iJ0ludGVyJywgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI1MCIgZmlsbD0idXJsKCNsb2dvR3JhZCkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSI5MDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIiBmaWx0ZXI9InVybCgjZ2xvdykiPk/CuTwvdGV4dD4KPC9zdmc+';
