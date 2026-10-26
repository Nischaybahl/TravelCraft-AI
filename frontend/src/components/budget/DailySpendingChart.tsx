import React from 'react';
import type { Trip } from '@/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DailySpendingChartProps {
  trip: Trip;
}

export const DailySpendingChart: React.FC<DailySpendingChartProps> = ({ trip }) => {
  const data = trip.itinerary.map((day) => ({
    name: `Day ${day.day_number}`,
    Spending: day.estimated_cost,
    Food: day.food_cost,
    Activities: day.activity_cost,
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <h4 className="text-sm font-bold text-gray-900 mb-2">Daily Outlay Schedule</h4>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} tickFormatter={(val) => `$${val}`} />
            <Tooltip formatter={(value: number) => `$${value}`} />
            <Bar dataKey="Spending" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailySpendingChart;
