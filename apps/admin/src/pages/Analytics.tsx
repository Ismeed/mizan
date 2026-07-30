import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Sparkles, Globe, PieChart as PieIcon, LineChart as LineIcon } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const mauData = [
  { month: 'Jan', users: 12000 },
  { month: 'Feb', users: 15000 },
  { month: 'Mar', users: 18000 },
  { month: 'Apr', users: 22000 },
  { month: 'May', users: 21000 },
  { month: 'Jun', users: 25000 },
  { month: 'Jul', users: 28900 },
];

const pieData = [
  { name: 'Mirath Inheritance', value: 45 },
  { name: 'Zakat Calculator', value: 30 },
  { name: 'AI Scholar Consult', value: 25 },
];
const COLORS = ['#C9A84C', '#1F4D36', '#2D6F4E'];

const countryData = [
  { name: 'Nigeria', users: 9500 },
  { name: 'Saudi Arabia', users: 6200 },
  { name: 'UAE', users: 4800 },
  { name: 'Indonesia', users: 4100 },
  { name: 'Pakistan', users: 2900 },
];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1 mb-1">
            <Sparkles size={14} /> Usage Demographics
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform Analytics & Insights</h1>
          <p className="text-gray-400 text-sm mt-1">Global user demographics, monthly active users (MAU), and feature distribution.</p>
        </div>
        <Badge variant="gold"><Globe size={14} className="mr-1 inline" /> Global Deployment</Badge>
      </div>

      <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <LineIcon size={18} className="text-[#C9A84C]" /> Monthly Active Users (MAU)
            </h3>
            <p className="text-xs text-gray-400">Total active app sessions over the last 7 months</p>
          </div>
          <Badge variant="success">+18.4% Growth</Badge>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mauData}>
              <defs>
                <linearGradient id="colorMau" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F4D36" opacity={0.4} />
              <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#12291E',
                  borderColor: '#1F4D36',
                  borderRadius: '12px',
                  color: '#FFF',
                }}
              />
              <Area type="monotone" dataKey="users" stroke="#C9A84C" strokeWidth={3} fillOpacity={1} fill="url(#colorMau)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
          <h3 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
            <PieIcon size={18} className="text-[#C9A84C]" /> Feature Share Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={65} outerRadius={85} paddingAngle={6} dataKey="value">
                  {pieData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#12291E', borderColor: '#1F4D36', borderRadius: '12px', color: '#FFF' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[#1F4D36]">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {item.name} ({item.value}%)
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
          <h3 className="text-lg font-bold text-white tracking-tight mb-6 flex items-center gap-2">
            <Globe size={18} className="text-[#C9A84C]" /> Top Active Countries
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F4D36" horizontal={false} opacity={0.4} />
                <XAxis type="number" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#12291E', borderColor: '#1F4D36', borderRadius: '12px', color: '#FFF' }} />
                <Bar dataKey="users" fill="#1F4D36" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
