import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '@/hooks/useTrips';
import DayCard from '@/components/itinerary/DayCard';
import BudgetOverview from '@/components/budget/BudgetOverview';
import ExpenseChart from '@/components/budget/ExpenseChart';
import DailySpendingChart from '@/components/budget/DailySpendingChart';
import Button from '@/components/common/Button';
import { ArrowLeft, Download, Trash2, Calendar, MapPin, Users } from 'lucide-react';

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    getTripById,
    setCurrentTrip,
    currentTrip,
    regenerateDay,
    updateActivity,
    addActivity,
    removeActivity,
    deleteTrip,
    exportPDF,
  } = useTrips();
  const navigate = useNavigate();

  const trip = id ? getTripById(id) : currentTrip;

  useEffect(() => {
    if (trip && trip.id !== currentTrip?.id) {
      setCurrentTrip(trip);
    }
  }, [trip, currentTrip, setCurrentTrip]);

  if (!trip) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-gray-800">Trip not found</h3>
        <Button className="mt-4" onClick={() => navigate('/my-trips')}>
          Back to My Trips
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      await deleteTrip(trip.id);
      navigate('/my-trips');
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/my-trips')}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Trips
      </button>

      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {trip.duration_days} Days Plan
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
            {trip.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {trip.destination}, {trip.country}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {trip.start_date} to {trip.end_date}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              {trip.num_travelers} travelers ({trip.travel_group})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportPDF} icon={<Download className="w-4 h-4" />}>
            Export PDF
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} icon={<Trash2 className="w-4 h-4" />}>
            Delete
          </Button>
        </div>
      </div>

      {/* Main Grid: Itinerary & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Daily Schedule</h3>
          {trip.itinerary && trip.itinerary.length > 0 ? (
            trip.itinerary.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                onRegenerate={regenerateDay}
                onUpdateActivity={updateActivity}
                onAddActivity={addActivity}
                onRemoveActivity={removeActivity}
              />
            ))
          ) : (
            <p className="text-sm text-gray-500 italic">No scheduled activities for this draft.</p>
          )}
        </div>

        <div className="space-y-6">
          <BudgetOverview trip={trip} />
          <ExpenseChart trip={trip} />
          <DailySpendingChart trip={trip} />
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPage;
