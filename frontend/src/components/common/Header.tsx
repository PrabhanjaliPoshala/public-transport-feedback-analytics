import React from 'react';
import { Bus, BarChart3, MessageSquarePlus, Search, LogIn, LogOut, UploadCloud, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { isAdminLoggedIn, setIsAdminLoggedIn, resetToDemoData } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div 
          onClick={() => setActiveTab(isAdminLoggedIn ? 'dashboard' : 'passenger')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:bg-blue-500 transition-all">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">CityTransit</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-400 font-mono border border-blue-700/50">
                Ops v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Public Transport Feedback & Analytics Platform</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('passenger')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'passenger'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquarePlus className="w-4 h-4" />
            Passenger Portal
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'track'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Search className="w-4 h-4" />
            Track Feedback
          </button>

          {isAdminLoggedIn && (
            <>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'dashboard' || activeTab === 'route-detail'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Operations Intelligence
              </button>

              <button
                onClick={() => setActiveTab('feedback-manager')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'feedback-manager'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                Feedback Manager
              </button>

              <button
                onClick={() => setActiveTab('operational-insights')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'operational-insights'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                AI Insights
              </button>

              <button
                onClick={() => setActiveTab('import')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'import'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                Import CSV
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('Reset to standard Route 42 deterioration demo dataset?')) {
                resetToDemoData();
              }
            }}
            title="Reset dataset to standard demo state"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium border border-slate-800"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>

          {isAdminLoggedIn ? (
            <button
              onClick={() => {
                setIsAdminLoggedIn(false);
                setActiveTab('passenger');
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Exit Admin</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('admin-login')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Ops Admin Login</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
