import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Feedback } from '../types';
import { FilterBar } from '../components/admin/FilterBar';
import { FeedbackStatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { Search, Star, Sparkles, CheckCircle, Clock, X } from 'lucide-react';

export const FeedbackManager: React.FC = () => {
  const { feedbackList, updateFeedbackStatus } = useApp();
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Feedback Management</h1>
        <p className="text-slate-400 text-sm mt-1">Review, investigate, and update passenger feedback resolution status.</p>
      </div>

      <FilterBar />

      {/* Feedback Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">{feedbackList.length} Passenger Feedback Reports</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <th className="py-3.5 px-4">Feedback ID</th>
                <th className="py-3.5 px-4">Route</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4 text-center">Rating</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Comment Snippet</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {feedbackList.slice(0, 50).map((item) => (
                <tr
                  key={item.id}
                  onClick={() => setSelectedFeedback(item)}
                  className="hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">{item.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{item.route_number}</td>
                  <td className="py-3.5 px-4 text-slate-400">{item.journey_date} ({item.time_period})</td>
                  
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-bold text-white">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      {item.overall_rating}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-medium">{item.category}</td>
                  <td className="py-3.5 px-4"><SeverityBadge severity={item.severity} /></td>
                  <td className="py-3.5 px-4 text-slate-400 truncate max-w-xs">{item.comment}</td>
                  
                  <td className="py-3.5 px-4 text-center">
                    <FeedbackStatusBadge status={item.status} />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFeedback(item);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Feedback Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative animate-fade-in">
            
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <span className="font-mono text-lg font-bold text-blue-400">{selectedFeedback.id}</span>
              <FeedbackStatusBadge status={selectedFeedback.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Route</span>
                <span className="font-bold text-white text-sm">{selectedFeedback.route_number}</span>
                <p className="text-slate-400 truncate">{selectedFeedback.route_name}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block">Journey Time Slot</span>
                <span className="font-bold text-white text-sm">{selectedFeedback.journey_date}</span>
                <p className="text-slate-400">{selectedFeedback.time_period}</p>
              </div>
            </div>

            {/* Ratings Grid */}
            <div className="grid grid-cols-5 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-center text-xs">
              <div>
                <span className="text-slate-500 block">Punctuality</span>
                <span className="font-bold text-white">{selectedFeedback.punctuality_rating}/5</span>
              </div>
              <div>
                <span className="text-slate-500 block">Cleanliness</span>
                <span className="font-bold text-white">{selectedFeedback.cleanliness_rating}/5</span>
              </div>
              <div>
                <span className="text-slate-500 block">Crowding</span>
                <span className="font-bold text-white">{selectedFeedback.crowding_rating}/5</span>
              </div>
              <div>
                <span className="text-slate-500 block">Driver</span>
                <span className="font-bold text-white">{selectedFeedback.driver_behaviour_rating}/5</span>
              </div>
              <div>
                <span className="text-slate-500 block">Overall</span>
                <span className="font-bold text-amber-400">{selectedFeedback.overall_rating}/5</span>
              </div>
            </div>

            {/* Comment */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
              <span className="text-xs text-slate-500 block mb-1">Passenger Feedback Comment</span>
              <p className="text-sm text-slate-200 italic">"{selectedFeedback.comment}"</p>
            </div>

            {/* AI Classification Output */}
            <div className="bg-purple-950/40 border border-purple-800/80 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-1.5 text-purple-400 font-bold text-xs mb-2">
                <Sparkles className="w-4 h-4" />
                <span>AI Automated NLP Classification</span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-300">Category: <strong className="text-white">{selectedFeedback.category}</strong></span>
                <span className="text-slate-300">Severity: <strong className="text-rose-400">{selectedFeedback.severity}</strong></span>
                <span className="text-slate-300">Confidence: <strong className="text-purple-400 font-mono">{(selectedFeedback.ai_confidence || 94)}%</strong></span>
              </div>
            </div>

            {/* Status Change Buttons */}
            <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">Update Status:</span>
              <div className="flex items-center gap-2">
                {(['New', 'Under Review', 'Resolved'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      updateFeedbackStatus(selectedFeedback.id, st);
                      setSelectedFeedback({ ...selectedFeedback, status: st });
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedFeedback.status === st
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
