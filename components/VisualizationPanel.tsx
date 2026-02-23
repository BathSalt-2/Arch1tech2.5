import React, { useEffect, useRef } from 'react';
import type { UnifiedConfig, ModelConfig, AgentConfig, WorkflowConfig, AppConfig } from '../types';
import { Card } from './ui/Card';

interface VisualizationPanelProps {
  config: UnifiedConfig;
}

const styles = `
  @keyframes viz-pulse {
    0%, 100% { opacity: 1; r: 8; }
    50% { opacity: 0.5; r: 10; }
  }
  @keyframes viz-flow {
    0% { stroke-dashoffset: 20; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes viz-orbit {
    from { transform-origin: 200px 180px; transform: rotate(0deg); }
    to { transform-origin: 200px 180px; transform: rotate(360deg); }
  }
  @keyframes viz-glow {
    0%, 100% { filter: drop-shadow(0 0 4px currentColor); }
    50% { filter: drop-shadow(0 0 12px currentColor); }
  }
  @keyframes viz-dot-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes viz-badge-fade {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
  .viz-node-pulse { animation: viz-pulse 2s ease-in-out infinite; }
  .viz-flow-line { stroke-dasharray: 6 4; animation: viz-flow 1s linear infinite; }
  .viz-glow { animation: viz-glow 2.5s ease-in-out infinite; }
  .viz-blink { animation: viz-dot-blink 1s ease-in-out infinite; }
  .viz-badge { animation: viz-badge-fade 3s ease-in-out infinite; }
`;

// ─── LLM Neural Network Visualization ────────────────────────────────────────
const LLMVisualization: React.FC<{ config: ModelConfig }> = ({ config }) => {
  const { core, memory, selfImprovement, expertise, ethicalMatrix } = config;

  const visLayers = Math.min(core.layers, 8);
  const nodesPerLayer = Math.min(core.heads, 6);
  const svgWidth = 420;
  const svgHeight = 340;
  const layerSpacing = svgWidth / (visLayers + 2);
  const nodeSpacing = 40;

  const ethColor = (() => {
    const u = ethicalMatrix.utilitarianism;
    const d = ethicalMatrix.deontology;
    const t = ethicalMatrix.transparency;
    if (u >= d && u >= t) return '#34d399'; // green
    if (d >= u && d >= t) return '#a78bfa'; // purple
    return '#22d3ee'; // cyan
  })();

  // Build layers: input (1 node) + hidden (nodesPerLayer) + output (1 node)
  const layers: { x: number; nodes: { y: number; key: string }[] }[] = [];

  // Input layer
  layers.push({
    x: layerSpacing,
    nodes: [{ y: svgHeight / 2, key: 'in-0' }],
  });

  // Hidden layers
  for (let l = 0; l < visLayers; l++) {
    const x = layerSpacing * (l + 2);
    const nodes = [];
    const totalH = (nodesPerLayer - 1) * nodeSpacing;
    const startY = svgHeight / 2 - totalH / 2;
    for (let n = 0; n < nodesPerLayer; n++) {
      nodes.push({ y: startY + n * nodeSpacing, key: `h-${l}-${n}` });
    }
    layers.push({ x, nodes });
  }

  // Output layer
  layers.push({
    x: layerSpacing * (visLayers + 2),
    nodes: [{ y: svgHeight / 2, key: 'out-0' }],
  });

  // Build connection lines between adjacent layers (sample, not all to avoid clutter)
  const connections: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  for (let li = 0; li < layers.length - 1; li++) {
    const fromLayer = layers[li];
    const toLayer = layers[li + 1];
    // Connect each from-node to first 2 to-nodes to avoid over-clutter
    fromLayer.nodes.forEach((fn, fi) => {
      toLayer.nodes.slice(0, 3).forEach((tn, ti) => {
        connections.push({
          x1: fromLayer.x, y1: fn.y,
          x2: toLayer.x, y2: tn.y,
          key: `conn-${li}-${fi}-${ti}`,
        });
      });
    });
  }

  const memModules = [
    { label: 'EPI', active: memory.episodicMemory, color: '#f59e0b', x: 30, y: 60 },
    { label: 'KG', active: memory.knowledgeGraph, color: '#10b981', x: 30, y: 110 },
  ];

  const selfModules = [
    { label: 'RSM', active: selfImprovement.recursiveStabilityMonitor, color: '#f472b6' },
    { label: 'DAE', active: selfImprovement.dynamicAlignmentEngine, color: '#38bdf8' },
    { label: 'IO', active: selfImprovement.introspectionOrchestrator, color: '#a78bfa' },
  ];

  return (
    <svg viewBox={`0 0 ${svgWidth} ${svgHeight + 60}`} className="w-full h-full" style={{ maxHeight: 380 }}>
      <defs>
        <filter id="glow-filter">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ethColor} stopOpacity="0.2" />
          <stop offset="50%" stopColor={ethColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={ethColor} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Connection lines */}
      {connections.map(c => (
        <line
          key={c.key}
          x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
          stroke={ethColor}
          strokeOpacity="0.25"
          strokeWidth="0.8"
          className="viz-flow-line"
        />
      ))}

      {/* Nodes */}
      {layers.map((layer, li) => (
        layer.nodes.map((node) => {
          const isInputOutput = li === 0 || li === layers.length - 1;
          const r = isInputOutput ? 10 : 7;
          const fill = isInputOutput ? ethColor : '#1e293b';
          const stroke = ethColor;
          return (
            <circle
              key={node.key}
              cx={layer.x}
              cy={node.y}
              r={r}
              fill={fill}
              stroke={stroke}
              strokeWidth="1.5"
              filter="url(#glow-filter)"
              className="viz-node-pulse"
              style={{ animationDelay: `${Math.random() * 2}s` }}
            />
          );
        })
      ))}

      {/* Layer count label */}
      <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle" fill="#64748b" fontSize="10">
        {visLayers} hidden layers × {nodesPerLayer} heads
      </text>

      {/* Memory side modules */}
      {memModules.map(m => (
        <g key={m.label} opacity={m.active ? 1 : 0.3}>
          <rect x={m.x - 18} y={m.y - 12} width={36} height={24} rx={4}
            fill="#0f172a" stroke={m.color} strokeWidth="1.5" />
          <text x={m.x} y={m.y + 4} textAnchor="middle" fill={m.color} fontSize="9" fontWeight="bold">
            {m.label}
          </text>
          {m.active && (
            <circle cx={m.x + 14} cy={m.y - 8} r={3} fill={m.color} className="viz-blink" />
          )}
          {/* Dashed line to input */}
          <line x1={m.x + 18} y1={m.y} x2={layerSpacing} y2={svgHeight / 2}
            stroke={m.color} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.5" />
        </g>
      ))}

      {/* Self-improvement status indicators */}
      {selfModules.map((sm, i) => (
        <g key={sm.label}>
          <rect
            x={svgWidth - 50}
            y={60 + i * 35}
            width={42}
            height={22}
            rx={4}
            fill="#0f172a"
            stroke={sm.active ? sm.color : '#334155'}
            strokeWidth="1.5"
            opacity={sm.active ? 1 : 0.4}
          />
          <text
            x={svgWidth - 29}
            y={60 + i * 35 + 14}
            textAnchor="middle"
            fill={sm.active ? sm.color : '#475569'}
            fontSize="8"
            fontWeight="bold"
          >
            {sm.label}
          </text>
          {sm.active && (
            <circle
              cx={svgWidth - 13}
              cy={60 + i * 35 + 5}
              r={3}
              fill={sm.color}
              className="viz-blink"
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          )}
        </g>
      ))}

      {/* Ethical matrix bars */}
      <g transform={`translate(70, ${svgHeight + 5})`}>
        <text x={0} y={10} fill="#64748b" fontSize="9">ΣTHIC-MATRIX</text>
        {[
          { label: 'U', value: ethicalMatrix.utilitarianism, color: '#34d399' },
          { label: 'D', value: ethicalMatrix.deontology, color: '#a78bfa' },
          { label: 'T', value: ethicalMatrix.transparency, color: '#22d3ee' },
        ].map((e, i) => (
          <g key={e.label} transform={`translate(${i * 90}, 16)`}>
            <text fill={e.color} fontSize="8" y={10}>{e.label}</text>
            <rect x={12} y={2} width={70} height={8} rx={2} fill="#1e293b" />
            <rect x={12} y={2} width={e.value * 0.7} height={8} rx={2} fill={e.color} opacity="0.8" />
            <text x={85} y={10} fill={e.color} fontSize="8">{e.value}</text>
          </g>
        ))}
      </g>

      {/* Expertise domain badges */}
      {expertise.domains.slice(0, 4).map((d, i) => (
        <g key={d} transform={`translate(${60 + i * 90}, ${svgHeight + 42})`} className="viz-badge">
          <rect x={0} y={0} width={80} height={16} rx={8} fill="#0f172a" stroke={ethColor} strokeWidth="1" />
          <text x={40} y={11} textAnchor="middle" fill={ethColor} fontSize="8">{d.length > 10 ? d.slice(0, 10) + '…' : d}</text>
        </g>
      ))}
    </svg>
  );
};

// ─── Agent Radial Visualization ───────────────────────────────────────────────
const AgentVisualization: React.FC<{ config: AgentConfig }> = ({ config }) => {
  const cx = 210, cy = 175;
  const r = 90;
  const toolColors: Record<string, string> = {
    'Web Search': '#38bdf8',
    'File System Access': '#f59e0b',
    'Code Interpreter': '#34d399',
    'API Connector': '#a78bfa',
  };
  const goalColor = '#f472b6';

  return (
    <svg viewBox="0 0 420 350" className="w-full h-full" style={{ maxHeight: 380 }}>
      <defs>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="3" result="cb" />
          <feMerge><feMergeNode in="cb" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Autonomous orbit ring */}
      {config.autonomous && (
        <circle cx={cx} cy={cy} r={r + 20} fill="none"
          stroke="#22d3ee" strokeWidth="1" strokeDasharray="8 4"
          opacity="0.4" className="viz-flow-line" />
      )}

      {/* Connection lines to tools */}
      {config.tools.map((tool, i) => {
        const angle = (i / Math.max(config.tools.length, 1)) * 2 * Math.PI - Math.PI / 2;
        const tx = cx + r * Math.cos(angle);
        const ty = cy + r * Math.sin(angle);
        return (
          <line key={tool} x1={cx} y1={cy} x2={tx} y2={ty}
            stroke={toolColors[tool] || '#64748b'}
            strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6"
            className="viz-flow-line" />
        );
      })}

      {/* Tool nodes */}
      {config.tools.map((tool, i) => {
        const angle = (i / Math.max(config.tools.length, 1)) * 2 * Math.PI - Math.PI / 2;
        const tx = cx + r * Math.cos(angle);
        const ty = cy + r * Math.sin(angle);
        const color = toolColors[tool] || '#64748b';
        const abbr = tool.split(' ').map(w => w[0]).join('');
        return (
          <g key={tool}>
            <circle cx={tx} cy={ty} r={22} fill="#0f172a" stroke={color} strokeWidth="2"
              filter="url(#glow2)" className="viz-glow" style={{ color, animationDelay: `${i * 0.5}s` }} />
            <text x={tx} y={ty - 4} textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">{abbr}</text>
            <text x={tx} y={ty + 8} textAnchor="middle" fill={color} fontSize="7">{tool.split(' ')[0]}</text>
          </g>
        );
      })}

      {/* Central agent node */}
      <circle cx={cx} cy={cy} r={38} fill="#0f172a" stroke="#22d3ee" strokeWidth="2.5"
        filter="url(#glow2)" className="viz-node-pulse" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="bold">AGENT</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#94a3b8" fontSize="8">{config.goal}</text>
      {config.autonomous && (
        <text x={cx} y={cy + 20} textAnchor="middle" fill="#34d399" fontSize="7">● AUTO</text>
      )}

      {/* Goal target node */}
      <g>
        <line x1={cx} y1={cy} x2={cx} y2={cy + r + 60}
          stroke={goalColor} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"
          className="viz-flow-line" />
        <circle cx={cx} cy={cy + r + 65} r={20} fill="#0f172a" stroke={goalColor} strokeWidth="2"
          filter="url(#glow2)" className="viz-glow" style={{ color: goalColor }} />
        <text x={cx} y={cy + r + 60} textAnchor="middle" fill={goalColor} fontSize="8">GOAL</text>
        <text x={cx} y={cy + r + 72} textAnchor="middle" fill={goalColor} fontSize="7">
          {config.goal.split(' ')[0]}
        </text>
      </g>

      {/* Labels */}
      <text x={cx} y={20} textAnchor="middle" fill="#475569" fontSize="10">
        {config.tools.length} tools active {config.autonomous ? '· AUTONOMOUS MODE' : ''}
      </text>
    </svg>
  );
};

// ─── Workflow Flowchart Visualization ────────────────────────────────────────
const WorkflowVisualization: React.FC<{ config: WorkflowConfig }> = ({ config }) => {
  const steps = config.steps;
  const typeColors: Record<string, string> = {
    Trigger: '#f59e0b', Action: '#38bdf8', Logic: '#a78bfa', Output: '#34d399',
  };
  const boxW = 160, boxH = 36, gap = 20;
  const svgH = steps.length * (boxH + gap) + 40;
  const cx = 210;

  return (
    <svg viewBox={`0 0 420 ${Math.max(svgH, 200)}`} className="w-full h-full" style={{ maxHeight: 400 }}>
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L0,8 L8,4 Z" fill="#38bdf8" />
        </marker>
      </defs>
      <text x={cx} y={20} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold">
        {config.name} · {steps.length} steps
      </text>
      {steps.map((step, i) => {
        const y = 30 + i * (boxH + gap);
        const color = typeColors[step.type] || '#64748b';
        const hasNext = i < steps.length - 1;
        return (
          <g key={step.id}>
            {/* Arrow to next */}
            {hasNext && (
              <line
                x1={cx} y1={y + boxH}
                x2={cx} y2={y + boxH + gap}
                stroke="#38bdf8" strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
                className="viz-flow-line"
              />
            )}
            {/* Step box */}
            <rect
              x={cx - boxW / 2} y={y}
              width={boxW} height={boxH}
              rx={6}
              fill="#0f172a"
              stroke={color}
              strokeWidth="1.8"
            />
            {/* Type badge */}
            <rect
              x={cx - boxW / 2} y={y}
              width={50} height={boxH}
              rx={6}
              fill={color}
              opacity={0.15}
            />
            <rect
              x={cx - boxW / 2 + 50} y={y}
              width={4} height={boxH}
              fill={color} opacity={0.5}
            />
            <text x={cx - boxW / 2 + 25} y={y + boxH / 2 + 4}
              textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">
              {step.type}
            </text>
            <text
              x={cx - boxW / 2 + 60}
              y={y + boxH / 2 + 4}
              fill="#cbd5e1"
              fontSize="9"
            >
              {step.description.length > 16 ? step.description.slice(0, 16) + '…' : step.description}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── App Architecture Stack Visualization ────────────────────────────────────
const AppVisualization: React.FC<{ config: AppConfig }> = ({ config }) => {
  const layers = [
    { label: 'FRONTEND', value: config.frontend, color: '#38bdf8', icon: '⬡' },
    { label: 'BACKEND', value: config.backend, color: '#a78bfa', icon: '⬢' },
    { label: 'DATABASE', value: config.database, color: '#f59e0b', icon: '⬣' },
  ];
  if (config.realtime) {
    layers.push({ label: 'REALTIME', value: 'WebSocket/SSE', color: '#34d399', icon: '⚡' });
  }

  const cx = 210, boxW = 200, boxH = 48, gap = 28;

  return (
    <svg viewBox={`0 0 420 ${layers.length * (boxH + gap) + 60}`} className="w-full h-full" style={{ maxHeight: 380 }}>
      <defs>
        <marker id="arrowhead2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L0,8 L8,4 Z" fill="#64748b" />
        </marker>
      </defs>
      <text x={cx} y={20} textAnchor="middle" fill="#64748b" fontSize="10">
        App Architecture {config.realtime ? '· REALTIME ENABLED' : ''}
      </text>
      {layers.map((layer, i) => {
        const y = 32 + i * (boxH + gap);
        const hasNext = i < layers.length - 1;
        return (
          <g key={layer.label}>
            {hasNext && (
              <line
                x1={cx} y1={y + boxH}
                x2={cx} y2={y + boxH + gap}
                stroke="#475569" strokeWidth="1.5"
                strokeDasharray="4 3"
                markerEnd="url(#arrowhead2)"
              />
            )}
            <rect
              x={cx - boxW / 2} y={y}
              width={boxW} height={boxH}
              rx={8}
              fill="#0f172a"
              stroke={layer.color}
              strokeWidth="2"
            />
            <text x={cx - boxW / 2 + 20} y={y + 20}
              fill={layer.color} fontSize="18">{layer.icon}</text>
            <text x={cx - boxW / 2 + 48} y={y + 18}
              fill={layer.color} fontSize="10" fontWeight="bold">{layer.label}</text>
            <text x={cx - boxW / 2 + 48} y={y + 34}
              fill="#94a3b8" fontSize="11">{layer.value}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ─── Main Panel Component ─────────────────────────────────────────────────────
export const VisualizationPanel = React.forwardRef<HTMLDivElement, VisualizationPanelProps>(
  ({ config }, ref) => {
    return (
      <Card className="h-full flex flex-col" ref={ref}>
        <style>{styles}</style>
        <Card.Header className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full viz-blink"
              style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 0 6px var(--color-primary)' }}
            />
            <Card.Title>Σ-MATRIX VISUALIZATION</Card.Title>
          </div>
          <Card.Description>
            {config.type === 'llm' && 'Neural architecture · live parameter map'}
            {config.type === 'agent' && 'Agent topology · tool network'}
            {config.type === 'workflow' && 'Workflow graph · step sequence'}
            {config.type === 'app' && 'Application stack · layer diagram'}
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex-grow overflow-hidden flex items-center justify-center p-2">
          {config.type === 'llm' && <LLMVisualization config={config} />}
          {config.type === 'agent' && <AgentVisualization config={config} />}
          {config.type === 'workflow' && <WorkflowVisualization config={config} />}
          {config.type === 'app' && <AppVisualization config={config} />}
        </Card.Content>
      </Card>
    );
  }
);

VisualizationPanel.displayName = 'VisualizationPanel';
