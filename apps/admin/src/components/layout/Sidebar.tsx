import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart2,
  Bell,
  HelpCircle,
  Coins,
  MessageSquare,
  BookOpen,
  Settings,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { to: '/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/knowledge-base', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/faqs', icon: HelpCircle, label: 'FAQs' },
  { to: '/nisab', icon: Coins, label: 'Nisab Rates' },
  { to: '/ai-usage', icon: MessageSquare, label: 'AI Usage' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar: React.FC = () => {
  const logout = useAuthStore(state => state.logout);

  return (
    <aside className="w-64 bg-[#091711] border-r border-[#1F4D36]/60 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#1F4D36]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4B458] to-[#9A7B2C] flex items-center justify-center shadow-lg shadow-[#C9A84C]/20">
            <Coins size={22} className="text-[#091711]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-widest gold-gradient-text">MIZAN</span>
            <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#12291E] to-[#1F4D36]/40 text-[#C9A84C] border border-[#1F4D36] shadow-md shadow-black/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#12291E]/60'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#C9A84C] rounded-r-full shadow-[0_0_10px_#C9A84C]" />
                )}
                <item.icon size={20} className={isActive ? 'text-[#C9A84C]' : 'text-gray-400'} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Sidebar Sign Out Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 mt-4 border border-rose-500/20"
        >
          <LogOut size={20} className="text-rose-400" />
          <span>Sign Out</span>
        </button>
      </nav>

      {/* System Status Footer */}
      <div className="p-4 border-t border-[#1F4D36]/60 bg-[#12291E]/40">
        <div className="flex items-center gap-3 p-3 glass-card rounded-xl border-[#1F4D36]">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <p className="text-xs font-bold text-white flex items-center gap-1">
              <ShieldCheck size={14} className="text-emerald-400" /> System Active
            </p>
            <p className="text-[10px] text-gray-400">Rule Engine & Dual-RAG</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
