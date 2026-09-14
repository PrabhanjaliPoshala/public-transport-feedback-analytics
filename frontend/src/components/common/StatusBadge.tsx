import React from 'react';
import type { FeedbackSeverity, FeedbackStatus, RouteStatus, TrendDirection } from '../../types';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RouteStatusBadgeProps {
  status: RouteStatus;
}

export const RouteStatusBadge: React.FC<RouteStatusBadgeProps> = ({ status }) => {
  const styles: Record<RouteStatus, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    Excellent: {
      bg: 'bg-emerald-950/80',
      text: 'text-emerald-400',
      border: 'border-emerald-800/80',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    Good: {
      bg: 'bg-blue-950/80',
      text: 'text-blue-400',
      border: 'border-blue-800/80',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    'Needs Attention': {
      bg: 'bg-amber-950/80',
      text: 'text-amber-400',
      border: 'border-amber-800/80',
      icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    Poor: {
      bg: 'bg-orange-950/80',
      text: 'text-orange-400',
      border: 'border-orange-800/80',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    Critical: {
      bg: 'bg-rose-950/90 animate-pulse-subtle',
      text: 'text-rose-400 font-bold',
      border: 'border-rose-700',
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
    },
  };

  const current = styles[status] || styles['Good'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${current.bg} ${current.text} ${current.border}`}>
      {current.icon}
      <span>{status}</span>
    </span>
  );
};

export const TrendBadge: React.FC<{ trend: TrendDirection; ratingChange?: number }> = ({ trend, ratingChange }) => {
  if (trend === 'Improving') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
        <TrendingUp className="w-3.5 h-3.5" />
        <span>↑ Improving {ratingChange ? `(+${ratingChange})` : ''}</span>
      </span>
    );
  }

  if (trend === 'Deteriorating') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-950 text-rose-400 border border-rose-800">
        <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
        <span>↓ Deteriorating {ratingChange ? `(${ratingChange})` : ''}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
      <Minus className="w-3.5 h-3.5" />
      <span>→ Stable</span>
    </span>
  );
};

export const SeverityBadge: React.FC<{ severity: FeedbackSeverity }> = ({ severity }) => {
  const map: Record<FeedbackSeverity, string> = {
    Low: 'bg-slate-800 text-slate-300 border-slate-700',
    Medium: 'bg-amber-950/80 text-amber-400 border-amber-800',
    High: 'bg-orange-950/90 text-orange-400 border-orange-800 font-semibold',
    Critical: 'bg-rose-950 text-rose-400 border-rose-700 font-bold',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${map[severity] || map['Medium']}`}>
      {severity}
    </span>
  );
};

export const FeedbackStatusBadge: React.FC<{ status: FeedbackStatus }> = ({ status }) => {
  const map: Record<FeedbackStatus, string> = {
    New: 'bg-blue-950 text-blue-400 border-blue-800',
    'Under Review': 'bg-amber-950 text-amber-400 border-amber-800',
    Resolved: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}>
      {status}
    </span>
  );
};
