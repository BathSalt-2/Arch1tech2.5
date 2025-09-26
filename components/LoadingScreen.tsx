import React from 'react';

export const LoadingScreen: React.FC = () => {
  const rings = Array.from({ length: 4 });
  const particles = Array.from({ length: 50 });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[var(--color-bg-primary)] overflow-hidden">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {rings.map((_, i) => (
          <div
            key={i}
            className="absolute border-2 border-[rgb(var(--color-primary-hover-val))/0.5] rounded-full"
            style={{
              width: `${(i + 1) * 4}rem`,
              height: `${(i + 1) * 4}rem`,
              animation: `spin ${2 + i * 1.5}s linear infinite ${i % 2 === 0 ? 'normal' : 'reverse'}`,
            }}
          ></div>
        ))}
        <div className="w-8 h-8 bg-[rgb(var(--color-primary-light-val))] rounded-full shadow-[0_0_20px_5px] shadow-[rgb(var(--color-primary-light-val))] animate-pulse"></div>
        {particles.map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[rgb(var(--color-secondary-hover-val))] rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: `0 0`,
              animation: `orbit 5s linear infinite`,
              animationDelay: `${i * -0.1}s`,
              transform: `rotate(${Math.random() * 360}deg) translateX(${4 + Math.random() * 8}rem) rotate(-${Math.random() * 360}deg)`,
            }}
          ></div>
        ))}
      </div>
      <p className="mt-12 text-lg text-slate-300 tracking-widest animate-pulse">
        QUANTUM CORE IGNITION...
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit {
          0% { opacity: 0; transform: rotate(0deg) translateX(4rem) scale(0.5); }
          20% { opacity: 1; transform: rotate(72deg) translateX(8rem) scale(1); }
          80% { opacity: 1; transform: rotate(288deg) translateX(5rem) scale(0.8); }
          100% { opacity: 0; transform: rotate(360deg) translateX(4rem) scale(0.5); }
        }
      `}</style>
    </div>
  );
};