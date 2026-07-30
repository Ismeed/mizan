import React from 'react';
import { Users, CreditCard, Activity, MessagesSquare, ArrowUpRight, ShieldCheck, FileSpreadsheet, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { StatCard } from '../components/ui/StatCard';
import { Badge } from '../components/ui/Badge';

const trendData = [
  { name: 'Mon', active: 4200, calculations: 2400 },
  { name: 'Tue', active: 5100, calculations: 3100 },
  { name: 'Wed', active: 4800, calculations: 3900 },
  { name: 'Thu', active: 6200, calculations: 4800 },
  { name: 'Fri', active: 7500, calculations: 5600 },
  { name: 'Sat', active: 8900, calculations: 6800 },
  { name: 'Sun', active: 9400, calculations: 7200 },
];

const featureData = [
  { name: 'Inheritance', value: 4800 },
  { name: 'Zakat', value: 3900 },
  { name: 'AI Scholar', value: 6200 },
  { name: 'PDF Reports', value: 2900 },
];

const recentCalculations = [
  { id: 'calc_1', type: 'Inheritance (Mirath)', user: 'usman@example.com', amount: '₦12,500,000', status: 'Completed', date: 'Just now' },
  { id: 'calc_2', type: 'Zakat on Wealth', user: 'fatima@example.com', amount: '₦450,000', status: 'Completed', date: '5m ago' },
  { id: 'calc_3', type: 'Inheritance (Awl)', user: 'ibrahim@example.com', amount: '₦84,000,000', status: 'Completed', date: '12m ago' },
  { id: 'calc_4', type: 'Business Inventory', user: 'zainab@example.com', amount: '₦3,200,000', status: 'Completed', date: '25m ago' },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1">
              <Sparkles size={14} /> MIZAN Engine Dashboard
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Executive Control Center</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time telemetry, Faraid & Zakat calculation monitoring, and Dual-RAG metrics.</p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="glass-card px-4 py-2.5 rounded-xl border-[#1F4D36] text-xs font-semibold text-gray-300 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            Rule Engine Isolated & Verified
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Platform Users" value="24,592" icon={<Users size={22} />} trend={{ value: 14.2, isPositive: true }} />
        <StatCard title="Active Premium Subscribers" value="8,234" icon={<CreditCard size={22} />} trend={{ value: 8.5, isPositive: true }} />
        <StatCard title="Daily Active Calculations" value="12,493" icon={<Activity size={22} />} trend={{ value: 4.1, isPositive: true }} />
        <StatCard title="AI Scholar Chats" value="45,912" icon={<MessagesSquare size={22} />} trend={{ value: 28.4, isPositive: true }} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border-[#1F4D36]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Weekly User & Calculation Growth</h3>
              <p className="text-xs text-gray-400">Comparing active daily users against executed calculations</p>
            </div>
            <Badge variant="gold">Live Sync</Badge>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCalc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F4D36" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#1F4D36" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F4D36" opacity={0.4} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12291E',
                    borderColor: '#1F4D36',
                    borderRadius: '12px',
                    color: '#FFF',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                />
                <Area type="monotone" dataKey="active" name="Active Users" stroke="#C9A84C" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                <Area type="monotone" dataKey="calculations" name="Calculations" stroke="#2D6F4E" strokeWidth={2} fillOpacity={1} fill="url(#colorCalc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Feature Breakdown</h3>
            <span className="text-xs text-gray-400 font-mono">30 Days</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F4D36" opacity={0.4} />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#12291E',
                    borderColor: '#1F4D36',
                    borderRadius: '12px',
                    color: '#FFF',
                  }}
                />
                <Bar dataKey="value" name="Usage Count" fill="#C9A84C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Recent Calculations Activity Table */}
      <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Live Calculation Stream</h3>
            <p className="text-xs text-gray-400">Real-time executed Faraid estate allocations and Zakat assessments</p>
          </div>
          <button className="text-xs text-[#C9A84C] font-semibold hover:underline flex items-center gap-1">
            View All Stream <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1F4D36] text-xs uppercase tracking-wider text-gray-400">
                <th className="py-3 px-4">Calculation Type</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Net Value</th>
                <th className="py-3 px-4">Engine Status</th>
                <th className="py-3 px-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F4D36]/40 text-sm">
              {recentCalculations.map((c) => (
                <tr key={c.id} className="hover:bg-[#1F4D36]/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                    <FileSpreadsheet size={16} className="text-[#C9A84C]" />
                    {c.type}
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">{c.user}</td>
                  <td className="py-3.5 px-4 font-bold text-[#C9A84C]">{c.amount}</td>
                  <td className="py-3.5 px-4">
                    <Badge variant="success">{c.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right text-gray-400 text-xs">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
