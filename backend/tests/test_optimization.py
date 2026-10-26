"""Tests for optimization service."""

import pytest
from datetime import date
from app.schemas.itinerary import Activity, ItineraryDay
from app.services.optimization_service import optimize_itinerary


def _make_activities(count: int, with_meals: bool = True):
    acts = []
    for i in range(count):
        acts.append(Activity(
            name=f"Activity {i+1}",
            description=f"Description for activity {i+1}",
            time_slot="morning" if i < count//3 else ("afternoon" if i < 2*count//3 else "evening"),
            location=f"Location {i+1}",
            area=f"Area {i % 3}",
            category="sightseeing",
            approximate_cost=10.0 + i,
            sort_order=i,
        ))
    if with_meals:
        acts.insert(0, Activity(name="Breakfast", is_meal=True, approximate_cost=12.0, time_slot="morning", sort_order=0))
        acts.insert(len(acts)//2, Activity(name="Lunch", is_meal=True, approximate_cost=15.0, time_slot="afternoon", sort_order=0))
        acts.append(Activity(name="Dinner", is_meal=True, approximate_cost=25.0, time_slot="evening", sort_order=0))
    return acts


def _make_day(day_number: int, num_activities: int = 6) -> ItineraryDay:
    return ItineraryDay(
        day_number=day_number,
        date=f"2025-06-{day_number:02d}",
        theme=f"Day {day_number} Theme",
        activities=_make_activities(num_activities),
        estimated_cost=200.0,
        food_cost=50.0,
        activity_cost=150.0,
    )


def test_optimize_balanced():
    days = [_make_day(1, 6), _make_day(2, 6)]
    result = optimize_itinerary(days, pace="balanced")
    assert len(result) == 2
    for day in result:
        assert len(day.activities) > 0


def test_optimize_relaxed_reduces_activities():
    days = [_make_day(1, 10)]
    result = optimize_itinerary(days, pace="relaxed")
    # Relaxed should have fewer non-meal activities
    non_meals = [a for a in result[0].activities if not a.is_meal]
    assert len(non_meals) <= 6


def test_optimize_preserves_meals():
    day = _make_day(1, 4)
    meals_before = [a for a in day.activities if a.is_meal]
    result = optimize_itinerary([day], pace="balanced")
    meals_after = [a for a in result[0].activities if a.is_meal]
    assert len(meals_after) >= 3  # At least breakfast, lunch, dinner


def test_sort_orders_updated():
    days = [_make_day(1, 5)]
    result = optimize_itinerary(days, pace="balanced")
    for i, act in enumerate(result[0].activities):
        assert act.sort_order == i


def test_costs_recalculated():
    days = [_make_day(1, 5)]
    result = optimize_itinerary(days, pace="balanced")
    day = result[0]
    expected_food = sum(a.approximate_cost for a in day.activities if a.is_meal)
    assert abs(day.food_cost - expected_food) < 0.01
