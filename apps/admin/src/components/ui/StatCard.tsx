import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
}) => {
  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden group">
      {/* Background Subtle Radial Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-2xl group-hover:bg-[#C9A84C]/15 transition-all duration-500 pointer-events-none" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-extrabold text-white tracking-tight group-hover:text-[#F5F0E8] transition-colors">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-[#1F4D36]/40 border border-[#1F4D36] rounded-xl text-[#C9A84C] group-hover:scale-110 group-hover:border-[#C9A84C]/40 transition-all duration-300">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#1F4D36]/40 relative z-10">
        {trend ? (
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {trend.isPositive ? <ArrowUpRight size={14} className="mr-0.5" /> : <ArrowDownRight size={14} className="mr-0.5" />}
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-gray-400">vs last month</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">{subtitle || 'Live Updated'}</span>
        )}
      </div>
    </div>
  );
};
