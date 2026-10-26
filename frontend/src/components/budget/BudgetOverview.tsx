import React from 'react';
import type { Trip } from '@/types';
import { DollarSign, Wallet, TrendingUp, AlertTriangle } from 'lucide-react';
import Card from '@/components/common/Card';

interface BudgetOverviewProps {
  trip: Trip;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ trip }) => {
  const budget = trip.budget || 2000;
  const estimated = trip.total_estimated_cost || 0;
  const remaining = budget - estimated;
  const isOverBudget = remaining < 0;
  const percentUsed = Math.min(100, Math.round((estimated / budget) * 100));

  return (
    <div className="space-y-4">
      {isOverBudget && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800 font-semibold">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Warning: Estimated expenses exceed your target budget by ${Math.abs(remaining)}.</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Target Budget</span>
          <h4 className="text-xl font-black text-gray-900 mt-1">${budget}</h4>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Est. Total</span>
          <h4 className="text-xl font-black text-indigo-600 mt-1">${estimated}</h4>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Remaining</span>
          <h4 className={`text-xl font-black mt-1 ${isOverBudget ? 'text-red-600' : 'text-teal-600'}`}>
            ${remaining}
          </h4>
        </Card>
        <Card className="p-4">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block">Daily Est.</span>
          <h4 className="text-xl font-black text-gray-700 mt-1">
            ${Math.round(estimated / Math.max(1, trip.duration_days))}
          </h4>
        </Card>
      </div>

      {/* Utilization Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-2">
          <span>Budget Allocated</span>
          <span className={isOverBudget ? 'text-red-600 font-bold' : 'text-gray-900'}>{percentUsed}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget ? 'bg-red-500' : percentUsed > 80 ? 'bg-amber-500' : 'bg-teal-500'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
