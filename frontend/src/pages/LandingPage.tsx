import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Sparkles, MapPin, Compass, ShieldCheck, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import Button from '@/components/common/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Bar */}
      <header className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-3">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="p-2 bg-indigo-600 group-hover:bg-indigo-500 rounded-xl shadow-md transition-colors shrink-0">
            <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-lg sm:text-xl tracking-tight text-white block leading-none group-hover:text-indigo-200 transition-colors">
              TravelCraft AI
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-indigo-300 block mt-0.5 sm:mt-1">
              Generative Travel Planner
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all shadow-xs"
            onClick={() => navigate('/login')}
          >
            Sign in
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30"
            onClick={() => navigate('/create-trip')}
          >
            Start Free
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20 text-center flex-1 flex flex-col justify-center items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] sm:text-xs font-semibold mb-5 sm:mb-6 max-w-[95%] sm:max-w-full">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate sm:whitespace-normal">Powered by Google Gemini 2.0 & Cloud Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight sm:leading-tight md:leading-tight mb-4 sm:mb-6 max-w-4xl px-2">
          Personalized Itineraries, <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-300 to-indigo-200">
            Crafted in Seconds with AI.
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-normal px-2">
          From curated dining and geographic cluster scheduling to smart budget tracking and single-day regeneration, TravelCraft AI eliminates vacation planning friction.
        </p>

        {/* Responsive CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-md mx-auto px-2">
          <Button
            size="lg"
            variant="primary"
            className="w-full sm:w-auto py-3 px-6 text-sm sm:text-base font-bold shadow-lg shadow-indigo-600/40"
            onClick={() => navigate('/create-trip')}
            icon={<ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
          >
            Build Your Trip Plan
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto py-3 px-6 text-sm sm:text-base font-semibold border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs"
            onClick={() => navigate('/recommendations')}
            icon={<Compass className="w-4 h-4 sm:w-5 sm:h-5 text-teal-300" />}
          >
            Explore by Vibe
          </Button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 sm:mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2">Structured Day-by-Day</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every day is logically organized by morning, afternoon, and evening slots with transit instructions, durations, and backup alternatives.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3 sm:mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2">Smart Budgeting</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Real-time calculations for lodging, meals, attractions, and local transit with interactive visual charts and overload alerts.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-xs sm:col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 sm:mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base sm:text-lg mb-1.5 sm:mb-2">Day Regeneration</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Regenerate or customize a single day without altering the rest of your vacation schedule. Tailor activities on the fly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-5 sm:py-6 px-4 sm:px-6 text-center text-xs text-gray-400">
        TravelCraft AI • Skill Wallet Capstone — Generative AI With Google Cloud
      </footer>
    </div>
  );
};

export default LandingPage;
