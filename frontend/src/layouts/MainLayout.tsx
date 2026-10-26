import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Compass,
  LayoutDashboard,
  PlusCircle,
  FolderHeart,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Plane,
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut, isDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Create Trip', path: '/create-trip', icon: <PlusCircle className="w-5 h-5" /> },
    { label: 'Current Plan', path: '/itinerary', icon: <Sparkles className="w-5 h-5" /> },
    { label: 'Destinations', path: '/recommendations', icon: <Compass className="w-5 h-5" /> },
    { label: 'My Trips', path: '/my-trips', icon: <FolderHeart className="w-5 h-5" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-navy-950 text-white p-4 flex items-center justify-between border-b border-navy-900 sticky top-0 z-40">
        <NavLink to="/" className="flex items-center gap-2.5 cursor-pointer">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-base tracking-tight leading-none text-white">TravelCraft AI</h1>
            <span className="text-[10px] text-indigo-300 font-semibold tracking-wider uppercase">
              Skill Wallet Edition
            </span>
          </div>
        </NavLink>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-gray-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-navy-950 text-white flex flex-col justify-between p-5 z-50 transition-transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo */}
          <NavLink
            to="/"
            className="hidden md:flex items-center gap-3 mb-8 px-2 group cursor-pointer"
          >
            <div className="p-2 bg-indigo-600 group-hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-500/20 transition-all">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight leading-none text-white group-hover:text-indigo-200 transition-colors">
                TravelCraft AI
              </h1>
              <p className="text-[10px] font-semibold text-indigo-300 tracking-wider uppercase mt-1">
                Intelligent Companion
              </p>
            </div>
          </NavLink>

          {/* Demo Mode Badge */}
          {isDemo && (
            <div className="mb-6 p-2.5 bg-indigo-900/40 border border-indigo-700/40 rounded-xl text-xs flex items-center gap-2 text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Smart Demo Mode active with simulated AI & live fallback</span>
            </div>
          )}

          {/* Nav links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-navy-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="pt-4 border-t border-navy-900">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-bold flex items-center justify-center text-xs shrink-0">
                {user?.full_name?.slice(0, 1) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.full_name || 'Traveler'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="font-bold text-gray-800">TravelCraft AI</span>
            <span>/</span>
            <span className="capitalize text-indigo-600 font-semibold">
              {location.pathname.replace('/', '') || 'dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600 pr-3 border-r border-gray-200">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span>{user?.full_name || 'Traveler'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-gray-200"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
