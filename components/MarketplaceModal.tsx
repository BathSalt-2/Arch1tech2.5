import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { DollarSignIcon, DownloadIcon, StoreIcon, CubeIcon, BotIcon, WorkflowIcon, AppIcon, UploadCloudIcon } from './icons/Icons';
import type { MarketplaceAsset, UnifiedConfig } from '../types';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketplaceAsset[];
  onAcquire: (asset: MarketplaceAsset) => void;
}

const AssetCard: React.FC<{ asset: MarketplaceAsset; onAcquire: (asset: MarketplaceAsset) => void; }> = ({ asset, onAcquire }) => {
    const getIcon = (type: UnifiedConfig['type']) => {
        switch (type) {
            case 'llm': return <CubeIcon className="w-5 h-5" />;
            case 'agent': return <BotIcon className="w-5 h-5" />;
            case 'workflow': return <WorkflowIcon className="w-5 h-5" />;
            case 'app': return <AppIcon className="w-5 h-5" />;
        }
    }
    
    const getLicenseColor = (license: MarketplaceAsset['license']) => {
        switch (license) {
            case 'OOML': return 'text-green-400';
            case 'Commercial': return 'text-cyan-400';
            case 'Subscription': return 'text-yellow-400';
        }
    }

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 flex flex-col gap-3 border border-transparent hover:border-[rgb(var(--color-accent-val)/0.5)] transition-all">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-[rgb(var(--color-primary-light-val))] text-lg">{asset.assetName}</h4>
                    <p className="text-xs text-slate-400">by {asset.creator}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs bg-slate-700/50 px-2 py-1 rounded-full text-slate-300" title={`Asset Type: ${asset.config.type.toUpperCase()}`}>
                    {getIcon(asset.config.type)}
                    <span>{asset.config.type.toUpperCase()}</span>
                </div>
            </div>
            <p className="text-sm text-slate-300 flex-grow">{asset.description}</p>
            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-[rgb(var(--color-border-val)/0.1)] pt-3">
                <div className="flex gap-4">
                    <span className={`font-bold ${getLicenseColor(asset.license)}`}>{asset.license}</span>
                     <div className="flex items-center gap-1" title="Downloads">
                        <DownloadIcon className="w-3 h-3" />
                        <span>{asset.downloads}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 font-bold text-lg text-amber-300">
                    <DollarSignIcon className="w-4 h-4" />
                    <span>{asset.license === 'Subscription' ? `${asset.cost}/mo` : asset.cost}</span>
                </div>
            </div>
            <Button onClick={() => onAcquire(asset)} className="w-full mt-2 !bg-indigo-600 hover:!bg-indigo-500 focus:!ring-indigo-500">
                <UploadCloudIcon className="w-4 h-4" /> Acquire Blueprint
            </Button>
        </div>
    );
};


export const MarketplaceModal: React.FC<MarketplaceModalProps> = ({ isOpen, onClose, assets, onAcquire }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
              <StoreIcon className="w-8 h-8 text-[rgb(var(--color-ethical-val))]" />
              <div>
                <Card.Title>Asset Marketplace</Card.Title>
                <Card.Description>Discover, acquire, and share blueprints with other architects.</Card.Description>
              </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </Card.Header>
        <Card.Content className="overflow-y-auto pr-2 scrollbar-thin">
          {assets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.sort((a, b) => b.downloads - a.downloads).map(asset => (
                    <AssetCard key={asset.id} asset={asset} onAcquire={onAcquire} />
                ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <p className="text-lg">The Marketplace is currently empty.</p>
              <p className="text-sm mt-2">Publish your own blueprints from the Gallery to get started!</p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};