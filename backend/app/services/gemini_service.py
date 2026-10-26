"""
TravelCraft AI - Gemini AI Integration Service

Full integration with the Google Gemini API (gemini-2.0-flash) for
generating travel itineraries, destination recommendations, and
single-day regeneration.

Includes structured prompts, JSON response parsing, retry logic,
timeout handling, and automatic fallback to demo data.
"""

from __future__ import annotations

import json
import logging
import re
from datetime import timedelta
from typing import List, Optional

import google.generativeai as genai

from app.core.config import settings
from app.schemas.itinerary import Activity, ItineraryDay
from app.schemas.recommendation import Destination
from app.schemas.trip import TripPreferences

logger = logging.getLogger(__name__)

MAX_RETRIES = 3
REQUEST_TIMEOUT = 30  # seconds


def _configure_genai() -> None:
    """Configure the google-generativeai library with the API key."""
    genai.configure(api_key=settings.GEMINI_API_KEY)


def _get_model() -> genai.GenerativeModel:
    """Return a configured GenerativeModel instance."""
    _configure_genai()
    return genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            temperature=0.7,
            max_output_tokens=8192,
        ),
    )


def _extract_json(text: str) -> str:
    """Extract JSON from a text response that may contain markdown fences."""
    # Try to find JSON array or object
    text = text.strip()
    # Remove markdown code fences if present
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*\n?", "", text)
        text = re.sub(r"\n?```\s*$", "", text)
    return text.strip()


def _parse_json_safe(raw: str) -> any:
    """Parse JSON, attempting repair if needed."""
    cleaned = _extract_json(raw)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try to find the first [ or { and last ] or }
        start_arr = cleaned.find("[")
        start_obj = cleaned.find("{")
        if start_arr == -1 and start_obj == -1:
            raise
        if start_arr != -1 and (start_obj == -1 or start_arr < start_obj):
            end = cleaned.rfind("]")
            if end != -1:
                return json.loads(cleaned[start_arr : end + 1])
        if start_obj != -1:
            end = cleaned.rfind("}")
            if end != -1:
                return json.loads(cleaned[start_obj : end + 1])
        raise


class GeminiService:
    """Service wrapping Google Gemini generative AI for travel planning."""

    # ------------------------------------------------------------------
    # Itinerary Generation
    # ------------------------------------------------------------------
    def generate_itinerary(self, preferences: TripPreferences) -> List[ItineraryDay]:
        """Generate a complete day-by-day itinerary using Gemini AI.

        Retries up to MAX_RETRIES times and falls back to demo data on failure.
        """
        prompt = self._build_itinerary_prompt(preferences)
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                logger.info(
                    "Gemini itinerary generation attempt %d/%d for %s",
                    attempt,
                    MAX_RETRIES,
                    preferences.destination,
                )
                model = _get_model()
                response = model.generate_content(
                    prompt,
                    request_options={"timeout": REQUEST_TIMEOUT},
                )
                raw_text = response.text
                data = _parse_json_safe(raw_text)

                # Gemini might return {"days": [...]} or a plain list
                if isinstance(data, dict):
                    days_data = data.get("days", data.get("itinerary", []))
                elif isinstance(data, list):
                    days_data = data
                else:
                    raise ValueError(f"Unexpected response type: {type(data)}")

                days: List[ItineraryDay] = []
                for i, day_raw in enumerate(days_data, start=1):
                    day_raw.setdefault("day_number", i)
                    # Normalise activities
                    activities_raw = day_raw.get("activities", [])
                    parsed_activities = []
                    for j, act in enumerate(activities_raw):
                        act.setdefault("sort_order", j)
                        parsed_activities.append(Activity(**act))
                    day_raw["activities"] = parsed_activities
                    days.append(ItineraryDay(**day_raw))

                if not days:
                    raise ValueError("Gemini returned an empty itinerary")

                # Fill in dates
                for idx, day in enumerate(days):
                    if not day.date:
                        day.date = (
                            preferences.start_date + timedelta(days=idx)
                        ).isoformat()

                logger.info(
                    "Successfully generated %d-day itinerary for %s",
                    len(days),
                    preferences.destination,
                )
                return days

            except Exception as exc:
                logger.warning(
                    "Gemini attempt %d failed: %s",
                    attempt,
                    exc,
                )
                if attempt == MAX_RETRIES:
                    logger.error(
                        "All %d Gemini attempts failed, falling back to demo data",
                        MAX_RETRIES,
                    )
                    from app.services.demo_service import demo_generate_itinerary

                    return demo_generate_itinerary(preferences)

        # Should not reach here, but just in case
        from app.services.demo_service import demo_generate_itinerary

        return demo_generate_itinerary(preferences)

    # ------------------------------------------------------------------
    # Destination Recommendations
    # ------------------------------------------------------------------
    def recommend_destinations(self, request) -> List[Destination]:
        """Generate destination recommendations using Gemini AI."""
        prompt = self._build_recommendation_prompt(request)
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                logger.info("Gemini recommendation attempt %d/%d", attempt, MAX_RETRIES)
                model = _get_model()
                response = model.generate_content(
                    prompt,
                    request_options={"timeout": REQUEST_TIMEOUT},
                )
                raw_text = response.text
                data = _parse_json_safe(raw_text)

                if isinstance(data, dict):
                    dests_data = data.get("destinations", data.get("recommendations", []))
                elif isinstance(data, list):
                    dests_data = data
                else:
                    raise ValueError(f"Unexpected response type: {type(data)}")

                destinations = [Destination(**d) for d in dests_data[:3]]
                if not destinations:
                    raise ValueError("Gemini returned no destinations")

                logger.info("Successfully generated %d recommendations", len(destinations))
                return destinations

            except Exception as exc:
                logger.warning("Gemini recommendation attempt %d failed: %s", attempt, exc)
                if attempt == MAX_RETRIES:
                    from app.services.demo_service import demo_recommend_destinations

                    return demo_recommend_destinations(request)

        from app.services.demo_service import demo_recommend_destinations

        return demo_recommend_destinations(request)

    # ------------------------------------------------------------------
    # Single Day Regeneration
    # ------------------------------------------------------------------
    def regenerate_day(
        self,
        preferences: TripPreferences,
        day_number: int,
        existing_days_summary: str = "",
        instructions: str = "",
    ) -> ItineraryDay:
        """Regenerate a single day of the itinerary."""
        prompt = self._build_regenerate_day_prompt(
            preferences, day_number, existing_days_summary, instructions
        )
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                logger.info(
                    "Gemini day-%d regeneration attempt %d/%d",
                    day_number,
                    attempt,
                    MAX_RETRIES,
                )
                model = _get_model()
                response = model.generate_content(
                    prompt,
                    request_options={"timeout": REQUEST_TIMEOUT},
                )
                raw_text = response.text
                data = _parse_json_safe(raw_text)

                # Could be a single day dict or wrapped in a key
                if isinstance(data, dict):
                    if "day" in data:
                        day_raw = data["day"]
                    elif "activities" in data:
                        day_raw = data
                    else:
                        # Take first key that looks like day data
                        day_raw = data
                elif isinstance(data, list) and data:
                    day_raw = data[0]
                else:
                    raise ValueError("Unexpected regeneration response format")

                day_raw.setdefault("day_number", day_number)
                activities_raw = day_raw.get("activities", [])
                parsed_activities = []
                for j, act in enumerate(activities_raw):
                    act.setdefault("sort_order", j)
                    parsed_activities.append(Activity(**act))
                day_raw["activities"] = parsed_activities

                day = ItineraryDay(**day_raw)
                if not day.date:
                    day.date = (
                        preferences.start_date + timedelta(days=day_number - 1)
                    ).isoformat()

                logger.info("Successfully regenerated day %d", day_number)
                return day

            except Exception as exc:
                logger.warning(
                    "Gemini day regeneration attempt %d failed: %s",
                    attempt,
                    exc,
                )
                if attempt == MAX_RETRIES:
                    from app.services.demo_service import demo_regenerate_day

                    return demo_regenerate_day(preferences, day_number)

        from app.services.demo_service import demo_regenerate_day

        return demo_regenerate_day(preferences, day_number)

    # ==================================================================
    # PROMPT ENGINEERING
    # ==================================================================

    def _build_itinerary_prompt(self, p: TripPreferences) -> str:
        duration = p.duration_days
        daily_budget = round(p.budget / max(duration, 1), 2)
        interests_str = ", ".join(p.interests) if p.interests else "general sightseeing"
        dietary_str = ", ".join(p.dietary_preferences) if p.dietary_preferences else "none"

        return f"""You are an expert travel planner. Generate a detailed {duration}-day travel itinerary for {p.destination}, {p.country}.

## Trip Details
- **Destination**: {p.destination}, {p.country}
- **Dates**: {p.start_date.isoformat()} to {p.end_date.isoformat()} ({duration} days)
- **Total Budget**: {p.budget} {p.currency} (approx. {daily_budget} {p.currency}/day)
- **Number of Travelers**: {p.num_travelers}
- **Travel Group**: {p.travel_group}
- **Travel Style**: {p.travel_style}
- **Travel Pace**: {p.travel_pace}
- **Interests**: {interests_str}
- **Accommodation Preference**: {p.accommodation_preference}
- **Dietary Preferences**: {dietary_str}
- **Additional Notes**: {p.additional_notes or "None"}

## Requirements
1. Generate exactly {duration} days.
2. For pace "{p.travel_pace}":
   - "relaxed": 4-5 activities per day with generous breaks
   - "balanced": 6-7 activities per day
   - "fast": 8-9 activities per day for maximum sightseeing
3. Group activities geographically — activities in the same area/neighbourhood should be scheduled together to minimise transit time.
4. Include realistic time scheduling (suggested_time like "09:00 - 10:30").
5. Include proper meal breaks: breakfast (07:30-09:00), lunch (12:00-13:30), dinner (18:30-20:00). Mark meals with is_meal=true.
6. Provide approximate costs in {p.currency} for every activity. Costs must be realistic for the destination and travel style.
7. Include transport suggestions between activities.
8. Each day should have a theme (e.g. "Historic Old Town", "Nature & Adventure").
9. Provide accommodation suggestions matching "{p.accommodation_preference}" style.
10. Add helpful travel tips for each day.
11. Activity categories: sightseeing, food, adventure, culture, shopping, transport, relaxation.
12. Respect dietary preferences: {dietary_str}.

## Output Format
Return ONLY a valid JSON array of day objects. No explanatory text.

```json
[
  {{
    "day_number": 1,
    "date": "{p.start_date.isoformat()}",
    "theme": "Day theme",
    "summary": "Brief overview of the day",
    "activities": [
      {{
        "name": "Activity Name",
        "description": "What this activity involves",
        "time_slot": "morning",
        "suggested_time": "09:00 - 10:30",
        "estimated_duration": "1.5 hours",
        "location": "Specific Place Name",
        "area": "Neighbourhood/District",
        "category": "sightseeing",
        "approximate_cost": 15.00,
        "transport_suggestion": "Walk from hotel (10 min)",
        "sort_order": 0,
        "is_meal": false,
        "is_custom": false,
        "notes": "Optional tips"
      }}
    ],
    "accommodation_suggestion": "Hotel suggestion for the night",
    "transport_notes": "General transport advice for the day",
    "travel_tips": "Helpful tips for the day",
    "estimated_cost": 150.00,
    "food_cost": 45.00,
    "transport_cost": 20.00,
    "activity_cost": 85.00
  }}
]
```

Generate the complete itinerary now."""

    def _build_recommendation_prompt(self, r) -> str:
        interests_str = ", ".join(r.interests) if r.interests else "general exploration"

        return f"""You are an expert travel advisor. Recommend exactly 3 travel destinations based on the following preferences.

## User Preferences
- **Travel Dates**: {r.travel_dates or "Flexible"}
- **Budget**: {r.budget} {r.currency}
- **Travel Vibe**: {r.travel_vibe or "open to anything"}
- **Group Size**: {r.group_size}
- **Interests**: {interests_str}
- **Desired Duration**: {r.duration}
- **Travel Style**: {r.travel_style}

## Requirements
1. Recommend exactly 3 destinations that best match the preferences.
2. Each destination should be distinct (different countries or very different experiences).
3. Include practical budget estimates for the specified duration and group size.
4. Consider seasonal factors for the travel dates.
5. Suggest 4-6 key attractions per destination.
6. Provide honest seasonal considerations (weather, crowds, events).

## Output Format
Return ONLY valid JSON. No explanatory text.

```json
[
  {{
    "name": "City Name",
    "country": "Country",
    "description": "Why this destination is great (2-3 sentences)",
    "reason": "Key reason it matches the user's preferences",
    "suggested_attractions": ["Attraction 1", "Attraction 2", "Attraction 3", "Attraction 4"],
    "approximate_budget": 1500.00,
    "suggested_duration": "5-7 days",
    "seasonal_considerations": "Weather and crowd information"
  }}
]
```

Generate 3 recommendations now."""

    def _build_regenerate_day_prompt(
        self,
        p: TripPreferences,
        day_number: int,
        existing_summary: str,
        instructions: str,
    ) -> str:
        daily_budget = round(p.budget / max(p.duration_days, 1), 2)
        interests_str = ", ".join(p.interests) if p.interests else "general sightseeing"
        dietary_str = ", ".join(p.dietary_preferences) if p.dietary_preferences else "none"
        date_str = (p.start_date + timedelta(days=day_number - 1)).isoformat()

        context_block = ""
        if existing_summary:
            context_block = f"""
## Context (Other Days)
{existing_summary}
Please create a day that complements the above itinerary and avoids repeating activities."""

        instructions_block = ""
        if instructions:
            instructions_block = f"""
## Special Instructions
{instructions}"""

        pace_map = {"relaxed": "4-5", "balanced": "6-7", "fast": "8-9"}
        activity_count = pace_map.get(p.travel_pace, "6-7")

        return f"""You are an expert travel planner. Regenerate Day {day_number} of a {p.duration_days}-day trip to {p.destination}, {p.country}.

## Trip Details
- **Destination**: {p.destination}, {p.country}
- **Day**: {day_number} of {p.duration_days} (Date: {date_str})
- **Daily Budget**: approx. {daily_budget} {p.currency}
- **Travelers**: {p.num_travelers} ({p.travel_group})
- **Style**: {p.travel_style} | **Pace**: {p.travel_pace} ({activity_count} activities)
- **Interests**: {interests_str}
- **Dietary**: {dietary_str}
{context_block}{instructions_block}

## Requirements
1. Generate exactly ONE day with {activity_count} activities.
2. Include breakfast, lunch, and dinner (is_meal=true).
3. Group activities geographically.
4. Use realistic times and costs.
5. Provide a unique theme for this day.

## Output Format
Return ONLY valid JSON for a single day object:

```json
{{
  "day_number": {day_number},
  "date": "{date_str}",
  "theme": "Day theme",
  "summary": "Brief overview",
  "activities": [ ... ],
  "accommodation_suggestion": "",
  "transport_notes": "",
  "travel_tips": "",
  "estimated_cost": 0,
  "food_cost": 0,
  "transport_cost": 0,
  "activity_cost": 0
}}
```

Generate the day now."""


# Module-level singleton
gemini_service = GeminiService()
