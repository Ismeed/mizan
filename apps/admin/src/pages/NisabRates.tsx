import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Coins, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const NisabRates: React.FC = () => {
  const [goldRate, setGoldRate] = useState('78.40');
  const [silverRate, setSilverRate] = useState('0.92');
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const goldNisab = (parseFloat(goldRate || '0') * 85).toFixed(2);
  const silverNisab = (parseFloat(silverRate || '0') * 595).toFixed(2);

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1 mb-1">
            <Sparkles size={14} /> Market Rates Telemetry
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Global Nisab Price Thresholds</h1>
          <p className="text-gray-400 text-sm mt-1">Configure Gold (85g) and Silver (595g) spot prices for real-time Zakat evaluations.</p>
        </div>
        <Badge variant="gold">
          <RefreshCw size={14} className="mr-1 inline animate-spin" /> Live Market Feed
        </Badge>
      </div>

      <div className="glass-card rounded-2xl p-8 border-[#1F4D36]">
        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gold Input Card */}
            <div className="bg-[#091711] p-6 rounded-2xl border border-[#1F4D36] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#C9A84C] flex items-center gap-2">
                  <Coins size={20} /> Gold Spot Rate (24k)
                </span>
                <Badge variant="gold">85g Threshold</Badge>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 font-semibold">Per Gram Price (USD $)</label>
                <input
                  type="number"
                  step="0.01"
                  value={goldRate}
                  onChange={(e) => setGoldRate(e.target.value)}
                  className="w-full bg-[#12291E] border border-[#1F4D36] rounded-xl p-3 text-xl font-bold text-white focus:outline-none focus:border-[#C9A84C]"
                  required
                />
              </div>

              <div className="pt-2 border-t border-[#1F4D36] flex justify-between items-center text-xs">
                <span className="text-gray-400">Computed Gold Nisab:</span>
                <span className="text-lg font-extrabold text-white">${parseFloat(goldNisab).toLocaleString()} USD</span>
              </div>
            </div>

            {/* Silver Input Card */}
            <div className="bg-[#091711] p-6 rounded-2xl border border-[#1F4D36] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-200 flex items-center gap-2">
                  <Coins size={20} className="text-gray-400" /> Silver Spot Rate (Pure)
                </span>
                <Badge variant="neutral">595g Threshold</Badge>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 font-semibold">Per Gram Price (USD $)</label>
                <input
                  type="number"
                  step="0.01"
                  value={silverRate}
                  onChange={(e) => setSilverRate(e.target.value)}
                  className="w-full bg-[#12291E] border border-[#1F4D36] rounded-xl p-3 text-xl font-bold text-white focus:outline-none focus:border-[#C9A84C]"
                  required
                />
              </div>

              <div className="pt-2 border-t border-[#1F4D36] flex justify-between items-center text-xs">
                <span className="text-gray-400">Computed Silver Nisab:</span>
                <span className="text-lg font-extrabold text-white">${parseFloat(silverNisab).toLocaleString()} USD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#1F4D36]">
            {isSaved ? (
              <span className="text-emerald-400 text-sm font-bold flex items-center gap-1">
                <CheckCircle2 size={16} /> Rates successfully updated and published to Rule Engine!
              </span>
            ) : (
              <span className="text-xs text-gray-400">Changes immediately apply across mobile app Zakat calculators.</span>
            )}
            <Button type="submit">Publish Nisab Rates</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
