import React, { useState, useEffect } from 'react';
import type { SavedModel, ModelConfig, ThemeName, UnifiedConfig } from './types';
import { LandingPage } from './components/LandingPage';
import { LoadingScreen } from './components/LoadingScreen';
import { Dashboard } from './components/Dashboard';
import { WelcomeModal } from './components/WelcomeModal';
import SkillsLibraryTab from './components/SkillsLibraryTab';
import { useLocalStorage } from './hooks/useLocalStorage';

type View = 'landing' | 'loading' | 'dashboard' | 'skills';

const App: React.FC = () => {
  const [view, setView] = useState<View>('landing');
  const [savedModels, setSavedModels] = useLocalStorage<SavedModel[]>('or4cl3-models', []);
  const [theme, setTheme] = useLocalStorage<ThemeName>('or4cl3-theme', 'oracl3');
  const [welcomed, setWelcomed] = useLocalStorage<boolean>('or4cl3-welcomed', false);
  const [astridInput, setAstridInput] = useState('');

  useEffect(() => {
    const body = document.body;
    body.classList.remove('theme-default', 'theme-nebula', 'theme-cyberpunk', 'theme-oracl3');
    body.classList.add(`theme-${theme}`);
  }, [theme]);

  const handleEnter = () => {
    setView('loading');
  };

  const handleSaveModel = (name: string, config: UnifiedConfig, sigil: string) => {
    setSavedModels(prevModels => {
        const existingModelIndex = prevModels.findIndex(m => m.name === name);
        const newVersion = { config, savedAt: new Date().toISOString() };

        if (existingModelIndex > -1) {
            const updatedModels = [...prevModels];
            const existingModel = updatedModels[existingModelIndex];
            existingModel.versions.push(newVersion);
            existingModel.sigil = sigil;
            return updatedModels;
        } else {
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
      }, 3000);
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
      case 'skills':
        return <SkillsLibraryTab 
                  onActivateSkill={(name, prompt) => {
                    setAstridInput(`${name}: ${prompt}`);
                    // Could transition to astrid view here if you have one
                  }} 
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