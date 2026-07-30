import React, { useState } from 'react';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { StatCard } from '../components/ui/StatCard';
import { MessageSquare, Zap, Clock, Sparkles, Bot, ShieldCheck } from 'lucide-react';

const mockConversations = [
  { id: 'conv_1', user: 'ali@example.com', tokens: 1250, messages: 8, date: '2026-07-27 14:30', topic: 'Inheritance Faraid Share' },
  { id: 'conv_2', user: 'sarah@example.com', tokens: 430, messages: 3, date: '2026-07-27 15:15', topic: 'Zakat on Gold Nisab' },
  { id: 'conv_3', user: 'omar@example.com', tokens: 3200, messages: 15, date: '2026-07-27 16:45', topic: 'Business Inventory Zakat Base' },
];

export const AIUsage: React.FC = () => {
  const [selectedConv, setSelectedConv] = useState<any>(null);

  const columns = [
    {
      header: 'User Account',
      accessor: (conv: any) => (
        <div>
          <p className="font-bold text-white leading-snug">{conv.user}</p>
          <p className="text-xs text-gray-400">ID: {conv.id}</p>
        </div>
      )
    },
    { header: 'Topic Category', accessor: 'topic' as const },
    { header: 'Messages', accessor: 'messages' as const },
    { 
      header: 'Tokens Consumed', 
      accessor: (conv: any) => (
        <span className="text-[#C9A84C] font-mono font-bold">{conv.tokens.toLocaleString()}</span>
      )
    },
    { header: 'Timestamp', accessor: 'date' as const },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1 mb-1">
            <Sparkles size={14} /> Telemetry Audit
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">AI Scholar & Gemini Usage</h1>
          <p className="text-gray-400 text-sm mt-1">Audit active conversations, token consumption, response latency, and Rule Engine isolation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total AI Conversations" value="12,492" icon={<MessageSquare size={22} />} trend={{ value: 15.2, isPositive: true }} />
        <StatCard title="Tokens Consumed" value="4.2M" icon={<Zap size={22} />} trend={{ value: 8.4, isPositive: true }} />
        <StatCard title="Avg. Response Time" value="1.12s" icon={<Clock size={22} />} trend={{ value: 0.15, isPositive: true }} />
      </div>

      <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Recent Conversation Logs</h3>
          <Badge variant="gold">
            <Bot size={14} className="mr-1 inline" /> Gemini 1.5 Pro Active
          </Badge>
        </div>

        <Table columns={columns} data={mockConversations} onRowClick={setSelectedConv} />
      </div>

      <Modal isOpen={!!selectedConv} onClose={() => setSelectedConv(null)} title="AI Conversation Audit Transcript">
        {selectedConv && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#091711] p-3 rounded-xl border border-[#1F4D36]">
                <span className="text-xs text-gray-400 block">User Account:</span>
                <span className="text-sm font-bold text-white">{selectedConv.user}</span>
              </div>
              <div className="bg-[#091711] p-3 rounded-xl border border-[#1F4D36]">
                <span className="text-xs text-gray-400 block">Tokens Used:</span>
                <span className="text-sm font-bold text-[#C9A84C] font-mono">{selectedConv.tokens}</span>
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Transcript Sample</span>
                <span className="text-emerald-400 flex items-center gap-1 text-[10px]"><ShieldCheck size={12} /> Verified Citations</span>
              </p>
              <div className="space-y-3">
                <div className="bg-[#091711] p-4 rounded-xl border border-[#1F4D36] text-sm text-gray-300">
                  <span className="font-bold text-[#C9A84C] block mb-1">User Query:</span>
                  How is inheritance calculated for a wife when children exist?
                </div>
                <div className="bg-[#1F4D36]/40 p-4 rounded-xl border border-[#1F4D36] text-sm text-gray-200">
                  <span className="font-bold text-emerald-400 block mb-1">AI Assistant (Rule Engine Verified):</span>
                  According to Surah An-Nisa (4:12), a wife receives 1/8th (12.5%) of the net estate when children exist. The calculation was processed by MIZAN's Rule Engine.
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
