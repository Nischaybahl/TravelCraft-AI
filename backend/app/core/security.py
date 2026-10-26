"""
TravelCraft AI - Security & Authentication

Provides JWT verification for Supabase Auth tokens and a FastAPI
dependency that extracts the current user.  In demo mode a fixed
user-id is returned so every endpoint works without Supabase.
"""

from __future__ import annotations

import logging
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt

from app.core.config import settings

logger = logging.getLogger(__name__)

DEMO_USER_ID = "00000000-0000-0000-0000-000000000000"
DEMO_USER_EMAIL = "demo@travelcraft.ai"


def _extract_token(request: Request) -> Optional[str]:
    """Pull the Bearer token from the Authorization header."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header[7:]
    return None


def _verify_supabase_jwt(token: str) -> dict:
    """Decode and verify a Supabase-issued JWT.

    Supabase JWTs are signed with the SUPABASE_ANON_KEY (HS256) or
    with an asymmetric key.  For simplicity we verify using the
    anon key with audience/issuer checks disabled so it works for
    both service-role and anon tokens.
    """
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_ANON_KEY,
            algorithms=["HS256"],
            options={
                "verify_aud": False,
                "verify_iss": False,
                # Allow a small clock skew
                "leeway": 30,
            },
        )
        return payload
    except JWTError as exc:
        logger.warning("JWT verification failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_current_user(request: Request) -> dict:
    """FastAPI dependency that returns the current authenticated user.

    In demo mode (or when no token is provided and demo mode is on)
    a fixed demo user is returned.  Otherwise the Supabase JWT is
    verified and the user info extracted.
    """
    token = _extract_token(request)

    # ------- Demo mode path -------
    if settings.is_demo_mode:
        if token is None:
            return {"id": DEMO_USER_ID, "email": DEMO_USER_EMAIL, "demo": True}
        # Even in demo mode, if a token is provided, try to decode it
        # so the user gets real identity when running locally with Supabase.
        try:
            payload = _verify_supabase_jwt(token)
            user_id = payload.get("sub", DEMO_USER_ID)
            email = payload.get("email", DEMO_USER_EMAIL)
            return {"id": user_id, "email": email, "demo": False}
        except HTTPException:
            # Fall back to demo user if token is invalid in demo mode
            return {"id": DEMO_USER_ID, "email": DEMO_USER_EMAIL, "demo": True}

    # ------- Live mode path -------
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = _verify_supabase_jwt(token)
    user_id = payload.get("sub")
    email = payload.get("email", "")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token does not contain a valid user ID",
        )

    return {"id": user_id, "email": email, "demo": False}
