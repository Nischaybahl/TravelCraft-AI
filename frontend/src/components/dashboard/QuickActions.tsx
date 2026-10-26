import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Compass, History, Sparkles } from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <button
        onClick={() => navigate('/create-trip')}
        className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex flex-col items-start justify-between text-left h-36"
      >
        <div className="p-2.5 bg-white/20 rounded-lg">
          <PlusCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-base">Plan New Itinerary</h4>
          <p className="text-xs text-indigo-100 mt-0.5">Generate day-by-day AI travel schedule</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/recommendations')}
        className="p-5 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex flex-col items-start justify-between text-left h-36"
      >
        <div className="p-2.5 bg-white/20 rounded-lg">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-bold text-base">Find Destinations</h4>
          <p className="text-xs text-teal-100 mt-0.5">Explore by vibe, climate, and budget</p>
        </div>
      </button>

      <button
        onClick={() => navigate('/my-trips')}
        className="p-5 bg-white border border-gray-200 text-gray-800 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all flex flex-col items-start justify-between text-left h-36 group"
      >
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-base">Browse Saved Trips</h4>
          <p className="text-xs text-gray-500 mt-0.5">Access, edit, and export prior plans</p>
        </div>
      </button>
    </div>
  );
};

export default QuickActions;
