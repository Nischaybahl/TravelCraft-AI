import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import { useToast } from '@/components/common/Toast';
import { User, Shield, Sparkles } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.full_name || 'Demo Traveler');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('en');
  const [style, setStyle] = useState('moderate');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences updated successfully!', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account & Travel Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Customize your profile, default currencies, and preferred itinerary styles.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <User className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-gray-900 text-base">Personal Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              helperText="Managed via Supabase Auth"
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-gray-900 text-base">Travel Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Default Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={[
                { label: 'USD ($)', value: 'USD' },
                { label: 'EUR (€)', value: 'EUR' },
                { label: 'GBP (£)', value: 'GBP' },
                { label: 'JPY (¥)', value: 'JPY' },
                { label: 'INR (₹)', value: 'INR' },
              ]}
            />
            <Select
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={[
                { label: 'English', value: 'en' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' },
                { label: 'German', value: 'de' },
              ]}
            />
            <Select
              label="Default Travel Style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              options={[
                { label: 'Budget Friendly', value: 'budget' },
                { label: 'Moderate Balanced', value: 'moderate' },
                { label: 'Luxury Experience', value: 'luxury' },
              ]}
            />
          </div>
        </Card>

        <Card className="bg-navy-950 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold text-sm">Deployment & AI Configuration Status</h4>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed mb-4">
            Running in self-contained development mode. Connect your own Supabase project and Google Gemini API key via the backend .env file for live production scaling.
          </p>
          <div className="text-[11px] font-mono bg-white/10 p-2.5 rounded-lg text-indigo-200">
            FRONTEND: Vercel Ready • BACKEND: FastAPI/Render Ready • DB: Supabase Postgres
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
