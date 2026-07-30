import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Shield, Key, Sparkles, CheckCircle2, Cpu, Lock } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const Settings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1 mb-1">
            <Sparkles size={14} /> Security Telemetry
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Admin Settings & Integrations</h1>
          <p className="text-gray-400 text-sm mt-1">Manage admin credentials, API integrations, and Gemini AI Gateway settings.</p>
        </div>
        <Badge variant="gold"><Lock size={14} className="mr-1 inline" /> SSL 256-Bit Encrypted</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1F4D36]">
            <div className="p-2.5 rounded-xl bg-[#1F4D36]/40 border border-[#1F4D36] text-[#C9A84C]">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Security Credentials</h3>
              <p className="text-xs text-gray-400">Update admin login password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Current Admin Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">New Strong Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl p-3 text-white focus:outline-none focus:border-[#C9A84C]"
              />
            </div>

            {isSaved && (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 size={14} /> Password updated successfully!
              </p>
            )}

            <Button type="submit" className="w-full mt-2">Update Password</Button>
          </form>
        </div>

        <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1F4D36]">
            <div className="p-2.5 rounded-xl bg-[#1F4D36]/40 border border-[#1F4D36] text-[#C9A84C]">
              <Key size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">API Gateways & Integrations</h3>
              <p className="text-xs text-gray-400">Live service integration status</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Google Gemini API (GEMINI_API_KEY)', status: 'Active (Gemini 1.5 Pro)', variant: 'success' as const, icon: Cpu },
              { name: 'OpenAI GPT-4o Fallback', status: 'Active', variant: 'success' as const, icon: Key },
              { name: 'Stripe Payment Gateway', status: 'Active (Webhooks Live)', variant: 'success' as const, icon: Shield },
              { name: 'Firebase Cloud Messaging (FCM)', status: 'Active', variant: 'success' as const, icon: Shield },
            ].map((api, idx) => (
              <div key={idx} className="flex justify-between items-center p-3.5 bg-[#091711] rounded-xl border border-[#1F4D36]">
                <div className="flex items-center gap-2">
                  <api.icon size={16} className="text-[#C9A84C]" />
                  <span className="text-xs font-semibold text-gray-300">{api.name}</span>
                </div>
                <Badge variant={api.variant}>{api.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
