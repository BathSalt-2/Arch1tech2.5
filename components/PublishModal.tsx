import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { UploadCloudIcon, SparklesIcon } from './icons/Icons';
import type { LicenseType, UnifiedConfig } from '../types';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (details: { description: string; license: LicenseType; cost: number }) => void;
  assetName: string;
  assetConfig?: UnifiedConfig;
  onGenerateDescription: (config: UnifiedConfig) => Promise<string>;
}

export const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, onPublish, assetName, assetConfig, onGenerateDescription }) => {
  const [description, setDescription] = useState('');
  const [license, setLicense] = useState<LicenseType>('OOML');
  const [cost, setCost] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handlePublishClick = () => {
    if (description.trim()) {
      onPublish({ description: description.trim(), license, cost: license === 'OOML' ? 0 : cost });
    }
  };
  
  const handleGenerateClick = async () => {
      if (!assetConfig) return;
      setIsGenerating(true);
      try {
          const generatedDesc = await onGenerateDescription(assetConfig);
          setDescription(generatedDesc);
      } catch (error) {
          console.error("Failed to generate description:", error);
      } finally {
          setIsGenerating(false);
      }
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newLicense = e.target.value as LicenseType;
      setLicense(newLicense);
      if (newLicense === 'OOML') {
          setCost(0);
      }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header>
          <Card.Title>Publish to Marketplace</Card.Title>
          <Card.Description>Share "{assetName}" with other architects.</Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <Button 
                onClick={handleGenerateClick} 
                disabled={!assetConfig || isGenerating}
                className="!text-xs !py-1 !px-2 !bg-indigo-600 hover:!bg-indigo-500 focus:!ring-indigo-500"
              >
                <SparklesIcon className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
                {isGenerating ? 'Generating...' : 'Generate with AI'}
              </Button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isGenerating ? 'Astrid is analyzing the blueprint...' : "Provide a compelling description of what this asset does and its ideal use cases..."}
              className="w-full h-24 bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm resize-none scrollbar-thin"
              autoFocus
              readOnly={isGenerating}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">License Type</label>
              <select 
                  value={license} 
                  onChange={handleLicenseChange}
                  className="w-full bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm"
              >
                  <option value="OOML">OOML (Free)</option>
                  <option value="Commercial">Commercial (One-time)</option>
                  <option value="Subscription">Subscription (Monthly)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 mb-1 block">Cost (ΣC)</label>
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(Math.max(0, parseInt(e.target.value, 10) || 0))}
                disabled={license === 'OOML'}
                className="w-full bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 focus:ring-2 focus:ring-[rgb(var(--color-primary-hover-val))] focus:outline-none transition text-sm disabled:bg-slate-700/50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </Card.Content>
        <Card.Footer className="flex justify-end gap-2">
            <Button onClick={onClose} className="!bg-slate-600 hover:!bg-slate-500 focus:!ring-slate-500">
                Cancel
            </Button>
            <Button onClick={handlePublishClick} disabled={!description.trim()}>
                <UploadCloudIcon className="w-5 h-5" />
                Publish
            </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};