-- 🛠️ DATABASE SCHEMA EXPANSION (Fix for Slug & Missing Columns)
-- This script ensures the Supabase 'businesses' table matches the Next.js BusinessListing interface.

-- 1. Add missing columns to 'businesses' table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS business_area_slug TEXT,
ADD COLUMN IF NOT EXISTS category_name TEXT,
ADD COLUMN IF NOT EXISTS category_name_kn TEXT,
ADD COLUMN IF NOT EXISTS area TEXT,
ADD COLUMN IF NOT EXISTS area_kn TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS whatsapp TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS description_kn TEXT,
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT,
ADD COLUMN IF NOT EXISTS working_hours TEXT;

-- 2. Create indexes for high-performance slug lookups
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses (slug);
CREATE INDEX IF NOT EXISTS idx_businesses_area_slug ON public.businesses (business_area_slug);

-- 3. (Optional) Sample Data Fix for Star Convention Hall
-- Update an existing row or insert a placeholder if you're testing
-- UPDATE public.businesses 
-- SET slug = 'star-convention-hall-ring-road', 
--     category_name = 'Convention Hall',
--     area = 'Ring Road'
-- WHERE name ILIKE '%Star Convention%';
