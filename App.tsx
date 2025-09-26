import React, { useState, useEffect } from 'react';
// FIX: Import UnifiedConfig to handle saving all asset types.
import type { SavedModel, ModelConfig, ThemeName, UnifiedConfig } from './types';
import { LandingPage } from './components/LandingPage';
import { LoadingScreen } from './components/LoadingScreen';
import { Dashboard } from './components/Dashboard';
import { useLocalStorage } from './hooks/useLocalStorage';

type View = 'landing' | 'loading' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [savedModels, setSavedModels] = useLocalStorage<SavedModel[]>('arch1tech-models', []);
  const [theme, setTheme] = useLocalStorage<ThemeName>('arch1tech-theme', 'default');

  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-default', 'theme-nebula', 'theme-cyberpunk');
    body.classList.add(`theme-${theme}`);
  }, [theme]);

  const handleEnter = () => {
    setView('loading');
  };

  // FIX: Update config type to UnifiedConfig to allow saving any asset type.
  const handleSaveModel = (name: string, config: UnifiedConfig) => {
    setSavedModels(prevModels => {
        const existingModelIndex = prevModels.findIndex(m => m.name === name);
        const newVersion = { config, savedAt: new Date().toISOString() };

        if (existingModelIndex > -1) {
            // Model with this name exists, add a new version
            const updatedModels = [...prevModels];
            const existingModel = updatedModels[existingModelIndex];
            existingModel.versions.push(newVersion);
            return updatedModels;
        } else {
            // This is a new model
            const newModel: SavedModel = {
                id: Date.now(),
                name,
                versions: [newVersion],
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

  return <div className="min-h-screen font-sans">{renderView()}</div>;
};

export default App;