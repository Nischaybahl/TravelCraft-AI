import React, { useState } from 'react';
import type { ItineraryDay, Activity } from '@/types';
import { Calendar, RefreshCw, Plus, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import ActivityItem from './ActivityItem';
import ActivityEditor from './ActivityEditor';
import DaySummary from './DaySummary';
import Button from '@/components/common/Button';

interface DayCardProps {
  day: ItineraryDay;
  onRegenerate: (dayNumber: number, instructions?: string) => Promise<void>;
  onUpdateActivity: (dayNumber: number, act: Activity) => void;
  onAddActivity: (dayNumber: number, act: Partial<Activity>) => void;
  onRemoveActivity: (dayNumber: number, actId: string) => void;
  isRegenerating?: boolean;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  onRegenerate,
  onUpdateActivity,
  onAddActivity,
  onRemoveActivity,
  isRegenerating = false,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptBox, setShowPromptBox] = useState(false);

  const handleRegenSubmit = async () => {
    await onRegenerate(day.day_number, customPrompt);
    setShowPromptBox(false);
    setCustomPrompt('');
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden mb-6 transition-all">
      {/* Header */}
      <div className="bg-navy-900 text-white p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center font-black text-lg text-indigo-200">
            {day.day_number}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Day {day.day_number}
              </span>
              {day.date && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  • <Calendar className="w-3 h-3" /> {day.date}
                </span>
              )}
            </div>
            <h4 className="text-lg font-black tracking-tight">{day.theme}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-white/10"
            onClick={() => setShowPromptBox(!showPromptBox)}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />}
          >
            Regenerate Day
          </Button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Optional regeneration instruction box */}
      {showPromptBox && (
        <div className="bg-indigo-50 border-b border-indigo-100 p-4 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            placeholder="e.g. Focus on historic temples and vegan street food"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 text-sm bg-white border border-indigo-200 rounded-lg px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              size="sm"
              variant="primary"
              loading={isRegenerating}
              onClick={handleRegenSubmit}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Refine Day
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowPromptBox(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Body */}
      {expanded && (
        <div className="p-6">
          {day.summary && <p className="text-sm text-gray-600 mb-5 italic">{day.summary}</p>}

          <div className="space-y-3.5">
            {day.activities.map((act) => (
              <ActivityItem
                key={act.id}
                activity={act}
                dayNumber={day.day_number}
                onUpdate={(updated) => onUpdateActivity(day.day_number, updated)}
                onDelete={(id) => onRemoveActivity(day.day_number, id)}
              />
            ))}
          </div>

          <div className="mt-4 pt-3 flex justify-between items-center">
            <Button
              size="sm"
              variant="outline"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAdding(true)}
            >
              Add Activity
            </Button>
          </div>

          <DaySummary day={day} />
        </div>
      )}

      {isAdding && (
        <ActivityEditor
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          onSave={(newAct) => onAddActivity(day.day_number, newAct)}
        />
      )}
    </div>
  );
};

export default DayCard;
