import React, { useState } from 'react';
import { Sun, Mountain, Landmark, Heart, Compass, Palmtree, Waves, ShoppingBag } from 'lucide-react';
import Button from '@/components/common/Button';

interface VibeSelectorProps {
  onSearch: (criteria: { vibe: string; climate: string; month: string }) => void;
  loading?: boolean;
}

const VIBES = [
  { id: 'cultural', label: 'Cultural & Historic', icon: <Landmark className="w-4 h-4" /> },
  { id: 'nature', label: 'Scenic Nature & Hikes', icon: <Mountain className="w-4 h-4" /> },
  { id: 'beaches', label: 'Sun & Coastal Relaxation', icon: <Waves className="w-4 h-4" /> },
  { id: 'romantic', label: 'Romantic Getaways', icon: <Heart className="w-4 h-4" /> },
  { id: 'adventure', label: 'Active Adventure', icon: <Compass className="w-4 h-4" /> },
  { id: 'urban', label: 'Urban & Shopping', icon: <ShoppingBag className="w-4 h-4" /> },
];

export const VibeSelector: React.FC<VibeSelectorProps> = ({ onSearch, loading = false }) => {
  const [selectedVibe, setSelectedVibe] = useState('cultural');
  const [climate, setClimate] = useState('Mild / Temperate');
  const [month, setMonth] = useState('Spring (April - June)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ vibe: selectedVibe, climate, month });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs mb-8">
      <h3 className="font-bold text-gray-900 text-base mb-1">Discover By Travel Vibe</h3>
      <p className="text-xs text-gray-500 mb-4">
        Tell TravelCraft your desired mood and our recommendation engine will pair you with ideal spots.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {VIBES.map((v) => {
          const isSelected = selectedVibe === v.id;
          return (
            <button
              type="button"
              key={v.id}
              onClick={() => setSelectedVibe(v.id)}
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className={isSelected ? 'text-indigo-600' : 'text-gray-400'}>{v.icon}</span>
              {v.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            Preferred Climate
          </label>
          <select
            value={climate}
            onChange={(e) => setClimate(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option>Sunny & Tropical</option>
            <option>Mild / Temperate</option>
            <option>Cool & Alpine</option>
            <option>Snowy & Winter Wonderland</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            Travel Window
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option>Spring (April - June)</option>
            <option>Summer (July - August)</option>
            <option>Autumn (September - November)</option>
            <option>Winter (December - March)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" loading={loading} icon={<Compass className="w-4 h-4" />}>
          Find Matching Destinations
        </Button>
      </div>
    </form>
  );
};

export default VibeSelector;
