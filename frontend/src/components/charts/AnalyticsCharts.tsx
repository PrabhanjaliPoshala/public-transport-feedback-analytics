import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import type { Feedback, RoutePerformance } from '../../types';

interface ChartsProps {
  feedbackList: Feedback[];
  rankings: RoutePerformance[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Crowding': '#f43f5e',
  'Punctuality / Delay': '#f97316',
  'Cleanliness': '#eab308',
  'Driver Behaviour': '#8b5cf6',
  'Service / Route Issue': '#3b82f6',
  'Safety': '#dc2626',
  'Other': '#64748b',
};

const SEVERITY_COLORS: Record<string, string> = {
  'Low': '#64748b',
  'Medium': '#eab308',
  'High': '#f97316',
  'Critical': '#f43f5e',
};

export const AnalyticsCharts: React.FC<ChartsProps> = ({ feedbackList, rankings }) => {
  const [trendGranularity, setTrendGranularity] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

  const routeComplaintsData = rankings
    .map((r) => ({
      name: r.route_number,
      complaints: r.complaints_count,
      highSeverity: r.high_severity_count,
    }))
    .sort((a, b) => b.complaints - a.complaints);

  const categoryCounts: Record<string, number> = {};
  feedbackList.forEach((f) => {
    if (f.overall_rating <= 3 || f.severity === 'High' || f.severity === 'Critical') {
      categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
    }
  });

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#3b82f6',
  }));

  const timePeriods = ['6 AM–9 AM', '9 AM–12 PM', '12 PM–3 PM', '3 PM–5 PM', '5 PM–7 PM', '7 PM–10 PM'];
  const timeData = timePeriods.map((period) => {
    const periodFeedback = feedbackList.filter((f) => f.time_period === period);
    const complaints = periodFeedback.filter((f) => f.overall_rating <= 3).length;
    const crowdingCount = periodFeedback.filter((f) => f.category === 'Crowding').length;
    const delayCount = periodFeedback.filter((f) => f.category === 'Punctuality / Delay').length;

    return {
      period: period.replace('–', '-'),
      complaints,
      crowdingCount,
      delayCount,
    };
  });

  const dateRatingMap: Record<string, { total: number; count: number; complaints: number }> = {};
  feedbackList.forEach((f) => {
    const dateKey = f.journey_date;
    if (!dateRatingMap[dateKey]) dateRatingMap[dateKey] = { total: 0, count: 0, complaints: 0 };
    dateRatingMap[dateKey].total += f.overall_rating;
    dateRatingMap[dateKey].count += 1;
    if (f.overall_rating <= 3) dateRatingMap[dateKey].complaints += 1;
  });

  const sortedDates = Object.keys(dateRatingMap).sort();
  let trendData: { label: string; rating: number; complaints: number }[] = [];

  if (trendGranularity === 'Daily') {
    trendData = sortedDates.slice(-20).map((d) => ({
      label: d.substring(5),
      rating: Number((dateRatingMap[d].total / dateRatingMap[d].count).toFixed(1)),
      complaints: dateRatingMap[d].complaints,
    }));
  } else if (trendGranularity === 'Weekly') {
    const chunks: Record<string, { total: number; count: number; comp: number }> = {};
    sortedDates.forEach((d, idx) => {
      const weekNum = `Wk ${Math.floor(idx / 7) + 1}`;
      if (!chunks[weekNum]) chunks[weekNum] = { total: 0, count: 0, comp: 0 };
      chunks[weekNum].total += dateRatingMap[d].total;
      chunks[weekNum].count += dateRatingMap[d].count;
      chunks[weekNum].comp += dateRatingMap[d].complaints;
    });
    trendData = Object.entries(chunks).map(([label, val]) => ({
      label,
      rating: Number((val.total / val.count).toFixed(1)),
      complaints: val.comp,
    }));
  } else {
    const months: Record<string, { total: number; count: number; comp: number }> = {};
    sortedDates.forEach((d) => {
      const m = d.substring(0, 7);
      if (!months[m]) months[m] = { total: 0, count: 0, comp: 0 };
      months[m].total += dateRatingMap[d].total;
      months[m].count += dateRatingMap[d].count;
      months[m].comp += dateRatingMap[d].complaints;
    });
    trendData = Object.entries(months).map(([m, val]) => ({
      label: m,
      rating: Number((val.total / val.count).toFixed(1)),
      complaints: val.comp,
    }));
  }

  const severityCounts: Record<string, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  feedbackList.forEach((f) => {
    severityCounts[f.severity] = (severityCounts[f.severity] || 0) + 1;
  });

  const severityData = Object.entries(severityCounts).map(([name, count]) => ({
    name,
    count,
    fill: SEVERITY_COLORS[name],
  }));

  const routeComparisonData = [...rankings]
    .sort((a, b) => a.average_rating - b.average_rating)
    .map((r) => ({
      name: r.route_number,
      rating: r.average_rating,
      isFailing: r.average_rating < 3.0,
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      
      {/* Chart 1: Complaints by Route */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">Complaints Volume by Route</h4>
            <p className="text-xs text-slate-400">Total complaints and high-severity issues per corridor</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routeComplaintsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="complaints" name="Total Complaints" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="highSeverity" name="High/Critical Severity" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Complaints by Category */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">Complaints by Category</h4>
            <p className="text-xs text-slate-400">Distribution of passenger complaint types</p>
          </div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Complaints by Time of Day */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">Time-of-Day Complaint Distribution</h4>
            <p className="text-xs text-slate-400">Highlighting peak hour crowding and delays</p>
          </div>
          <span className="text-xs font-semibold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
            5 PM–7 PM Peak
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="crowdingCount" name="Crowding Complaints" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="delayCount" name="Delay Complaints" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 4: Rating Trend over Time */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">System Satisfaction Trend</h4>
            <p className="text-xs text-slate-400">Average overall passenger rating over time</p>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {(['Daily', 'Weekly', 'Monthly'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTrendGranularity(mode)}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  trendGranularity === mode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
              <YAxis domain={[1, 5]} stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Line type="monotone" dataKey="rating" name="Average Rating" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 5: Severity Distribution */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">Feedback Severity Breakdown</h4>
            <p className="text-xs text-slate-400">Classification of passenger report severity</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="count" name="Reports Count" radius={[4, 4, 0, 0]}>
                {severityData.map((entry, index) => (
                  <Cell key={`cell-sev-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 6: Route Rating Comparison */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-white">Route Rating Comparison</h4>
            <p className="text-xs text-slate-400">Lowest to highest average overall satisfaction</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={routeComparisonData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" domain={[0, 5]} stroke="#94a3b8" fontSize={11} />
              <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={75} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="rating" name="Rating (out of 5)" radius={[0, 4, 4, 0]}>
                {routeComparisonData.map((entry, index) => (
                  <Cell key={`cell-comp-${index}`} fill={entry.isFailing ? '#f43f5e' : '#3b82f6'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
