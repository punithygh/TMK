-- 1. Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create businesses table (if not exists) or alter existing one
-- Note: Assuming table name is 'businesses' as per task
CREATE TABLE IF NOT EXISTS public.businesses (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_kn TEXT,
    address TEXT,
    location GEOGRAPHY(POINT, 4326),
    status TEXT DEFAULT 'PUBLISHED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create a spatial index for high-performance radius searches
CREATE INDEX IF NOT EXISTS businesses_geo_index ON public.businesses USING GIST (location);

-- 4. Create the RPC function for Radius Search
-- This function calculates distance on a sphere for maximum accuracy in meters
CREATE OR REPLACE FUNCTION get_nearby_businesses(
    user_lat FLOAT,
    user_long FLOAT,
    radius_meters FLOAT
)
RETURNS SETOF businesses
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM businesses
    WHERE ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(user_long, user_lat), 4326)::geography,
        radius_meters
    )
    ORDER BY location <-> ST_SetSRID(ST_MakePoint(user_long, user_lat), 4326)::geography; -- Sort by proximity
END;
$$;
