# Dynasty Dental Solutions

**Dynasty Dental Solutions** is a modern, responsive, and full-stack web application designed for a premier dental clinic located on Jinnah Rd, Zia Colony, Faisalabad, Pakistan.

This project includes a public-facing website matching the clinic brand design reference, along with an **Owner Admin Dashboard** (`/admin`) allowing the clinic owner to manage all content, photos, appointments, inquiries, hours, and branding independently without code editing or redeployments.

---

## 1. Key Features

### Public Website
- **Modern Dental Aesthetic**: Clean navy-blue (`#153E70`), vivid blue (`#0878F9`), and soft-blue (`#EAF4FF`) palette matching the clinic brand reference.
- **Dynamic Sticky Header**: Features clinic logo, quick navigation, and a prominent blue call button (`0306 1521205`).
- **Hero Section**:
  - Configurable "Verified Clinic" badge.
  - Live Real-Time Open/Closed calculation based on `Asia/Karachi` timezone.
  - Editable rating display (`5.0 (317)`).
  - Quick action buttons (Call Now, Contact Us, Book Online).
  - High-resolution dental treatment operatory photography.
- **Top Service Badges**: 5 rounded dental cards (General Dentistry, Cosmetic Dentistry, Teeth Cleaning, Root Canal Treatment, Emergency Dental Care) with custom dental iconography.
- **Interactive Clinic Gallery**: 7 photo cards with image hover effects, descriptions, and a responsive **Lightbox Modal** with keyboard navigation.
- **Two-Column Detailed Information Grid**:
  - **About Dynasty Dental Solutions**: Story, doctor credentials, and 4 core clinical standards.
  - **Location & Interactive Map**: Embedded OpenStreetMap centered at Jinnah Rd / Zia Colony Faisalabad, GPS coordinates, and direct directions link.
  - **Our Services**: Expanded services overview.
  - **Contact Us**: Working `tel:` phone link, direct WhatsApp conversation link, message trigger, and map directions.
  - **Live Opening Hours**: Real-time status indicator with full Monday–Sunday 24/7 schedule.
  - **Clinic Insights**: Owner-verified accessibility (wheelchair entrance, parking, restroom, seating), amenities, and accepted payments (checks, NFC mobile, payment plans).
  - **Book Your Appointment Today**: Banner card with direct booking action.
- **Working Appointment Booking**:
  - Full modal with React Hook Form + Zod validation.
  - Service selection, date picker, time slot selection, patient consent, and anti-double-submission protection.
  - Persisted to database with unique booking reference code.
- **Working Contact Inquiry Form**: Instant messaging persisted to database.
- **Full SEO & Structured Data**: Dynamic OpenGraph tags, meta descriptions, and Schema.org `Dentist` JSON-LD markup.

### Owner Admin Dashboard (`/admin`)
A protected administration portal with 17 dedicated management sections:
1. **Dashboard Overview**: Real KPI metrics (pending/confirmed appointments, new messages, recent activity audit trail).
2. **Clinic Profile**: Clinic name, tagline, description, dentist credentials, doctor bio, and doctor headshot.
3. **Logo & Branding**: Upload clinic logo (PNG, JPG, WebP, SVG), favicon, text fallback mode, and display height slider with live preview.
4. **Hero Section**: Headline, subtext, verified badge toggle, rating score toggle, and hero background photo manager.
5. **Services Manager**: Add, edit, delete, reorder, and toggle visibility for dental services with custom icon picker.
6. **Photo Gallery**: Upload clinic photos, assign categories, reorder, set featured photo, and toggle homepage visibility.
7. **About the Clinic**: About text and 4 feature badge titles.
8. **Contact Information**: Primary phone number, WhatsApp number, email, and Google Maps directions link (updates header, cards, and footer globally).
9. **Address & Map Pin**: Street address, area, city, postal code, GPS coordinates (latitude/longitude), and interactive map pin preview.
10. **Opening Hours**: Daily schedules, 24-hour toggles, closed days, `Asia/Karachi` timezone, holiday announcement banner, and live real-time status test.
11. **Accessibility & Amenities**: Toggles for wheelchair access, parking, amenities, and payment options.
12. **Ratings & Reviews**: Rating score (5.0), reviews count (317), visibility toggle, and patient testimonials list.
13. **Appointments**: Table of patient requests with 1-click status actions (Confirm, Complete, Cancel), search, filter, and direct WhatsApp contact.
14. **Messages / Inquiries**: Contact form messages inbox with read/unread, archive, and direct response actions.
15. **SEO & Social**: Meta titles, descriptions, keywords, Open Graph image, and social media URLs.
16. **Website Appearance**: Primary navy, blue accent, and light background colors.
17. **Security & Account**: Change password, database status, and activity log audit trail.
- **Draft & Publish Engine**: Save changes as a draft to preview before making live, or publish instantly to live visitors.

---

## 2. Technology Stack

- **Framework**: Next.js 16 (App Router) with React 19 and TypeScript.
- **Styling**: Tailwind CSS v4 with custom clinic color tokens.
- **Icons**: Lucide Icons & Custom SVG Dental Icons.
- **Forms & Validation**: React Hook Form with Zod schemas.
- **Database & Storage**: Supabase (PostgreSQL with RLS + Storage Buckets) with local persistent fallback mode.
- **Maps**: OpenStreetMap embed + Google Maps navigation links.

---

## 3. Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation
1. Clone or navigate to the repository directory:
   ```bash
   cd "d:/Online work/AI APPS/4"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Owner Admin Credentials

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to log in:
- **Default Owner Email**: `owner@dynastydental.pk`
- **Default Password**: `Dynasty2025!Dental`

*(You can change the password anytime in `/admin/security` or via the `ADMIN_PASSWORD` environment variable).*

---

## 5. Supabase Setup & Production Deployment

The project includes the complete Supabase SQL schema in `supabase/schema.sql`.

### Steps to connect Supabase:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the entire script in `supabase/schema.sql`.
   - This creates tables: `clinic_settings`, `opening_hours`, `services`, `gallery_images`, `appointments`, `contact_messages`, `admin_activity_logs`, and `testimonials`.
   - Configures Row Level Security (RLS) policies.
   - Sets up the public storage bucket `clinic-assets`.
3. Copy your project URL and keys from **Project Settings -> API**.
4. Set the environment variables in `.env.local` or on your hosting provider (e.g. Vercel):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ADMIN_PASSWORD=YourCustomSecurePassword
   ```

---

## 6. Deployment to Vercel

1. Push the code to your GitHub/GitLab repository.
2. Import the repository in [Vercel](https://vercel.com).
3. Add the environment variables from `.env.example`.
4. Deploy! The project builds cleanly with `next build`.
