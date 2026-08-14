'use client';

import React from 'react';
import { Clock, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

export type FreshnessStatus = 'LIVE' | 'RECENT' | 'STALE' | 'UNKNOWN';

interface FreshnessBadgeProps {
  status?: FreshnessStatus;
  lastUpdated?: string | Date;
  customMinutesAgo?: number;
  className?: string;
}

export const FreshnessBadge: React.FC<FreshnessBadgeProps> = ({
  status: initialStatus,
  lastUpdated,
  customMinutesAgo,
  className = '',
}) => {
  let minutesAgo = customMinutesAgo;

  if (minutesAgo === undefined && lastUpdated && typeof lastUpdated !== 'string') {
    const diffMs = new Date().getTime() - new Date(lastUpdated).getTime();
    minutesAgo = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  }

  let status: FreshnessStatus = initialStatus || 'LIVE';
  if (initialStatus === undefined && minutesAgo !== undefined) {
    if (minutesAgo < 15) status = 'LIVE';
    else if (minutesAgo < 60) status = 'RECENT';
    else status = 'STALE';
  }

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase border ${
        status === 'LIVE'
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          : status === 'RECENT'
          ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
          : status === 'STALE'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          : 'bg-slate-800 border-slate-700 text-slate-400'
      } ${className}`}
      title={`Data Last Updated: ${lastUpdated ? String(lastUpdated) : minutesAgo !== undefined ? `${minutesAgo} mins ago` : 'Just now'}`}
    >
      {status === 'LIVE' && <CheckCircle2 size={12} className="text-emerald-400 animate-pulse" />}
      {status === 'RECENT' && <Clock size={12} className="text-blue-400" />}
      {status === 'STALE' && <AlertCircle size={12} className="text-amber-400" />}
      {status === 'UNKNOWN' && <ShieldAlert size={12} className="text-slate-400" />}
      
      <span>
        {status} {minutesAgo !== undefined ? `(${minutesAgo}m)` : ''}
      </span>
    </div>
  );
};
