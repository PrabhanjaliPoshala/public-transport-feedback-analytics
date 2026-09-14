import React from 'react';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/common/KpiCard';
import { FilterBar } from '../components/admin/FilterBar';
import { RouteTable } from '../components/admin/RouteTable';
import { AnalyticsCharts } from '../components/charts/AnalyticsCharts';
import {
  MessageSquare,
  Star,
  AlertTriangle,
  Flame,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface AdminDashboardProps {
  onSelectRoute: (routeId: string) => void;
  onNavigateInsights: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectRoute, onNavigateInsights }) => {
  const { overview, routeRankings, feedbackList } = useApp();

  if (!overview) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p>Loading Transport Operations Intelligence...</p>
      </div>
    );
  }

  const deterioratingRoutes = routeRankings.filter(
    (r) => r.trend === 'Deteriorating' || r.status === 'Critical' || r.status === 'Poor'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              Live Operations Monitoring Active
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Transport Operations Intelligence
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor passenger experience, identify recurring service issues and detect route deterioration.
          </p>
        </div>

        <button
          onClick={onNavigateInsights}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-950/40 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>View Operational AI Insights</span>
        </button>
      </div>

      <FilterBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <KpiCard
          title="Total Feedback"
          value={overview.totalFeedback}
          subtitle="System-wide reports"
          icon={<MessageSquare className="w-5 h-5" />}
        />

        <KpiCard
          title="Average Overall Rating"
          value={`${overview.averageRating} / 5`}
          change={overview.ratingChangePercent}
          changeType="positive_is_good"
          icon={<Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
          alert={overview.averageRating < 3.2}
        />

        <KpiCard
          title="Total Complaints"
          value={overview.totalComplaints}
          change={overview.complaintsChangePercent}
          changeType="negative_is_good"
          icon={<AlertTriangle className="w-5 h-5 text-orange-400" />}
        />

        <KpiCard
          title="High/Critical Severity"
          value={overview.highCriticalComplaints}
          subtitle="Urgent intervention required"
          icon={<Flame className="w-5 h-5 text-rose-400" />}
          alert={overview.highCriticalComplaints > 40}
        />

        <KpiCard
          title="Worst Performing Route"
          value={overview.worstPerformingRoute.route_number}
          subtitle={`Rating: ${overview.worstPerformingRoute.rating.toFixed(1)} / 5`}
          icon={<TrendingDown className="w-5 h-5 text-rose-400" />}
          badgeText="Deteriorating"
          alert={true}
        />

        <KpiCard
          title="Most Reported Issue"
          value={overview.mostReportedIssue.category.split('/')[0]}
          subtitle={`${overview.mostReportedIssue.count} total reports`}
          icon={<Layers className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {deterioratingRoutes.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/90 border border-rose-800 rounded-2xl p-5 mb-8 shadow-xl">
          <div className="flex items-center justify-between border-b border-rose-800/60 pb-3 mb-4">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm uppercase tracking-wider">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>Routes Requiring Attention (Deterioration Analysis)</span>
            </div>
            <span className="text-xs bg-rose-900/80 text-rose-200 px-2.5 py-0.5 rounded border border-rose-700 font-mono">
              {deterioratingRoutes.length} Corridors Flagged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deterioratingRoutes.map((r) => (
              <div
                key={r.route_id}
                onClick={() => onSelectRoute(r.route_id)}
                className="bg-slate-950/90 border border-rose-800/80 rounded-xl p-4 cursor-pointer hover:border-rose-600 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white group-hover:text-rose-400 transition-colors">{r.route_number}</span>
                  <span className="text-xs font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
                    Rating ↓ {Math.abs(r.rating_change || 0.9).toFixed(1)}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mb-3 truncate">{r.route_name}</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Top Issue:</span>
                    <span className="font-semibold text-slate-200">{r.top_issue}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Worst Period:</span>
                    <span className="font-semibold text-slate-200">{r.worst_period}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-rose-400 font-medium">
                  <span>Complaints ↑ 31%</span>
                  <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect Route</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RouteTable rankings={routeRankings} onSelectRoute={onSelectRoute} />
      <AnalyticsCharts feedbackList={feedbackList} rankings={routeRankings} />
    </div>
  );
};
