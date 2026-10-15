-- ==============================================================================
-- Dynasty Dental Solutions - Supabase Database Schema
-- Location: Faisalabad, Pakistan
-- Compatible with Supabase PostgreSQL, Row Level Security (RLS), and Storage
-- ==============================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clinic Settings Table (Single-row primary configuration)
CREATE TABLE IF NOT EXISTS public.clinic_settings (
    id TEXT PRIMARY KEY DEFAULT 'dynasty-settings-1',
    clinic_name TEXT NOT NULL DEFAULT 'Dynasty Dental Solutions',
    tagline TEXT DEFAULT 'Your Smile, Our Priority.',
    description TEXT DEFAULT 'Modern dental care in a clean, safe and comfortable environment.',
    doctor_name TEXT DEFAULT 'Dr. M. Niyalish Semab',
    doctor_credentials TEXT DEFAULT 'BDS, RDS — Consultant Dental Surgeon',
    doctor_bio TEXT,
    doctor_image_url TEXT DEFAULT '/images/doctor-profile.jpg',
    
    phone TEXT NOT NULL DEFAULT '0306 1521205',
    phone_display TEXT DEFAULT 'Call 0306 1521205',
    whatsapp TEXT DEFAULT '923061521205',
    email TEXT DEFAULT 'dynastydentalsolutions@gmail.com',
    
    full_address TEXT NOT NULL DEFAULT 'Jinnah Rd, Zia Colony, Faisalabad, Punjab, Pakistan',
    colony_area TEXT DEFAULT 'Zia Colony, Jinnah Rd',
    city TEXT NOT NULL DEFAULT 'Faisalabad',
    postal_code TEXT DEFAULT '38000',
    country TEXT NOT NULL DEFAULT 'Pakistan',
    latitude DOUBLE PRECISION DEFAULT 31.4187,
    longitude DOUBLE PRECISION DEFAULT 73.0791,
    directions_url TEXT DEFAULT 'https://maps.google.com/?q=Dynasty+Dental+Solutions+Faisalabad',
    map_zoom INT DEFAULT 16,
    
    timezone TEXT DEFAULT 'Asia/Karachi',
    verified_clinic BOOLEAN DEFAULT true,
    rating_score NUMERIC(3, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 317,
    show_rating BOOLEAN DEFAULT true,
    
    logo_url TEXT DEFAULT '/images/tooth-logo.svg',
    favicon_url TEXT DEFAULT '/images/tooth-logo.svg',
    logo_text_fallback BOOLEAN DEFAULT false,
    logo_height INT DEFAULT 38,
    
    primary_color TEXT DEFAULT '#153E70',
    accent_blue TEXT DEFAULT '#0878F9',
    light_bg_color TEXT DEFAULT '#EAF4FF',
    
    is_published BOOLEAN DEFAULT true,
    has_draft_changes BOOLEAN DEFAULT false,
    draft_data JSONB,
    
    holiday_notice TEXT DEFAULT '',
    show_holiday_notice BOOLEAN DEFAULT false,
    
    seo_meta_title TEXT DEFAULT 'Dynasty Dental Solutions | Best Dental Clinic in Faisalabad',
    seo_meta_description TEXT DEFAULT 'Dynasty Dental Solutions in Faisalabad provides 24/7 world-class dental care, cosmetic dentistry, root canal treatments, teeth whitening, and emergency dental services.',
    seo_keywords TEXT DEFAULT 'dental clinic Faisalabad, dentist in Faisalabad, Dynasty Dental Solutions, teeth cleaning, root canal, 24/7 emergency dentist',
    og_image_url TEXT DEFAULT '/images/hero-clinic.jpg',
    
    social_facebook TEXT DEFAULT 'https://facebook.com',
    social_instagram TEXT DEFAULT 'https://instagram.com',
    social_youtube TEXT DEFAULT 'https://youtube.com',
    social_twitter TEXT DEFAULT 'https://twitter.com',
    
    hero_headline TEXT DEFAULT 'Dynasty Dental Solutions',
    hero_tagline TEXT DEFAULT 'Your smile, our priority.',
    hero_description TEXT DEFAULT 'Modern dental care in a clean, safe and comfortable environment.',
    hero_image_url TEXT DEFAULT '/images/hero-clinic.jpg',
    
    about_title TEXT DEFAULT 'About Dynasty Dental Solutions',
    about_description TEXT DEFAULT 'Dynasty Dental Solutions is a trusted dental clinic in Faisalabad, dedicated to providing high-quality dental care in a clean, modern, and comfortable environment. Our experienced team ensures personalized care for every patient, helping you achieve a healthy and confident smile.',
    about_badges JSONB DEFAULT '[
      {"icon": "shield-check", "title": "Professional Dental Care"},
      {"icon": "settings", "title": "Modern Equipment"},
      {"icon": "shield-plus", "title": "Clean & Safe Environment"},
      {"icon": "user-heart", "title": "Patient-Focused Service"}
    ]'::jsonb,
    
    insights JSONB DEFAULT '{
      "accessibility": {
        "wheelchair_entrance": true,
        "wheelchair_parking": true,
        "wheelchair_restroom": true,
        "wheelchair_seating": true
      },
      "amenities": {
        "restroom": true,
        "waiting_lounge": true,
        "wifi": true
      },
      "payments": {
        "checks": true,
        "nfc_mobile": true,
        "payment_plans": true,
        "cash": true,
        "credit_cards": true
      }
    }'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Opening Hours Table
CREATE TABLE IF NOT EXISTS public.opening_hours (
    id TEXT PRIMARY KEY,
    day_of_week TEXT NOT NULL,
    is_open_24h BOOLEAN DEFAULT true,
    is_closed BOOLEAN DEFAULT false,
    open_time TEXT DEFAULT '00:00',
    close_time TEXT DEFAULT '23:59',
    display_text TEXT DEFAULT 'Open 24 hours',
    display_order INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    full_description TEXT,
    icon_name TEXT NOT NULL DEFAULT 'tooth',
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    price_range TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Gallery Images Table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'treatment',
    display_order INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    show_on_homepage BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Appointments Table (Patient Requests)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    requested_date DATE NOT NULL,
    requested_time TEXT NOT NULL,
    service_id TEXT,
    service_title TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'rescheduled', 'completed', 'cancelled'
    consent_given BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching and filtering appointments
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(requested_date);

-- 7. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON public.contact_messages(is_read);

-- 8. Admin Activity Logs Table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    details TEXT,
    admin_user TEXT DEFAULT 'owner@dynastydental.pk',
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    rating INT DEFAULT 5,
    review_text TEXT NOT NULL,
    date_text TEXT DEFAULT 'Recent',
    is_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public can read clinic_settings, opening_hours, services, gallery, testimonials
CREATE POLICY "Public can view clinic settings" ON public.clinic_settings FOR SELECT USING (true);
CREATE POLICY "Public can view opening hours" ON public.opening_hours FOR SELECT USING (true);
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view visible gallery images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON public.testimonials FOR SELECT USING (true);

-- Public can submit appointments and contact messages
CREATE POLICY "Public can submit appointment requests" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated staff can manage all data
CREATE POLICY "Authenticated users full access to clinic_settings" ON public.clinic_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access to opening_hours" ON public.opening_hours FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access to services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access to gallery_images" ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access to appointments" ON public.appointments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access to contact_messages" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access to activity_logs" ON public.admin_activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users full access to testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE CONFIGURATION (Supabase Storage Bucket: clinic-assets)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('clinic-assets', 'clinic-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read clinic-assets
CREATE POLICY "Public Access clinic-assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'clinic-assets');

-- Authenticated owner can upload, update, delete images
CREATE POLICY "Authenticated Upload clinic-assets" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'clinic-assets');

CREATE POLICY "Authenticated Update clinic-assets" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'clinic-assets');

CREATE POLICY "Authenticated Delete clinic-assets" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'clinic-assets');
