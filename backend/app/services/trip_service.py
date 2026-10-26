"""
TravelCraft AI - Trip Service

CRUD operations for trips using Supabase or in-memory demo storage.
"""

from __future__ import annotations

import logging
import uuid
from datetime import datetime
from typing import Dict, List, Optional

from app.core.config import settings
from app.schemas.itinerary import Activity, ItineraryDay

logger = logging.getLogger(__name__)

# In-memory storage for demo mode
_demo_trips: Dict[str, dict] = {}
_demo_itinerary_days: Dict[str, List[dict]] = {}  # trip_id -> days


def _now_iso() -> str:
    return datetime.utcnow().isoformat()


# ======================================================================
# SUPABASE OPERATIONS
# ======================================================================

def _get_sb():
    """Get Supabase client, returns None if unavailable."""
    try:
        from app.database.supabase_client import get_supabase_client
        return get_supabase_client()
    except Exception:
        return None


async def save_trip_supabase(user_id: str, trip_data: dict, itinerary_days: List[ItineraryDay]) -> dict:
    sb = _get_sb()
    if not sb:
        return await save_trip_demo(user_id, trip_data, itinerary_days)

    trip_id = str(uuid.uuid4())
    trip_record = {
        "id": trip_id,
        "user_id": user_id,
        "title": trip_data.get("title", f"Trip to {trip_data.get('destination', 'Unknown')}"),
        "destination": trip_data.get("destination", ""),
        "country": trip_data.get("country", ""),
        "description": trip_data.get("description", ""),
        "start_date": str(trip_data.get("start_date", "")),
        "end_date": str(trip_data.get("end_date", "")),
        "duration_days": trip_data.get("duration_days", 1),
        "budget": float(trip_data.get("budget", 0)),
        "currency": trip_data.get("currency", "USD"),
        "num_travelers": trip_data.get("num_travelers", 1),
        "travel_group": trip_data.get("travel_group", "solo"),
        "travel_style": trip_data.get("travel_style", "moderate"),
        "travel_pace": trip_data.get("travel_pace", "balanced"),
        "interests": trip_data.get("interests", []),
        "accommodation_preference": trip_data.get("accommodation_preference", ""),
        "dietary_preferences": trip_data.get("dietary_preferences", []),
        "additional_notes": trip_data.get("additional_notes", ""),
        "status": "planned",
        "total_estimated_cost": sum(d.estimated_cost for d in itinerary_days),
        "accommodation_cost": 0,
        "food_cost": sum(d.food_cost for d in itinerary_days),
        "transport_cost": sum(d.transport_cost for d in itinerary_days),
        "activity_cost": sum(d.activity_cost for d in itinerary_days),
    }

    try:
        result = sb.table("trips").insert(trip_record).execute()
        # Save days and activities
        for day in itinerary_days:
            day_id = str(uuid.uuid4())
            day_record = {
                "id": day_id,
                "trip_id": trip_id,
                "day_number": day.day_number,
                "date": day.date,
                "theme": day.theme,
                "summary": day.summary,
                "accommodation_suggestion": day.accommodation_suggestion,
                "transport_notes": day.transport_notes,
                "travel_tips": day.travel_tips,
                "estimated_cost": day.estimated_cost,
                "food_cost": day.food_cost,
                "transport_cost": day.transport_cost,
                "activity_cost": day.activity_cost,
            }
            sb.table("itinerary_days").insert(day_record).execute()
            for act in day.activities:
                act_record = {
                    "id": str(uuid.uuid4()),
                    "day_id": day_id,
                    "name": act.name,
                    "description": act.description,
                    "time_slot": act.time_slot,
                    "suggested_time": act.suggested_time,
                    "estimated_duration": act.estimated_duration,
                    "location": act.location,
                    "area": act.area,
                    "category": act.category,
                    "approximate_cost": act.approximate_cost,
                    "transport_suggestion": act.transport_suggestion,
                    "sort_order": act.sort_order,
                    "is_meal": act.is_meal,
                    "is_custom": act.is_custom,
                    "notes": act.notes,
                }
                sb.table("itinerary_activities").insert(act_record).execute()
        trip_record["itinerary_days"] = [d.model_dump() for d in itinerary_days]
        return trip_record
    except Exception as e:
        logger.error("Supabase save failed: %s, falling back to demo", e)
        return await save_trip_demo(user_id, trip_data, itinerary_days)


async def get_trips_supabase(user_id: str) -> List[dict]:
    sb = _get_sb()
    if not sb:
        return await get_trips_demo(user_id)
    try:
        result = sb.table("trips").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        return result.data or []
    except Exception as e:
        logger.error("Supabase get_trips failed: %s", e)
        return await get_trips_demo(user_id)


async def get_trip_supabase(user_id: str, trip_id: str) -> Optional[dict]:
    sb = _get_sb()
    if not sb:
        return await get_trip_demo(user_id, trip_id)
    try:
        result = sb.table("trips").select("*").eq("id", trip_id).eq("user_id", user_id).single().execute()
        trip = result.data
        if not trip:
            return None
        # Fetch days
        days_result = sb.table("itinerary_days").select("*").eq("trip_id", trip_id).order("day_number").execute()
        days = days_result.data or []
        for day in days:
            acts_result = sb.table("itinerary_activities").select("*").eq("day_id", day["id"]).order("sort_order").execute()
            day["activities"] = acts_result.data or []
        trip["itinerary_days"] = days
        return trip
    except Exception as e:
        logger.error("Supabase get_trip failed: %s", e)
        return await get_trip_demo(user_id, trip_id)


async def update_trip_supabase(user_id: str, trip_id: str, update_data: dict) -> Optional[dict]:
    sb = _get_sb()
    if not sb:
        return await update_trip_demo(user_id, trip_id, update_data)
    try:
        result = sb.table("trips").update(update_data).eq("id", trip_id).eq("user_id", user_id).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        logger.error("Supabase update failed: %s", e)
        return await update_trip_demo(user_id, trip_id, update_data)


async def delete_trip_supabase(user_id: str, trip_id: str) -> bool:
    sb = _get_sb()
    if not sb:
        return await delete_trip_demo(user_id, trip_id)
    try:
        sb.table("trips").delete().eq("id", trip_id).eq("user_id", user_id).execute()
        return True
    except Exception as e:
        logger.error("Supabase delete failed: %s", e)
        return await delete_trip_demo(user_id, trip_id)


# ======================================================================
# DEMO MODE OPERATIONS (In-memory)
# ======================================================================

async def save_trip_demo(user_id: str, trip_data: dict, itinerary_days: List[ItineraryDay]) -> dict:
    trip_id = str(uuid.uuid4())
    trip_record = {
        "id": trip_id,
        "user_id": user_id,
        "title": trip_data.get("title", f"Trip to {trip_data.get('destination', 'Unknown')}"),
        "destination": trip_data.get("destination", ""),
        "country": trip_data.get("country", ""),
        "description": trip_data.get("description", ""),
        "start_date": str(trip_data.get("start_date", "")),
        "end_date": str(trip_data.get("end_date", "")),
        "duration_days": trip_data.get("duration_days", 1),
        "budget": float(trip_data.get("budget", 0)),
        "currency": trip_data.get("currency", "USD"),
        "num_travelers": trip_data.get("num_travelers", 1),
        "travel_group": trip_data.get("travel_group", "solo"),
        "travel_style": trip_data.get("travel_style", "moderate"),
        "travel_pace": trip_data.get("travel_pace", "balanced"),
        "interests": trip_data.get("interests", []),
        "accommodation_preference": trip_data.get("accommodation_preference", ""),
        "dietary_preferences": trip_data.get("dietary_preferences", []),
        "additional_notes": trip_data.get("additional_notes", ""),
        "status": "planned",
        "total_estimated_cost": round(sum(d.estimated_cost for d in itinerary_days), 2),
        "accommodation_cost": 0,
        "food_cost": round(sum(d.food_cost for d in itinerary_days), 2),
        "transport_cost": round(sum(d.transport_cost for d in itinerary_days), 2),
        "activity_cost": round(sum(d.activity_cost for d in itinerary_days), 2),
        "created_at": _now_iso(),
        "updated_at": _now_iso(),
        "itinerary_days": [d.model_dump() for d in itinerary_days],
    }
    _demo_trips[trip_id] = trip_record
    return trip_record


async def get_trips_demo(user_id: str) -> List[dict]:
    return [
        {k: v for k, v in t.items() if k != "itinerary_days"}
        for t in _demo_trips.values()
        if t.get("user_id") == user_id
    ]


async def get_trip_demo(user_id: str, trip_id: str) -> Optional[dict]:
    trip = _demo_trips.get(trip_id)
    if trip and trip.get("user_id") == user_id:
        return trip
    return None


async def update_trip_demo(user_id: str, trip_id: str, update_data: dict) -> Optional[dict]:
    trip = _demo_trips.get(trip_id)
    if not trip or trip.get("user_id") != user_id:
        return None
    for key, value in update_data.items():
        if value is not None:
            trip[key] = value
    trip["updated_at"] = _now_iso()
    return trip


async def delete_trip_demo(user_id: str, trip_id: str) -> bool:
    trip = _demo_trips.get(trip_id)
    if trip and trip.get("user_id") == user_id:
        del _demo_trips[trip_id]
        return True
    return False


# ======================================================================
# PUBLIC API — routes call these functions
# ======================================================================

async def save_trip(user_id: str, trip_data: dict, itinerary_days: List[ItineraryDay]) -> dict:
    if settings.has_supabase and not settings.is_demo_mode:
        return await save_trip_supabase(user_id, trip_data, itinerary_days)
    return await save_trip_demo(user_id, trip_data, itinerary_days)


async def get_trips(user_id: str) -> List[dict]:
    if settings.has_supabase and not settings.is_demo_mode:
        return await get_trips_supabase(user_id)
    return await get_trips_demo(user_id)


async def get_trip(user_id: str, trip_id: str) -> Optional[dict]:
    if settings.has_supabase and not settings.is_demo_mode:
        return await get_trip_supabase(user_id, trip_id)
    return await get_trip_demo(user_id, trip_id)


async def update_trip(user_id: str, trip_id: str, update_data: dict) -> Optional[dict]:
    if settings.has_supabase and not settings.is_demo_mode:
        return await update_trip_supabase(user_id, trip_id, update_data)
    return await update_trip_demo(user_id, trip_id, update_data)


async def delete_trip(user_id: str, trip_id: str) -> bool:
    if settings.has_supabase and not settings.is_demo_mode:
        return await delete_trip_supabase(user_id, trip_id)
    return await delete_trip_demo(user_id, trip_id)
