import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <Compass className="w-8 h-8 animate-spin" />
      </div>
      <h1 className="text-4xl font-black text-gray-900 tracking-tight">404</h1>
      <h3 className="text-lg font-bold text-gray-700 mt-1">Destination Not Found</h3>
      <p className="text-sm text-gray-500 max-w-sm mt-2 mb-6">
        The route you are looking for does not exist or has moved. Let's redirect you back to safety.
      </p>
      <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
    </div>
  );
};

export default NotFoundPage;
