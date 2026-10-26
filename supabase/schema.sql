-- ============================================================
-- TravelCraft AI - Supabase Database Schema
-- Complete SQL schema for the travel itinerary planner
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Stores user profile information linked to Supabase Auth
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    preferred_currency TEXT DEFAULT 'USD',
    preferred_language TEXT DEFAULT 'en',
    travel_style TEXT DEFAULT 'moderate',
    dietary_preferences TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TRIPS TABLE
-- Stores trip metadata and preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    country TEXT DEFAULT '',
    description TEXT DEFAULT '',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INTEGER NOT NULL,
    budget NUMERIC(12, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    num_travelers INTEGER DEFAULT 1,
    travel_group TEXT DEFAULT 'solo',
    travel_style TEXT DEFAULT 'moderate',
    travel_pace TEXT DEFAULT 'balanced',
    interests TEXT[] DEFAULT '{}',
    accommodation_preference TEXT DEFAULT '',
    dietary_preferences TEXT[] DEFAULT '{}',
    additional_notes TEXT DEFAULT '',
    status TEXT DEFAULT 'draft',
    total_estimated_cost NUMERIC(12, 2) DEFAULT 0,
    accommodation_cost NUMERIC(12, 2) DEFAULT 0,
    food_cost NUMERIC(12, 2) DEFAULT 0,
    transport_cost NUMERIC(12, 2) DEFAULT 0,
    activity_cost NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ITINERARY_DAYS TABLE
-- Stores individual days of a trip itinerary
-- ============================================================
CREATE TABLE IF NOT EXISTS itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE NOT NULL,
    theme TEXT DEFAULT '',
    summary TEXT DEFAULT '',
    accommodation_suggestion TEXT DEFAULT '',
    transport_notes TEXT DEFAULT '',
    travel_tips TEXT DEFAULT '',
    estimated_cost NUMERIC(10, 2) DEFAULT 0,
    food_cost NUMERIC(10, 2) DEFAULT 0,
    transport_cost NUMERIC(10, 2) DEFAULT 0,
    activity_cost NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(trip_id, day_number)
);

-- ============================================================
-- ITINERARY_ACTIVITIES TABLE
-- Stores individual activities within each day
-- ============================================================
CREATE TABLE IF NOT EXISTS itinerary_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    time_slot TEXT DEFAULT '',
    suggested_time TEXT DEFAULT '',
    estimated_duration TEXT DEFAULT '',
    location TEXT DEFAULT '',
    area TEXT DEFAULT '',
    category TEXT DEFAULT 'sightseeing',
    approximate_cost NUMERIC(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    transport_suggestion TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    is_meal BOOLEAN DEFAULT FALSE,
    is_custom BOOLEAN DEFAULT FALSE,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_start_date ON trips(start_date);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip_id ON itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_day_number ON itinerary_days(trip_id, day_number);
CREATE INDEX IF NOT EXISTS idx_activities_day_id ON itinerary_activities(day_id);
CREATE INDEX IF NOT EXISTS idx_activities_sort_order ON itinerary_activities(day_id, sort_order);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_activities ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Trips: Users can only access their own trips
CREATE POLICY "Users can view own trips"
    ON trips FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own trips"
    ON trips FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
    ON trips FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
    ON trips FOR DELETE
    USING (auth.uid() = user_id);

-- Itinerary Days: Users can access days for their own trips
CREATE POLICY "Users can view own itinerary days"
    ON itinerary_days FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can create itinerary days for own trips"
    ON itinerary_days FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can update own itinerary days"
    ON itinerary_days FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete own itinerary days"
    ON itinerary_days FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM trips WHERE trips.id = itinerary_days.trip_id AND trips.user_id = auth.uid()
    ));

-- Activities: Users can access activities for their own trips
CREATE POLICY "Users can view own activities"
    ON itinerary_activities FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM itinerary_days
        JOIN trips ON trips.id = itinerary_days.trip_id
        WHERE itinerary_days.id = itinerary_activities.day_id
        AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can create activities for own trips"
    ON itinerary_activities FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM itinerary_days
        JOIN trips ON trips.id = itinerary_days.trip_id
        WHERE itinerary_days.id = itinerary_activities.day_id
        AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can update own activities"
    ON itinerary_activities FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM itinerary_days
        JOIN trips ON trips.id = itinerary_days.trip_id
        WHERE itinerary_days.id = itinerary_activities.day_id
        AND trips.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete own activities"
    ON itinerary_activities FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM itinerary_days
        JOIN trips ON trips.id = itinerary_days.trip_id
        WHERE itinerary_days.id = itinerary_activities.day_id
        AND trips.user_id = auth.uid()
    ));

-- ============================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_trips_updated_at
    BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_itinerary_days_updated_at
    BEFORE UPDATE ON itinerary_days
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON itinerary_activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
