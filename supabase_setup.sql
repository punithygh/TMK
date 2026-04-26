-- ============================================================
-- TUMKURCONNECT: Yelp-Grade Database Setup Script
-- Run this in: Supabase Dashboard > SQL Editor
-- All steps are safe to re-run (idempotent)
-- ============================================================


-- STEP 1: Enable Required Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS postgis;


-- STEP 2: GIST Indexes for Fast Fuzzy Search
-- Makes typo-tolerant search 100x faster
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_business_name_trgm
  ON directory_business USING gist (name gist_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_business_description_trgm
  ON directory_business USING gist (description gist_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_business_area_trgm
  ON directory_business USING gist (area gist_trgm_ops);


-- STEP 3: Spatial Index on existing 'location' column
-- Uses the PostGIS geometry column already in your schema
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_business_location_geom
  ON directory_business USING gist (location);


-- STEP 4: Standard B-tree Indexes for Common Filters
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_business_category_id
  ON directory_business (category_id);

CREATE INDEX IF NOT EXISTS idx_business_is_verified
  ON directory_business (is_verified)
  WHERE is_verified = TRUE;

CREATE INDEX IF NOT EXISTS idx_business_is_featured
  ON directory_business (is_featured)
  WHERE is_featured = TRUE;

CREATE INDEX IF NOT EXISTS idx_review_business_id
  ON directory_review (business_id);

CREATE INDEX IF NOT EXISTS idx_review_user_id
  ON directory_review (user_id);

CREATE INDEX IF NOT EXISTS idx_bookmark_user_id
  ON directory_bookmark (user_id);


-- STEP 5: Nearby Businesses RPC
-- DROP all old overloaded versions first to clear the conflict
-- ============================================================
DROP FUNCTION IF EXISTS get_nearby_businesses(FLOAT, FLOAT, INT);
DROP FUNCTION IF EXISTS get_nearby_businesses(FLOAT, FLOAT, FLOAT);
DROP FUNCTION IF EXISTS get_nearby_businesses(FLOAT, FLOAT);

CREATE OR REPLACE FUNCTION get_nearby_businesses(
  user_lat      FLOAT,
  user_long     FLOAT,
  radius_meters FLOAT DEFAULT 5000
)
RETURNS TABLE (
  id                INT,
  name              TEXT,
  name_kn           TEXT,
  slug              TEXT,
  area              TEXT,
  category_id       INT,
  main_image_upload TEXT,
  avg_rating        NUMERIC,
  review_count      BIGINT,
  is_verified       BOOLEAN,
  phone             TEXT,
  extracted_lat     FLOAT,
  extracted_lng     FLOAT,
  distance_meters   FLOAT
) LANGUAGE sql STABLE AS
$func$
  SELECT
    b.id,
    b.name,
    b.name_kn,
    b.slug,
    b.area,
    b.category_id,
    b.main_image_upload,
    COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) AS avg_rating,
    COUNT(r.id)                                    AS review_count,
    b.is_verified,
    b.phone,
    ST_Y(b.location::geometry)                     AS extracted_lat,
    ST_X(b.location::geometry)                     AS extracted_lng,
    ST_DistanceSphere(
      b.location::geometry,
      ST_SetSRID(ST_MakePoint(user_long, user_lat), 4326)
    )                                              AS distance_meters
  FROM directory_business b
  LEFT JOIN directory_review r ON r.business_id = b.id
  WHERE b.location IS NOT NULL
    AND ST_DWithin(
      b.location::geography,
      ST_SetSRID(ST_MakePoint(user_long, user_lat), 4326)::geography,
      radius_meters::float
    )
  GROUP BY
    b.id, b.name, b.name_kn, b.slug, b.area,
    b.category_id, b.main_image_upload, b.is_verified, b.phone, b.location
  ORDER BY distance_meters ASC
  LIMIT 50;
$func$;


-- STEP 6: Fuzzy Search RPC with live ratings
-- Typo-tolerant search using pg_trgm similarity scoring
-- ============================================================
CREATE OR REPLACE FUNCTION search_businesses_fuzzy(search_term TEXT)
RETURNS TABLE (
  id                INT,
  name              TEXT,
  name_kn           TEXT,
  slug              TEXT,
  area              TEXT,
  category_id       INT,
  main_image_upload TEXT,
  avg_rating        NUMERIC,
  review_count      BIGINT,
  is_verified       BOOLEAN,
  phone             TEXT,
  match_score       FLOAT
) LANGUAGE sql STABLE AS
$func$
  SELECT
    b.id,
    b.name,
    b.name_kn,
    b.slug,
    b.area,
    b.category_id,
    b.main_image_upload,
    COALESCE(ROUND(AVG(r.rating)::numeric, 1), 0) AS avg_rating,
    COUNT(r.id)                                    AS review_count,
    b.is_verified,
    b.phone,
    GREATEST(
      similarity(b.name,                     search_term),
      similarity(COALESCE(b.area,        ''), search_term),
      similarity(COALESCE(b.description, ''), search_term)
    )                                             AS match_score
  FROM directory_business b
  LEFT JOIN directory_review r ON r.business_id = b.id
  WHERE
    b.name        % search_term
    OR b.area     % search_term
    OR b.description % search_term
    OR b.name ILIKE '%' || search_term || '%'
  GROUP BY
    b.id, b.name, b.name_kn, b.slug, b.area,
    b.category_id, b.main_image_upload, b.is_verified, b.phone, b.description
  ORDER BY match_score DESC
  LIMIT 20;
$func$;


-- STEP 7: Row Level Security (RLS)
-- Prevents users from modifying each other's data
-- ============================================================
ALTER TABLE directory_review          ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_bookmark        ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_review_reaction ENABLE ROW LEVEL SECURITY;

-- Reviews: anyone can read
DROP POLICY IF EXISTS "reviews_public_read" ON directory_review;
CREATE POLICY "reviews_public_read"
  ON directory_review FOR SELECT USING (true);

-- Reviews: only owner can write
DROP POLICY IF EXISTS "reviews_owner_write" ON directory_review;
CREATE POLICY "reviews_owner_write"
  ON directory_review FOR ALL
  USING (user_id::text = (SELECT id::text FROM auth_user WHERE username = current_user LIMIT 1));

-- Bookmarks: owner only
DROP POLICY IF EXISTS "bookmarks_owner_only" ON directory_bookmark;
CREATE POLICY "bookmarks_owner_only"
  ON directory_bookmark FOR ALL
  USING (user_id::text = (SELECT id::text FROM auth_user WHERE username = current_user LIMIT 1));

-- Reactions: anyone can read
DROP POLICY IF EXISTS "reactions_public_read" ON directory_review_reaction;
CREATE POLICY "reactions_public_read"
  ON directory_review_reaction FOR SELECT USING (true);

-- Reactions: only owner can write
DROP POLICY IF EXISTS "reactions_owner_write" ON directory_review_reaction;
CREATE POLICY "reactions_owner_write"
  ON directory_review_reaction FOR ALL
  USING (user_id::text = (SELECT id::text FROM auth_user WHERE username = current_user LIMIT 1));


-- ============================================================
-- DONE. All indexes, RPCs, and security policies are applied.
-- Verify with: SELECT proname FROM pg_proc WHERE proname IN ('get_nearby_businesses','search_businesses_fuzzy');
-- ============================================================
