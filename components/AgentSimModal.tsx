import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { DicesIcon, BotIcon, FileTextIcon, InfinityIcon } from './icons/Icons';
import type { AgentConfig, GridCell, AgentAction } from '../types';

interface AgentSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
  onSimulate: (task: string) => AsyncGenerator<AgentAction>;
}

const GRID_SIZE = 10;

const generateInitialGrid = (): GridCell[][] => {
    const grid = Array.from({ length: GRID_SIZE }, () => 
        Array.from({ length: GRID_SIZE }, () => ({ type: 'empty' } as GridCell))
    );
    // Add some obstacles
    for (let i = 0; i < 15; i++) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        grid[y][x] = { type: 'obstacle' };
    }
    // Add data nodes
    for (let i = 0; i < 5; i++) {
        const x = Math.floor(Math.random() * GRID_SIZE);
        const y = Math.floor(Math.random() * GRID_SIZE);
        if(grid[y][x].type === 'empty') grid[y][x] = { type: 'dataNode' };
    }
    // Add goal
    const gx = Math.floor(Math.random() * GRID_SIZE);
    const gy = Math.floor(Math.random() * GRID_SIZE);
    if(grid[gy][gx].type === 'empty') grid[gy][gx] = { type: 'goal' };

    return grid;
};

const Cell: React.FC<{ type: GridCell['type'] }> = ({ type }) => {
    const baseClass = "w-full h-full rounded flex items-center justify-center transition-colors";
    switch(type) {
        case 'obstacle': return <div className={`${baseClass} bg-slate-700`} title="Obstacle"></div>;
        case 'dataNode': return <div className={`${baseClass} bg-cyan-800`} title="Data Node"><FileTextIcon className="w-4 h-4 text-cyan-300"/></div>;
        case 'goal': return <div className={`${baseClass} bg-fuchsia-800`} title="Goal"><InfinityIcon className="w-4 h-4 text-fuchsia-300"/></div>;
        default: return <div className={`${baseClass} bg-slate-800/50`}></div>;
    }
};

export const AgentSimModal: React.FC<AgentSimModalProps> = ({ isOpen, onClose, config, onSimulate }) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [agentPos, setAgentPos] = useState<[number, number]>([0, 0]);
  const [task, setTask] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');

  useEffect(() => {
    if (isOpen) {
      const newGrid = generateInitialGrid();
      setGrid(newGrid);
      const startX = Math.floor(Math.random() * GRID_SIZE);
      const startY = Math.floor(Math.random() * GRID_SIZE);
      setAgentPos([startX, startY]);
      setLogs(['Simulation environment initialized. Agent deployed.']);
      setTask('');
      setSimStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  const handleStartSimulation = async () => {
    if (!task.trim() || isSimulating) return;
    setIsSimulating(true);
    setSimStatus('running');
    setLogs(prev => [`Task received: "${task}"`]);
    
    try {
        for await (const action of onSimulate(task)) {
            await new Promise(res => setTimeout(res, 300)); // Delay for visualization
            setLogs(prev => [...prev, `[${action.action.toUpperCase()}] ${action.reason}`]);
            if (action.action === 'move' && action.to) {
                setAgentPos(action.to);
            }
            if (action.action === 'complete' || action.action === 'fail') {
                setSimStatus(action.action);
                break;
            }
        }
    } catch(e) {
        console.error(e);
        setLogs(prev => [...prev, "ERROR: Simulation stream failed."]);
        setSimStatus('failed');
    } finally {
        setIsSimulating(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 modal-enter"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <Card.Header className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <DicesIcon className="w-6 h-6 text-[rgb(var(--color-ethical-val))]" />
                <div>
                    <Card.Title>Agent Simulation Chamber</Card.Title>
                    <Card.Description>Test the agent's behavior in a dynamic world state.</Card.Description>
                </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl leading-none">&times;</button>
        </Card.Header>
        <Card.Content className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
            <div className="w-full md:w-1/2 flex-shrink-0 aspect-square bg-black/20 p-2 rounded-lg grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`}}>
                {grid.map((row, y) => row.map((cell, x) => (
                    <div key={`${x}-${y}`} className="relative">
                        <Cell type={cell.type} />
                        {agentPos[0] === x && agentPos[1] === y && (
                            <div className="absolute inset-0 flex items-center justify-center" title="Agent">
                                <BotIcon className="w-5 h-5 text-fuchsia-400 animate-pulse" />
                            </div>
                        )}
                    </div>
                )))}
            </div>
             <div className="w-full md:w-1/2 flex-grow flex flex-col gap-2 overflow-hidden">
                <div className="flex-shrink-0">
                    <input 
                        type="text"
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        placeholder="e.g., 'Find all data nodes'"
                        className="w-full bg-slate-800/50 border border-[rgb(var(--color-border-val)/0.3)] rounded-lg p-2 text-sm"
                        disabled={isSimulating}
                    />
                    <Button onClick={handleStartSimulation} disabled={!task.trim() || isSimulating} className="w-full mt-2">
                        {isSimulating ? 'Simulating...' : 'Execute Task'}
                    </Button>
                </div>
                <div className="flex-grow bg-black/20 p-2 rounded-lg overflow-y-auto scrollbar-thin">
                    <h4 className="font-semibold text-slate-300 mb-2">Simulation Log</h4>
                    <div className="space-y-1 text-xs font-mono text-slate-400">
                        {logs.map((log, i) => <p key={i} className="whitespace-pre-wrap">&gt; {log}</p>)}
                         {simStatus === 'completed' && <p className="text-green-400 font-bold">&gt; SIMULATION COMPLETED</p>}
                         {simStatus === 'failed' && <p className="text-red-400 font-bold">&gt; SIMULATION FAILED</p>}
                    </div>
                </div>
            </div>
        </Card.Content>
      </Card>
    </div>
  );
};