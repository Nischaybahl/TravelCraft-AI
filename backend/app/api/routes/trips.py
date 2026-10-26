"""Trip CRUD endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import get_current_user
from app.schemas.trip import TripCreate, TripListResponse, TripResponse, TripUpdate
from app.services import trip_service

router = APIRouter(prefix="/api/trips", tags=["Trips"])


@router.get("", response_model=TripListResponse)
async def list_trips(user: dict = Depends(get_current_user)):
    """List all trips for the current user."""
    trips = await trip_service.get_trips(user["id"])
    return TripListResponse(trips=[TripResponse(**t) for t in trips], total=len(trips))


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    body: dict,
    user: dict = Depends(get_current_user),
):
    """Create and save a new trip with its itinerary."""
    from app.schemas.itinerary import ItineraryDay

    trip_data = body.get("trip", body)
    days_raw = body.get("itinerary_days", [])
    itinerary_days = []
    for d in days_raw:
        if isinstance(d, dict):
            itinerary_days.append(ItineraryDay(**d))
        elif hasattr(d, "model_dump"):
            itinerary_days.append(d)

    prefs = trip_data.get("preferences", trip_data)
    save_data = {
        "title": trip_data.get("title", f"Trip to {prefs.get('destination', 'Unknown')}"),
        "destination": prefs.get("destination", ""),
        "country": prefs.get("country", ""),
        "description": trip_data.get("description", ""),
        "start_date": prefs.get("start_date", ""),
        "end_date": prefs.get("end_date", ""),
        "duration_days": prefs.get("duration_days", len(itinerary_days) or 1),
        "budget": prefs.get("budget", 0),
        "currency": prefs.get("currency", "USD"),
        "num_travelers": prefs.get("num_travelers", 1),
        "travel_group": prefs.get("travel_group", "solo"),
        "travel_style": prefs.get("travel_style", "moderate"),
        "travel_pace": prefs.get("travel_pace", "balanced"),
        "interests": prefs.get("interests", []),
        "accommodation_preference": prefs.get("accommodation_preference", ""),
        "dietary_preferences": prefs.get("dietary_preferences", []),
        "additional_notes": prefs.get("additional_notes", ""),
    }

    result = await trip_service.save_trip(user["id"], save_data, itinerary_days)
    return TripResponse(**result)


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(trip_id: str, user: dict = Depends(get_current_user)):
    """Get a specific trip with full itinerary."""
    trip = await trip_service.get_trip(user["id"], trip_id)
    if not trip:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return TripResponse(**trip)


@router.put("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: str,
    body: TripUpdate,
    user: dict = Depends(get_current_user),
):
    """Update an existing trip."""
    update_data = body.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")

    result = await trip_service.update_trip(user["id"], trip_id, update_data)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
    return TripResponse(**result)


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(trip_id: str, user: dict = Depends(get_current_user)):
    """Delete a trip."""
    deleted = await trip_service.delete_trip(user["id"], trip_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")
