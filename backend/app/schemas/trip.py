"""
TravelCraft AI - Trip Schemas

Pydantic models for trip preferences, CRUD operations,
and API request/response shapes.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field, field_validator, model_validator


class TripPreferences(BaseModel):
    """User-provided preferences used to generate an itinerary."""

    destination: str = Field(..., min_length=1, max_length=200, description="City or region name")
    country: str = Field(default="", max_length=100, description="Country of the destination")
    start_date: date = Field(..., description="Trip start date")
    end_date: date = Field(..., description="Trip end date")
    budget: float = Field(..., gt=0, description="Total trip budget")
    currency: str = Field(default="USD", max_length=10)
    num_travelers: int = Field(default=1, ge=1, le=50)
    travel_group: str = Field(
        default="solo",
        description="solo, couple, family, friends, business",
    )
    travel_style: str = Field(
        default="moderate",
        description="budget, moderate, luxury",
    )
    travel_pace: str = Field(
        default="balanced",
        description="relaxed, balanced, fast",
    )
    interests: List[str] = Field(
        default_factory=list,
        description="List of interests like culture, food, adventure, etc.",
    )
    accommodation_preference: str = Field(
        default="hotel",
        description="hotel, hostel, airbnb, resort, any",
    )
    dietary_preferences: List[str] = Field(
        default_factory=list,
        description="Dietary restrictions or preferences",
    )
    additional_notes: str = Field(default="", max_length=2000)

    @field_validator("travel_group")
    @classmethod
    def validate_travel_group(cls, v: str) -> str:
        allowed = {"solo", "couple", "family", "friends", "business"}
        v_lower = v.lower().strip()
        if v_lower not in allowed:
            return "solo"
        return v_lower

    @field_validator("travel_style")
    @classmethod
    def validate_travel_style(cls, v: str) -> str:
        allowed = {"budget", "moderate", "luxury"}
        v_lower = v.lower().strip()
        if v_lower not in allowed:
            return "moderate"
        return v_lower

    @field_validator("travel_pace")
    @classmethod
    def validate_travel_pace(cls, v: str) -> str:
        allowed = {"relaxed", "balanced", "fast"}
        v_lower = v.lower().strip()
        if v_lower not in allowed:
            return "balanced"
        return v_lower

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_date < self.start_date:
            raise ValueError("end_date must be on or after start_date")
        delta = (self.end_date - self.start_date).days
        if delta > 60:
            raise ValueError("Trip duration cannot exceed 60 days")
        return self

    @property
    def duration_days(self) -> int:
        return (self.end_date - self.start_date).days + 1


class TripCreate(BaseModel):
    """Request body for creating a new trip."""

    title: str = Field(default="", max_length=300)
    preferences: TripPreferences
    description: str = Field(default="", max_length=2000)


class TripUpdate(BaseModel):
    """Request body for updating an existing trip."""

    title: Optional[str] = Field(default=None, max_length=300)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[str] = Field(default=None)
    destination: Optional[str] = None
    country: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = Field(default=None, gt=0)
    currency: Optional[str] = None
    num_travelers: Optional[int] = Field(default=None, ge=1)
    travel_group: Optional[str] = None
    travel_style: Optional[str] = None
    travel_pace: Optional[str] = None
    interests: Optional[List[str]] = None
    accommodation_preference: Optional[str] = None
    dietary_preferences: Optional[List[str]] = None
    additional_notes: Optional[str] = None


class TripResponse(BaseModel):
    """Single trip returned from the API."""

    id: str
    user_id: str
    title: str
    destination: str
    country: str = ""
    description: str = ""
    start_date: str
    end_date: str
    duration_days: int
    budget: float = 0
    currency: str = "USD"
    num_travelers: int = 1
    travel_group: str = "solo"
    travel_style: str = "moderate"
    travel_pace: str = "balanced"
    interests: List[str] = []
    accommodation_preference: str = ""
    dietary_preferences: List[str] = []
    additional_notes: str = ""
    status: str = "draft"
    total_estimated_cost: float = 0
    accommodation_cost: float = 0
    food_cost: float = 0
    transport_cost: float = 0
    activity_cost: float = 0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    itinerary_days: Optional[list] = None  # Populated on detail view

    model_config = {"from_attributes": True}


class TripListResponse(BaseModel):
    """Response containing a list of trips."""

    trips: List[TripResponse]
    total: int
