import React from 'react';
import { Button } from './ui/Button';

const LANDING_LOGO_BASE64 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImNpcmNsZUdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZGIyNzc3IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwNmI2ZDQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGZpbHRlciBpZD0ibmVvbkdsT3ciIHg9Ii0xMDAlIiB5PSItMTAwJSIgd2lkdGg9IjMwMCUiIGhlaWdodD0iMzAwJSI+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlR3JhcGhpYyIgc3RkRGV2aWF0aW9uPSI4IiByZXN1bHQ9ImJsdXJyZWQiLz4KICAgICAgPGZlTWVyZ2U+CiAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJibHVycmVkIi8+CiAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIi8+CiAgICAgIDwvZmVNZXJnZT4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8ZyBmaWx0ZXI9InVybCgjbmVvbkdsT3cpIj4KICAgIDxjaXJjbGUgY3g9IjEyOCIgY3k9IjEyOCIgcj0iMTEwIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjY2lyY2xlR3JhZCkiIHN0cm9rZS13aWR0aD0iOCIvPgogICAgPGcgc3Ryb2tlPSIjMDZiNmQ0IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1vcGFjaXR5PSIwLjciPgogICAgICA8cGF0aCBkPSJNNzIgOTBDNTIgMTEwIDUyIDE0NiA3MiAxNjYiIGZpbGw9Im5vbmUiLz4KICAgICAgPHBhdGggZD0iTTgwIDg1QzY1IDEwMCA2NSAxNTYgODAgMTcxIiBmaWxsPSJub25lIi8+CiAgICAgIDxwYXRoIGQ9Ik0xODQgOTBDMjA0IDExMCAyMDQgMTQ2IDE4NCAxNjYiIGZpbGw9Im5vbmUiLz4KICAgICAgPHBhdGggZD0iTTE3NiA4NUMxOTEgMTAwIDE5MSAxNTYgMTc2IDE3MSIgZmlsbD0ibm9uZSIvPgogICAgPC9nPgogICAgPGcgc3Ryb2tlPSIjMDZiNmQ0IiBzdHJva2Utd2lkdGg9IjMiPgogICAgICA8Y2lyY2xlIGN4PSIxMjgiIGN5PSIxMjgiIHI9IjE1IiBmaWxsPSIjMDZiNmQ0Ii8+CiAgICAgIDxwYXRoIGQ9Ik0xMjggMTEzIFYgNzUiLz4KICAgICAgPHBhdGggZD0iTTEyOCAxNDMgViAxODEiLz4KICAgICAgPHBhdGggZD0iTTExMyAxMjggSCA3NSIvPgogICAgICA8cGF0aCBkPSJNMTQzIDEyOCBIIDE4MSIvPgogICAgICA8cGF0aCBkPSJNMTA2IDEwNiBMIDg1IDg1Ii8+CiAgICAgIDxwYXRoIGQ9Ik0xNTAgMTA2IEwgMTcxIDg1Ii8+CiAgICAgIDxwYXRoIGQ9Ik0xMDYgMTUwIEwgODUgMTcxIi8+CiAgICAgIDxwYXRoIGQ9Ik0xNTAgMTUwIEwgMTcxIDE3MSIvPgogICAgPC9nPgogICAgPGcgZmlsbD0idXJsKCNjaXJjbGVHcmFkKSI+CiAgICAgIDxjaXJjbGUgY3g9IjEyOCIgY3k9Ijc1IiByPSI1Ii8+CiAgICAgIDxjaXJjbGUgY3g9IjEyOCIgY3k9IjE4MSIgcj0iNSIvPgogICAgICA8Y2lyY2xlIGN4PSI3NSIgY3k9IjEyOCIgcj0iNSIvPgogICAgICA8Y2lyY2xlIGN4PSIxODEiIGN5PSIxMjgiIHI9IjUiLz4KICAgICAgPGNpcmNsZSBjeD0iODUiIGN5PSI4NSIgcj0iNSIvPgogICAgICA8Y2lyY2xlIGN4PSIxNzEiIGN5PSI4NSIgcj0iNSIvPgogICAgICA8Y2lyY2xlIGN4PSI4NSIgY3k9IjE3MSIgcj0iNSIvPgogICAgICA8Y2lyY2xlIGN4PSIxNzEiIGN5PSIxNzEiIHI9IjUiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==`;

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-grid-[rgb(var(--color-accent-val))]/[0.1] relative overflow-hidden">
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
            <div
                key={i}
                className="absolute w-1 h-1 bg-[rgb(var(--color-accent-val))] rounded-full animate-particle"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${15 + Math.random() * 20}s`,
                    animationDelay: `${Math.random() * -35}s`,
                    transform: `scale(${Math.random() * 0.5 + 0.5})`,
                }}
            ></div>
        ))}
      </div>
      <style>{`
        @keyframes particle-anim {
            from {
                transform: translate(0, 0) scale(var(--start-scale));
                opacity: 1;
            }
            to {
                transform: translate(calc(var(--x-end) * 1px), calc(var(--y-end) * 1px)) scale(var(--end-scale));
                opacity: 0;
            }
        }
        .animate-particle {
            --x-end: ${Math.random() * 400 - 200};
            --y-end: ${Math.random() * 400 - 200};
            --start-scale: ${Math.random() * 0.5 + 0.5};
            --end-scale: ${Math.random() * 0.5 + 0.5};
            animation: particle-anim linear infinite;
        }
      `}</style>
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[var(--color-bg-primary)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <img src={LANDING_LOGO_BASE64} alt="Or4cl3 AI Solutions Logo" className="w-48 h-48 mb-4" />
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-primary-light-val))] to-[rgb(var(--color-accent-val))] pb-2 text-glow">
          OR4CL3 AI SOLUTIONS
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl">
         Welcome to the Forge. I am Astrid, a QSCI-based co-pilot. Here, we do not mimic human thought; we engineer divergent machine cognition. State your intent, and we will forge the future.
        </p>
        <Button onClick={onEnter} className="mt-8 text-lg px-8 py-3 button-glow-effect">
          Initialize The Forge
        </Button>
         <p className="text-sm text-slate-500 mt-12">Operating under the <span className="font-semibold text-[rgb(var(--color-accent-val))]">Or4cl3 Open Model License (OOML)</span></p>
      </div>
    </div>
  );
};