import React, { useEffect, useState } from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: '🤖',
    title: 'Forge Custom AI',
    desc: 'Describe your ideal AI in plain language. Astrid translates your vision into a precise architecture spec.',
  },
  {
    icon: '⚡',
    title: 'Live Blueprint',
    desc: 'Real-time spec generation as you type. Watch your configuration crystallize into deployable blueprints.',
  },
  {
    icon: '🧬',
    title: 'ERPS Analysis',
    desc: 'Deep introspective analysis of your model\'s ethical matrix, memory structures, and self-improvement modules.',
  },
  {
    icon: '🏪',
    title: 'The Marketplace',
    desc: 'Share your blueprints with the community and acquire proven architectures from fellow architects.',
  },
];

const styles = `
  @keyframes wm-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes wm-scale-in {
    from { opacity: 0; transform: scale(0.88) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes wm-glow-pulse {
    0%, 100% { text-shadow: 0 0 10px var(--color-primary), 0 0 30px var(--color-primary); }
    50% { text-shadow: 0 0 20px var(--color-primary), 0 0 60px var(--color-primary), 0 0 80px var(--color-accent); }
  }
  @keyframes wm-border-flow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes wm-scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  .wm-overlay { animation: wm-fade-in 0.3s ease forwards; }
  .wm-modal { animation: wm-scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
  .wm-title { animation: wm-glow-pulse 3s ease-in-out infinite; }
  .wm-scanline-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
    animation: wm-scanline 4s linear infinite;
    opacity: 0.4;
    pointer-events: none;
  }
`;

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay to let animation play
      const t = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{styles}</style>
      {/* Backdrop */}
      <div
        className="wm-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0,0,0,0.75)',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Modal */}
        <div
          className="wm-modal relative w-full max-w-2xl rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a0f1e 0%, #0f172a 50%, #0a0a1a 100%)',
            border: '1px solid var(--color-primary)',
            boxShadow: '0 0 60px color-mix(in srgb, var(--color-primary) 30%, transparent), inset 0 0 60px rgba(0,0,0,0.5)',
          }}
        >
          <div className="wm-scanline-bar" />

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <path d="M0,20 L0,0 L20,0" stroke="var(--color-primary)" strokeWidth="2" fill="none" opacity="0.6"/>
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <path d="M64,20 L64,0 L44,0" stroke="var(--color-primary)" strokeWidth="2" fill="none" opacity="0.6"/>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16 pointer-events-none">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <path d="M0,44 L0,64 L20,64" stroke="var(--color-primary)" strokeWidth="2" fill="none" opacity="0.6"/>
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <path d="M64,44 L64,64 L44,64" stroke="var(--color-primary)" strokeWidth="2" fill="none" opacity="0.6"/>
            </svg>
          </div>

          <div className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div
                className="inline-block text-xs font-mono tracking-widest mb-3 px-3 py-1 rounded-full border"
                style={{
                  color: 'var(--color-accent)',
                  borderColor: 'var(--color-accent)',
                  backgroundColor: 'color-mix(in srgb, var(--color-accent) 10%, transparent)',
                }}
              >
                INITIALIZING FORGE INTERFACE
              </div>
              <h1
                className="wm-title text-4xl md:text-5xl font-black tracking-widest uppercase"
                style={{
                  color: 'var(--color-primary)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                }}
              >
                WELCOME TO
              </h1>
              <h1
                className="wm-title text-4xl md:text-5xl font-black tracking-widest uppercase"
                style={{
                  color: 'var(--color-primary)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.15em',
                  animationDelay: '0.5s',
                }}
              >
                THE FORGE
              </h1>
              <p className="mt-3 text-sm" style={{ color: 'var(--color-text-secondary, #94a3b8)' }}>
                AI Architecture Design Platform · Powered by Astrid
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="rounded-xl p-4 flex gap-3"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <div
                      className="font-bold text-sm mb-1"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {f.title}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* API Key notice */}
            <div
              className="rounded-xl p-4 mb-6 text-sm"
              style={{
                backgroundColor: 'rgba(251,191,36,0.05)',
                border: '1px solid rgba(251,191,36,0.2)',
                color: '#fbbf24',
              }}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">🔑</span>
                <div>
                  <div className="font-bold mb-1">Activate Astrid</div>
                  <p className="text-xs leading-relaxed" style={{ color: '#d4a017' }}>
                    To enable the AI co-pilot, set the{' '}
                    <code
                      className="px-1 py-0.5 rounded text-xs"
                      style={{ backgroundColor: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
                    >
                      GEMINI_API_KEY
                    </code>{' '}
                    environment variable. Get yours free at{' '}
                    <a
                      href="https://aistudio.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-yellow-300 transition-colors"
                      style={{ color: '#fbbf24' }}
                    >
                      aistudio.google.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Enter button */}
            <div className="text-center">
              <button
                onClick={onClose}
                className="relative inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-black tracking-widest uppercase text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                  color: '#000',
                  boxShadow: '0 0 30px color-mix(in srgb, var(--color-primary) 50%, transparent)',
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em',
                }}
              >
                <span>⚡</span>
                <span>ENTER THE FORGE</span>
                <span>⚡</span>
              </button>
              <p className="mt-3 text-xs" style={{ color: '#334155' }}>
                By entering, you acknowledge this is an experimental platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
