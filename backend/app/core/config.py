"""
TravelCraft AI - Application Configuration

Loads settings from environment variables with sensible defaults
so the app can start in demo mode without any env vars set.
"""

from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ---------- API Keys ----------
    GEMINI_API_KEY: str = ""

    # ---------- Supabase ----------
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # ---------- CORS ----------
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173"

    # ---------- Demo Mode ----------
    DEMO_MODE: bool = True

    # ---------- App Metadata ----------
    APP_NAME: str = "TravelCraft AI API"
    APP_VERSION: str = "1.0.0"

    # ---------- Computed helpers ----------
    @property
    def cors_origins_list(self) -> list[str]:
        """Return CORS origins as a list of strings."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_demo_mode(self) -> bool:
        """Determine if the app should run in demo mode.

        Demo mode is active when DEMO_MODE is True **or** when
        critical keys are missing.
        """
        if self.DEMO_MODE:
            return True
        if not self.GEMINI_API_KEY:
            return True
        return False

    @property
    def has_supabase(self) -> bool:
        """Return True when Supabase credentials are available."""
        return bool(self.SUPABASE_URL and self.SUPABASE_ANON_KEY)


# Singleton settings instance
settings = Settings()
