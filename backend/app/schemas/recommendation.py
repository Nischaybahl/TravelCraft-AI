"""
TravelCraft AI - Recommendation Schemas

Pydantic models for destination recommendation requests and responses.
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    """Request body for getting destination recommendations."""

    travel_dates: str = Field(
        default="",
        description="Approximate travel dates or month, e.g. 'June 2025' or 'flexible'",
    )
    budget: float = Field(default=2000, gt=0, description="Approximate total budget")
    currency: str = Field(default="USD", max_length=10)
    travel_vibe: str = Field(
        default="",
        description="Desired trip vibe — adventure, relaxation, cultural, romantic, etc.",
    )
    group_size: int = Field(default=1, ge=1, le=50)
    interests: List[str] = Field(
        default_factory=list,
        description="Interests such as history, beaches, nightlife, nature",
    )
    duration: str = Field(
        default="1 week",
        description="How long the trip should be, e.g. '5 days', '2 weeks'",
    )
    travel_style: str = Field(
        default="moderate",
        description="budget, moderate, luxury",
    )


class Destination(BaseModel):
    """A single destination recommendation."""

    name: str = Field(..., description="City or region name")
    country: str = Field(default="", description="Country")
    description: str = Field(default="", description="Why this destination is recommended")
    reason: str = Field(default="", description="Key reason it matches the user's preferences")
    suggested_attractions: List[str] = Field(
        default_factory=list,
        description="Top attractions or experiences",
    )
    approximate_budget: float = Field(default=0, ge=0, description="Estimated budget for the trip")
    suggested_duration: str = Field(default="", description="Recommended trip length")
    seasonal_considerations: str = Field(
        default="",
        description="Weather or seasonal advice",
    )


class RecommendationResponse(BaseModel):
    """Response with a list of recommended destinations."""

    destinations: List[Destination]
    is_demo: bool = False
