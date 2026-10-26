import React, { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import TripCard from '@/components/trips/TripCard';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FolderHeart } from 'lucide-react';

export const MyTripsPage: React.FC = () => {
  const { trips, deleteTrip, duplicateTrip } = useTrips();
  const [filter, setFilter] = useState<'all' | 'planned' | 'draft' | 'completed'>('all');
  const navigate = useNavigate();

  const filteredTrips = trips.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">My Saved Trips</h2>
          <p className="text-sm text-gray-500 mt-1">
            Browse and manage all created, upcoming, and past travel itineraries.
          </p>
        </div>
        <Button
          onClick={() => navigate('/create-trip')}
          icon={<PlusCircle className="w-4 h-4" />}
        >
          New Itinerary
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200 pb-3 text-xs font-bold">
        {(['all', 'planned', 'draft', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredTrips.length === 0 ? (
        <EmptyState
          title="No Trips Found"
          description={`You do not have any trips matching the "${filter}" filter.`}
          actionText="Create New Itinerary"
          onAction={() => navigate('/create-trip')}
          icon={<FolderHeart className="w-12 h-12 text-gray-400" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDelete={deleteTrip}
              onDuplicate={duplicateTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTripsPage;
