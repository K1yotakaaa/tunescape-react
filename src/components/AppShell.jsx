import { useState } from 'react';
import Sidebar from './Sidebar';
import TracksView from '../views/TracksView';
import FavoritesView from '../views/FavoritesView';
import ReportView from '../views/ReportView';
import { useAuth } from '../context/AuthContext';

export default function AppShell() {
  const [activeView, setActiveView] = useState('tracks');
  const { demoMode, logout } = useAuth(); 

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="main-area">
        {demoMode && (
          <div className="demo-banner">
            <span>⚠️ DEMO MODE. Read-only.</span>
            <button onClick={logout}>
              Sign in
            </button>
            <span>to use your account.</span>
          </div>
        )}

        {activeView === 'tracks' && <TracksView />}
        {activeView === 'favorites' && <FavoritesView />}
        {activeView === 'report' && <ReportView />}
      </main>
    </div>
  );
}