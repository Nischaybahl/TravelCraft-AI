"""
TravelCraft AI - Optimization Service

Practical scheduling logic: geographic grouping, pace adjustment,
meal-break insertion, travel buffers, and overload warnings.
"""

from __future__ import annotations

import logging
from typing import List

from app.schemas.itinerary import Activity, ItineraryDay

logger = logging.getLogger(__name__)

PACE_ACTIVITY_RANGE = {
    "relaxed": (4, 5),
    "balanced": (6, 7),
    "fast": (8, 9),
}

MEAL_TIMES = {
    "breakfast": "08:00",
    "lunch": "12:30",
    "dinner": "19:00",
}


def _activities_per_day(pace: str) -> int:
    lo, hi = PACE_ACTIVITY_RANGE.get(pace, (6, 7))
    return hi


def _group_by_area(activities: List[Activity]) -> List[Activity]:
    """Sort activities so those in the same area are adjacent (simple grouping)."""
    meals = [a for a in activities if a.is_meal]
    non_meals = [a for a in activities if not a.is_meal]

    # Group non-meals by area
    area_groups: dict[str, list[Activity]] = {}
    for a in non_meals:
        key = (a.area or a.location or "unknown").lower().strip()
        area_groups.setdefault(key, []).append(a)

    grouped: List[Activity] = []
    for area_acts in area_groups.values():
        grouped.extend(area_acts)

    # Interleave meals at appropriate positions
    result: List[Activity] = []
    meal_idx = 0
    non_meal_count = len(grouped)

    if non_meal_count == 0:
        return meals

    # Insert meals roughly at 1/4, 1/2, 3/4 positions
    meal_positions = []
    if len(meals) >= 1:
        meal_positions.append(max(1, non_meal_count // 4))
    if len(meals) >= 2:
        meal_positions.append(max(2, non_meal_count // 2))
    if len(meals) >= 3:
        meal_positions.append(max(3, (non_meal_count * 3) // 4))

    gi = 0
    for pos in range(non_meal_count + len(meals)):
        if meal_idx < len(meal_positions) and gi == meal_positions[meal_idx]:
            if meal_idx < len(meals):
                result.append(meals[meal_idx])
            meal_idx += 1
        if gi < len(grouped):
            result.append(grouped[gi])
            gi += 1

    # Append any remaining meals
    while meal_idx < len(meals):
        result.append(meals[meal_idx])
        meal_idx += 1
    while gi < len(grouped):
        result.append(grouped[gi])
        gi += 1

    return result


def _ensure_meals(activities: List[Activity], destination: str) -> List[Activity]:
    """Make sure at least breakfast, lunch, and dinner exist."""
    has_breakfast = any(
        a.is_meal and ("breakfast" in a.name.lower() or a.time_slot == "morning")
        for a in activities
    )
    has_lunch = any(
        a.is_meal and ("lunch" in a.name.lower() or (a.time_slot == "afternoon" and a.is_meal))
        for a in activities
    )
    has_dinner = any(
        a.is_meal and ("dinner" in a.name.lower() or a.time_slot == "evening")
        for a in activities
    )

    if not has_breakfast:
        activities.insert(0, Activity(
            name=f"Breakfast in {destination}",
            description="Start your day with a local breakfast.",
            time_slot="morning",
            suggested_time="08:00 - 09:00",
            estimated_duration="1 hour",
            location=f"Local café, {destination}",
            area="City Centre",
            category="food",
            approximate_cost=12.0,
            sort_order=0,
            is_meal=True,
        ))
    if not has_lunch:
        mid = len(activities) // 2
        activities.insert(mid, Activity(
            name=f"Lunch in {destination}",
            description="Midday break for a local lunch.",
            time_slot="afternoon",
            suggested_time="12:30 - 13:30",
            estimated_duration="1 hour",
            location=f"Local restaurant, {destination}",
            area="City Centre",
            category="food",
            approximate_cost=15.0,
            sort_order=mid,
            is_meal=True,
        ))
    if not has_dinner:
        activities.append(Activity(
            name=f"Dinner in {destination}",
            description="End the day with a delicious dinner.",
            time_slot="evening",
            suggested_time="19:00 - 20:30",
            estimated_duration="1.5 hours",
            location=f"Restaurant, {destination}",
            area="City Centre",
            category="food",
            approximate_cost=25.0,
            sort_order=len(activities),
            is_meal=True,
        ))

    return activities


def _trim_or_pad(
    activities: List[Activity], target: int, destination: str
) -> List[Activity]:
    """Adjust activity count to match the target pace."""
    if len(activities) > target:
        # Keep meals and trim non-meals from the end
        meals = [a for a in activities if a.is_meal]
        non_meals = [a for a in activities if not a.is_meal]
        keep = max(target - len(meals), 1)
        return meals + non_meals[:keep]
    return activities


def _update_sort_orders(activities: List[Activity]) -> List[Activity]:
    for i, a in enumerate(activities):
        a.sort_order = i
    return activities


def _check_overload(day: ItineraryDay, pace: str) -> ItineraryDay:
    """Add a warning if the day seems overloaded."""
    _, hi = PACE_ACTIVITY_RANGE.get(pace, (6, 7))
    non_meal = [a for a in day.activities if not a.is_meal]
    if len(non_meal) > hi + 2:
        warning = (
            f"⚠️ This day has {len(non_meal)} non-meal activities, which may "
            f"feel rushed for a '{pace}' pace. Consider removing some activities."
        )
        day.travel_tips = f"{warning} {day.travel_tips}" if day.travel_tips else warning
    return day


def optimize_itinerary(
    days: List[ItineraryDay],
    pace: str = "balanced",
    destination: str = "",
) -> List[ItineraryDay]:
    """Optimize the itinerary for geographic grouping, pace, and meals."""
    target_count = _activities_per_day(pace)
    optimized: List[ItineraryDay] = []

    for day in days:
        activities = list(day.activities)

        # 1. Ensure meal breaks exist
        activities = _ensure_meals(activities, destination or "the destination")

        # 2. Group by area
        activities = _group_by_area(activities)

        # 3. Trim or pad to match pace
        activities = _trim_or_pad(activities, target_count, destination or "the destination")

        # 4. Update sort orders
        activities = _update_sort_orders(activities)

        # 5. Recalculate costs
        food_cost = round(sum(a.approximate_cost for a in activities if a.is_meal), 2)
        activity_cost = round(sum(a.approximate_cost for a in activities if not a.is_meal), 2)
        transport_cost = day.transport_cost or 15.0
        estimated_cost = round(food_cost + activity_cost + transport_cost, 2)

        day.activities = activities
        day.food_cost = food_cost
        day.activity_cost = activity_cost
        day.estimated_cost = estimated_cost

        # 6. Check for overload
        day = _check_overload(day, pace)

        optimized.append(day)

    return optimized
