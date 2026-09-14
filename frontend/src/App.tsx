import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { PassengerPortal } from './pages/PassengerPortal';
import { TrackFeedbackPage } from './pages/TrackFeedbackPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { RouteDetailPage } from './pages/RouteDetailPage';
import { FeedbackManager } from './pages/FeedbackManager';
import { OperationalInsights } from './pages/OperationalInsights';
import { CSVImportPage } from './pages/CSVImportPage';
import { Bus, Code, ExternalLink } from 'lucide-react';

const MainContent: React.FC = () => {
  const { selectedRouteId, setSelectedRouteId } = useApp();
  const [activeTab, setActiveTab] = useState<string>('passenger');
  const [trackInitialId, setTrackInitialId] = useState<string>('');

  const handleNavigateTrack = (feedbackId?: string) => {
    if (feedbackId) setTrackInitialId(feedbackId);
    setActiveTab('track');
  };

  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    setActiveTab('route-detail');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1">
        {activeTab === 'passenger' && (
          <PassengerPortal onNavigateTrack={handleNavigateTrack} />
        )}

        {activeTab === 'track' && (
          <TrackFeedbackPage
            initialId={trackInitialId}
            onNavigateHome={() => setActiveTab('passenger')}
          />
        )}

        {activeTab === 'admin-login' && (
          <AdminLoginPage onLoginSuccess={() => setActiveTab('dashboard')} />
        )}

        {(activeTab === 'dashboard' || (activeTab === 'route-detail' && !selectedRouteId)) && (
          <AdminDashboard
            onSelectRoute={handleSelectRoute}
            onNavigateInsights={() => setActiveTab('operational-insights')}
          />
        )}

        {activeTab === 'route-detail' && selectedRouteId && (
          <RouteDetailPage
            routeId={selectedRouteId}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'feedback-manager' && <FeedbackManager />}

        {activeTab === 'operational-insights' && <OperationalInsights />}

        {activeTab === 'import' && <CSVImportPage />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-8 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-200 font-bold text-sm mb-1">
              <Bus className="w-4 h-4 text-blue-400" />
              <span>Public Transport Feedback & Service Analytics Platform</span>
            </div>
            <p>Decimal Point Analytics (DPA) Hackathon 2026 – Stage 2 Case Study 2</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-blue-400 font-mono text-xs border border-slate-800 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>FastAPI OpenAPI Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
