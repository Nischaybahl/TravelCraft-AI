import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTrips } from '@/hooks/useTrips';
import TripPreferenceForm from '@/components/trips/TripPreferenceForm';
import type { TripPreferences } from '@/types';

export const CreateTripPage: React.FC = () => {
  const { generateItinerary, loading } = useTrips();
  const navigate = useNavigate();
  const location = useLocation();

  const stateDest = location.state?.destination || '';
  const stateCountry = location.state?.country || '';

  const handleGenerate = async (prefs: TripPreferences) => {
    await generateItinerary(prefs);
    navigate('/itinerary');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Create Trip Itinerary</h2>
        <p className="text-sm text-gray-500 mt-1">
          Specify your destination, schedule, group size, and vibe to generate an AI-optimized schedule.
        </p>
      </div>

      <TripPreferenceForm
        onSubmit={handleGenerate}
        loading={loading}
        initialDestination={stateDest}
        initialCountry={stateCountry}
      />
    </div>
  );
};

export default CreateTripPage;
