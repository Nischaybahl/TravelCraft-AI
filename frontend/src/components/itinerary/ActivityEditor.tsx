import React, { useState } from 'react';
import type { Activity } from '@/types';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';

interface ActivityEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Partial<Activity>) => void;
  activity?: Activity;
}

export const ActivityEditor: React.FC<ActivityEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  activity,
}) => {
  const [name, setName] = useState(activity?.name || '');
  const [description, setDescription] = useState(activity?.description || '');
  const [timeSlot, setTimeSlot] = useState(activity?.time_slot || 'morning');
  const [suggestedTime, setSuggestedTime] = useState(activity?.suggested_time || '09:00 - 10:30');
  const [estimatedDuration, setEstimatedDuration] = useState(activity?.estimated_duration || '1.5 hours');
  const [location, setLocation] = useState(activity?.location || '');
  const [area, setArea] = useState(activity?.area || '');
  const [category, setCategory] = useState(activity?.category || 'sightseeing');
  const [cost, setCost] = useState(activity?.approximate_cost || 0);
  const [transport, setTransport] = useState(activity?.transport_suggestion || '');
  const [isMeal, setIsMeal] = useState(activity?.is_meal || false);
  const [notes, setNotes] = useState(activity?.notes || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(activity || {}),
      name,
      description,
      time_slot: timeSlot,
      suggested_time: suggestedTime,
      estimated_duration: estimatedDuration,
      location,
      area,
      category,
      approximate_cost: Number(cost),
      transport_suggestion: transport,
      is_meal: isMeal,
      notes,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={activity ? 'Edit Activity' : 'Add Activity'}>
      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label="Activity Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div>
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1.5 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Time Slot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            options={[
              { label: 'Morning', value: 'morning' },
              { label: 'Afternoon', value: 'afternoon' },
              { label: 'Evening', value: 'evening' },
              { label: 'Night', value: 'night' },
            ]}
          />
          <Input
            label="Suggested Time"
            value={suggestedTime}
            onChange={(e) => setSuggestedTime(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            label="Area / District"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { label: 'Sightseeing', value: 'sightseeing' },
              { label: 'Food & Dining', value: 'food' },
              { label: 'Culture & Museum', value: 'culture' },
              { label: 'Adventure', value: 'adventure' },
              { label: 'Shopping', value: 'shopping' },
              { label: 'Relaxation', value: 'relaxation' },
            ]}
          />
          <Input
            label="Approx Cost ($)"
            type="number"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
          />
        </div>

        <Input
          label="Transport Notes"
          value={transport}
          onChange={(e) => setTransport(e.target.value)}
          placeholder="e.g. 5 min walk from station"
        />

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isMeal"
            checked={isMeal}
            onChange={(e) => setIsMeal(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
          />
          <label htmlFor="isMeal" className="text-sm font-medium text-gray-700">
            Is this a dining / meal stop?
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Activity
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ActivityEditor;
