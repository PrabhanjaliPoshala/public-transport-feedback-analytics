import React from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  changeType?: 'positive_is_good' | 'negative_is_good';
  icon: React.ReactNode;
  badgeText?: string;
  alert?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive_is_good',
  icon,
  badgeText,
  alert = false,
}) => {
  let isGood = false;
  if (change !== undefined) {
    if (changeType === 'positive_is_good') {
      isGood = change >= 0;
    } else {
      isGood = change <= 0;
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border transition-all ${
      alert
        ? 'bg-gradient-to-br from-slate-900 via-rose-950/30 to-slate-900 border-rose-800/80 shadow-lg shadow-rose-950/20'
        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-md'
    }`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`p-2.5 rounded-xl border ${
          alert ? 'bg-rose-950/80 border-rose-800 text-rose-400' : 'bg-slate-800/80 border-slate-700/80 text-blue-400'
        }`}>
          {icon}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{value}</div>
        
        {badgeText && (
          <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-950 text-rose-400 border border-rose-800">
            {badgeText}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-800/80">
        {change !== undefined ? (
          <div className={`flex items-center gap-1 font-semibold ${
            isGood ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {change > 0 ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : change < 0 ? (
              <ArrowDownRight className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4 text-slate-400" />
            )}
            <span>{change > 0 ? `+${change}%` : `${change}%`}</span>
            <span className="text-slate-400 font-normal">vs prev period</span>
          </div>
        ) : (
          <span className="text-slate-400">{subtitle || 'Live calculated'}</span>
        )}
      </div>
    </div>
  );
};
