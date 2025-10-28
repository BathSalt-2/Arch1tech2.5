import React from 'react';
import { Button } from './ui/Button';
import { GalleryIcon, SettingsIcon, BotIcon, CubeIcon, WorkflowIcon, AppIcon, LibraryIcon, StoreIcon } from './icons/Icons';
import type { CreationMode, SystemStatus } from '../types';
import { SigmaMatrix } from './features/SigmaMatrix';
import { BioPhaseMonitor } from './features/BioPhaseMonitor';

interface HeaderProps {
  onShowGallery: () => void;
  onShowSettings: () => void;
  onShowKnowledgeBase: () => void;
  onShowMarketplace: () => void;
  creationMode: CreationMode;
  onCreationModeChange: (mode: CreationMode) => void;
  systemStatus: SystemStatus;
  onBioPhaseToggle: () => void;
}

const creationModes: { mode: CreationMode; icon: React.ReactNode; label: string }[] = [
  { mode: 'llm', icon: <CubeIcon className="w-5 h-5" />, label: 'LLM' },
  { mode: 'agent', icon: <BotIcon className="w-5 h-5" />, label: 'Agent' },
  { mode: 'workflow', icon: <WorkflowIcon className="w-5 h-5" />, label: 'Workflow' },
  { mode: 'app', icon: <AppIcon className="w-5 h-5" />, label: 'App' },
];

export const Header: React.FC<HeaderProps> = ({ onShowGallery, onShowSettings, onShowKnowledgeBase, onShowMarketplace, creationMode, onCreationModeChange, systemStatus, onBioPhaseToggle }) => {
  return (
    <header className="flex-shrink-0 border-b border-[rgb(var(--color-border-val)/0.2)] p-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={HEADER_LOGO_BASE64} alt="Or4cl3 AI Solutions Logo" className="w-10 h-10" />
          <span className="font-bold text-xl hidden sm:inline text-white text-glow">OR4CL3</span>
        </div>

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


        <div className="flex items-center gap-1 sm:gap-2">
           <BioPhaseMonitor status={systemStatus.bioPhase} onToggle={onBioPhaseToggle} />
           <Button onClick={onShowKnowledgeBase} className="!bg-transparent hover:!bg-[rgb(var(--color-secondary-val)/0.2)]" title="Open Knowledge Base">
            <LibraryIcon className="w-5 h-5" />
             <span className="hidden md:inline">Knowledge Base</span>
          </Button>
          <Button onClick={onShowMarketplace} className="!bg-transparent hover:!bg-[rgb(var(--color-secondary-val)/0.2)]" title="Open Marketplace">
            <StoreIcon className="w-5 h-5" />
            <span className="hidden md:inline">Marketplace</span>
          </Button>
          <Button onClick={onShowGallery} className="!bg-transparent hover:!bg-[rgb(var(--color-secondary-val)/0.2)]" title="Open Gallery">
            <GalleryIcon className="w-5 h-5" />
            <span className="hidden md:inline">Gallery</span>
          </Button>
          <Button onClick={onShowSettings} className="!bg-transparent hover:!bg-[rgb(var(--color-secondary-val)/0.2)]" title="Open Settings">
            <SettingsIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

const HEADER_LOGO_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJoZWFkZXItZ3JhZCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2RiMjc3NyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA2YjZkNCIvPjwvZGVmcz48ZmlsdGVyIGlkPSJoZWFkZXItZ2xvdyI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMyIgaW49IlNvdXJjZUdyYXBoaWMiIHJlc3VsdD0iYmx1ciIvPjwvZmlsdGVyPjxnIGZpbHRlcj0idXJsKCNoZWFkZXItZ2xvdykiPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjaGVhZGVyLWdyYWQpIiBzdHJva2Utd2lkdGg9IjYiLz48ZyBzdHJva2U9InVybCgjaGVhZGVyLWdyYWQpIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PHBhdGggZD0iTTUwIDQwIFYgMjUiLz48cGF0aCBkPSJNNTAgNjAgViA3NSIvPjxwYXRoIGQ9Ik00MCA1MCBIIDI1Ii8+PHBhdGggZD0iTTYwIDUwIEggNzUiLz48cGF0aCBkPSJNMzggMzggTCAyOCAyOCIvPjxwYXRoIGQ9Ik02MiA2MiBMIDcyIDcyIi8+PHBhdGggZD0iTTM4IDYyIEwgMjggNzIiLz48cGF0aCBkPSJNNjIgMzggTCA3MiAyOCIvPjwvZz48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxMCIgZmlsbD0idXJsKCNoZWFkZXItZ3JhZCkiLz48L2c+PC9zdmc+';