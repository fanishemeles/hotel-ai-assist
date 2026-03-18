import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Landing } from './components/Landing';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { AppView } from './types';
import { Toaster } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { Button } from './components/ui/button';

const App = () => {
  const [view, setView] = useState<AppView>('landing');

  const renderView = () => {
    switch (view) {
      case 'landing':
        return <Landing onStart={() => setView('onboarding')} onDemo={() => setView('chat_demo')} />;
      case 'onboarding':
        return <Onboarding onComplete={() => setView('dashboard')} />;
      case 'dashboard':
        return <Dashboard />;
      case 'chat_demo':
        return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md mb-8 flex items-center justify-between">
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setView('landing')}>
                <ChevronLeft className="mr-2" /> Back to Landing
              </Button>
              <div className="text-right">
                <h2 className="text-white font-bold">WhatsApp Simulator</h2>
                <p className="text-white/60 text-xs">Testing AI Concierge Flows</p>
              </div>
            </div>
            <ChatInterface />
          </div>
        );
      default:
        return <Landing onStart={() => setView('onboarding')} onDemo={() => setView('chat_demo')} />;
    }
  };

  return (
    <AppProvider>
      <div className="font-sans antialiased text-slate-900">
        {renderView()}
      </div>
      <Toaster position="top-center" richColors />
    </AppProvider>
  );
};

export default App;