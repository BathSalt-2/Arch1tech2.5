import React, { useState, useRef } from 'react';
import type { SavedModel, UnifiedConfig, ModelVersion } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { TrashIcon, HistoryIcon, CheckCircleIcon, XCircleIcon, SigmaIcon, FileTextIcon, UploadCloudIcon } from './icons/Icons';
import { ConfirmationModal } from './ConfirmationModal';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: SavedModel[];
  onLoad: (config: UnifiedConfig, modelName: string) => void;
  onDelete: (modelId: number) => void;
  onPublishRequest: (version: ModelVersion, modelName: string) => void;
  onAnalyzeImport: (config: UnifiedConfig) => void;
}

const DetailItem: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold">{label}:</span>
        <span className="font-mono text-slate-300">{value}</span>
    </div>
);

const StatusItem: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
    <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="font-semibold">{label}:</span>
        {active ? 
            <CheckCircleIcon className="w-4 h-4 text-green-400" /> : 
            <XCircleIcon className="w-4 h-4 text-red-400" />
        }
    </div>
);


export const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, models, onLoad, onDelete, onPublishRequest, onAnalyzeImport }) => {
  const [expandedModelId, setExpandedModelId] = useState<number | null>(null);
  const [modelForDeletion, setModelForDeletion] = useState<SavedModel | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const toggleExpand = (modelId: number) => {
    setExpandedModelId(prevId => (prevId === modelId ? null : modelId));
  };
  
  const handleConfirmDelete = () => {
    if (modelForDeletion) {
      onDelete(modelForDeletion.id);
    }
    setModelForDeletion(null);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string) as UnifiedConfig;
          onAnalyzeImport(config);
          onClose();
        } catch (error) {
          console.error("Failed to parse blueprint:", error);
          alert("Error: Invalid blueprint file. Please upload a valid JSON configuration.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-enter"
        onClick={onClose}
      >
        <Card 
          className="w-full max-w-4xl max-h-[80vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <Card.Header className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <Card.Title>Blueprint Gallery</Card.Title>
              <Card.Description>Manage your saved AI model configurations and their version history.</Card.Description>
            </div>
             <div className="flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".json"
                    onChange={handleFileImport}
                />
                <Button onClick={() => fileInputRef.current?.click()} className="!bg-indigo-600 hover:!bg-indigo-500">
                    <FileTextIcon className="w-4 h-4" />
                    Import Blueprint
                </Button>
                <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
             </div>
          </Card.Header>
          <Card.Content className="overflow-y-auto space-y-3 pr-2 scrollbar-thin">
            {models.length > 0 ? (
              models.map(model => (
                <div key={model.id} className="bg-slate-800/50 rounded-lg transition-all">
                  <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div 
                            className="w-12 h-12 flex-shrink-0 bg-black/20 rounded-md flex items-center justify-center border border-[rgb(var(--color-border-val)/0.2)] p-1"
                            title="Asset Sigil"
                            dangerouslySetInnerHTML={{ __html: model.sigil || '<svg viewBox="0 0 24 24"><path d="M18 7V4H6v3 M12 4v16 M6 20v-3h12v3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"></path></svg>' }}
                        />
                        <div className="flex-grow">
                            <h4 className="font-semibold text-[rgb(var(--color-primary-light-val))] text-lg">{model.name}</h4>
                            <p className="text-xs text-slate-400 mt-1">
                                {model.versions.length} version{model.versions.length > 1 ? 's' : ''} saved. Last updated: {new Date(model.versions[model.versions.length - 1].savedAt).toLocaleString()}
                            </p>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center">
                          <Button onClick={() => toggleExpand(model.id)} className="!bg-slate-600 hover:!bg-slate-500 focus:!ring-slate-500 text-sm px-3 py-1">
                              <HistoryIcon className="w-4 h-4" /> History
                          </Button>
                          <Button onClick={() => setModelForDeletion(model)} className="!bg-pink-700 hover:!bg-pink-600 focus:!ring-pink-600 text-sm px-3 py-1">
                              <TrashIcon className="w-4 h-4" /> Delete
                          </Button>
                      </div>
                  </div>

                  {expandedModelId === model.id && (
                      <div className="p-4 border-t border-[rgb(var(--color-border-val)/0.2)] space-y-2">
                          <h5 className="text-sm font-semibold text-slate-300 mb-2">Version History (Newest First)</h5>
                          {[...model.versions].reverse().map((version) => (
                              <div key={version.savedAt} className="bg-slate-900/50 p-3 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                  <div className='flex-grow'>
                                      <p className="text-sm text-slate-200 font-mono">
                                          Saved: {new Date(version.savedAt).toLocaleString()}
                                      </p>
                                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1 p-2 bg-black/20 rounded">
                                          {version.config.type === 'llm' ? (
                                              <>
                                                  <DetailItem label="Tokens" value={version.config.memory.shortTermTokens} />
                                                  <StatusItem label="RSM" active={version.config.selfImprovement.recursiveStabilityMonitor} />
                                                  <StatusItem label="DAE" active={version.config.selfImprovement.dynamicAlignmentEngine} />
                                              </>
                                          ) : (
                                              <DetailItem label="Type" value={version.config.type.toUpperCase()} />
                                          )}
                                      </div>
                                  </div>
                                  <div className="flex gap-2 self-end md:self-center">
                                      <Button onClick={() => onLoad(version.config, model.name)} className="!bg-indigo-600 hover:!bg-indigo-500 focus:!ring-indigo-500 text-xs px-2 py-1">
                                          <UploadCloudIcon className="w-4 h-4" /> Load
                                      </Button>
                                      <Button onClick={() => onPublishRequest(version, model.name)} className="!bg-green-600 hover:!bg-green-500 focus:!ring-green-500 text-xs px-2 py-1">
                                          <UploadCloudIcon className="w-4 h-4" /> Publish
                                      </Button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <p>Your gallery is empty.</p>
                <p className="text-sm">Create and save a model to see it here.</p>
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
      <ConfirmationModal
        isOpen={!!modelForDeletion}
        onClose={() => setModelForDeletion(null)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the blueprint "${modelForDeletion?.name}"? All of its versions will be permanently removed. This action cannot be undone.`}
      />
    </>
  );
};