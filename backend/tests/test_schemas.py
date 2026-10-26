"""Tests for Pydantic schemas."""

import pytest
from datetime import date


def test_trip_preferences_valid():
    from app.schemas.trip import TripPreferences
    prefs = TripPreferences(
        destination="Paris",
        country="France",
        start_date=date(2025, 6, 1),
        end_date=date(2025, 6, 5),
        budget=2000.0,
        num_travelers=2,
        travel_group="couple",
        travel_style="moderate",
        travel_pace="balanced",
        interests=["culture", "food"],
    )
    assert prefs.destination == "Paris"
    assert prefs.duration_days == 5
    assert prefs.travel_group == "couple"


def test_trip_preferences_invalid_dates():
    from app.schemas.trip import TripPreferences
    with pytest.raises(ValueError):
        TripPreferences(
            destination="Paris",
            start_date=date(2025, 6, 10),
            end_date=date(2025, 6, 1),
            budget=1000.0,
        )


def test_trip_preferences_negative_budget():
    from app.schemas.trip import TripPreferences
    with pytest.raises(ValueError):
        TripPreferences(
            destination="Paris",
            start_date=date(2025, 6, 1),
            end_date=date(2025, 6, 5),
            budget=-100.0,
        )


def test_trip_preferences_defaults():
    from app.schemas.trip import TripPreferences
    prefs = TripPreferences(
        destination="Tokyo",
        start_date=date(2025, 7, 1),
        end_date=date(2025, 7, 3),
        budget=3000.0,
    )
    assert prefs.travel_group == "solo"
    assert prefs.travel_style == "moderate"
    assert prefs.travel_pace == "balanced"
    assert prefs.currency == "USD"


def test_activity_schema():
    from app.schemas.itinerary import Activity
    act = Activity(
        name="Eiffel Tower",
        description="Visit the iconic tower",
        time_slot="morning",
        suggested_time="09:00 - 11:00",
        estimated_duration="2 hours",
        location="Eiffel Tower",
        area="Champ de Mars",
        category="sightseeing",
        approximate_cost=26.0,
    )
    assert act.name == "Eiffel Tower"
    assert act.approximate_cost == 26.0
    assert act.is_meal is False


def test_itinerary_day_schema():
    from app.schemas.itinerary import Activity, ItineraryDay
    day = ItineraryDay(
        day_number=1,
        date="2025-06-01",
        theme="Iconic Landmarks",
        summary="Explore Paris landmarks",
        activities=[
            Activity(name="Eiffel Tower", approximate_cost=26.0),
            Activity(name="Lunch", approximate_cost=20.0, is_meal=True),
        ],
        estimated_cost=100.0,
        food_cost=20.0,
        activity_cost=80.0,
    )
    assert day.day_number == 1
    assert len(day.activities) == 2


def test_recommendation_request():
    from app.schemas.recommendation import RecommendationRequest
    req = RecommendationRequest(
        travel_dates="June 2025",
        budget=2000.0,
        travel_vibe="cultural",
        group_size=2,
        interests=["history", "food"],
    )
    assert req.budget == 2000.0
    assert len(req.interests) == 2


def test_profile_update():
    from app.schemas.profile import ProfileUpdate
    update = ProfileUpdate(full_name="John Doe", preferred_currency="EUR")
    assert update.full_name == "John Doe"
    dumped = update.model_dump(exclude_none=True)
    assert "preferred_currency" in dumped
    assert "avatar_url" not in dumped
