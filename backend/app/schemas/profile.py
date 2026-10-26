"""
TravelCraft AI - Profile Schemas

Pydantic models for user profile responses and updates.
"""

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class ProfileResponse(BaseModel):
    """User profile returned from the API."""

    id: str
    email: str
    full_name: str = ""
    avatar_url: str = ""
    preferred_currency: str = "USD"
    preferred_language: str = "en"
    travel_style: str = "moderate"
    dietary_preferences: List[str] = []
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    model_config = {"from_attributes": True}


class ProfileUpdate(BaseModel):
    """Fields that can be updated on a user profile."""

    full_name: Optional[str] = Field(default=None, max_length=200)
    avatar_url: Optional[str] = Field(default=None, max_length=1000)
    preferred_currency: Optional[str] = Field(default=None, max_length=10)
    preferred_language: Optional[str] = Field(default=None, max_length=10)
    travel_style: Optional[str] = Field(default=None)
    dietary_preferences: Optional[List[str]] = None
