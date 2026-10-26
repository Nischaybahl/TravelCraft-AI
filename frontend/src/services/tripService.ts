import api from './api';
import type { Trip, TripPreferences, Destination, RecommendationRequest } from '@/types';

export const tripService = {
  async generateItinerary(preferences: TripPreferences): Promise<Trip> {
    return api.post<Trip>('/api/itineraries/generate', preferences);
  },

  async regenerateDay(tripId: string, dayNumber: number, preferences?: Partial<TripPreferences>): Promise<Trip> {
    return api.post<Trip>(`/api/itineraries/regenerate-day`, {
      trip_id: tripId,
      day_number: dayNumber,
      ...preferences,
    });
  },

  async getRecommendations(request: RecommendationRequest): Promise<Destination[]> {
    return api.post<Destination[]>('/api/destinations/recommend', request);
  },

  async getTrips(): Promise<Trip[]> {
    return api.get<Trip[]>('/api/trips');
  },

  async getTrip(id: string): Promise<Trip> {
    return api.get<Trip>(`/api/trips/${id}`);
  },

  async createTrip(data: Partial<Trip>): Promise<Trip> {
    return api.post<Trip>('/api/trips', data);
  },

  async updateTrip(id: string, data: Partial<Trip>): Promise<Trip> {
    return api.put<Trip>(`/api/trips/${id}`, data);
  },

  async deleteTrip(id: string): Promise<void> {
    return api.delete<void>(`/api/trips/${id}`);
  },

  async exportPDF(data: Trip): Promise<Blob> {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/itineraries/export-pdf`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );
    if (!response.ok) throw new Error('PDF export failed');
    return response.blob();
  },
};

export default tripService;
