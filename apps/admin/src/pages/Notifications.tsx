import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Send, Bell, Sparkles, CheckCircle2, Users } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const Notifications: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('ALL');
  const [sentCount, setSentCount] = useState<number | null>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSentCount(target === 'ALL' ? 24592 : target === 'PREMIUM' ? 8234 : 16358);
    setTitle('');
    setBody('');
    setTimeout(() => setSentCount(null), 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1 mb-1">
            <Sparkles size={14} /> Firebase Push Center
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Push Notification Broadcast</h1>
          <p className="text-gray-400 text-sm mt-1">Broadcast real-time push alerts, Zakat reminders, and announcements.</p>
        </div>
        <Badge variant="gold">
          <Bell size={14} className="mr-1 inline" /> FCM Service Active
        </Badge>
      </div>

      <div className="glass-card rounded-2xl p-8 border-[#1F4D36]">
        <form onSubmit={handleSend} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Target Segment</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'ALL', label: 'All Users (24.5k)' },
                { id: 'PREMIUM', label: 'Premium Only (8.2k)' },
                { id: 'FREE', label: 'Free Tier (16.3k)' },
              ].map(seg => (
                <button
                  type="button"
                  key={seg.id}
                  onClick={() => setTarget(seg.id)}
                  className={`p-4 rounded-xl border text-sm font-bold text-left transition-all ${
                    target === seg.id
                      ? 'bg-[#1F4D36] border-[#C9A84C] text-[#C9A84C] shadow-lg shadow-[#C9A84C]/10'
                      : 'bg-[#091711] border-[#1F4D36] text-gray-400 hover:text-white hover:bg-[#12291E]'
                  }`}
                >
                  <Users size={16} className="mb-2" />
                  {seg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Notification Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 🌙 Ramadan Zakat Reminder & Nisab Update"
              className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Message Body</label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C] resize-none"
              placeholder="Enter message content displayed on lock screen..."
              required
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1F4D36]">
            {sentCount !== null ? (
              <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                <CheckCircle2 size={16} /> Broadcast successfully sent to {sentCount.toLocaleString()} devices!
              </span>
            ) : (
              <span className="text-xs text-gray-400">Pushes execute immediately via Firebase Cloud Messaging.</span>
            )}
            <Button type="submit">
              <Send size={16} className="mr-2 inline" /> Send Broadcast Now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
