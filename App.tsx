import React, { useState, useEffect } from 'react';
// FIX: Import UnifiedConfig to handle saving all asset types.
import type { SavedModel, ModelConfig, ThemeName, UnifiedConfig } from './types';
import { LandingPage } from './components/LandingPage';
import { LoadingScreen } from './components/LoadingScreen';
import { Dashboard } from './components/Dashboard';
import { WelcomeModal } from './components/WelcomeModal';
import { useLocalStorage } from './hooks/useLocalStorage';

type View = 'landing' | 'loading' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [savedModels, setSavedModels] = useLocalStorage<SavedModel[]>('or4cl3-models', []);
  const [theme, setTheme] = useLocalStorage<ThemeName>('or4cl3-theme', 'oracl3');
  const [welcomed, setWelcomed] = useLocalStorage<boolean>('or4cl3-welcomed', false);

  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-default', 'theme-nebula', 'theme-cyberpunk', 'theme-oracl3');
    body.classList.add(`theme-${theme}`);
  }, [theme]);

  const handleEnter = () => {
    setView('loading');
  };

  // FIX: Update config type to UnifiedConfig and add sigil.
  const handleSaveModel = (name: string, config: UnifiedConfig, sigil: string) => {
    setSavedModels(prevModels => {
        const existingModelIndex = prevModels.findIndex(m => m.name === name);
        const newVersion = { config, savedAt: new Date().toISOString() };

        if (existingModelIndex > -1) {
            // Model with this name exists, add a new version
            const updatedModels = [...prevModels];
            const existingModel = updatedModels[existingModelIndex];
            existingModel.versions.push(newVersion);
            // Update sigil if it has changed
            existingModel.sigil = sigil;
            return updatedModels;
        } else {
            // This is a new model
            const newModel: SavedModel = {
                id: Date.now(),
                name,
                versions: [newVersion],
                sigil,
            };
            return [...prevModels, newModel];
        }
    });
  };
  
  const handleDeleteModel = (modelId: number) => {
    setSavedModels(prev => prev.filter(m => m.id !== modelId));
  };

  useEffect(() => {
    if (view === 'loading') {
      const timer = setTimeout(() => {
        setView('dashboard');
      }, 3000); // Simulate loading time
      return () => clearTimeout(timer);
    }
  }, [view]);

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <LandingPage onEnter={handleEnter} />;
      case 'loading':
        return <LoadingScreen />;
      case 'dashboard':
        return <Dashboard 
                  savedModels={savedModels}
                  onSaveModel={handleSaveModel}
                  onDeleteModel={handleDeleteModel}
                  theme={theme}
                  onThemeChange={setTheme}
                />;
      default:
        return <LandingPage onEnter={handleEnter} />;
    }
  };

  return (
    <div className="min-h-screen font-sans">
      {renderView()}
      {view !== 'loading' && (
        <WelcomeModal
          isOpen={!welcomed}
          onClose={() => setWelcomed(true)}
        />
      )}
    </div>
  );
};

export default App;
