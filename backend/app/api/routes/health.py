"""Health check endpoint."""

from fastapi import APIRouter

from app.core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "version": settings.APP_VERSION,
        "mode": "demo" if settings.is_demo_mode else "live",
        "supabase_connected": settings.has_supabase,
        "gemini_configured": bool(settings.GEMINI_API_KEY),
    }
