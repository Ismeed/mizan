import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@mizan.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    setTimeout(() => {
      if (email === 'admin@mizan.com' && password === 'password') {
        login('mock-jwt-token', email);
        navigate('/');
      } else {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0D1F17] flex flex-col items-center justify-center p-4">
      <div className="mb-8 flex flex-col items-center text-[#C9A84C]">
        <Coins size={48} className="mb-4" />
        <h1 className="text-3xl font-bold tracking-widest">MIZAN</h1>
        <p className="text-gray-400 mt-2">Admin Portal</p>
      </div>
      
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <Input 
            label="Email Address" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
