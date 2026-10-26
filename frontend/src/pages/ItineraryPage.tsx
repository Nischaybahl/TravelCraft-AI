import React, { useState } from 'react';
import { useTrips } from '@/hooks/useTrips';
import DayCard from '@/components/itinerary/DayCard';
import BudgetOverview from '@/components/budget/BudgetOverview';
import ExpenseChart from '@/components/budget/ExpenseChart';
import DailySpendingChart from '@/components/budget/DailySpendingChart';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { Download, Save, PlusCircle, Compass, FileText } from 'lucide-react';
import { useToast } from '@/components/common/Toast';

export const ItineraryPage: React.FC = () => {
  const {
    currentTrip,
    regenerateDay,
    updateActivity,
    addActivity,
    removeActivity,
    saveCurrentTrip,
    exportPDF,
    loading,
  } = useTrips();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'plan' | 'budget'>('plan');

  if (!currentTrip || !currentTrip.itinerary || currentTrip.itinerary.length === 0) {
    return (
      <EmptyState
        title="No Active Itinerary"
        description="You have not created or selected an itinerary yet. Plan a trip now using our AI trip builder!"
        actionText="Plan a New Trip"
        onAction={() => navigate('/create-trip')}
        icon={<Compass className="w-12 h-12 text-indigo-400" />}
      />
    );
  }

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentTrip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${currentTrip.destination}_Itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Itinerary exported as JSON!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            {currentTrip.duration_days} Days in {currentTrip.country || 'Destination'}
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
            {currentTrip.title}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {currentTrip.start_date} to {currentTrip.end_date} • {currentTrip.num_travelers} Travelers •{' '}
            <span className="capitalize">{currentTrip.travel_pace} pace</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={exportPDF} icon={<Download className="w-4 h-4" />}>
            Export PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJSON} icon={<FileText className="w-4 h-4" />}>
            Export JSON
          </Button>
          <Button variant="primary" size="sm" onClick={saveCurrentTrip} icon={<Save className="w-4 h-4" />}>
            Save Trip
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('plan')}
          className={`pb-3 transition-colors ${
            activeTab === 'plan'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Day-by-Day Schedule
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`pb-3 transition-colors ${
            activeTab === 'budget'
              ? 'border-b-2 border-indigo-600 text-indigo-600'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          Budget & Expenses
        </button>
      </div>

      {/* Tab 1: Day-by-Day Plan */}
      {activeTab === 'plan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {currentTrip.itinerary.map((day) => (
              <DayCard
                key={day.id}
                day={day}
                onRegenerate={regenerateDay}
                onUpdateActivity={updateActivity}
                onAddActivity={addActivity}
                onRemoveActivity={removeActivity}
                isRegenerating={loading}
              />
            ))}
          </div>

          {/* Quick budget summary sidebar */}
          <div className="space-y-6">
            <BudgetOverview trip={currentTrip} />
            <ExpenseChart trip={currentTrip} />
          </div>
        </div>
      )}

      {/* Tab 2: Full Budget Details */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <BudgetOverview trip={currentTrip} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpenseChart trip={currentTrip} />
            <DailySpendingChart trip={currentTrip} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryPage;
