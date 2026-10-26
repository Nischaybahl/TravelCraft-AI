import type { TripPreferences } from '@/types';

export interface ValidationErrors {
  [key: string]: string;
}

export function validateTripPreferences(prefs: Partial<TripPreferences>): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!prefs.destination?.trim()) {
    errors.destination = 'Destination is required';
  }

  if (!prefs.country?.trim()) {
    errors.country = 'Country is required';
  }

  if (!prefs.start_date) {
    errors.start_date = 'Start date is required';
  }

  if (!prefs.end_date) {
    errors.end_date = 'End date is required';
  }

  if (prefs.start_date && prefs.end_date) {
    const start = new Date(prefs.start_date);
    const end = new Date(prefs.end_date);
    if (end <= start) {
      errors.end_date = 'End date must be after start date';
    }
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diff > 30) {
      errors.end_date = 'Trip duration cannot exceed 30 days';
    }
  }

  if (!prefs.budget || prefs.budget <= 0) {
    errors.budget = 'Budget must be greater than 0';
  } else if (prefs.budget > 1000000) {
    errors.budget = 'Budget seems unrealistically high';
  }

  if (!prefs.num_travelers || prefs.num_travelers < 1) {
    errors.num_travelers = 'At least 1 traveler is required';
  } else if (prefs.num_travelers > 20) {
    errors.num_travelers = 'Maximum 20 travelers';
  }

  if (!prefs.travel_group) {
    errors.travel_group = 'Please select a travel group';
  }

  if (!prefs.travel_style) {
    errors.travel_style = 'Please select a travel style';
  }

  if (!prefs.travel_pace) {
    errors.travel_pace = 'Please select a travel pace';
  }

  if (!prefs.interests || prefs.interests.length === 0) {
    errors.interests = 'Select at least one interest';
  }

  return errors;
}

export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}
