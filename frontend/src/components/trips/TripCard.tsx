import React from 'react';
import type { Trip } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, Trash2, Copy, ArrowRight } from 'lucide-react';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';

interface TripCardProps {
  trip: Trip;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onDelete,
  onDuplicate,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col justify-between hover:shadow-md transition-all group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge
            variant={
              trip.status === 'completed'
                ? 'gray'
                : trip.status === 'planned'
                ? 'success'
                : 'info'
            }
          >
            {trip.status.toUpperCase()}
          </Badge>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDuplicate(trip.id)}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Duplicate trip"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(trip.id)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h4 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
          {trip.title || `Trip to ${trip.destination}`}
        </h4>
        <p className="text-sm font-medium text-gray-500 mt-0.5">
          {trip.destination}, {trip.country}
        </p>

        {trip.description && (
          <p className="text-xs text-gray-600 mt-2.5 line-clamp-2 leading-relaxed">
            {trip.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>{trip.duration_days} days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span>{trip.num_travelers} travelers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-teal-600" />
            <span>${trip.budget} budget</span>
          </div>
          <div className="capitalize font-medium text-gray-700">
            {trip.travel_pace} pace
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3">
        <button
          onClick={() => navigate(`/trips/${trip.id}`)}
          className="w-full py-2 px-3 bg-gray-50 group-hover:bg-indigo-600 group-hover:text-white text-gray-700 font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5"
        >
          <span>Open Full Itinerary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
};

export default TripCard;
