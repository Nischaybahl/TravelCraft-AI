import React from 'react';
import type { Trip } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import Badge from '@/components/common/Badge';

interface RecentTripsProps {
  trips: Trip[];
}

export const RecentTrips: React.FC<RecentTripsProps> = ({ trips }) => {
  const navigate = useNavigate();

  if (trips.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500 text-sm">
        No recent trips planned. Start your first journey today!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {trips.slice(0, 4).map((trip) => (
        <div
          key={trip.id}
          onClick={() => navigate(`/trips/${trip.id}`)}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-navy-50 flex items-center justify-center text-navy-600 font-bold text-sm shrink-0">
              {trip.destination.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {trip.title || `Trip to ${trip.destination}`}
                </h4>
                <Badge
                  variant={
                    trip.status === 'completed'
                      ? 'gray'
                      : trip.status === 'planned'
                      ? 'success'
                      : 'info'
                  }
                  size="sm"
                >
                  {trip.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {trip.destination}, {trip.country}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {trip.duration_days} days
                </span>
                <span className="flex items-center gap-1 font-semibold text-gray-700">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  {trip.budget} {trip.currency}
                </span>
              </div>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>
      ))}
    </div>
  );
};

export default RecentTrips;
