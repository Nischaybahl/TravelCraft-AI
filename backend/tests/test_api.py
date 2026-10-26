"""API integration tests using FastAPI TestClient."""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "mode" in data
    assert "version" in data


def test_root_redirects():
    response = client.get("/", follow_redirects=False)
    assert response.status_code in (301, 302, 307, 308)


def test_generate_itinerary_demo():
    payload = {
        "preferences": {
            "destination": "Paris",
            "country": "France",
            "start_date": "2025-06-01",
            "end_date": "2025-06-03",
            "budget": 1500.0,
            "num_travelers": 2,
            "travel_group": "couple",
            "travel_style": "moderate",
            "travel_pace": "balanced",
            "interests": ["culture", "food"],
        }
    }
    response = client.post("/api/itineraries/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "days" in data
    assert len(data["days"]) == 3
    assert data["destination"] == "Paris"
    # Each day should have activities
    for day in data["days"]:
        assert "activities" in day
        assert len(day["activities"]) > 0


def test_generate_itinerary_validation_error():
    payload = {
        "preferences": {
            "destination": "Paris",
            "start_date": "2025-06-10",
            "end_date": "2025-06-01",
            "budget": 1000.0,
        }
    }
    response = client.post("/api/itineraries/generate", json=payload)
    assert response.status_code == 422


def test_recommend_destinations_demo():
    payload = {
        "travel_dates": "June 2025",
        "budget": 2000.0,
        "travel_vibe": "cultural",
        "group_size": 2,
        "interests": ["history", "food"],
        "duration": "1 week",
        "travel_style": "moderate",
    }
    response = client.post("/api/destinations/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "destinations" in data
    assert len(data["destinations"]) == 3
    for dest in data["destinations"]:
        assert "name" in dest
        assert "country" in dest


def test_regenerate_day_demo():
    payload = {
        "preferences": {
            "destination": "Tokyo",
            "country": "Japan",
            "start_date": "2025-07-01",
            "end_date": "2025-07-05",
            "budget": 3000.0,
            "interests": ["food", "culture"],
        },
        "day_number": 2,
        "instructions": "More food activities",
    }
    response = client.post("/api/itineraries/regenerate-day", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["day_number"] == 2
    assert "activities" in data


def test_trips_crud_demo():
    # Create a trip
    create_payload = {
        "trip": {
            "title": "Test Trip to Paris",
            "destination": "Paris",
            "country": "France",
            "start_date": "2025-06-01",
            "end_date": "2025-06-03",
            "duration_days": 3,
            "budget": 1500.0,
        },
        "itinerary_days": []
    }
    response = client.post("/api/trips", json=create_payload)
    assert response.status_code == 201
    trip = response.json()
    trip_id = trip["id"]
    assert trip["destination"] == "Paris"

    # List trips
    response = client.get("/api/trips")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1

    # Get trip
    response = client.get(f"/api/trips/{trip_id}")
    assert response.status_code == 200
    assert response.json()["id"] == trip_id

    # Update trip
    response = client.put(f"/api/trips/{trip_id}", json={"title": "Updated Trip"})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Trip"

    # Delete trip
    response = client.delete(f"/api/trips/{trip_id}")
    assert response.status_code == 204

    # Verify deleted
    response = client.get(f"/api/trips/{trip_id}")
    assert response.status_code == 404


def test_profile_demo():
    response = client.get("/api/profile")
    assert response.status_code == 200
    data = response.json()
    assert "email" in data

    # Update profile
    response = client.put("/api/profile", json={"full_name": "Test User"})
    assert response.status_code == 200
    assert response.json()["full_name"] == "Test User"


def test_export_pdf():
    payload = {
        "trip": {
            "destination": "Paris",
            "country": "France",
            "title": "Trip to Paris",
            "start_date": "2025-06-01",
            "end_date": "2025-06-03",
            "budget": 1500,
            "currency": "USD",
            "num_travelers": 2,
            "travel_style": "moderate",
            "travel_pace": "balanced",
            "travel_group": "couple",
            "interests": ["culture"],
        },
        "itinerary_days": [
            {
                "day_number": 1,
                "date": "2025-06-01",
                "theme": "Day 1",
                "summary": "Explore Paris",
                "activities": [
                    {"name": "Eiffel Tower", "approximate_cost": 26.0, "suggested_time": "09:00"},
                ],
                "estimated_cost": 100.0,
                "food_cost": 30.0,
                "transport_cost": 15.0,
                "activity_cost": 55.0,
            }
        ],
    }
    response = client.post("/api/itineraries/export-pdf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert len(response.content) > 100
