"""Destination recommendation endpoints."""

from fastapi import APIRouter, Depends

from app.core.config import settings
from app.core.security import get_current_user
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse

router = APIRouter(prefix="/api/destinations", tags=["Recommendations"])


@router.post("/recommend", response_model=RecommendationResponse)
async def recommend_destinations(
    request: RecommendationRequest,
    user: dict = Depends(get_current_user),
):
    """Get AI-powered destination recommendations."""
    if settings.is_demo_mode or not settings.GEMINI_API_KEY:
        from app.services.demo_service import demo_recommend_destinations
        destinations = demo_recommend_destinations(request)
        return RecommendationResponse(destinations=destinations, is_demo=True)

    from app.services.gemini_service import gemini_service
    destinations = gemini_service.recommend_destinations(request)
    return RecommendationResponse(destinations=destinations, is_demo=False)
