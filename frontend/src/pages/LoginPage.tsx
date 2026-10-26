import React from 'react';
import LoginForm from '@/components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-black text-gray-900">Welcome Back</h3>
        <p className="text-xs text-gray-500 mt-0.5">Sign in to manage and view your saved trips</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
