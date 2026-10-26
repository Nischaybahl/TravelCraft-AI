import React from 'react';
import RegisterForm from '@/components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-black text-gray-900">Get Started</h3>
        <p className="text-xs text-gray-500 mt-0.5">Create your personalized itinerary account</p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
