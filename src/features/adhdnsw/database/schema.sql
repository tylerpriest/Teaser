-- ADHDNSW.org Database Schema for Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For location-based queries

-- Professionals table
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL, -- Dr, Prof, Ms, Mr, etc
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    credentials TEXT[], -- MBBS, FRANZCP, etc
    registration_number TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    booking_url TEXT,
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMP WITH TIME ZONE,
    verified_by UUID REFERENCES auth.users(id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    accepts_new_patients BOOLEAN DEFAULT true,
    waitlist_weeks INTEGER,
    
    -- Profile content
    bio TEXT,
    approach TEXT,
    specializations TEXT[],
    languages TEXT[] DEFAULT ARRAY['English'],
    
    -- NDIS
    ndis_registered BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    -- Search
    search_vector tsvector
);

-- Locations table (professionals can have multiple locations)
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "Main Practice", "Westmead Clinic"
    
    -- Address
    street_address TEXT NOT NULL,
    suburb TEXT NOT NULL,
    state TEXT DEFAULT 'NSW',
    postcode TEXT NOT NULL,
    
    -- Coordinates for distance search
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    
    -- Contact
    phone TEXT,
    email TEXT,
    
    -- Availability
    is_primary BOOLEAN DEFAULT false,
    offers_telehealth BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service types
CREATE TABLE service_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'medical', 'therapy', 'coaching', 'assessment'
    display_order INTEGER DEFAULT 0
);

-- Professional services junction
CREATE TABLE professional_services (
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    service_type_id UUID REFERENCES service_types(id) ON DELETE CASCADE,
    PRIMARY KEY (professional_id, service_type_id)
);

-- Age groups served
CREATE TABLE age_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    min_age INTEGER,
    max_age INTEGER
);

-- Professional age groups junction
CREATE TABLE professional_age_groups (
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    age_group_id UUID REFERENCES age_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (professional_id, age_group_id)
);

-- Payment methods
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT
);

-- Professional payment methods junction
CREATE TABLE professional_payment_methods (
    professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES payment_methods(id) ON DELETE CASCADE,
    bulk_billing_available BOOLEAN DEFAULT false,
    PRIMARY KEY (professional_id, payment_method_id)
);

-- Blog categories
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES blog_categories(id),
    display_order INTEGER DEFAULT 0,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog posts
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    
    -- Author
    author_name TEXT NOT NULL,
    author_bio TEXT,
    author_image TEXT,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    canonical_url TEXT,
    
    -- Categorization
    is_featured BOOLEAN DEFAULT false,
    is_evergreen BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Search
    search_vector tsvector
);

-- Blog post categories junction
CREATE TABLE blog_post_categories (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

-- Blog tags
CREATE TABLE blog_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

-- Blog post tags junction
CREATE TABLE blog_post_tags (
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Search queries tracking
CREATE TABLE search_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query TEXT NOT NULL,
    query_type TEXT NOT NULL, -- 'directory', 'blog', 'site'
    results_count INTEGER,
    clicked_result UUID,
    user_location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_professionals_slug ON professionals(slug);
CREATE INDEX idx_professionals_search ON professionals USING GIN(search_vector);
CREATE INDEX idx_locations_suburb ON locations(suburb);
CREATE INDEX idx_locations_postcode ON locations(postcode);
CREATE INDEX idx_locations_geo ON locations USING GIST(location);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_search ON blog_posts USING GIN(search_vector);

-- Full text search triggers
CREATE OR REPLACE FUNCTION professionals_search_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.bio, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.specializations, ' '), '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(NEW.credentials, ' '), '')), 'C');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER professionals_search_update
    BEFORE INSERT OR UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION professionals_search_trigger();

-- Blog search trigger
CREATE OR REPLACE FUNCTION blog_posts_search_trigger() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.excerpt, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'C');
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_search_update
    BEFORE INSERT OR UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION blog_posts_search_trigger();

-- Update location geography on insert/update
CREATE OR REPLACE FUNCTION update_location_geography() RETURNS trigger AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location := ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
    END IF;
    RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER location_geography_update
    BEFORE INSERT OR UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_location_geography();

-- Row Level Security
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON professionals FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON locations FOR SELECT USING (true);
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (status = 'published');