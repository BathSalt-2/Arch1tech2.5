import React from 'react';
import { Card } from './ui/Card';
import { OOML_LICENSE_TEXT } from '../constants';
import { ShieldCheckIcon } from './icons/Icons';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-6 h-6 text-[rgb(var(--color-ethical-val))]" />
            <div>
                <Card.Title>Or4cl3 Open Model License (OOML) v1.0</Card.Title>
                <Card.Description>Reciprocity, attribution, and ethical use.</Card.Description>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </Card.Header>
        <Card.Content className="overflow-y-auto pr-2 scrollbar-thin">
            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans">
                {OOML_LICENSE_TEXT}
            </pre>
        </Card.Content>
      </Card>
    </div>
  );
};
