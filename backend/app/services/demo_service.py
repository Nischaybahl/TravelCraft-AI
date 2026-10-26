"""
TravelCraft AI - Demo Data Service

Provides rich, realistic demo data for when Gemini AI is unavailable.
All demo data is clearly labelled so users know it is sample content.
"""

from __future__ import annotations

import random
from datetime import timedelta
from typing import Dict, List

from app.schemas.itinerary import Activity, ItineraryDay
from app.schemas.recommendation import Destination
from app.schemas.trip import TripPreferences


# ======================================================================
# DEMO DESTINATION DATA
# ======================================================================

_DEMO_DESTINATIONS: Dict[str, List[List[Activity]]] = {}


def _paris_activities() -> List[List[Activity]]:
    """Return multi-day activities for Paris."""
    return [
        # Day 1 — Iconic Landmarks
        [
            Activity(name="Breakfast at Café de Flore (Demo)", description="Classic Parisian breakfast with croissants, café crème, and fresh orange juice at the iconic Left Bank café.", time_slot="morning", suggested_time="08:00 - 09:00", estimated_duration="1 hour", location="Café de Flore", area="Saint-Germain-des-Prés", category="food", approximate_cost=18.0, transport_suggestion="Walk from hotel", sort_order=0, is_meal=True, notes="Arrive early to avoid tourist crowds"),
            Activity(name="Eiffel Tower Visit (Demo)", description="Ascend the Iron Lady for breathtaking panoramic views of Paris. Take the stairs to the 2nd floor for the best experience.", time_slot="morning", suggested_time="09:30 - 12:00", estimated_duration="2.5 hours", location="Eiffel Tower", area="Champ de Mars", category="sightseeing", approximate_cost=26.0, transport_suggestion="Métro Line 6 to Bir-Hakeim (15 min)", sort_order=1, is_meal=False, notes="Book skip-the-line tickets in advance"),
            Activity(name="Lunch at Le Jules Verne (Demo)", description="Fine dining restaurant on the Eiffel Tower's second floor. Three-course French lunch with stunning views.", time_slot="afternoon", suggested_time="12:30 - 14:00", estimated_duration="1.5 hours", location="Le Jules Verne, Eiffel Tower", area="Champ de Mars", category="food", approximate_cost=85.0, transport_suggestion="Already at Eiffel Tower", sort_order=2, is_meal=True, notes="Reservations essential — book 2-3 weeks ahead"),
            Activity(name="Seine River Cruise (Demo)", description="Relaxing one-hour boat cruise along the Seine, passing Notre-Dame, Louvre, and Musée d'Orsay.", time_slot="afternoon", suggested_time="14:30 - 15:30", estimated_duration="1 hour", location="Bateaux Mouches", area="Pont de l'Alma", category="sightseeing", approximate_cost=16.0, transport_suggestion="Walk from Eiffel Tower (10 min)", sort_order=3, is_meal=False),
            Activity(name="Musée d'Orsay (Demo)", description="World-class collection of Impressionist masterpieces including Monet, Renoir, and Van Gogh in a stunning converted railway station.", time_slot="afternoon", suggested_time="16:00 - 18:00", estimated_duration="2 hours", location="Musée d'Orsay", area="Saint-Germain-des-Prés", category="culture", approximate_cost=16.0, transport_suggestion="Walk along the Seine (15 min)", sort_order=4, is_meal=False),
            Activity(name="Dinner at Le Bouillon Chartier (Demo)", description="Historic Parisian brasserie serving classic French cuisine at remarkably affordable prices. Try the duck confit.", time_slot="evening", suggested_time="19:00 - 20:30", estimated_duration="1.5 hours", location="Le Bouillon Chartier", area="Grands Boulevards", category="food", approximate_cost=25.0, transport_suggestion="Métro Line 12 to Notre-Dame-de-Lorette", sort_order=5, is_meal=True),
            Activity(name="Evening Stroll on Champs-Élysées (Demo)", description="Walk down the world's most famous avenue, illuminated at night, ending at the Arc de Triomphe.", time_slot="evening", suggested_time="21:00 - 22:00", estimated_duration="1 hour", location="Champs-Élysées", area="8th Arrondissement", category="sightseeing", approximate_cost=0.0, transport_suggestion="Métro Line 1 to George V", sort_order=6, is_meal=False),
        ],
        # Day 2 — Art & Culture
        [
            Activity(name="Breakfast at local boulangerie (Demo)", description="Fresh pastries and coffee at a neighbourhood bakery. Try a pain au chocolat.", time_slot="morning", suggested_time="08:00 - 08:45", estimated_duration="45 min", location="Du Pain et des Idées", area="Canal Saint-Martin", category="food", approximate_cost=10.0, transport_suggestion="Walk from hotel", sort_order=0, is_meal=True),
            Activity(name="Louvre Museum (Demo)", description="Home to the Mona Lisa, Venus de Milo, and 35,000 works of art. Focus on the highlights to avoid museum fatigue.", time_slot="morning", suggested_time="09:00 - 12:00", estimated_duration="3 hours", location="Musée du Louvre", area="1st Arrondissement", category="culture", approximate_cost=17.0, transport_suggestion="Métro Line 1 to Palais-Royal", sort_order=1, is_meal=False, notes="Enter via the Richelieu entrance to skip the pyramid queue"),
            Activity(name="Lunch at Angelina (Demo)", description="Elegant tea salon famous for its hot chocolate and Mont-Blanc pastry. Light French lunch.", time_slot="afternoon", suggested_time="12:30 - 13:45", estimated_duration="1.25 hours", location="Angelina Paris", area="Rue de Rivoli", category="food", approximate_cost=30.0, transport_suggestion="Walk from Louvre (5 min)", sort_order=2, is_meal=True),
            Activity(name="Tuileries Garden Walk (Demo)", description="Stroll through the manicured French formal gardens between the Louvre and Place de la Concorde.", time_slot="afternoon", suggested_time="14:00 - 14:45", estimated_duration="45 min", location="Jardin des Tuileries", area="1st Arrondissement", category="relaxation", approximate_cost=0.0, transport_suggestion="Walk from Angelina (2 min)", sort_order=3, is_meal=False),
            Activity(name="Montmartre & Sacré-Cœur (Demo)", description="Explore the bohemian hillside neighbourhood, visit the white-domed basilica, and watch street artists at Place du Tertre.", time_slot="afternoon", suggested_time="15:30 - 17:30", estimated_duration="2 hours", location="Sacré-Cœur Basilica", area="Montmartre", category="sightseeing", approximate_cost=0.0, transport_suggestion="Métro Line 12 to Abbesses + funicular", sort_order=4, is_meal=False),
            Activity(name="Dinner in Montmartre (Demo)", description="Cozy French bistro dinner in Montmartre. Try the steak-frites or coq au vin.", time_slot="evening", suggested_time="19:00 - 20:30", estimated_duration="1.5 hours", location="Le Consulat", area="Montmartre", category="food", approximate_cost=35.0, transport_suggestion="Walk (5 min)", sort_order=5, is_meal=True),
            Activity(name="Moulin Rouge Show (Demo)", description="World-famous cabaret show with dazzling costumes and choreography.", time_slot="night", suggested_time="21:00 - 23:00", estimated_duration="2 hours", location="Moulin Rouge", area="Pigalle", category="culture", approximate_cost=95.0, transport_suggestion="Walk from restaurant (10 min)", sort_order=6, is_meal=False, notes="Book tickets well in advance"),
        ],
        # Day 3 — Versailles & Shopping
        [
            Activity(name="Breakfast at hotel (Demo)", description="Quick hotel breakfast before the day trip.", time_slot="morning", suggested_time="07:30 - 08:15", estimated_duration="45 min", location="Hotel", area="Central Paris", category="food", approximate_cost=0.0, transport_suggestion="In-hotel", sort_order=0, is_meal=True),
            Activity(name="Palace of Versailles (Demo)", description="Explore the opulent palace, Hall of Mirrors, and magnificent formal gardens of Louis XIV.", time_slot="morning", suggested_time="09:30 - 13:00", estimated_duration="3.5 hours", location="Château de Versailles", area="Versailles", category="culture", approximate_cost=21.0, transport_suggestion="RER C train from central Paris (40 min)", sort_order=1, is_meal=False, notes="Buy the Passport ticket for full access"),
            Activity(name="Lunch in Versailles (Demo)", description="Lunch at a charming restaurant near the palace. Try the croque-monsieur.", time_slot="afternoon", suggested_time="13:00 - 14:15", estimated_duration="1.25 hours", location="La Flottille", area="Versailles Gardens", category="food", approximate_cost=22.0, transport_suggestion="Walk (5 min)", sort_order=2, is_meal=True),
            Activity(name="Versailles Gardens (Demo)", description="Explore the stunning formal gardens, Grand Trianon, and Marie Antoinette's Estate.", time_slot="afternoon", suggested_time="14:30 - 16:00", estimated_duration="1.5 hours", location="Gardens of Versailles", area="Versailles", category="sightseeing", approximate_cost=0.0, transport_suggestion="Walk", sort_order=3, is_meal=False),
            Activity(name="Le Marais Shopping (Demo)", description="Trendy neighbourhood with boutiques, vintage shops, and galleries. Great for unique souvenirs.", time_slot="afternoon", suggested_time="17:00 - 18:30", estimated_duration="1.5 hours", location="Le Marais", area="3rd & 4th Arrondissement", category="shopping", approximate_cost=50.0, transport_suggestion="RER C back to Paris, then Métro to Saint-Paul", sort_order=4, is_meal=False),
            Activity(name="Falafel at L'As du Fallafel (Demo)", description="Legendary falafel in the Jewish quarter of Le Marais. Always a queue — always worth it.", time_slot="evening", suggested_time="19:00 - 19:45", estimated_duration="45 min", location="L'As du Fallafel", area="Le Marais", category="food", approximate_cost=12.0, transport_suggestion="Walk (3 min)", sort_order=5, is_meal=True),
            Activity(name="Seine Nighttime Walk (Demo)", description="Evening walk along the illuminated Seine. Catch the Eiffel Tower sparkling on the hour.", time_slot="evening", suggested_time="20:30 - 21:30", estimated_duration="1 hour", location="Pont des Arts", area="Central Paris", category="relaxation", approximate_cost=0.0, transport_suggestion="Métro to Pont Neuf", sort_order=6, is_meal=False),
        ],
    ]


def _tokyo_activities() -> List[List[Activity]]:
    """Return multi-day activities for Tokyo."""
    return [
        # Day 1 — Traditional Tokyo
        [
            Activity(name="Breakfast at Tsukiji Outer Market (Demo)", description="Fresh sushi, tamagoyaki, and street food for breakfast at the famous market.", time_slot="morning", suggested_time="07:30 - 08:30", estimated_duration="1 hour", location="Tsukiji Outer Market", area="Tsukiji", category="food", approximate_cost=15.0, transport_suggestion="Subway to Tsukiji Station", sort_order=0, is_meal=True),
            Activity(name="Senso-ji Temple (Demo)", description="Tokyo's oldest temple with the iconic Kaminarimon gate and Nakamise shopping street.", time_slot="morning", suggested_time="09:00 - 10:30", estimated_duration="1.5 hours", location="Senso-ji", area="Asakusa", category="culture", approximate_cost=0.0, transport_suggestion="Subway to Asakusa (20 min)", sort_order=1, is_meal=False),
            Activity(name="Tokyo Skytree (Demo)", description="Observation deck at 350m offering panoramic views of the entire Tokyo metropolitan area.", time_slot="morning", suggested_time="11:00 - 12:00", estimated_duration="1 hour", location="Tokyo Skytree", area="Sumida", category="sightseeing", approximate_cost=22.0, transport_suggestion="Walk from Asakusa (15 min)", sort_order=2, is_meal=False),
            Activity(name="Ramen Lunch (Demo)", description="Authentic tonkotsu ramen at a local noodle shop. Use the ticket machine to order.", time_slot="afternoon", suggested_time="12:30 - 13:15", estimated_duration="45 min", location="Ichiran Ramen", area="Asakusa", category="food", approximate_cost=12.0, transport_suggestion="Walk (5 min)", sort_order=3, is_meal=True),
            Activity(name="Meiji Shrine (Demo)", description="Serene Shinto shrine set in a lush forest in the heart of Tokyo.", time_slot="afternoon", suggested_time="14:00 - 15:30", estimated_duration="1.5 hours", location="Meiji Jingu", area="Harajuku", category="culture", approximate_cost=0.0, transport_suggestion="JR Yamanote Line to Harajuku", sort_order=4, is_meal=False),
            Activity(name="Harajuku & Takeshita Street (Demo)", description="Vibrant youth culture district with quirky fashion shops, crêpes, and colourful street style.", time_slot="afternoon", suggested_time="15:45 - 17:00", estimated_duration="1.25 hours", location="Takeshita Street", area="Harajuku", category="shopping", approximate_cost=20.0, transport_suggestion="Walk from Meiji Shrine (5 min)", sort_order=5, is_meal=False),
            Activity(name="Dinner in Shibuya (Demo)", description="Yakiniku (Japanese BBQ) dinner near Shibuya Crossing. Grill premium wagyu at your table.", time_slot="evening", suggested_time="18:30 - 20:00", estimated_duration="1.5 hours", location="Gyukatsu Motomura", area="Shibuya", category="food", approximate_cost=35.0, transport_suggestion="Walk from Harajuku (15 min)", sort_order=6, is_meal=True),
            Activity(name="Shibuya Crossing at Night (Demo)", description="Experience the world's busiest pedestrian crossing illuminated by neon signs.", time_slot="evening", suggested_time="20:15 - 21:00", estimated_duration="45 min", location="Shibuya Crossing", area="Shibuya", category="sightseeing", approximate_cost=0.0, transport_suggestion="Walk (2 min)", sort_order=7, is_meal=False),
        ],
        # Day 2 — Modern Tokyo
        [
            Activity(name="Convenience Store Breakfast (Demo)", description="Try the surprisingly excellent onigiri, sandwiches and coffee from a Japanese konbini.", time_slot="morning", suggested_time="08:00 - 08:30", estimated_duration="30 min", location="7-Eleven or Lawson", area="Hotel area", category="food", approximate_cost=6.0, transport_suggestion="Walk", sort_order=0, is_meal=True),
            Activity(name="TeamLab Borderless (Demo)", description="Immersive digital art museum with interactive installations that respond to your movement.", time_slot="morning", suggested_time="09:00 - 11:00", estimated_duration="2 hours", location="TeamLab Borderless", area="Azabudai Hills", category="culture", approximate_cost=30.0, transport_suggestion="Subway to Kamiyacho", sort_order=1, is_meal=False, notes="Book tickets online in advance — sells out quickly"),
            Activity(name="Lunch in Roppongi (Demo)", description="Japanese curry rice at CoCo Ichibanya — customise your spice level and toppings.", time_slot="afternoon", suggested_time="11:30 - 12:15", estimated_duration="45 min", location="CoCo Ichibanya", area="Roppongi", category="food", approximate_cost=10.0, transport_suggestion="Subway (10 min)", sort_order=2, is_meal=True),
            Activity(name="Akihabara Electric Town (Demo)", description="Anime, manga, electronics, and gaming paradise. Visit multi-floor arcades and figure shops.", time_slot="afternoon", suggested_time="13:00 - 15:00", estimated_duration="2 hours", location="Akihabara", area="Akihabara", category="shopping", approximate_cost=25.0, transport_suggestion="JR Yamanote Line (20 min)", sort_order=3, is_meal=False),
            Activity(name="Imperial Palace Gardens (Demo)", description="Tranquil gardens surrounding the Emperor's residence with beautiful seasonal foliage.", time_slot="afternoon", suggested_time="15:30 - 16:45", estimated_duration="1.25 hours", location="Imperial Palace East Gardens", area="Chiyoda", category="sightseeing", approximate_cost=0.0, transport_suggestion="JR to Tokyo Station, walk 10 min", sort_order=4, is_meal=False),
            Activity(name="Sushi Dinner at Ginza (Demo)", description="Omakase sushi experience at a high-quality Ginza sushi counter.", time_slot="evening", suggested_time="18:00 - 19:30", estimated_duration="1.5 hours", location="Sushi Saito (or similar)", area="Ginza", category="food", approximate_cost=60.0, transport_suggestion="Walk from Imperial Palace (15 min)", sort_order=5, is_meal=True),
            Activity(name="Shinjuku Golden Gai (Demo)", description="Explore the atmospheric alleyways of tiny bars, each seating 6-10 people.", time_slot="night", suggested_time="20:30 - 22:00", estimated_duration="1.5 hours", location="Golden Gai", area="Shinjuku", category="culture", approximate_cost=20.0, transport_suggestion="JR to Shinjuku (15 min)", sort_order=6, is_meal=False),
        ],
        # Day 3 — Day Trip & Relaxation
        [
            Activity(name="Hotel Breakfast (Demo)", description="Japanese-style hotel breakfast with miso soup, grilled fish, rice, and pickles.", time_slot="morning", suggested_time="07:00 - 07:45", estimated_duration="45 min", location="Hotel", area="Central Tokyo", category="food", approximate_cost=0.0, transport_suggestion="In-hotel", sort_order=0, is_meal=True),
            Activity(name="Day Trip to Kamakura (Demo)", description="Visit the coastal town famous for the Great Buddha and seaside temples.", time_slot="morning", suggested_time="08:30 - 12:00", estimated_duration="3.5 hours", location="Kamakura", area="Kamakura", category="culture", approximate_cost=10.0, transport_suggestion="JR Yokosuka Line from Tokyo (1 hour)", sort_order=1, is_meal=False),
            Activity(name="Lunch in Kamakura (Demo)", description="Fresh shirasu (whitebait) don at a local restaurant near the beach.", time_slot="afternoon", suggested_time="12:00 - 13:00", estimated_duration="1 hour", location="Kamakura seaside restaurant", area="Kamakura", category="food", approximate_cost=14.0, transport_suggestion="Walk (5 min)", sort_order=2, is_meal=True),
            Activity(name="Hokoku-ji Bamboo Temple (Demo)", description="Serene Zen temple with a stunning bamboo grove. Enjoy matcha tea in the garden.", time_slot="afternoon", suggested_time="13:30 - 14:45", estimated_duration="1.25 hours", location="Hokoku-ji", area="Kamakura", category="culture", approximate_cost=5.0, transport_suggestion="Bus from Kamakura Station", sort_order=3, is_meal=False),
            Activity(name="Return to Tokyo & Onsen (Demo)", description="Relax at a traditional Japanese bath house after a full day of exploration.", time_slot="afternoon", suggested_time="16:00 - 17:30", estimated_duration="1.5 hours", location="Thermae Yu", area="Shinjuku", category="relaxation", approximate_cost=18.0, transport_suggestion="JR back to Shinjuku (1 hour)", sort_order=4, is_meal=False),
            Activity(name="Izakaya Dinner (Demo)", description="Traditional Japanese pub dining with small plates, yakitori, and draft beer.", time_slot="evening", suggested_time="18:30 - 20:00", estimated_duration="1.5 hours", location="Torikizoku", area="Shinjuku", category="food", approximate_cost=25.0, transport_suggestion="Walk (5 min)", sort_order=5, is_meal=True),
            Activity(name="Robot Restaurant Show (Demo)", description="Over-the-top neon-lit robot performance show — quintessentially Tokyo.", time_slot="night", suggested_time="20:30 - 22:00", estimated_duration="1.5 hours", location="Robot Restaurant", area="Shinjuku", category="culture", approximate_cost=55.0, transport_suggestion="Walk (5 min)", sort_order=6, is_meal=False),
        ],
    ]


def _generic_activities(destination: str) -> List[List[Activity]]:
    """Generate a generic but reasonable day of activities for any destination."""
    return [
        [
            Activity(name=f"Breakfast at local café in {destination} (Demo)", description=f"Start your day with a traditional local breakfast in {destination}.", time_slot="morning", suggested_time="08:00 - 09:00", estimated_duration="1 hour", location=f"Local café, {destination}", area="City Centre", category="food", approximate_cost=12.0, transport_suggestion="Walk from hotel", sort_order=0, is_meal=True),
            Activity(name=f"City Walking Tour of {destination} (Demo)", description=f"Guided walking tour through the historic centre and main landmarks of {destination}.", time_slot="morning", suggested_time="09:30 - 12:00", estimated_duration="2.5 hours", location=f"{destination} Old Town", area="Historic Centre", category="sightseeing", approximate_cost=20.0, transport_suggestion="Walk from café", sort_order=1, is_meal=False),
            Activity(name=f"Lunch at popular local restaurant (Demo)", description=f"Try the local cuisine at a well-reviewed restaurant in {destination}.", time_slot="afternoon", suggested_time="12:30 - 13:45", estimated_duration="1.25 hours", location=f"Local restaurant, {destination}", area="City Centre", category="food", approximate_cost=18.0, transport_suggestion="Walk (5 min)", sort_order=2, is_meal=True),
            Activity(name=f"Museum or Cultural Site (Demo)", description=f"Visit the most popular museum or cultural attraction in {destination}.", time_slot="afternoon", suggested_time="14:15 - 16:15", estimated_duration="2 hours", location=f"Main Museum, {destination}", area="Cultural District", category="culture", approximate_cost=15.0, transport_suggestion="Public transport (15 min)", sort_order=3, is_meal=False),
            Activity(name=f"Local Market & Shopping (Demo)", description=f"Explore the local market for souvenirs, crafts, and street food in {destination}.", time_slot="afternoon", suggested_time="16:30 - 18:00", estimated_duration="1.5 hours", location=f"Central Market, {destination}", area="Market District", category="shopping", approximate_cost=25.0, transport_suggestion="Walk (10 min)", sort_order=4, is_meal=False),
            Activity(name=f"Dinner at recommended restaurant (Demo)", description=f"Evening dining at a top-rated restaurant in {destination}. Local specialities recommended.", time_slot="evening", suggested_time="19:00 - 20:30", estimated_duration="1.5 hours", location=f"Fine dining, {destination}", area="Dining Quarter", category="food", approximate_cost=35.0, transport_suggestion="Taxi (10 min)", sort_order=5, is_meal=True),
            Activity(name=f"Evening exploration (Demo)", description=f"Enjoy the nightlife or a peaceful evening walk through {destination}'s illuminated streets.", time_slot="evening", suggested_time="21:00 - 22:00", estimated_duration="1 hour", location=f"Night district, {destination}", area="Entertainment District", category="relaxation", approximate_cost=10.0, transport_suggestion="Walk", sort_order=6, is_meal=False),
        ],
    ]


def _get_destination_activities(destination: str) -> List[List[Activity]]:
    """Return curated activities if available, else generic ones."""
    dest_lower = destination.lower().strip()
    if "paris" in dest_lower:
        return _paris_activities()
    if "tokyo" in dest_lower:
        return _tokyo_activities()
    # Fallback to generic
    return _generic_activities(destination)


# ======================================================================
# PUBLIC FUNCTIONS
# ======================================================================


def demo_generate_itinerary(preferences: TripPreferences) -> List[ItineraryDay]:
    """Generate a realistic sample itinerary for demo mode."""
    duration = preferences.duration_days
    all_day_activities = _get_destination_activities(preferences.destination)

    days: List[ItineraryDay] = []
    daily_budget = round(preferences.budget / max(duration, 1), 2)

    for i in range(duration):
        day_num = i + 1
        date_str = (preferences.start_date + timedelta(days=i)).isoformat()

        # Cycle through available template days
        template_index = i % len(all_day_activities)
        activities = all_day_activities[template_index]

        # Compute costs
        food_cost = round(sum(a.approximate_cost for a in activities if a.is_meal), 2)
        activity_cost = round(sum(a.approximate_cost for a in activities if not a.is_meal), 2)
        transport_cost = round(daily_budget * 0.1, 2)
        estimated_cost = round(food_cost + activity_cost + transport_cost, 2)

        themes = [
            "Historic Highlights",
            "Art & Culture Discovery",
            "Local Life & Markets",
            "Nature & Relaxation",
            "Culinary Adventure",
            "Off-the-Beaten-Path",
            "Shopping & Entertainment",
        ]

        day = ItineraryDay(
            day_number=day_num,
            date=date_str,
            theme=f"{themes[i % len(themes)]} (Demo)",
            summary=f"Day {day_num} exploring {preferences.destination} with a focus on {themes[i % len(themes)].lower()}.",
            activities=activities,
            accommodation_suggestion=f"Stay at a comfortable {preferences.accommodation_preference} in central {preferences.destination}",
            transport_notes="Use public transport day pass for best value. Taxis available for longer distances.",
            travel_tips=f"This is demo data. In live mode, AI generates a personalised itinerary for {preferences.destination}.",
            estimated_cost=estimated_cost,
            food_cost=food_cost,
            transport_cost=transport_cost,
            activity_cost=activity_cost,
        )
        days.append(day)

    return days


def demo_recommend_destinations(request) -> List[Destination]:
    """Return 3 curated destination recommendations for demo mode."""
    # Build a pool of destinations and pick 3 that roughly match interests
    all_destinations = [
        Destination(
            name="Paris",
            country="France",
            description="The City of Light dazzles with iconic landmarks, world-class art, and unmatched culinary experiences. From the Eiffel Tower to charming Left Bank cafés, Paris is the epitome of romance and culture.",
            reason="Perfect blend of culture, food, and iconic sightseeing",
            suggested_attractions=["Eiffel Tower", "Louvre Museum", "Montmartre", "Seine River Cruise", "Versailles Palace"],
            approximate_budget=2500.0,
            suggested_duration="5-7 days",
            seasonal_considerations="Spring (April-June) and autumn (Sept-Oct) offer mild weather and fewer crowds. Summer is peak season.",
        ),
        Destination(
            name="Tokyo",
            country="Japan",
            description="A mesmerising blend of ultramodern technology and ancient tradition. Tokyo offers unparalleled food, stunning temples, vibrant pop culture, and impeccable hospitality.",
            reason="Unique cultural immersion with incredible food and technology",
            suggested_attractions=["Senso-ji Temple", "Shibuya Crossing", "Meiji Shrine", "Tsukiji Market", "Akihabara"],
            approximate_budget=3000.0,
            suggested_duration="5-7 days",
            seasonal_considerations="Cherry blossom season (late March-April) is magical but crowded. Autumn foliage (Nov) is equally stunning.",
        ),
        Destination(
            name="Bali",
            country="Indonesia",
            description="Tropical paradise with stunning rice terraces, ancient temples, world-class surfing, and a thriving wellness scene. Perfect for relaxation and adventure alike.",
            reason="Ideal for relaxation, nature, and spiritual experiences at great value",
            suggested_attractions=["Ubud Rice Terraces", "Tanah Lot Temple", "Seminyak Beach", "Mount Batur Sunrise Trek", "Uluwatu Temple"],
            approximate_budget=1500.0,
            suggested_duration="7-10 days",
            seasonal_considerations="Dry season (April-October) is best. Rainy season (Nov-March) brings afternoon showers but lush scenery.",
        ),
        Destination(
            name="Rome",
            country="Italy",
            description="The Eternal City where ancient ruins meet vibrant modern life. Walk through millennia of history, savour authentic Italian cuisine, and soak in la dolce vita.",
            reason="Unrivalled historical depth combined with incredible Italian cuisine",
            suggested_attractions=["Colosseum", "Vatican Museums", "Trevi Fountain", "Roman Forum", "Trastevere neighbourhood"],
            approximate_budget=2200.0,
            suggested_duration="4-6 days",
            seasonal_considerations="Spring and autumn are ideal. Summer (July-August) is very hot and crowded. Winter is mild and cheap.",
        ),
        Destination(
            name="New York City",
            country="United States",
            description="The city that never sleeps offers Broadway shows, world-famous museums, diverse cuisines, and iconic skyline views. Every neighbourhood tells a different story.",
            reason="Endless entertainment, cultural diversity, and iconic experiences",
            suggested_attractions=["Central Park", "Metropolitan Museum of Art", "Times Square", "Brooklyn Bridge", "Statue of Liberty"],
            approximate_budget=3500.0,
            suggested_duration="5-7 days",
            seasonal_considerations="Fall (Sept-Nov) has perfect weather. Summer is hot and busy. Winter is cold but festive.",
        ),
        Destination(
            name="Cape Town",
            country="South Africa",
            description="Stunning natural beauty with Table Mountain, pristine beaches, world-class wine regions, and rich cultural heritage. Outstanding value for luxury experiences.",
            reason="Spectacular scenery, adventure activities, and excellent wine",
            suggested_attractions=["Table Mountain", "Cape of Good Hope", "Kirstenbosch Gardens", "V&A Waterfront", "Stellenbosch Wine Route"],
            approximate_budget=1800.0,
            suggested_duration="5-7 days",
            seasonal_considerations="November-March (Southern Hemisphere summer) offers warm weather and long days. June-August can be rainy.",
        ),
    ]

    # Simple interest-based scoring
    interests_lower = [i.lower() for i in getattr(request, "interests", [])]
    vibe = getattr(request, "travel_vibe", "").lower()

    scored = []
    for dest in all_destinations:
        score = 0
        desc_lower = (dest.description + dest.reason).lower()
        for interest in interests_lower:
            if interest in desc_lower:
                score += 2
        if vibe and vibe in desc_lower:
            score += 3
        # Budget proximity
        budget = getattr(request, "budget", 2000)
        if dest.approximate_budget <= budget * 1.2:
            score += 1
        scored.append((score, dest))

    scored.sort(key=lambda x: x[0], reverse=True)
    selected = [dest for _, dest in scored[:3]]

    return selected


def demo_regenerate_day(preferences: TripPreferences, day_number: int) -> ItineraryDay:
    """Generate a fresh single day for demo mode."""
    date_str = (preferences.start_date + timedelta(days=day_number - 1)).isoformat()
    all_day_activities = _get_destination_activities(preferences.destination)

    # Pick a different template day than originally
    template_index = (day_number + 1) % len(all_day_activities)
    activities = all_day_activities[template_index]

    food_cost = round(sum(a.approximate_cost for a in activities if a.is_meal), 2)
    activity_cost = round(sum(a.approximate_cost for a in activities if not a.is_meal), 2)
    transport_cost = round(preferences.budget / max(preferences.duration_days, 1) * 0.1, 2)
    estimated_cost = round(food_cost + activity_cost + transport_cost, 2)

    return ItineraryDay(
        day_number=day_number,
        date=date_str,
        theme=f"Refreshed Day {day_number} (Demo)",
        summary=f"A newly generated alternative day {day_number} for your {preferences.destination} trip.",
        activities=activities,
        accommodation_suggestion=f"Continue at your {preferences.accommodation_preference} in {preferences.destination}",
        transport_notes="Use public transport for convenience and value.",
        travel_tips="This is regenerated demo data. With a Gemini API key, you'll get AI-tailored itineraries.",
        estimated_cost=estimated_cost,
        food_cost=food_cost,
        transport_cost=transport_cost,
        activity_cost=activity_cost,
    )
