import React from 'react';
import { Plane, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-gray-400 hover:text-white flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex flex-col items-center group cursor-pointer"
          >
            <div className="inline-flex p-3 bg-indigo-600 group-hover:bg-indigo-500 rounded-2xl shadow-lg shadow-indigo-500/30 mb-3 text-white transition-all">
              <Plane className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight group-hover:text-indigo-200 transition-colors">
              TravelCraft AI
            </h2>
            <p className="text-xs text-indigo-200 mt-1 uppercase tracking-widest font-semibold">
              Your Intelligent Travel Companion
            </p>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
