import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StarRating } from '../components/common/StarRating';
import type { FeedbackCategory, TimePeriod } from '../types';
import { classifyFeedback } from '../services/aiClassifier';
import { Bus, CheckCircle, Sparkles, Send, ArrowRight, ShieldCheck } from 'lucide-react';

interface PassengerPortalProps {
  onNavigateTrack: (feedbackId?: string) => void;
}

export const PassengerPortal: React.FC<PassengerPortalProps> = ({ onNavigateTrack }) => {
  const { routes, submitFeedback } = useApp();

  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-42');
  const [journeyDate, setJourneyDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [journeyTime] = useState<string>('18:15');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('5 PM–7 PM');

  const [punctualityRating, setPunctualityRating] = useState<number>(2);
  const [cleanlinessRating, setCleanlinessRating] = useState<number>(3);
  const [crowdingRating, setCrowdingRating] = useState<number>(1);
  const [driverRating, setDriverRating] = useState<number>(3);
  const [overallRating, setOverallRating] = useState<number>(2);

  const [comment, setComment] = useState<string>('The bus is always packed after 6 PM and often arrives late.');
  const [category, setCategory] = useState<FeedbackCategory>('Crowding');

  const [aiPreview, setAiPreview] = useState(() => classifyFeedback(comment, { overall: overallRating }));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<any | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleCommentChange = (text: string) => {
    setComment(text);
    const classification = classifyFeedback(text, { overall: overallRating });
    setAiPreview(classification);
    if (classification.category !== 'Other') {
      setCategory(classification.category);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedRouteId) {
      setValidationError('Please select a route.');
      return;
    }

    if (overallRating < 1 || overallRating > 5) {
      setValidationError('Overall rating must be between 1 and 5 stars.');
      return;
    }

    if (!comment.trim()) {
      setValidationError('Please provide a brief comment describing your journey experience.');
      return;
    }

    setSubmitting(true);

    const selectedRouteObj = routes.find((r) => r.id === selectedRouteId) || routes[0];

    try {
      const result = await submitFeedback({
        route_id: selectedRouteId,
        route_number: selectedRouteObj.route_number,
        route_name: selectedRouteObj.route_name,
        journey_date: journeyDate,
        journey_time: journeyTime,
        time_period: timePeriod,
        punctuality_rating: punctualityRating,
        cleanliness_rating: cleanlinessRating,
        crowding_rating: crowdingRating,
        driver_behaviour_rating: driverRating,
        overall_rating: overallRating,
        comment,
        category: category || aiPreview.category,
        severity: aiPreview.severity,
      });

      setSubmittedFeedback(result);
    } catch (err) {
      setValidationError('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmittedFeedback(null);
    setComment('');
    setOverallRating(3);
    setPunctualityRating(3);
    setCleanlinessRating(3);
    setCrowdingRating(3);
    setDriverRating(3);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-xs font-semibold mb-4">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Official City Transport Passenger Portal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Help Us Improve Your Journey
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          Share your experience and help us make public transportation safer, cleaner, and more reliable for everyone.
        </p>
      </div>

      {submittedFeedback ? (
        <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-emerald-950 text-emerald-400 border border-emerald-700/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Thank You for Your Feedback!</h2>
          <p className="text-slate-300 text-sm mb-6">
            Your report has been logged into the Transport Operations Intelligence system.
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 mb-6 max-w-lg mx-auto text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-xs text-slate-400 uppercase font-semibold">Feedback Reference ID</span>
              <span className="font-mono text-sm font-bold text-blue-400 bg-blue-950 px-2.5 py-1 rounded border border-blue-800">
                {submittedFeedback.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div>
                <span className="text-slate-500 block">Route</span>
                <span className="font-semibold text-slate-200">{submittedFeedback.route_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Journey Date & Slot</span>
                <span className="font-semibold text-slate-200">{submittedFeedback.journey_date} ({submittedFeedback.time_period})</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <span className="text-slate-500 text-xs block mb-1">AI Automated Classification</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-xs border border-purple-800 font-medium">
                  {submittedFeedback.category}
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-xs border border-rose-800 font-bold">
                  {submittedFeedback.severity} Severity
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-md"
            >
              Submit Another Feedback
            </button>
            <button
              onClick={() => onNavigateTrack(submittedFeedback.id)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Track Feedback Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {validationError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-sm font-medium">
              {validationError}
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
              <Bus className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">1. Journey Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Bus Route *</label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.route_number} - {r.route_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Journey Date *</label>
                <input
                  type="date"
                  value={journeyDate}
                  onChange={(e) => setJourneyDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time Period *</label>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="6 AM–9 AM">6 AM–9 AM (Morning Peak)</option>
                  <option value="9 AM–12 PM">9 AM–12 PM</option>
                  <option value="12 PM–3 PM">12 PM–3 PM</option>
                  <option value="3 PM–5 PM">3 PM–5 PM</option>
                  <option value="5 PM–7 PM">5 PM–7 PM (Evening Peak)</option>
                  <option value="7 PM–10 PM">7 PM–10 PM</option>
                  <option value="Late Night">Late Night</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
              <h2 className="text-base font-bold text-white uppercase tracking-wider">2. Service Ratings (1 to 5 Stars)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
              <StarRating label="Punctuality & Delays" value={punctualityRating} onChange={setPunctualityRating} />
              <StarRating label="Vehicle Cleanliness" value={cleanlinessRating} onChange={setCleanlinessRating} />
              <StarRating label="Passenger Crowding" value={crowdingRating} onChange={setCrowdingRating} />
              <StarRating label="Driver Behaviour" value={driverRating} onChange={setDriverRating} />
              
              <div className="sm:col-span-2 pt-3 border-t border-slate-800">
                <StarRating label="Overall Journey Rating *" value={overallRating} onChange={setOverallRating} size="lg" />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Your Journey Feedback / Comment *</label>
              {aiPreview && (
                <div className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-950/80 px-2.5 py-1 rounded-md border border-purple-800/80 font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Classification Preview: {aiPreview.category} ({aiPreview.severity})</span>
                </div>
              )}
            </div>

            <textarea
              rows={4}
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Please describe what went well or what needs improvement..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300"
                >
                  <option value="Punctuality / Delay">Punctuality / Delay</option>
                  <option value="Cleanliness">Cleanliness</option>
                  <option value="Crowding">Crowding</option>
                  <option value="Driver Behaviour">Driver Behaviour</option>
                  <option value="Service / Route Issue">Service / Route Issue</option>
                  <option value="Safety">Safety</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center justify-end text-xs text-slate-400 pt-5">
                <span>AI Confidence Score: <strong className="text-purple-400 font-mono">{aiPreview.confidence}%</strong></span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            <span>{submitting ? 'Submitting Feedback...' : 'Submit Feedback Report'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
