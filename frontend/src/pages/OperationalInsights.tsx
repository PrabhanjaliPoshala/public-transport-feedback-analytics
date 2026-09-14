import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ShieldAlert, Users, Clock, UserCheck, ArrowRight } from 'lucide-react';
import { SeverityBadge } from '../components/common/StatusBadge';

export const OperationalInsights: React.FC = () => {
  const { insights, routeRankings } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold mb-3">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Automated Operational Intelligence Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Operational Insights</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time alerts and statistical findings derived dynamically from passenger feedback data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {insights.map((item) => {
          const isCritical = item.severity === 'Critical';

          return (
            <div
              key={item.id}
              className={`rounded-2xl p-6 border shadow-xl transition-all ${
                isCritical
                  ? 'bg-gradient-to-br from-slate-900 via-rose-950/40 to-slate-900 border-rose-800/80'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {item.type === 'critical' && <ShieldAlert className="w-5 h-5 text-rose-400" />}
                  {item.type === 'crowding' && <Users className="w-5 h-5 text-rose-400" />}
                  {item.type === 'punctuality' && <Clock className="w-5 h-5 text-orange-400" />}
                  {item.type === 'driver' && <UserCheck className="w-5 h-5 text-purple-400" />}
                  <h3 className="font-bold text-white text-base">{item.title}</h3>
                </div>
                <SeverityBadge severity={item.severity} />
              </div>

              <p className="text-sm text-slate-300 mb-4">{item.description}</p>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                <span className="font-mono text-amber-400 font-bold">{item.metric}</span>
                <span className="text-slate-500">{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
