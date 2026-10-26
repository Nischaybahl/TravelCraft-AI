"""
TravelCraft AI - Supabase Client

Initializes the Supabase client from application settings.
Returns None when credentials are missing (demo mode).
"""

from __future__ import annotations

import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

_supabase_client = None
_initialized = False


def _init_client():
    """Lazily initialize the Supabase client."""
    global _supabase_client, _initialized
    if _initialized:
        return

    _initialized = True

    if not settings.has_supabase:
        logger.info(
            "Supabase credentials not configured — running without database. "
            "Trip data will be stored in-memory."
        )
        _supabase_client = None
        return

    try:
        from supabase import create_client, Client

        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
        _supabase_client = create_client(settings.SUPABASE_URL, key)
        logger.info("Supabase client initialized successfully for %s", settings.SUPABASE_URL)
    except Exception as exc:
        logger.error("Failed to initialize Supabase client: %s", exc)
        _supabase_client = None


def get_supabase_client():
    """Return the Supabase client instance, or None in demo mode.

    The client is lazily initialized on first call.
    """
    if not _initialized:
        _init_client()
    return _supabase_client
