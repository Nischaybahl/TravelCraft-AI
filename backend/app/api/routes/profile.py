"""Profile endpoints."""

from fastapi import APIRouter, Depends

from app.core.config import settings
from app.core.security import get_current_user, DEMO_USER_EMAIL, DEMO_USER_ID
from app.schemas.profile import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/api/profile", tags=["Profile"])

# In-memory profile store for demo mode
_demo_profiles: dict = {}


@router.get("", response_model=ProfileResponse)
async def get_profile(user: dict = Depends(get_current_user)):
    """Get current user's profile."""
    user_id = user["id"]

    if settings.has_supabase and not settings.is_demo_mode:
        try:
            from app.database.supabase_client import get_supabase_client
            sb = get_supabase_client()
            if sb:
                result = sb.table("profiles").select("*").eq("id", user_id).single().execute()
                if result.data:
                    return ProfileResponse(**result.data)
        except Exception:
            pass

    # Demo mode
    profile = _demo_profiles.get(user_id, {
        "id": user_id,
        "email": user.get("email", DEMO_USER_EMAIL),
        "full_name": "Demo User",
        "avatar_url": "",
        "preferred_currency": "USD",
        "preferred_language": "en",
        "travel_style": "moderate",
        "dietary_preferences": [],
    })
    return ProfileResponse(**profile)


@router.put("", response_model=ProfileResponse)
async def update_profile(
    body: ProfileUpdate,
    user: dict = Depends(get_current_user),
):
    """Update current user's profile."""
    user_id = user["id"]
    update_data = body.model_dump(exclude_none=True)

    if settings.has_supabase and not settings.is_demo_mode:
        try:
            from app.database.supabase_client import get_supabase_client
            sb = get_supabase_client()
            if sb:
                result = sb.table("profiles").update(update_data).eq("id", user_id).execute()
                if result.data:
                    return ProfileResponse(**result.data[0])
        except Exception:
            pass

    # Demo mode
    profile = _demo_profiles.get(user_id, {
        "id": user_id,
        "email": user.get("email", DEMO_USER_EMAIL),
        "full_name": "Demo User",
        "avatar_url": "",
        "preferred_currency": "USD",
        "preferred_language": "en",
        "travel_style": "moderate",
        "dietary_preferences": [],
    })
    profile.update(update_data)
    _demo_profiles[user_id] = profile
    return ProfileResponse(**profile)
