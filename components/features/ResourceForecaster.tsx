import React from 'react';
import type { UnifiedConfig } from '../../types';
import { LayersIcon, ZapIcon, DollarSignIcon } from '../icons/Icons';

interface ResourceForecasterProps {
    config: UnifiedConfig;
}

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string; }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-2 text-xs">
        <div className="text-slate-400">{icon}</div>
        <div>
            <div className="font-semibold text-slate-300">{label}</div>
            <div className="font-mono text-[rgb(var(--color-primary-light-val))]">{value}</div>
        </div>
    </div>
);

export const ResourceForecaster: React.FC<ResourceForecasterProps> = ({ config }) => {
    let params = 'N/A';
    let latency = 'N/A';
    let cost = 'N/A';

    if (config.type === 'llm') {
        const p = (config.core.layers * config.core.hiddenDimension * config.core.hiddenDimension * 12) / 1_000_000;
        params = `${p.toFixed(1)}M`;
        latency = `${50 + p * 2} ms`;
        cost = `$${(p / 1000).toFixed(3)}/1k`;
    } else if (config.type === 'agent') {
        params = 'Lightweight';
        latency = '< 100 ms';
        cost = 'Minimal';
    } else {
        params = 'Variable';
        latency = 'Variable';
        cost = 'Variable';
    }

    return (
        <div className="w-full bg-black/20 p-2 rounded-lg flex items-center justify-around gap-2 border border-[rgb(var(--color-border-val)/0.1)]">
            <Stat icon={<LayersIcon className="w-4 h-4" />} label="Parameters" value={params} />
            <Stat icon={<ZapIcon className="w-4 h-4" />} label="Est. Latency" value={latency} />
            <Stat icon={<DollarSignIcon className="w-4 h-4" />} label="Est. Cost" value={cost} />
        </div>
    );
};
