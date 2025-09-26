import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { SaveIcon } from './icons/Icons';

interface SaveModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const SaveModelModal: React.FC<SaveModelModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSaveClick = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName('');
    }
  };

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
          <Card.Title>Archive Blueprint</Card.Title>
          <Card.Description>Enter a name to save this model configuration to your gallery.</Card.Description>
        </Card.Header>
        <Card.Content>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Creative Storyteller v1"
            className="w-full bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm"
            autoFocus
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveClick();
                }
            }}
          />
        </Card.Content>
        <Card.Footer className="flex justify-end gap-2">
            <Button onClick={onClose} className="!bg-slate-600 hover:!bg-slate-500 focus:!ring-slate-500">
                Cancel
            </Button>
            <Button onClick={handleSaveClick} disabled={!name.trim()}>
                <SaveIcon className="w-5 h-5" />
                Save Blueprint
            </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};