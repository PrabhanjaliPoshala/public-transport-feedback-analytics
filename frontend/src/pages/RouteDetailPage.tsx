import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { RouteDetailAnalytics } from '../types';
import { apiService } from '../services/apiService';
import { RouteStatusBadge, TrendBadge } from '../components/common/StatusBadge';
import { ArrowLeft, Sparkles, Star, AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface RouteDetailProps {
  routeId: string;
  onBack: () => void;
}

export const RouteDetailPage: React.FC<RouteDetailProps> = ({ routeId, onBack }) => {
  const { routes } = useApp();
  const [detail, setDetail] = useState<RouteDetailAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      const res = await apiService.getRouteDetail(routeId);
      setDetail(res);
      setLoading(false);
    }
    loadDetail();
  }, [routeId]);

  if (loading || !detail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        <p>Loading Route Performance Analysis...</p>
      </div>
    );
  }

  const isFailing = detail.route_number === 'Route 42' || detail.status === 'Critical' || detail.status === 'Poor';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Back Link */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Operations Intelligence Dashboard</span>
      </button>

      {/* Route Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">{detail.route_number}</h1>
              <RouteStatusBadge status={detail.status} />
              <TrendBadge trend={detail.trend} ratingChange={detail.rating_change} />
            </div>
            <p className="text-slate-400 text-sm">{detail.route_name}</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
            <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
            <div>
              <span className="text-2xl font-extrabold text-white">{detail.average_rating.toFixed(1)}</span>
              <span className="text-slate-500 text-xs font-semibold"> / 5.0</span>
              <span className="text-slate-400 text-xs block">Overall Rating</span>
            </div>
          </div>
        </div>

        {/* Breakdown Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Punctuality Score</span>
            <span className="font-bold text-white text-base">{detail.punctuality.toFixed(1)}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Cleanliness Score</span>
            <span className="font-bold text-white text-base">{detail.cleanliness.toFixed(1)}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Crowding Score</span>
            <span className={`font-bold text-base ${detail.crowding < 2.5 ? 'text-rose-400 font-extrabold' : 'text-white'}`}>
              {detail.crowding.toFixed(1)}
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Driver Behaviour</span>
            <span className="font-bold text-white text-base">{detail.driver_behaviour.toFixed(1)}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Total Feedback</span>
            <span className="font-bold text-blue-400 text-base">{detail.total_feedback}</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-slate-400 block">Complaints Count</span>
            <span className="font-bold text-rose-400 text-base">{detail.complaints_count}</span>
          </div>
        </div>
      </div>

      {/* AI Generated Operational Insight Card */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-800 rounded-2xl p-5 mb-8 shadow-lg">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>AI-Generated Operational Intelligence Insight</span>
        </div>
        <p className="text-slate-200 text-sm font-medium italic">
          "{detail.ai_insight}"
        </p>
      </div>

      {/* Top Issues & Worst Time Period Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Top Issues */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span>Top Reported Service Issues</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-semibold">1. Primary Issue: {detail.top_issue}</span>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 font-mono font-bold">
                Critical Focus
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-300 font-semibold">2. Secondary Issue: {detail.second_issue}</span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-mono font-bold">
                Secondary Impact
              </span>
            </div>
          </div>
        </div>

        {/* Worst Time Period */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Worst Time Period</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">Peak hours with highest passenger dissatisfaction</p>
          </div>

          <div className="bg-rose-950/80 border border-rose-800 rounded-xl p-4 text-center">
            <span className="text-2xl font-extrabold text-rose-300 block">{detail.worst_period}</span>
            <span className="text-xs text-rose-400 font-medium">Evening Peak Rush Hour</span>
          </div>
        </div>

      </div>

      {/* Historical Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Rating Trend Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <h4 className="text-sm font-bold text-white mb-4">Rating Trend Over Time</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={detail.rating_history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[1, 5]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="rating" name="Rating" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Volume Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md">
          <h4 className="text-sm font-bold text-white mb-4">Complaint Volume Trend</h4>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={detail.complaint_history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" name="Complaints" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
