"""Itinerary generation endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response

from app.core.config import settings
from app.core.security import get_current_user
from app.schemas.itinerary import (
    GenerateItineraryRequest,
    GenerateItineraryResponse,
    ItineraryDay,
    RegenerateDayRequest,
)
from app.services.optimization_service import optimize_itinerary

router = APIRouter(prefix="/api/itineraries", tags=["Itineraries"])


@router.post("/generate", response_model=GenerateItineraryResponse)
async def generate_itinerary(
    request: GenerateItineraryRequest,
    user: dict = Depends(get_current_user),
):
    """Generate a complete day-by-day itinerary."""
    prefs = request.preferences
    is_demo = False

    if settings.is_demo_mode or not settings.GEMINI_API_KEY:
        from app.services.demo_service import demo_generate_itinerary
        days = demo_generate_itinerary(prefs)
        is_demo = True
    else:
        from app.services.gemini_service import gemini_service
        days = gemini_service.generate_itinerary(prefs)

    # Optimize
    days = optimize_itinerary(days, pace=prefs.travel_pace, destination=prefs.destination)

    total_cost = round(sum(d.estimated_cost for d in days), 2)

    return GenerateItineraryResponse(
        days=days,
        total_estimated_cost=total_cost,
        destination=prefs.destination,
        duration_days=prefs.duration_days,
        is_demo=is_demo,
    )


@router.post("/regenerate-day", response_model=ItineraryDay)
async def regenerate_day(
    request: RegenerateDayRequest,
    user: dict = Depends(get_current_user),
):
    """Regenerate a single day of an itinerary."""
    prefs = request.preferences

    if settings.is_demo_mode or not settings.GEMINI_API_KEY:
        from app.services.demo_service import demo_regenerate_day
        day = demo_regenerate_day(prefs, request.day_number)
    else:
        from app.services.gemini_service import gemini_service
        day = gemini_service.regenerate_day(
            prefs,
            request.day_number,
            request.existing_days_summary,
            request.instructions,
        )

    # Optimize single day
    optimized = optimize_itinerary(
        [day], pace=prefs.travel_pace, destination=prefs.destination
    )
    return optimized[0]


@router.post("/export-pdf")
async def export_pdf(
    request: dict,
    user: dict = Depends(get_current_user),
):
    """Export itinerary as PDF."""
    from app.services.pdf_service import generate_pdf

    trip_data = request.get("trip", {})
    itinerary_days = request.get("itinerary_days", [])

    if not trip_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Trip data is required")

    try:
        pdf_bytes = generate_pdf(trip_data, itinerary_days)
        destination = trip_data.get("destination", "trip")
        filename = f"TravelCraft_AI_{destination.replace(' ', '_')}_Itinerary.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"PDF generation failed: {str(e)}",
        )
