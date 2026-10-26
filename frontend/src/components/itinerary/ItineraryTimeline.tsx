import React from 'react';
import type { ItineraryDay } from '@/types';
import { Clock, MapPin, DollarSign } from 'lucide-react';

interface ItineraryTimelineProps {
  days: ItineraryDay[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ days }) => {
  return (
    <div className="space-y-8 pl-4 border-l-2 border-indigo-100 my-6">
      {days.map((day) => (
        <div key={day.id} className="relative">
          <div className="absolute -left-[25px] top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-xs" />
          <div className="mb-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Day {day.day_number}
            </span>
            <h4 className="text-base font-bold text-gray-900">{day.theme}</h4>
          </div>

          <div className="space-y-2.5">
            {day.activities.map((act) => (
              <div
                key={act.id}
                className="bg-white border border-gray-100 p-3 rounded-lg flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {act.suggested_time || 'Flexible'}
                  </span>
                  <span className="font-semibold text-gray-800">{act.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  {act.location && (
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {act.location}
                    </span>
                  )}
                  <span className="font-bold text-gray-700">
                    ${act.approximate_cost || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItineraryTimeline;
