import React, { useState } from 'react';
import type { Activity } from '@/types';
import { Clock, MapPin, DollarSign, Navigation, Edit2, Trash2, Utensils } from 'lucide-react';
import Badge from '@/components/common/Badge';
import ActivityEditor from './ActivityEditor';

interface ActivityItemProps {
  activity: Activity;
  dayNumber: number;
  onUpdate: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative group bg-white border border-gray-100 rounded-xl p-4.5 shadow-xs hover:border-indigo-100 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50/70 px-2.5 py-0.5 rounded-md">
              <Clock className="w-3.5 h-3.5" />
              {activity.suggested_time || activity.time_slot}
            </span>
            <Badge variant={activity.is_meal ? 'warning' : 'primary'} size="sm">
              {activity.is_meal && <Utensils className="w-3 h-3 inline mr-1" />}
              {activity.category}
            </Badge>
            {activity.estimated_duration && (
              <span className="text-xs text-gray-400">({activity.estimated_duration})</span>
            )}
          </div>

          <h5 className="font-bold text-gray-900 text-base">{activity.name}</h5>
          {activity.description && (
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{activity.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-3 text-xs text-gray-500">
            {activity.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {activity.location} {activity.area ? `(${activity.area})` : ''}
              </span>
            )}
            <span className="flex items-center gap-1 font-semibold text-gray-700">
              <DollarSign className="w-3.5 h-3.5 text-gray-400" />
              {activity.approximate_cost > 0 ? `$${activity.approximate_cost} est.` : 'Free'}
            </span>
            {activity.transport_suggestion && (
              <span className="flex items-center gap-1 text-teal-600">
                <Navigation className="w-3.5 h-3.5" />
                {activity.transport_suggestion}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit activity"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(activity.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete activity"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing && (
        <ActivityEditor
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          activity={activity}
          onSave={(updated) => onUpdate(updated as Activity)}
        />
      )}
    </div>
  );
};

export default ActivityItem;
