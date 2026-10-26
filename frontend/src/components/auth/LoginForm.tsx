import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { useToast } from '@/components/common/Toast';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('traveler@demo.travelcraft.ai');
  const [password, setPassword] = useState('password123');
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter an email address', 'error');
      return;
    }
    await signIn(email);
    showToast('Signed in successfully!', 'success');
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail className="w-4 h-4" />}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        placeholder="••••••••"
        required
      />

      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-500 flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Demo credentials pre-filled
        </span>
      </div>

      <Button type="submit" loading={loading} className="w-full">
        Sign in to TravelCraft AI
      </Button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
          Create free account
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
