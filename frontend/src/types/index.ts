// ============================================================
// TravelCraft AI — Type Definitions
// ============================================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  preferred_currency: string;
  preferred_language: string;
  travel_style: string;
  dietary_preferences: string[];
  created_at: string;
  updated_at: string;
}

export interface TripPreferences {
  destination: string;
  country: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  num_travelers: number;
  travel_group: string;
  travel_style: string;
  travel_pace: string;
  interests: string[];
  accommodation_preference: string;
  dietary_preferences: string[];
  additional_notes: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  time_slot: string;
  suggested_time: string;
  estimated_duration: string;
  location: string;
  area: string;
  category: string;
  approximate_cost: number;
  currency?: string;
  transport_suggestion: string;
  sort_order: number;
  is_meal: boolean;
  is_custom: boolean;
  notes: string;
}

export interface ItineraryDay {
  id: string;
  day_number: number;
  date: string;
  theme: string;
  summary: string;
  activities: Activity[];
  accommodation_suggestion: string;
  transport_notes: string;
  travel_tips: string;
  estimated_cost: number;
  food_cost: number;
  transport_cost: number;
  activity_cost: number;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  country: string;
  description: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  budget: number;
  currency: string;
  num_travelers: number;
  travel_group: string;
  travel_style: string;
  travel_pace: string;
  interests: string[];
  accommodation_preference: string;
  dietary_preferences: string[];
  additional_notes: string;
  status: 'draft' | 'planned' | 'active' | 'completed' | 'cancelled';
  total_estimated_cost: number;
  accommodation_cost: number;
  food_cost: number;
  transport_cost: number;
  activity_cost: number;
  itinerary: ItineraryDay[];
  created_at: string;
  updated_at: string;
}

export interface Destination {
  name: string;
  country: string;
  description: string;
  reason: string;
  suggested_attractions: string[];
  approximate_budget: number;
  suggested_duration: number;
  seasonal_considerations: string;
}

export interface BudgetBreakdown {
  total_budget: number;
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  daily_spending: { day: number; amount: number; label: string }[];
  total_estimated: number;
  remaining: number;
  currency: string;
}

export interface RecommendationRequest {
  interests: string[];
  budget_range: string;
  travel_style: string;
  preferred_climate: string;
  travel_month: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
