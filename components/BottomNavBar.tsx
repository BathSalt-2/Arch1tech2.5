import React from 'react';
import { MobileView } from '../types';
import { MessageCircleIcon, EyeIcon, SlidersHorizontalIcon, GalleryIcon } from './icons/Icons';

interface BottomNavBarProps {
  activeView: MobileView;
  setView: (view: MobileView) => void;
  onShowGallery: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${
      isActive ? 'text-[rgb(var(--color-primary-light-val))]' : 'text-slate-400 hover:text-slate-200'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeView, setView, onShowGallery }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-lg border-t border-[rgb(var(--color-border-val)/0.2)] z-40 lg:hidden">
      <div className="container mx-auto h-full grid grid-cols-4 items-stretch">
        <NavItem
          icon={<MessageCircleIcon className="w-6 h-6" />}
          label="Console"
          isActive={activeView === 'chat'}
          onClick={() => setView('chat')}
        />
        <NavItem
          icon={<EyeIcon className="w-6 h-6" />}
          label="Blueprint"
          isActive={activeView === 'visualize'}
          onClick={() => setView('visualize')}
        />
        <NavItem
          icon={<SlidersHorizontalIcon className="w-6 h-6" />}
          label="Forge"
          isActive={activeView === 'configure'}
          onClick={() => setView('configure')}
        />
        <NavItem
          icon={<GalleryIcon className="w-6 h-6" />}
          label="Gallery"
          isActive={false} // The gallery is a modal, so it's never the "active" view
          onClick={onShowGallery}
        />
      </div>
    </footer>
  );
};