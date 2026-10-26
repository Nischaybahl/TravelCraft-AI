import React from 'react';
import type { Trip } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExpenseChartProps {
  trip: Trip;
}

const COLORS = ['#4f46e5', '#0d9488', '#f59e0b', '#ec4899', '#6366f1'];

export const ExpenseChart: React.FC<ExpenseChartProps> = ({ trip }) => {
  const data = [
    { name: 'Lodging', value: trip.accommodation_cost || Math.round(trip.total_estimated_cost * 0.35) },
    { name: 'Dining', value: trip.food_cost || Math.round(trip.total_estimated_cost * 0.3) },
    { name: 'Activities', value: trip.activity_cost || Math.round(trip.total_estimated_cost * 0.2) },
    { name: 'Transit', value: trip.transport_cost || Math.round(trip.total_estimated_cost * 0.15) },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs">
      <h4 className="text-sm font-bold text-gray-900 mb-2">Category Breakdown</h4>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value}`} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;
