import React from 'react';
import type { ItineraryDay } from '@/types';
import { Home, Lightbulb, TrendingUp } from 'lucide-react';

interface DaySummaryProps {
  day: ItineraryDay;
}

export const DaySummary: React.FC<DaySummaryProps> = ({ day }) => {
  return (
    <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-4 mt-4 space-y-3">
      {day.accommodation_suggestion && (
        <div className="flex items-start gap-2.5 text-xs text-gray-700">
          <Home className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-gray-900">Stay:</span>{' '}
            {day.accommodation_suggestion}
          </div>
        </div>
      )}

      {day.travel_tips && (
        <div className="flex items-start gap-2.5 text-xs text-teal-800 bg-teal-50/60 p-2.5 rounded-lg border border-teal-100/60">
          <Lightbulb className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Local Tip:</span> {day.travel_tips}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-xs">
        <span className="text-gray-500 font-medium">Estimated Day Outlay:</span>
        <div className="flex gap-3 font-semibold text-gray-700">
          <span>Food: ${day.food_cost || 0}</span>
          <span>Transit: ${day.transport_cost || 0}</span>
          <span className="text-indigo-600 font-bold">Total: ${day.estimated_cost || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default DaySummary;
