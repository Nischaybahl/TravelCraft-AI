import React from 'react';
import { useTrips } from '@/hooks/useTrips';
import { useAuth } from '@/hooks/useAuth';
import StatsCard from '@/components/dashboard/StatsCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentTrips from '@/components/dashboard/RecentTrips';
import Card from '@/components/common/Card';
import { FolderHeart, Calendar, Compass, Wallet } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { trips } = useTrips();
  const { user } = useAuth();

  const totalTrips = trips.length;
  const plannedTrips = trips.filter((t) => t.status === 'planned').length;
  const totalBudgetPlanned = trips.reduce((acc, t) => acc + (t.budget || 0), 0);
  const totalDays = trips.reduce((acc, t) => acc + (t.duration_days || 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Welcome back, {user?.full_name?.split(' ')[0] || 'Traveler'}! 👋
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Here is your personalized travel planner overview and active itineraries.
        </p>
      </div>

      {/* Quick Action Buttons */}
      <QuickActions />

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Itineraries"
          value={totalTrips}
          subtitle="Saved in your profile"
          icon={<FolderHeart className="w-5 h-5" />}
        />
        <StatsCard
          title="Upcoming Journeys"
          value={plannedTrips}
          subtitle="Scheduled trips"
          icon={<Calendar className="w-5 h-5" />}
        />
        <StatsCard
          title="Days Planned"
          value={totalDays}
          subtitle="Across all adventures"
          icon={<Compass className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Budget Tracked"
          value={`$${totalBudgetPlanned.toLocaleString()}`}
          subtitle="Estimated expenses"
          icon={<Wallet className="w-5 h-5" />}
        />
      </div>

      {/* Recent Trips Section */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-lg">Recent Trips</h3>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {trips.length} Total
          </span>
        </div>
        <RecentTrips trips={trips} />
      </Card>
    </div>
  );
};

export default DashboardPage;
