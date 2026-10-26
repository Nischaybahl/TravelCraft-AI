import React from 'react';
import type { Destination } from '@/types';
import { MapPin, DollarSign, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (dest: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
}) => {
  return (
    <Card className="flex flex-col justify-between hover:shadow-lg hover:border-indigo-200 transition-all group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-md">
            <Sparkles className="w-3.5 h-3.5" /> AI Recommended
          </span>
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {destination.suggested_duration} days
          </span>
        </div>

        <h4 className="text-xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">
          {destination.name}
        </h4>
        <p className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-gray-400" />
          {destination.country}
        </p>

        <p className="text-xs text-gray-600 leading-relaxed mb-4">
          {destination.description}
        </p>

        <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/60 text-xs mb-4">
          <span className="font-bold text-indigo-900 block mb-0.5">Why it fits your vibe:</span>
          <p className="text-indigo-700">{destination.reason}</p>
        </div>

        {destination.suggested_attractions && destination.suggested_attractions.length > 0 && (
          <div className="mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
              Top Highlights
            </span>
            <div className="flex flex-wrap gap-1.5">
              {destination.suggested_attractions.slice(0, 4).map((att, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-md border border-gray-100 font-medium"
                >
                  {att}
                </span>
              ))}
            </div>
          </div>
        )}

        {destination.seasonal_considerations && (
          <p className="text-xs text-gray-500 italic mb-4">
            Seasonality: {destination.seasonal_considerations}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 font-medium block">Est. Budget</span>
          <span className="text-base font-black text-gray-900">
            ${destination.approximate_budget}
          </span>
        </div>
        <Button
          onClick={() => onSelect(destination)}
          size="sm"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          Plan This Trip
        </Button>
      </div>
    </Card>
  );
};

export default DestinationCard;
