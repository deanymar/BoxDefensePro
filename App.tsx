
import React, { useState } from 'react';
import { useStore } from './demo'; 
import { Auth } from './views/Auth';
import { Landing } from './views/Landing';
import { CustomerDashboard } from './views/CustomerDashboard';
import { BoxDetailView } from './views/BoxDetail';
import { CompanyDashboard } from './views/CompanyDashboard';
import { Shield, Moon, Sun, Home } from 'lucide-react';

const App: React.FC = () => {
  const store = useStore();
  const [currentBoxId, setCurrentBoxId] = useState<string | null>(null);
  // Track if we should explicitly show the Auth screen (e.g., coming from Landing)
  const [isAuthExplicitlyVisible, setIsAuthExplicitlyVisible] = useState(false);

  const handleStart = () => {
    store.setShowLanding(false);
    setIsAuthExplicitlyVisible(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthExplicitlyVisible(false);
  };

  if (store.showLanding) {
    return (
      <div className={store.isDarkMode ? 'dark' : ''}>
        <Landing 
          onStart={handleStart} 
          onToggleTheme={store.toggleDarkMode} 
          isDarkMode={store.isDarkMode}
          onShowDemo={() => {
            store.loginAsDummyCompany();
            setIsAuthExplicitlyVisible(false);
          }}
          currentUser={store.currentUser}
        />
      </div>
    );
  }

  // Show Auth if explicitly requested OR if no user is logged in
  if (isAuthExplicitlyVisible || !store.currentUser) {
    return (
      <div className={store.isDarkMode ? 'dark' : ''}>
        <Auth 
          onLoginCustomer={store.loginCustomer} 
          onLoginCompany={store.loginCompany} 
          onLoginDummyCompany={store.loginAsDummyCompany}
          onBackToHome={() => {
            store.setShowLanding(true);
            setIsAuthExplicitlyVisible(false);
          }}
          onToggleTheme={store.toggleDarkMode}
          isDarkMode={store.isDarkMode}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  const currentBox = store.boxes.find(b => b.id === currentBoxId);

  if (store.currentUser.role === 'company') {
    return (
      <div className={store.isDarkMode ? 'dark' : ''}>
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
          <CompanyDashboard store={store} />
        </div>
      </div>
    );
  }

  const customerMoves = store.moves.filter(m => m.customerPhone === store.currentUser?.phone);

  return (
    <div className={`${store.isDarkMode ? 'dark' : ''} min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto shadow-2xl relative bg-white dark:bg-slate-900 min-h-screen flex flex-col no-print">
        <header className="bg-primary-gradient px-6 py-8 text-white flex justify-between items-center sticky top-0 z-40">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentBoxId(null)}>
            <Shield className="w-7 h-7 text-white" />
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">BOXDEFENSE</h1>
          </div>
          <div className="flex items-center space-x-4">
             <button 
                onClick={() => {
                  store.setShowLanding(true);
                  setIsAuthExplicitlyVisible(false);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center group"
                title="Return to Home"
              >
                <Home className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-bold uppercase hidden sm:inline">Home</span>
              </button>
             <button 
                onClick={store.toggleDarkMode}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                {store.isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
             <button onClick={store.logout} className="text-xs font-bold uppercase tracking-widest opacity-70 hover:opacity-100">
               Logout
             </button>
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          {currentBoxId && currentBox ? (
            <BoxDetailView 
              box={currentBox} 
              store={store} 
              onBack={() => setCurrentBoxId(null)} 
            />
          ) : (
            <CustomerDashboard 
              moves={customerMoves} 
              store={store} 
              onSelectBox={setCurrentBoxId} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
