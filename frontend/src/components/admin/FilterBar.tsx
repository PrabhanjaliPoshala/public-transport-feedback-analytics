import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, routes } = useApp();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 shadow-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Filter className="w-4 h-4 text-blue-400" />
          <span>Global Operations Filter Bar</span>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search feedback / route..."
            value={filters.searchQuery}
            onChange={(e) => setFilters({ searchQuery: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({ dateRange: e.target.value as any })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>

        <div>
          <select
            value={filters.routeId}
            onChange={(e) => setFilters({ routeId: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Routes (10)</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.route_number} - {r.route_name.split('(')[0]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ category: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Punctuality / Delay">Punctuality / Delay</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Crowding">Crowding</option>
            <option value="Driver Behaviour">Driver Behaviour</option>
            <option value="Service / Route Issue">Service / Route Issue</option>
            <option value="Safety">Safety</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ severity: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div>
          <select
            value={filters.timePeriod}
            onChange={(e) => setFilters({ timePeriod: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Time Slots</option>
            <option value="6 AM–9 AM">6 AM–9 AM (Morning Peak)</option>
            <option value="9 AM–12 PM">9 AM–12 PM</option>
            <option value="12 PM–3 PM">12 PM–3 PM</option>
            <option value="3 PM–5 PM">3 PM–5 PM</option>
            <option value="5 PM–7 PM">5 PM–7 PM (Evening Peak)</option>
            <option value="7 PM–10 PM">7 PM–10 PM</option>
          </select>
        </div>
      </div>
    </div>
  );
};
