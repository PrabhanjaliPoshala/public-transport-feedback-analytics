import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Feedback } from '../types';
import { Search, ShieldAlert, CheckCircle2, Clock, Star, ArrowLeft } from 'lucide-react';
import { FeedbackStatusBadge, SeverityBadge } from '../components/common/StatusBadge';

interface TrackFeedbackProps {
  initialId?: string;
  onNavigateHome: () => void;
}

export const TrackFeedbackPage: React.FC<TrackFeedbackProps> = ({ initialId = '', onNavigateHome }) => {
  const { feedbackList } = useApp();
  const [searchId, setSearchId] = useState<string>(initialId);
  const [foundRecord, setFoundRecord] = useState<Feedback | null>(() => {
    if (initialId) {
      return feedbackList.find((f) => f.id.toLowerCase() === initialId.toLowerCase()) || null;
    }
    return null;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const match = feedbackList.find((f) => f.id.toLowerCase() === searchId.trim().toLowerCase());
    setFoundRecord(match || null);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Passenger Portal</span>
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">Track Passenger Feedback Status</h1>
        <p className="text-slate-400 text-sm">Enter your Feedback Reference ID (e.g. FB-10492 or newly submitted ID)</p>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Reference ID (e.g. FB-1042)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-md"
          >
            Track Status
          </button>
        </div>
      </form>

      {foundRecord ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
            <div>
              <span className="text-xs text-slate-400 block uppercase font-semibold">Feedback Reference</span>
              <span className="font-mono text-lg font-bold text-blue-400">{foundRecord.id}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Current Status:</span>
              <FeedbackStatusBadge status={foundRecord.status} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-500 block">Route Info</span>
              <span className="font-semibold text-white">{foundRecord.route_number}</span>
              <p className="text-xs text-slate-400 truncate">{foundRecord.route_name}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-500 block">Journey Date & Time</span>
              <span className="font-semibold text-white">{foundRecord.journey_date}</span>
              <p className="text-xs text-slate-400">{foundRecord.time_period}</p>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Passenger Rating</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-white text-sm">{foundRecord.overall_rating} / 5</span>
              </div>
            </div>

            <p className="text-sm text-slate-200 italic bg-slate-900 p-3 rounded-lg border border-slate-800/60 mb-3">
              "{foundRecord.comment}"
            </p>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-400">Category: <strong className="text-white">{foundRecord.category}</strong></span>
              <span className="text-slate-400">Severity:</span>
              <SeverityBadge severity={foundRecord.severity} />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Operations Audit Log</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <span className="font-semibold">Feedback Received & Logged</span>
                  <p className="text-slate-500 text-[11px]">{new Date(foundRecord.created_at).toLocaleString()}</p>
                </div>
              </div>

              {foundRecord.status !== 'New' && (
                <div className="flex items-start gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-semibold">Assigned to Route Operational Specialist</span>
                    <p className="text-slate-500 text-[11px]">Under active review by transit dispatcher</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : searchId ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
          <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Record Found</h3>
          <p className="text-xs">No feedback report matching reference ID "{searchId}" was found.</p>
        </div>
      ) : null}
    </div>
  );
};
