import React from 'react';
import Card from '@/components/common/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
}) => {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-black text-gray-900 mt-1">{value}</h4>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        {trend && (
          <p
            className={`text-xs font-semibold mt-2 ${
              trendPositive ? 'text-teal-600' : 'text-red-500'
            }`}
          >
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">{icon}</div>
    </Card>
  );
};

export default StatsCard;
