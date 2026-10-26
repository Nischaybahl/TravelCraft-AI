import React, { useState } from 'react';
import type { TripPreferences } from '@/types';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import { Calendar, Users, DollarSign, Sparkles, MapPin, Compass } from 'lucide-react';
import { useToast } from '@/components/common/Toast';

const INTEREST_OPTIONS = [
  'Food & Dining',
  'Nature & Scenery',
  'Adventure',
  'Culture & Arts',
  'History',
  'Beaches',
  'Shopping',
  'Nightlife',
  'Photography',
];

interface TripPreferenceFormProps {
  onSubmit: (prefs: TripPreferences) => void;
  loading?: boolean;
  initialDestination?: string;
  initialCountry?: string;
}

export const TripPreferenceForm: React.FC<TripPreferenceFormProps> = ({
  onSubmit,
  loading = false,
  initialDestination = '',
  initialCountry = '',
}) => {
  const [destination, setDestination] = useState(initialDestination || 'Barcelona');
  const [country, setCountry] = useState(initialCountry || 'Spain');
  const [startDate, setStartDate] = useState('2025-05-10');
  const [endDate, setEndDate] = useState('2025-05-14');
  const [budget, setBudget] = useState(2000);
  const [currency, setCurrency] = useState('USD');
  const [numTravelers, setNumTravelers] = useState(2);
  const [travelGroup, setTravelGroup] = useState('couple');
  const [travelStyle, setTravelStyle] = useState('moderate');
  const [travelPace, setTravelPace] = useState('balanced');
  const [interests, setInterests] = useState<string[]>(['Culture & Arts', 'Food & Dining']);
  const [accommodation, setAccommodation] = useState('boutique hotel');
  const [dietary, setDietary] = useState('');
  const [notes, setNotes] = useState('');
  const { showToast } = useToast();

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const calculatedDuration = Math.max(
    1,
    Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)) + 1
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) {
      showToast('Please specify a destination', 'error');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      showToast('End date cannot precede start date', 'error');
      return;
    }
    if (budget <= 0) {
      showToast('Budget must be positive', 'error');
      return;
    }

    const dietaryList = dietary
      ? dietary.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    onSubmit({
      destination,
      country,
      start_date: startDate,
      end_date: endDate,
      budget: Number(budget),
      currency,
      num_travelers: Number(numTravelers),
      travel_group: travelGroup,
      travel_style: travelStyle,
      travel_pace: travelPace,
      interests,
      accommodation_preference: accommodation,
      dietary_preferences: dietaryList,
      additional_notes: notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Destination & Dates */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <MapPin className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900 text-base">Destination & Dates</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Destination City"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Kyoto, Paris, Rome"
            required
          />
          <Input
            label="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Japan, France, Italy"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          <div className="flex flex-col justify-end">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-center">
              <span className="text-xs text-indigo-600 font-semibold uppercase tracking-wider block">
                Duration
              </span>
              <span className="text-base font-black text-indigo-900">
                {isNaN(calculatedDuration) ? '—' : `${calculatedDuration} Days`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Budget & Travelers */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <DollarSign className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-gray-900 text-base">Budget & Travelers</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Total Estimated Budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            min={1}
            required
          />
          <Select
            label="Currency"
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
          <Input
            label="Number of Travelers"
            type="number"
            value={numTravelers}
            onChange={(e) => setNumTravelers(Number(e.target.value))}
            min={1}
            max={20}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Travel Group"
            value={travelGroup}
            onChange={(e) => setTravelGroup(e.target.value)}
            options={[
              { label: 'Solo Traveler', value: 'solo' },
              { label: 'Couple / Duo', value: 'couple' },
              { label: 'Family with Kids', value: 'family' },
              { label: 'Friends Group', value: 'friends' },
            ]}
          />
          <Select
            label="Travel Style"
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            options={[
              { label: 'Budget Friendly', value: 'budget' },
              { label: 'Balanced Moderate', value: 'moderate' },
              { label: 'Luxury Experience', value: 'luxury' },
            ]}
          />
          <Select
            label="Pace of Itinerary"
            value={travelPace}
            onChange={(e) => setTravelPace(e.target.value)}
            options={[
              { label: 'Relaxed (3-4 activities/day)', value: 'relaxed' },
              { label: 'Balanced (5-6 activities/day)', value: 'balanced' },
              { label: 'Fast-Paced (7+ activities/day)', value: 'fast' },
            ]}
          />
        </div>
      </div>

      {/* 3. Interests & Tailoring */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Compass className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900 text-base">Interests & Preferences</h3>
        </div>

        <div>
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
            Select Your Interests (Multi-Select)
          </label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((item) => {
              const selected = interests.includes(item);
              return (
                <button
                  type="button"
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={`text-xs px-3.5 py-2 rounded-xl font-semibold border transition-all ${
                    selected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Accommodation Preference"
            value={accommodation}
            onChange={(e) => setAccommodation(e.target.value)}
            placeholder="e.g. Boutique Hotel, Airbnb, Resort"
          />
          <Input
            label="Dietary Restrictions"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            placeholder="e.g. Vegetarian, Halal, Gluten-free"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Additional Instructions / Vibe</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mt-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="e.g. Include local hidden gems, avoid overly touristy areas, must see sunset spots..."
            rows={2}
          />
        </div>
      </div>

      {/* Submit Banner */}
      <div className="flex items-center justify-between p-4 bg-navy-900 text-white rounded-2xl">
        <div>
          <h4 className="font-bold text-sm">Ready to generate your smart plan?</h4>
          <p className="text-xs text-gray-300">
            AI-optimized routing, clustered attractions, & personalized budgets.
          </p>
        </div>
        <Button
          type="submit"
          loading={loading}
          size="lg"
          icon={<Sparkles className="w-5 h-5 text-indigo-300" />}
        >
          Generate Itinerary
        </Button>
      </div>
    </form>
  );
};

export default TripPreferenceForm;
