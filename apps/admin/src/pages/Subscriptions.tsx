import React from 'react';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { DollarSign, CreditCard, TrendingUp, Sparkles, ShieldCheck } from 'lucide-react';

const mockSubs = [
  { id: 'sub_1', user: 'ali@example.com', plan: 'Premium Annual', status: 'ACTIVE', provider: 'Stripe', nextBilling: '2026-10-01', amount: '$49.99' },
  { id: 'sub_2', user: 'fatima@example.com', plan: 'Premium Monthly', status: 'ACTIVE', provider: 'Apple Pay', nextBilling: '2026-08-05', amount: '$4.99' },
  { id: 'sub_3', user: 'omar@example.com', plan: 'Premium Annual', status: 'CANCELED', provider: 'Google Play', nextBilling: '-', amount: '$49.99' },
  { id: 'sub_4', user: 'zainab@example.com', plan: 'Premium Annual', status: 'ACTIVE', provider: 'Stripe', nextBilling: '2026-12-15', amount: '$49.99' },
];

export const Subscriptions: React.FC = () => {
  const columns = [
    {
      header: 'Subscriber Account',
      accessor: (sub: any) => (
        <div>
          <p className="font-bold text-white leading-snug">{sub.user}</p>
          <p className="text-xs text-gray-400">ID: {sub.id}</p>
        </div>
      )
    },
    {
      header: 'Plan',
      accessor: (sub: any) => (
        <Badge variant="gold">{sub.plan}</Badge>
      )
    },
    {
      header: 'Recurring Amount',
      accessor: (sub: any) => (
        <span className="text-[#C9A84C] font-extrabold">{sub.amount}</span>
      )
    },
    { header: 'Payment Gateway', accessor: 'provider' as const },
    { 
      header: 'Status', 
      accessor: (sub: any) => (
        <Badge variant={sub.status === 'ACTIVE' ? 'success' : 'error'}>{sub.status}</Badge>
      )
    },
    { header: 'Next Renewal', accessor: 'nextBilling' as const },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1 mb-1">
            <Sparkles size={14} /> Revenue Telemetry
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Subscriptions & Billing</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor monthly recurring revenue (MRR), subscription renewals, and churn rates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Monthly Recurring Revenue (MRR)" value="$12,450" icon={<DollarSign size={22} />} trend={{ value: 8.4, isPositive: true }} />
        <StatCard title="Active Subscribers" value="8,234" icon={<CreditCard size={22} />} trend={{ value: 12.1, isPositive: true }} />
        <StatCard title="Subscription Churn Rate" value="2.1%" icon={<TrendingUp size={22} />} trend={{ value: 0.4, isPositive: true }} />
      </div>

      <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Active Subscription Ledger</h3>
          <Badge variant="success"><ShieldCheck size={14} className="mr-1 inline" /> In-App Purchasing Live</Badge>
        </div>

        <Table columns={columns} data={mockSubs} />
      </div>
    </div>
  );
};
