export interface ClinicSettings {
  id: string;
  clinic_name: string;
  tagline: string;
  description: string;
  doctor_name: string;
  doctor_credentials: string;
  doctor_bio: string;
  doctor_image_url: string;
  
  phone: string;
  phone_display: string;
  whatsapp: string;
  email: string;
  
  full_address: string;
  colony_area: string;
  city: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  directions_url: string;
  map_zoom: number;
  
  timezone: string; // 'Asia/Karachi'
  verified_clinic: boolean;
  rating_score: number; // e.g. 5.0
  reviews_count: number; // e.g. 317
  show_rating: boolean;
  
  logo_url: string;
  favicon_url: string;
  logo_text_fallback: boolean;
  logo_height: number;
  logo_icon?: string;
  logo_badge_style?: 'badge' | 'plain' | 'outline';
  
  primary_color: string;
  accent_blue: string;
  light_bg_color: string;
  
  is_published: boolean;
  has_draft_changes: boolean;
  
  holiday_notice: string;
  show_holiday_notice: boolean;
  
  seo_meta_title: string;
  seo_meta_description: string;
  seo_keywords: string;
  og_image_url: string;
  
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
  social_twitter: string;
  
  hero_headline: string;
  hero_tagline: string;
  hero_description: string;
  hero_image_url: string;
  hero_images?: string[];
  
  about_title: string;
  about_description: string;
  about_badges: {
    icon: string;
    title: string;
  }[];
  
  insights: {
    accessibility: {
      wheelchair_entrance: boolean;
      wheelchair_parking: boolean;
      wheelchair_restroom: boolean;
      wheelchair_seating: boolean;
    };
    amenities: {
      restroom: boolean;
      waiting_lounge: boolean;
      wifi: boolean;
    };
    payments: {
      checks: boolean;
      nfc_mobile: boolean;
      payment_plans: boolean;
      cash: boolean;
      credit_cards: boolean;
    };
  };

  updated_at: string;
}

export interface OpeningHour {
  id: string;
  day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  is_open_24h: boolean;
  is_closed: boolean;
  open_time: string; // "00:00" or "09:00"
  close_time: string; // "23:59" or "21:00"
  display_text?: string;
  display_order: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  icon_name: 'tooth' | 'smile' | 'sparkles' | 'root-canal' | 'clock' | 'shield';
  image_url?: string;
  display_order: number;
  is_active: boolean;
  price_range?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: 'exterior' | 'treatment' | 'equipment' | 'lounge' | 'aesthetic';
  display_order: number;
  is_featured: boolean;
  show_on_homepage: boolean;
  created_at?: string;
}

export interface Appointment {
  id: string;
  patient_name: string;
  phone: string;
  email?: string;
  requested_date: string;
  requested_time: string;
  service_id: string;
  service_title: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';
  consent_given: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact_info: string;
  subject: string;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  action: string;
  details: string;
  admin_user: string;
  timestamp: string;
}

export interface Testimonial {
  id: string;
  patient_name: string;
  rating: number;
  review_text: string;
  date_text: string;
  is_verified: boolean;
}
