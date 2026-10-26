import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '@/hooks/useTrips';
import type { Destination } from '@/types';
import VibeSelector from '@/components/recommendations/VibeSelector';
import DestinationCard from '@/components/recommendations/DestinationCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export const RecommendationsPage: React.FC = () => {
  const { getRecommendations } = useTrips();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (criteria: { vibe: string; climate: string; month: string }) => {
    setLoading(true);
    const results = await getRecommendations({
      interests: [criteria.vibe],
      budget_range: 'moderate',
      travel_style: criteria.vibe,
      preferred_climate: criteria.climate,
      travel_month: criteria.month,
    });
    setDestinations(results);
    setLoading(false);
  };

  const handleSelect = (dest: Destination) => {
    navigate('/create-trip', {
      state: { destination: dest.name, country: dest.country },
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Destination Discovery Engine</h2>
        <p className="text-sm text-gray-500 mt-1">
          Explore curated locations aligned with your preferred climate, vibe, and travel season.
        </p>
      </div>

      <VibeSelector onSearch={handleSearch} loading={loading} />

      {loading && <LoadingSpinner message="Searching best matching global destinations..." />}

      {destinations.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-black text-gray-900 text-lg">Recommended For You</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <DestinationCard key={i} destination={dest} onSelect={handleSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
