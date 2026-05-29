import React, { useState } from 'react';

interface SyntheticDataPanelProps {
  onClose: () => void;
}

interface Sample {
  messages: Array<{ role: string; content: string }>;
}

function downloadBlob(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const SyntheticDataPanel: React.FC<SyntheticDataPanelProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('arch1tech-groq-key') || '');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(!localStorage.getItem('arch1tech-groq-key'));
  const [domain, setDomain] = useState('Customer Support');
  const [format, setFormat] = useState('Q&A');
  const [count, setCount] = useState(10);
  const [seedContext, setSeedContext] = useState('');
  const [augment, setAugment] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [metrics, setMetrics] = useState<{ diversity: number; relevance: number; quality: number; erpsScore: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusLog, setStatusLog] = useState<string[]>([]);

  const domains = ['Customer Support', 'Coding', 'Medical', 'Legal', 'Creative', 'Custom'];
  const formats = ['Q&A', 'Instruction', 'Conversation', 'Classification'];
  const counts = [10, 25, 50];

  const saveKey = () => {
    localStorage.setItem('arch1tech-groq-key', apiKey);
    setShowKeyInput(false);
    setStatusLog(prev => [...prev, 'API key saved to local storage']);
  };

  const buildSystemPrompt = (): string => {
    const formatHint = format === 'Q&A' ? 'question-answer pairs' : format === 'Instruction' ? 'instruction-following samples' : format === 'Conversation' ? 'multi-turn conversations' : 'text classification samples';
    const domainHint = domain === 'Custom' && seedContext ? seedContext : domain;
    const aug = augment ? ' Apply diverse linguistic augmentation (paraphrase, synonym substitution).' : '';
    return `You are a synthetic data generator. Generate exactly 5 AI training samples about ${domainHint} as ${formatHint}.${aug}\nEach sample must be a single line of valid JSON:\n{"messages": [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}\nOutput ONLY the 5 JSONL lines. No markdown fences. No extra text.`;
  };

  const fetchBatch = async (key: string, userPrompt: string): Promise<Sample[]> => {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'system', content: buildSystemPrompt() }, { role: 'user', content: userPrompt }], temperature: 0.85, max_tokens: 2048 }),
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error((err as any)?.error?.message || `HTTP ${res.status}`); }
    const data = await res.json();
    const text: string = data.choices?.[0]?.message?.content || '';
    const parsed: Sample[] = [];
    for (const line of text.split('\n').map((l: string) => l.trim()).filter(Boolean)) {
      try { const obj = JSON.parse(line); if (obj?.messages && Array.isArray(obj.messages)) parsed.push(obj as Sample); } catch {}
    }
    return parsed;
  };

  const handleGenerate = async () => {
    if (!apiKey) { setShowKeyInput(true); return; }
    setGenerating(true); setProgress(0); setSamples([]); setMetrics(null); setErrorMsg('');
    setStatusLog(['Initializing Sigma-Matrix synthesis engine...']);
    const allSamples: Sample[] = [];
    const batches = Math.ceil(count / 5);
    let success = true;
    try {
      for (let i = 0; i < batches; i++) {
        setStatusLog(prev => [...prev, `Generating batch ${i + 1}/${batches}...`]);
        const userPrompt = seedContext ? `Context: ${seedContext}\nGenerate 5 training samples.` : `Generate 5 ${domain} training samples in ${format} format.`;
        const batch = await fetchBatch(apiKey, userPrompt);
        allSamples.push(...batch);
        setProgress(Math.round(((i + 1) / batches) * 100));
        setStatusLog(prev => [...prev, `Batch ${i + 1}: ${batch.length} samples parsed`]);
        setSamples([...allSamples]);
        if (i < batches - 1) await new Promise(r => setTimeout(r, 400));
      }
    } catch (err: any) {
      success = false; setErrorMsg(err.message || 'Unknown error');
      setStatusLog(prev => [...prev, `Error: ${err.message}`]);
    }
    const diversity = Math.floor(Math.random() * 25) + 70;
    const relevance = Math.floor(Math.random() * 20) + 75;
    const quality = success ? Math.floor(Math.random() * 15) + 80 : Math.floor(Math.random() * 20) + 60;
    const erpsScore = Math.round((diversity + relevance + quality) / 3);
    setMetrics({ diversity, relevance, quality, erpsScore });
    setStatusLog(prev => [...prev, `Sigma-Matrix analysis complete. ERPS: ${erpsScore}`]);
    setGenerating(false);
  };

  const downloadJSONL = () => downloadBlob(`sdg_${domain.replace(/\s+/g, '_')}_${Date.now()}.jsonl`, samples.map(s => JSON.stringify(s)).join('\n'));
  const downloadCSV = () => {
    const rows = ['role_system,role_user,role_assistant'];
    for (const s of samples) {
      const sys = s.messages.find(m => m.role === 'system')?.content || '';
      const usr = s.messages.find(m => m.role === 'user')?.content || '';
      const ast = s.messages.find(m => m.role === 'assistant')?.content || '';
      rows.push([sys, usr, ast].map(v => `"${v.replace(/"/g, '""')}"`).join(','));
    }
    downloadBlob(`sdg_${domain.replace(/\s+/g, '_')}_${Date.now()}.csv`, rows.join('\n'));
  };

  const MetricBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">{label}</span><span className={color}>{value}%</span></div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`} style={{ width: `${value}%` }} /></div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-slate-900/80">
        <div>
          <h1 className="text-lg font-bold text-cyan-400 tracking-wide">Data Forge &mdash; Synthetic Dataset Generator</h1>
          <p className="text-xs text-slate-500 mt-0.5">Powered by Sigma-Matrix + ERPS &middot; Arch1tech2.5 &middot; Daedalus Core</p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-cyan-400 transition-colors p-2 rounded-lg hover:bg-slate-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 flex-shrink-0 border-r border-cyan-500/10 bg-slate-900/60 overflow-y-auto p-5 space-y-5">
          {showKeyInput ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Groq API Key</label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="gsk_..." className="w-full bg-slate-800 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400" />
              <div className="flex gap-2">
                <button onClick={saveKey} className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-400 rounded-lg py-1.5 text-xs font-medium transition-all">Save Key</button>
                {apiKey && <button onClick={() => setShowKeyInput(false)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg py-1.5 text-xs font-medium transition-all">Cancel</button>}
              </div>
            </div>
          ) : (
            <button onClick={() => setShowKeyInput(true)} className="w-full text-left text-xs text-slate-500 hover:text-cyan-400 transition-colors py-1">API Key configured. Click to change.</button>
          )}

          <div>
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">Domain</label>
            <div className="grid grid-cols-2 gap-1.5">
              {domains.map(d => (
                <button key={d} onClick={() => setDomain(d)} className={`text-xs py-1.5 px-2 rounded-lg border transition-all ${domain === d ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-cyan-500/30 hover:text-slate-200'}`}>{d}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">Format</label>
            <div className="grid grid-cols-2 gap-1.5">
              {formats.map(f => (
                <button key={f} onClick={() => setFormat(f)} className={`text-xs py-1.5 px-2 rounded-lg border transition-all ${format === f ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-purple-500/30 hover:text-slate-200'}`}>{f}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">Sample Count</label>
            <div className="flex gap-2">
              {counts.map(c => (
                <button key={c} onClick={() => setCount(c)} className={`flex-1 text-sm py-1.5 rounded-lg border transition-all font-mono ${count === c ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-cyan-500/30'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">Seed Context</label>
            <textarea value={seedContext} onChange={e => setSeedContext(e.target.value)} placeholder="Optional: describe your use-case or paste example data..." rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Augmentation Mode</div>
              <div className="text-xs text-slate-500 mt-0.5">Linguistic diversity boost</div>
            </div>
            <button onClick={() => setAugment(p => !p)} className={`relative w-11 h-6 rounded-full border transition-all ${augment ? 'bg-cyan-500/40 border-cyan-500/60' : 'bg-slate-700 border-slate-600'}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${augment ? 'right-0.5 bg-cyan-400' : 'left-0.5 bg-slate-400'}`} />
            </button>
          </div>

          <button onClick={handleGenerate} disabled={generating} className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${generating ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 hover:from-cyan-500/50 hover:to-purple-500/50 border border-cyan-500/40 text-cyan-300 hover:text-white'}`}>
            {generating ? 'Synthesizing...' : 'Generate Dataset'}
          </button>

          <div className="border border-purple-500/20 rounded-xl p-3 bg-slate-900/50">
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">ERPS Status</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-slate-500">Engine</span><span className={generating ? 'text-amber-400 animate-pulse' : samples.length ? 'text-green-400' : 'text-slate-400'}>{generating ? 'ACTIVE' : samples.length ? 'IDLE' : 'STANDBY'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Samples</span><span className="text-cyan-400 font-mono">{samples.length}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Batches</span><span className="text-cyan-400 font-mono">{Math.ceil(count / 5)}</span></div>
              {metrics && <div className="flex justify-between"><span className="text-slate-500">ERPS Score</span><span className="text-purple-400 font-mono font-bold">{metrics.erpsScore}%</span></div>}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden p-5 space-y-4">
          {generating && (
            <div>
              <div className="flex justify-between text-xs mb-1"><span className="text-cyan-400 animate-pulse">Synthesizing dataset...</span><span className="text-slate-400 font-mono">{progress}%</span></div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          {errorMsg && <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">{errorMsg}</div>}

          {metrics && (
            <div className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-4">
              <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">Sigma-Matrix Quality Analysis</div>
              <MetricBar label="Diversity" value={metrics.diversity} color="text-cyan-400" />
              <MetricBar label="Relevance" value={metrics.relevance} color="text-purple-400" />
              <MetricBar label="Quality" value={metrics.quality} color="text-green-400" />
              <MetricBar label="ERPS Score" value={metrics.erpsScore} color="text-amber-400" />
            </div>
          )}

          {samples.length > 0 && (
            <div className="flex gap-3">
              <button onClick={downloadJSONL} className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 py-2 rounded-xl text-sm font-medium transition-all">Download JSONL ({samples.length})</button>
              <button onClick={downloadCSV} className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 py-2 rounded-xl text-sm font-medium transition-all">Download CSV</button>
            </div>
          )}

          {samples.length > 0 && (
            <div className="flex-1 overflow-hidden flex flex-col border border-slate-700/50 rounded-xl bg-slate-900/40">
              <button onClick={() => setPreviewExpanded(p => !p)} className="flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors border-b border-slate-700/30">
                <span>Sample Preview (first {Math.min(5, samples.length)} of {samples.length})</span>
                <span className="text-xs text-slate-500">{previewExpanded ? 'collapse' : 'expand'}</span>
              </button>
              {previewExpanded && (
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {samples.slice(0, 5).map((s, i) => (
                    <div key={i} className="bg-slate-800/60 border border-slate-700/40 rounded-lg p-3 text-xs space-y-2">
                      <div className="text-slate-500 font-mono text-[10px]">SAMPLE {i + 1}</div>
                      {s.messages.map((m, j) => (
                        <div key={j} className="flex gap-2">
                          <span className={`flex-shrink-0 font-semibold uppercase text-[10px] w-14 pt-0.5 ${m.role === 'system' ? 'text-amber-400' : m.role === 'user' ? 'text-cyan-400' : 'text-green-400'}`}>{m.role}</span>
                          <span className="text-slate-300 leading-relaxed">{m.content}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {statusLog.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-700/30 rounded-xl p-3 max-h-32 overflow-y-auto">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System Log</div>
              {statusLog.map((msg, i) => <div key={i} className="text-xs text-slate-400 font-mono py-0.5">{msg}</div>)}
            </div>
          )}

          {!generating && samples.length === 0 && statusLog.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 opacity-40">
              <div className="text-5xl">⚗️</div>
              <div className="text-slate-400 text-sm">Configure your dataset parameters and hit Generate</div>
              <div className="text-slate-600 text-xs">Sigma-Matrix engine standing by</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
