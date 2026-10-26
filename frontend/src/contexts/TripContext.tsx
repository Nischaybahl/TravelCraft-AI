import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Trip, TripPreferences, Destination, RecommendationRequest, ItineraryDay, Activity } from '@/types';
import { demoTrips } from '@/utils/demoData';
import tripService from '@/services/tripService';
import { useToast } from '@/components/common/Toast';

interface TripContextType {
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
  trips: Trip[];
  loading: boolean;
  generateItinerary: (preferences: TripPreferences) => Promise<Trip>;
  regenerateDay: (dayNumber: number, instructions?: string) => Promise<void>;
  saveCurrentTrip: () => Promise<void>;
  updateActivity: (dayNumber: number, activity: Activity) => void;
  addActivity: (dayNumber: number, activity: Partial<Activity>) => void;
  removeActivity: (dayNumber: number, activityId: string) => void;
  getTripById: (id: string) => Trip | undefined;
  deleteTrip: (id: string) => Promise<void>;
  duplicateTrip: (id: string) => Promise<void>;
  getRecommendations: (req: RecommendationRequest) => Promise<Destination[]>;
  exportPDF: () => Promise<void>;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || '';

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(() => {
    const saved = localStorage.getItem('travelcraft_trips');
    return saved ? JSON.parse(saved) : demoTrips;
  });
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(() => {
    const saved = localStorage.getItem('travelcraft_current_trip');
    return saved ? JSON.parse(saved) : demoTrips[0];
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('travelcraft_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    if (currentTrip) {
      localStorage.setItem('travelcraft_current_trip', JSON.stringify(currentTrip));
    }
  }, [currentTrip]);

  const generateItinerary = async (preferences: TripPreferences): Promise<Trip> => {
    setLoading(true);
    try {
      // Try backend API first
      const res = await fetch(`${API_BASE}/api/itineraries/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });
      if (res.ok) {
        const data = await res.json();
        const newTrip: Trip = {
          id: 'trip-' + Date.now(),
          user_id: 'user-default',
          title: `Trip to ${preferences.destination}`,
          destination: preferences.destination,
          country: preferences.country,
          description: `Personalized itinerary for ${preferences.destination}`,
          start_date: preferences.start_date,
          end_date: preferences.end_date,
          duration_days: data.duration_days || data.days.length,
          budget: preferences.budget,
          currency: preferences.currency,
          num_travelers: preferences.num_travelers,
          travel_group: preferences.travel_group,
          travel_style: preferences.travel_style,
          travel_pace: preferences.travel_pace,
          interests: preferences.interests,
          accommodation_preference: preferences.accommodation_preference,
          dietary_preferences: preferences.dietary_preferences,
          additional_notes: preferences.additional_notes,
          status: 'planned',
          total_estimated_cost: data.total_estimated_cost,
          accommodation_cost: Math.round(data.total_estimated_cost * 0.35),
          food_cost: Math.round(data.total_estimated_cost * 0.3),
          transport_cost: Math.round(data.total_estimated_cost * 0.15),
          activity_cost: Math.round(data.total_estimated_cost * 0.2),
          itinerary: data.days,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCurrentTrip(newTrip);
        setTrips((prev) => [newTrip, ...prev]);
        showToast('Itinerary generated successfully!', 'success');
        return newTrip;
      }
    } catch {
      // Fallback handled below
    }

    // Fallback deterministic local generation
    const duration = Math.max(
      1,
      Math.ceil((new Date(preferences.end_date).getTime() - new Date(preferences.start_date).getTime()) / (1000 * 3600 * 24)) + 1
    );
    const mockDays: ItineraryDay[] = Array.from({ length: duration }).map((_, idx) => ({
      id: `day-${idx + 1}-${Date.now()}`,
      day_number: idx + 1,
      date: new Date(new Date(preferences.start_date).getTime() + idx * 86400000).toISOString().split('T')[0],
      theme: idx === 0 ? 'Arrival & City Exploration' : idx === duration - 1 ? 'Highlights & Souvenirs' : 'Cultural Immersion & Local Gems',
      summary: `Day ${idx + 1} curated for a ${preferences.travel_pace} pace in ${preferences.destination}.`,
      accommodation_suggestion: `Boutique hotel in Central ${preferences.destination}`,
      transport_notes: 'Public transit & walking recommended for optimal scenic routing.',
      travel_tips: 'Carry local currency and hydration. Respect cultural norms.',
      estimated_cost: Math.round(preferences.budget / duration),
      food_cost: Math.round((preferences.budget / duration) * 0.4),
      transport_cost: Math.round((preferences.budget / duration) * 0.2),
      activity_cost: Math.round((preferences.budget / duration) * 0.4),
      activities: [
        {
          id: `act-${idx}-1`,
          name: `Morning Highlights of ${preferences.destination}`,
          description: `Explore renowned sights and scenic viewpoints matching interests: ${preferences.interests.slice(0, 2).join(', ') || 'Culture'}.`,
          time_slot: 'morning',
          suggested_time: '09:00 - 11:30',
          estimated_duration: '2.5 hours',
          location: `Old Town ${preferences.destination}`,
          area: 'Historic District',
          category: 'sightseeing',
          approximate_cost: Math.round(25 * (preferences.num_travelers || 1)),
          transport_suggestion: '10 min walk from hotel',
          sort_order: 0,
          is_meal: false,
          is_custom: false,
          notes: 'Pre-booking tickets advised.',
        },
        {
          id: `act-${idx}-2`,
          name: 'Authentic Local Lunch',
          description: `Taste signature regional dishes accommodating ${preferences.dietary_preferences.join(', ') || 'standard'} dietary preferences.`,
          time_slot: 'afternoon',
          suggested_time: '12:30 - 14:00',
          estimated_duration: '1.5 hours',
          location: `Bistro Quarter, ${preferences.destination}`,
          area: 'Culinary Lane',
          category: 'food',
          approximate_cost: Math.round(20 * (preferences.num_travelers || 1)),
          transport_suggestion: '5 min walk',
          sort_order: 1,
          is_meal: true,
          is_custom: false,
          notes: 'Outdoor patio seating recommended.',
        },
        {
          id: `act-${idx}-3`,
          name: `${preferences.destination} Museum & Artisan Markets`,
          description: `Afternoon immersion into the local craftsmanship and heritage of ${preferences.country || preferences.destination}.`,
          time_slot: 'afternoon',
          suggested_time: '14:30 - 17:00',
          estimated_duration: '2.5 hours',
          location: 'Arts Quarter',
          area: 'Cultural Center',
          category: 'culture',
          approximate_cost: Math.round(15 * (preferences.num_travelers || 1)),
          transport_suggestion: 'Short tram ride',
          sort_order: 2,
          is_meal: false,
          is_custom: false,
          notes: 'Photography allowed in designated halls.',
        },
        {
          id: `act-${idx}-4`,
          name: 'Sunset Dinner & Leisure Walk',
          description: 'Relaxing evening meal featuring ambient views and pleasant evening climate.',
          time_slot: 'evening',
          suggested_time: '19:00 - 21:00',
          estimated_duration: '2 hours',
          location: `Riverfront / Promenade, ${preferences.destination}`,
          area: 'Downtown Promenade',
          category: 'food',
          approximate_cost: Math.round(35 * (preferences.num_travelers || 1)),
          transport_suggestion: 'Taxi or 15 min stroll',
          sort_order: 3,
          is_meal: true,
          is_custom: false,
          notes: 'Catch dusk skyline illumination.',
        },
      ],
    }));

    const fallbackTrip: Trip = {
      id: 'trip-' + Date.now(),
      user_id: 'user-default',
      title: `Trip to ${preferences.destination}`,
      destination: preferences.destination,
      country: preferences.country,
      description: `Curated ${preferences.travel_style} travel planner for ${preferences.destination}`,
      start_date: preferences.start_date,
      end_date: preferences.end_date,
      duration_days: duration,
      budget: preferences.budget,
      currency: preferences.currency,
      num_travelers: preferences.num_travelers,
      travel_group: preferences.travel_group,
      travel_style: preferences.travel_style,
      travel_pace: preferences.travel_pace,
      interests: preferences.interests,
      accommodation_preference: preferences.accommodation_preference,
      dietary_preferences: preferences.dietary_preferences,
      additional_notes: preferences.additional_notes,
      status: 'planned',
      total_estimated_cost: preferences.budget,
      accommodation_cost: Math.round(preferences.budget * 0.35),
      food_cost: Math.round(preferences.budget * 0.3),
      transport_cost: Math.round(preferences.budget * 0.15),
      activity_cost: Math.round(preferences.budget * 0.2),
      itinerary: mockDays,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCurrentTrip(fallbackTrip);
    setTrips((prev) => [fallbackTrip, ...prev]);
    setLoading(false);
    showToast('Itinerary planned in smart demo mode!', 'success');
    return fallbackTrip;
  };

  const regenerateDay = async (dayNumber: number, instructions?: string) => {
    if (!currentTrip) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/itineraries/regenerate-day`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            destination: currentTrip.destination,
            country: currentTrip.country,
            start_date: currentTrip.start_date,
            end_date: currentTrip.end_date,
            budget: currentTrip.budget,
            currency: currentTrip.currency,
            num_travelers: currentTrip.num_travelers,
            travel_group: currentTrip.travel_group,
            travel_style: currentTrip.travel_style,
            travel_pace: currentTrip.travel_pace,
            interests: currentTrip.interests,
            accommodation_preference: currentTrip.accommodation_preference,
            dietary_preferences: currentTrip.dietary_preferences,
            additional_notes: currentTrip.additional_notes,
          },
          day_number: dayNumber,
          instructions: instructions || 'Provide refreshed vibrant experiences',
        }),
      });

      if (res.ok) {
        const newDayData: ItineraryDay = await res.json();
        const updatedDays = currentTrip.itinerary.map((d) => (d.day_number === dayNumber ? newDayData : d));
        const updated = { ...currentTrip, itinerary: updatedDays };
        setCurrentTrip(updated);
        setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        showToast(`Day ${dayNumber} successfully regenerated!`, 'success');
        setLoading(false);
        return;
      }
    } catch {
      // Fallback below
    }

    // Local Day regeneration
    const updatedDays = currentTrip.itinerary.map((d) => {
      if (d.day_number !== dayNumber) return d;
      return {
        ...d,
        theme: `Refreshed Explorations: Day ${dayNumber}`,
        summary: `Updated plan for Day ${dayNumber} focused on unique local excursions.`,
        activities: d.activities.map((a, i) => ({
          ...a,
          name: `${a.name} (Alternative Route)`,
          description: `Customized itinerary alternative reflecting ${instructions || 'varied sights'}.`,
        })),
      };
    });
    const updated = { ...currentTrip, itinerary: updatedDays };
    setCurrentTrip(updated);
    setTrips((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setLoading(false);
    showToast(`Day ${dayNumber} refreshed with alternative options!`, 'info');
  };

  const saveCurrentTrip = async () => {
    if (!currentTrip) return;
    try {
      // Also persist to backend API
      await fetch(`${API_BASE}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip: {
            title: currentTrip.title,
            destination: currentTrip.destination,
            country: currentTrip.country,
            start_date: currentTrip.start_date,
            end_date: currentTrip.end_date,
            duration_days: currentTrip.duration_days,
            budget: currentTrip.budget,
            currency: currentTrip.currency,
            num_travelers: currentTrip.num_travelers,
            travel_group: currentTrip.travel_group,
            travel_style: currentTrip.travel_style,
            travel_pace: currentTrip.travel_pace,
            interests: currentTrip.interests,
            accommodation_preference: currentTrip.accommodation_preference,
            dietary_preferences: currentTrip.dietary_preferences,
            additional_notes: currentTrip.additional_notes,
          },
          itinerary_days: currentTrip.itinerary,
        }),
      });
    } catch {
      // Handled via local storage sync
    }

    setTrips((prev) => {
      const idx = prev.findIndex((t) => t.id === currentTrip.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = currentTrip;
        return copy;
      }
      return [currentTrip, ...prev];
    });
    localStorage.setItem('travelcraft_current_trip', JSON.stringify(currentTrip));
    showToast('Trip saved successfully to your library!', 'success');
  };

  const updateActivity = (dayNumber: number, activity: Activity) => {
    if (!currentTrip) return;
    const updatedItinerary = currentTrip.itinerary.map((day) => {
      if (day.day_number !== dayNumber) return day;
      const acts = day.activities.map((a) => (a.id === activity.id ? activity : a));
      return { ...day, activities: acts };
    });
    setCurrentTrip({ ...currentTrip, itinerary: updatedItinerary });
  };

  const addActivity = (dayNumber: number, activity: Partial<Activity>) => {
    if (!currentTrip) return;
    const newAct: Activity = {
      id: `custom-act-${Date.now()}`,
      name: activity.name || 'Custom Activity',
      description: activity.description || '',
      time_slot: activity.time_slot || 'afternoon',
      suggested_time: activity.suggested_time || '15:00 - 16:30',
      estimated_duration: activity.estimated_duration || '1.5 hours',
      location: activity.location || currentTrip.destination,
      area: activity.area || 'Downtown',
      category: activity.category || 'sightseeing',
      approximate_cost: activity.approximate_cost || 0,
      transport_suggestion: activity.transport_suggestion || 'Walking',
      sort_order: 99,
      is_meal: activity.is_meal || false,
      is_custom: true,
      notes: activity.notes || '',
    };
    const updatedItinerary = currentTrip.itinerary.map((day) => {
      if (day.day_number !== dayNumber) return day;
      return { ...day, activities: [...day.activities, newAct] };
    });
    setCurrentTrip({ ...currentTrip, itinerary: updatedItinerary });
    showToast('Activity added!', 'success');
  };

  const removeActivity = (dayNumber: number, activityId: string) => {
    if (!currentTrip) return;
    const updatedItinerary = currentTrip.itinerary.map((day) => {
      if (day.day_number !== dayNumber) return day;
      return { ...day, activities: day.activities.filter((a) => a.id !== activityId) };
    });
    setCurrentTrip({ ...currentTrip, itinerary: updatedItinerary });
    showToast('Activity removed', 'info');
  };

  const getTripById = (id: string) => {
    return trips.find((t) => t.id === id);
  };

  const deleteTrip = async (id: string) => {
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (currentTrip?.id === id) {
      setCurrentTrip(null);
    }
    showToast('Trip deleted.', 'info');
  };

  const duplicateTrip = async (id: string) => {
    const existing = trips.find((t) => t.id === id);
    if (!existing) return;
    const duplicated: Trip = {
      ...existing,
      id: `trip-copy-${Date.now()}`,
      title: `${existing.title} (Copy)`,
      created_at: new Date().toISOString(),
    };
    setTrips((prev) => [duplicated, ...prev]);
    showToast('Trip duplicated successfully.', 'success');
  };

  const getRecommendations = async (req: RecommendationRequest): Promise<Destination[]> => {
    try {
      const res = await fetch(`${API_BASE}/api/destinations/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          travel_dates: req.travel_month || 'Spring',
          budget: 2500,
          currency: 'USD',
          travel_vibe: req.travel_style || 'Relaxed',
          group_size: 2,
          interests: req.interests,
          duration: '1 week',
          travel_style: req.travel_style || 'moderate',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.destinations || [];
      }
    } catch {
      // Fallback
    }

    return [
      {
        name: 'Kyoto',
        country: 'Japan',
        description: 'Immerse in timeless shrines, sublime bamboo groves, and authentic culinary artistry.',
        reason: 'Perfect match for cultural depth, serene aesthetics, and gastronomy.',
        suggested_attractions: ['Fushimi Inari Shrine', 'Kinkaku-ji', 'Arashiyama Bamboo Grove', 'Gion District'],
        approximate_budget: 2400,
        suggested_duration: 6,
        seasonal_considerations: 'Spring cherry blossoms and autumn maples provide scenic peak foliage.',
      },
      {
        name: 'Florence',
        country: 'Italy',
        description: 'The cradle of the Renaissance boasting masterworks, Tuscan cuisine, and romantic alleys.',
        reason: 'Superb architecture, walkability, and renowned food & wine culture.',
        suggested_attractions: ['Duomo Cathedral', 'Uffizi Gallery', 'Ponte Vecchio', 'Piazzale Michelangelo'],
        approximate_budget: 2200,
        suggested_duration: 5,
        seasonal_considerations: 'Shoulder seasons (May & September) boast agreeable weather with minimal queues.',
      },
      {
        name: 'Vancouver',
        country: 'Canada',
        description: 'Spectacular mountain and ocean vistas coupled with bustling multicultural dining scenes.',
        reason: 'Ideal for nature enthusiasts seeking coastal adventures alongside cosmopolitan comfort.',
        suggested_attractions: ['Stanley Park Seawall', 'Capilano Suspension Bridge', 'Granville Island', 'Gastown'],
        approximate_budget: 2600,
        suggested_duration: 7,
        seasonal_considerations: 'Summer months provide sunny temperate climate for cycling and maritime tours.',
      },
    ];
  };

  const exportPDF = async () => {
    if (!currentTrip) return;
    try {
      const blob = await tripService.exportPDF(currentTrip);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `TravelCraft_${currentTrip.destination}_Itinerary.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Itinerary PDF downloaded successfully!', 'success');
    } catch {
      // Client-side fallback using window.print
      window.print();
    }
  };

  return (
    <TripContext.Provider
      value={{
        currentTrip,
        setCurrentTrip,
        trips,
        loading,
        generateItinerary,
        regenerateDay,
        saveCurrentTrip,
        updateActivity,
        addActivity,
        removeActivity,
        getTripById,
        deleteTrip,
        duplicateTrip,
        getRecommendations,
        exportPDF,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripContext);
  if (!context) throw new Error('useTrips must be used within TripProvider');
  return context;
};
