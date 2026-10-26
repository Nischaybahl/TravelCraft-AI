"""
TravelCraft AI - Itinerary Schemas

Pydantic models for activities, itinerary days, and
itinerary generation request/response shapes.
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field

from app.schemas.trip import TripPreferences


class Activity(BaseModel):
    """A single activity within an itinerary day."""

    name: str = Field(..., min_length=1, description="Activity name")
    description: str = Field(default="", description="What the activity involves")
    time_slot: str = Field(
        default="morning",
        description="morning, afternoon, evening, night",
    )
    suggested_time: str = Field(default="", description="e.g. '09:00 - 10:30'")
    estimated_duration: str = Field(default="", description="e.g. '1.5 hours'")
    location: str = Field(default="", description="Specific place name")
    area: str = Field(default="", description="Neighbourhood or district")
    category: str = Field(
        default="sightseeing",
        description="sightseeing, food, adventure, culture, shopping, transport, relaxation",
    )
    approximate_cost: float = Field(default=0, ge=0)
    transport_suggestion: str = Field(default="", description="How to get there")
    sort_order: int = Field(default=0, ge=0)
    is_meal: bool = Field(default=False)
    is_custom: bool = Field(default=False)
    notes: str = Field(default="")


class ItineraryDay(BaseModel):
    """One day of the itinerary."""

    day_number: int = Field(..., ge=1)
    date: str = Field(default="", description="ISO date string YYYY-MM-DD")
    theme: str = Field(default="", description="Day theme, e.g. 'Historic Old Town'")
    summary: str = Field(default="", description="Brief overview of the day")
    activities: List[Activity] = Field(default_factory=list)
    accommodation_suggestion: str = Field(default="")
    transport_notes: str = Field(default="")
    travel_tips: str = Field(default="")
    estimated_cost: float = Field(default=0, ge=0)
    food_cost: float = Field(default=0, ge=0)
    transport_cost: float = Field(default=0, ge=0)
    activity_cost: float = Field(default=0, ge=0)


class GenerateItineraryRequest(BaseModel):
    """Request to generate a full itinerary."""

    preferences: TripPreferences


class GenerateItineraryResponse(BaseModel):
    """Response containing the generated itinerary."""

    days: List[ItineraryDay]
    total_estimated_cost: float = 0
    destination: str = ""
    duration_days: int = 0
    is_demo: bool = False


class RegenerateDayRequest(BaseModel):
    """Request to regenerate a single day of an itinerary."""

    preferences: TripPreferences
    day_number: int = Field(..., ge=1)
    instructions: str = Field(
        default="",
        max_length=1000,
        description="Optional instructions for regeneration",
    )
    existing_days_summary: str = Field(
        default="",
        description="Summary of the other days for context",
    )
