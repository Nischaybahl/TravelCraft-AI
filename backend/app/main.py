"""
TravelCraft AI - FastAPI Application

Main entry point for the backend API server.
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.api.routes import health, recommendations, itineraries, trips, profile

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create the FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered travel itinerary planner built with Google Gemini",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(recommendations.router)
app.include_router(itineraries.router)
app.include_router(trips.router)
app.include_router(profile.router)


@app.get("/", include_in_schema=False)
async def root():
    """Redirect root to API documentation."""
    return RedirectResponse(url="/docs")


@app.on_event("startup")
async def startup_event():
    mode = "DEMO" if settings.is_demo_mode else "LIVE"
    logger.info("=" * 60)
    logger.info("TravelCraft AI API v%s starting in %s mode", settings.APP_VERSION, mode)
    logger.info("CORS origins: %s", settings.cors_origins_list)
    logger.info("Supabase configured: %s", settings.has_supabase)
    logger.info("Gemini API key set: %s", bool(settings.GEMINI_API_KEY))
    logger.info("=" * 60)
