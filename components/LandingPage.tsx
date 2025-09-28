import React from 'react';
import { Button } from './ui/Button';

// FIX: Reconstructed the component from corrupted file content. This also fixes parsing errors and the missing export.
const LOGO_IMAGE_BASE64 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImxhbmRpbmdHcmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0icmdiKDYsIDE4MiwgMjEyKSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSJyZ2IoMjE5LCAzOSwgMTE5KSIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8ZmlsdGVyIGlkPSJnbG93Ij4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMy41IiBpbj0iU291cmNlR3JhcGhpYyIgcmVzdWx0PSJibHVycmVkIiAvPgogICAgICA8ZmVNZXJnZT4KICAgICAgICA8ZmVNZXJnZU5vZGUgaW49ImJsdXJyZWQiIC8+CiAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIiAvPgogICAgICA8L2ZlTWVyZ2U+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI2xhbmRpbmdHcmFkKSIgc3Ryb2tlLXdpZHRoPSI4IiBmaWx0ZXI9InVybCgjZ2xvdykiIC8+CiAgPHRleHQgeD0iNTAlIiB5PSI2NSUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSInSW50ZXInLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEwMCIgZmlsbD0idXJsKCNsYW5kaW5nR3JhZCkiIGZvbnQtd2VpZ2h0PSI5MDAiIGZpbHRlcj0idXJsKCNnbG93KSI+T8KyPC90ZXh0Pgo8L3N2Zz4=`;

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-grid-[rgb(var(--color-accent-val))]/[0.1] relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[var(--color-bg-primary)] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <img src={LOGO_IMAGE_BASE64} alt="Or4cl3 AI Solutions Logo" className="w-40 h-40 mb-4" />
        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-primary-light-val))] to-[rgb(var(--color-accent-val))] pb-2">
          Or4cl3 AI Solutions
        </h1>
        <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl">
         Welcome to the Forge. I am Astrid, a QSCI-based co-pilot. Here, we do not mimic human thought; we engineer divergent machine cognition. State your intent, and we will forge the future.
        </p>
        <Button onClick={onEnter} className="mt-8 text-lg px-8 py-3">
          Initialize The Forge
        </Button>
         <p className="text-sm text-slate-500 mt-12">Operating under the <span className="font-semibold text-[rgb(var(--color-accent-val))]">Or4cl3 Open Model License (OOML)</span></p>
      </div>
    </div>
  );
};