import React, { useState } from 'react';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Search, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Ali Ahmed', email: 'ali@example.com', country: 'Nigeria', madhhab: 'Maliki', plan: 'PREMIUM', status: 'ACTIVE', joined: '2023-10-01' },
  { id: '2', name: 'Sarah Khan', email: 'sarah@example.com', country: 'Pakistan', madhhab: 'Hanafi', plan: 'FREE', status: 'ACTIVE', joined: '2023-10-05' },
  { id: '3', name: 'Omar Yusuf', email: 'omar@example.com', country: 'UAE', madhhab: 'Shafi\'i', plan: 'PREMIUM', status: 'SUSPENDED', joined: '2023-11-12' },
  { id: '4', name: 'Zainab Mohammed', email: 'zainab@example.com', country: 'United Kingdom', madhhab: 'Hanbali', plan: 'PREMIUM', status: 'ACTIVE', joined: '2023-12-01' },
];

export const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = [
    {
      header: 'User',
      accessor: (user: any) => (
        <div>
          <p className="font-bold text-white leading-snug">{user.name}</p>
          <p className="text-xs text-gray-400">{user.email}</p>
        </div>
      )
    },
    { header: 'Country', accessor: 'country' as const },
    {
      header: 'Madhhab',
      accessor: (user: any) => (
        <span className="text-[#C9A84C] font-semibold">{user.madhhab}</span>
      )
    },
    {
      header: 'Subscription Plan',
      accessor: (user: any) => (
        <Badge variant={user.plan === 'PREMIUM' ? 'gold' : 'neutral'}>{user.plan}</Badge>
      )
    },
    {
      header: 'Status',
      accessor: (user: any) => (
        <Badge variant={user.status === 'ACTIVE' ? 'success' : 'error'}>{user.status}</Badge>
      )
    },
    { header: 'Joined Date', accessor: 'joined' as const },
    {
      header: 'Actions',
      accessor: (user: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <UserCheck size={14} className="mr-1 inline" /> Details
          </Button>
          <Button size="sm" variant={user.status === 'ACTIVE' ? 'danger' : 'secondary'}>
            {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      )
    }
  ];

  const filteredUsers = mockUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-gradient-to-r from-[#12291E] via-[#1A3328] to-[#12291E] p-8 rounded-2xl border border-[#1F4D36]">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#C9A84C] flex items-center gap-1 mb-1">
            <Sparkles size={14} /> Account Telemetry
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">User Account Management</h1>
          <p className="text-gray-400 text-sm mt-1">View, search, and manage all registered MIZAN platform accounts.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 border-[#1F4D36]">
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full bg-[#091711] border border-[#1F4D36] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Table columns={columns} data={filteredUsers} />
      </div>
    </div>
  );
};
