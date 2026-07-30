import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Subscriptions } from './pages/Subscriptions';
import { Analytics } from './pages/Analytics';
import { Notifications } from './pages/Notifications';
import { FAQs } from './pages/FAQs';
import { NisabRates } from './pages/NisabRates';
import { AIUsage } from './pages/AIUsage';
import { Settings } from './pages/Settings';
import { useAuthStore } from './stores/auth.store';

import { KnowledgeBase } from './pages/KnowledgeBase';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="knowledge-base" element={<KnowledgeBase />} />
          <Route path="faqs" element={<FAQs />} />
          <Route path="nisab" element={<NisabRates />} />
          <Route path="ai-usage" element={<AIUsage />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
