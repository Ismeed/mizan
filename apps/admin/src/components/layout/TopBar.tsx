import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';

export const TopBar: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return (
    <header className="h-20 bg-[#091711]/80 backdrop-blur-md border-b border-[#1F4D36]/60 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-96">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search calculations, users, rules..."
          className="w-full bg-[#12291E] border border-[#1F4D36] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C9A84C] transition-all"
        />
      </div>

      {/* User, Notifications & Logout */}
      <div className="flex items-center gap-4">
        <button className="relative p-2.5 rounded-xl bg-[#12291E] border border-[#1F4D36] text-gray-400 hover:text-white hover:border-[#C9A84C]/50 transition-all">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#C9A84C] rounded-full ring-4 ring-[#091711]" />
        </button>

        <div className="h-8 w-[1px] bg-[#1F4D36]/60" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#12291E] border border-[#1F4D36] flex items-center justify-center text-[#C9A84C]">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none mb-1">{user?.email || 'admin@mizan.org'}</p>
            <p className="text-xs text-[#C9A84C] font-semibold">Chief Administrator</p>
          </div>
        </div>

        <div className="h-8 w-[1px] bg-[#1F4D36]/60" />

        {/* Sign Out Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:border-rose-500/50 text-xs font-bold transition-all duration-200"
          title="Sign Out of Admin Portal"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
