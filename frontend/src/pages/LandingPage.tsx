import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Sparkles, MapPin, Compass, ShieldCheck, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import Button from '@/components/common/Button';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      {/* Top Bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="p-2 bg-indigo-600 group-hover:bg-indigo-500 rounded-xl shadow-md transition-colors">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white block leading-none group-hover:text-indigo-200 transition-colors">
              TravelCraft AI
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300">
              Generative Travel Planner
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold px-4 py-2 transition-all shadow-xs"
            onClick={() => navigate('/login')}
          >
            Sign in
          </Button>
          <Button variant="primary" onClick={() => navigate('/create-trip')}>
            Start Free
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by Google Gemini 2.0 & Cloud Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
          Personalized Itineraries, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-teal-300 to-indigo-200">
            Crafted in Seconds with AI.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          From curated dining and geographic cluster scheduling to smart budget tracking and single-day regeneration, TravelCraft AI eliminates vacation planning friction.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/create-trip')}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Build Your Trip Plan
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-xs"
            onClick={() => navigate('/recommendations')}
            icon={<Compass className="w-5 h-5 text-teal-300" />}
          >
            Explore Destinations by Vibe
          </Button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Structured Day-by-Day</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every day is logically organized by morning, afternoon, and evening slots with transit instructions, durations, and backup alternatives.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Smart Budgeting</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Real-time calculations for lodging, meals, attractions, and local transit with interactive visual charts and overload alerts.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">Day Regeneration</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Regenerate or customize a single day without altering the rest of your vacation schedule. Tailor activities on the fly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 px-6 text-center text-xs text-gray-500">
        TravelCraft AI • Skill Wallet Capstone — Generative AI With Google Cloud
      </footer>
    </div>
  );
};

export default LandingPage;
