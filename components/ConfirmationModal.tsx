import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AlertTriangleIcon } from './icons/Icons';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
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
        <Card.Header className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangleIcon className="w-6 h-6 text-red-400" />
            </div>
            <div>
                <Card.Title>{title}</Card.Title>
                <Card.Description>{message}</Card.Description>
            </div>
        </Card.Header>
        <Card.Footer className="flex justify-end gap-2">
            <Button onClick={onClose} className="!bg-slate-600 hover:!bg-slate-500 focus:!ring-slate-500">
                Cancel
            </Button>
            <Button onClick={onConfirm} className="!bg-red-600 hover:!bg-red-500 focus:!ring-red-500">
                Confirm
            </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};