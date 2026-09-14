import React from 'react';
import type { RoutePerformance } from '../../types';
import { RouteStatusBadge, TrendBadge } from '../common/StatusBadge';
import { ChevronRight, Star } from 'lucide-react';

interface RouteTableProps {
  rankings: RoutePerformance[];
  onSelectRoute: (routeId: string) => void;
}

export const RouteTable: React.FC<RouteTableProps> = ({ rankings, onSelectRoute }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Route Performance & Deterioration Index</h3>
          <p className="text-xs text-slate-400">Ranked by passenger rating. Click any route row to view detailed operational analytics.</p>
        </div>
        <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 font-mono">
          {rankings.length} Routes Analyzed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <th className="py-3.5 px-4 text-center">Rank</th>
              <th className="py-3.5 px-4">Route Info</th>
              <th className="py-3.5 px-4 text-center">Overall Rating</th>
              <th className="py-3.5 px-4 text-center">Punctuality</th>
              <th className="py-3.5 px-4 text-center">Cleanliness</th>
              <th className="py-3.5 px-4 text-center">Crowding</th>
              <th className="py-3.5 px-4 text-center">Driver</th>
              <th className="py-3.5 px-4 text-center">Complaints</th>
              <th className="py-3.5 px-4">Trend</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rankings.map((route) => {
              const isFailing = route.route_number === 'Route 42' || route.status === 'Critical' || route.status === 'Poor';

              return (
                <tr
                  key={route.route_id}
                  onClick={() => onSelectRoute(route.route_id)}
                  className={`hover:bg-slate-800/60 transition-colors cursor-pointer group ${
                    isFailing ? 'bg-rose-950/10' : ''
                  }`}
                >
                  <td className="py-4 px-4 text-center font-extrabold text-slate-300 text-sm">
                    #{route.rank}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      <span>{route.route_number}</span>
                      {isFailing && (
                        <span className="text-[10px] bg-rose-950 text-rose-400 px-1.5 py-0.5 rounded border border-rose-800 font-normal">
                          Deteriorating
                        </span>
                      )}
                    </div>
                    <div className="text-slate-400 text-xs truncate max-w-xs">{route.route_name}</div>
                  </td>

                  <td className="py-4 px-4 text-center font-bold">
                    <div className="inline-flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      <Star className={`w-3.5 h-3.5 ${route.average_rating >= 4 ? 'text-amber-400 fill-amber-400' : 'text-rose-400 fill-rose-400'}`} />
                      <span className={route.average_rating < 3 ? 'text-rose-400 font-extrabold' : 'text-white'}>
                        {route.average_rating.toFixed(1)} / 5
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-center font-medium text-slate-300">{route.punctuality.toFixed(1)}</td>
                  <td className="py-4 px-4 text-center font-medium text-slate-300">{route.cleanliness.toFixed(1)}</td>
                  <td className={`py-4 px-4 text-center font-medium ${route.crowding < 2.5 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                    {route.crowding.toFixed(1)}
                  </td>
                  <td className="py-4 px-4 text-center font-medium text-slate-300">{route.driver_behaviour.toFixed(1)}</td>

                  <td className="py-4 px-4 text-center">
                    <span className={`inline-block font-extrabold px-2 py-0.5 rounded ${
                      route.complaints_count > 50 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'text-slate-300'
                    }`}>
                      {route.complaints_count}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <TrendBadge trend={route.trend} ratingChange={route.rating_change} />
                  </td>

                  <td className="py-4 px-4">
                    <RouteStatusBadge status={route.status} />
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="inline-flex items-center text-blue-400 group-hover:translate-x-1 transition-transform font-medium">
                      <span>Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
