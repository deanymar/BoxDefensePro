import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { serverCache } from './server/cache-generator';
import { User, UserRole } from './types';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { MoveView } from './components/MoveView';
import { LandingPage, LandingNav } from './components/LandingPage';
import { LegalPage, EnterprisePage, PrivacyPolicy, TermsOfService, SafetyReport } from './components/StaticPages';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeMoveId, setActiveMoveId] = useState<string | null>(null);
  const [systemState, setSystemState] = useState<'uninitialized' | 'ready'>('uninitialized');
  const [targetRole, setTargetRole] = useState<UserRole | null>(null);
  const [currentLandingPage, setCurrentLandingPage] = useState<LandingNav>('home');

  useEffect(() => {
    const checkSetup = () => {
      const state = db.get();
      if (state.users.length === 0) {
        db.migrate();
        db.seed();
        serverCache.generateAll();
      } else {
        serverCache.generateAll();
      }
      setSystemState('ready');
    };
    checkSetup();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveMoveId(null);
    setTargetRole(null);
  };

  if (systemState === 'uninitialized') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Initializing Enterprise Environment...</p>
        </div>
      </div>
    );
  }

  // Handle Static Landing Pages
  if (!currentUser) {
    if (targetRole) {
       return <Auth role={targetRole} onLogin={setCurrentUser} onBack={() => setTargetRole(null)} />;
    }

    switch (currentLandingPage) {
      case 'legal': return <LegalPage onBack={() => setCurrentLandingPage('home')} />;
      case 'enterprise': return <EnterprisePage onBack={() => setCurrentLandingPage('home')} />;
      case 'privacy': return <PrivacyPolicy onBack={() => setCurrentLandingPage('home')} />;
      case 'terms': return <TermsOfService onBack={() => setCurrentLandingPage('home')} />;
      case 'safety': return <SafetyReport onBack={() => setCurrentLandingPage('home')} />;
      default: return <LandingPage onStartAuth={setTargetRole} onNavigate={setCurrentLandingPage} />;
    }
  }

  // Dashboard / Admin Layout
  return (
    <div className={`min-h-screen bg-slate-50 pb-20 md:pb-0 ${currentUser.role === 'admin' ? 'flex flex-col md:flex-row' : ''}`}>
      {/* Sidebar for Admin on Desktop, otherwise just a header */}
      {currentUser.role !== 'admin' && (
        <header className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 uppercase">BoxDefense</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-widest ${
              currentUser.role === 'company' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
            }`}>
              {currentUser.role}
            </span>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1l-1 1H3l-1-1V5l1-1h9l1 1v1" />
              </svg>
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 ${currentUser.role === 'admin' ? '' : 'max-w-4xl mx-auto p-4 md:p-8'}`}>
        {activeMoveId ? (
          <MoveView 
            moveId={activeMoveId} 
            user={currentUser} 
            onBack={() => setActiveMoveId(null)} 
          />
        ) : (
          <Dashboard 
            user={currentUser} 
            onSelectMove={setActiveMoveId}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
};

export default App;