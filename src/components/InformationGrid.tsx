'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  Lightbulb,
  Check,
  ShieldCheck,
  Cpu,
  ShieldPlus,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { ClinicSettings, OpeningHour, Service } from '@/types/clinic';
import { ScheduleStatus } from '@/lib/schedule';
import { ToothIcon, ServiceIconRenderer } from './DentalIcons';

interface InformationGridProps {
  settings: ClinicSettings;
  hours: OpeningHour[];
  services: Service[];
  scheduleStatus: ScheduleStatus;
  onContactClick: () => void;
  onBookClick: () => void;
}

export default function InformationGrid({
  settings,
  hours,
  services,
  scheduleStatus,
  onContactClick,
  onBookClick,
}: InformationGridProps) {
  const [mapZoom, setMapZoom] = useState(false);
  const cleanPhone = settings.phone.replace(/\s+/g, '');
  const cleanWhatsApp = settings.whatsapp ? settings.whatsapp.replace(/\D/g, '') : cleanPhone;

  // Feature badge icon resolver
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'shield-check':
        return <ShieldCheck className="w-5 h-5 text-[#0878F9]" />;
      case 'settings':
      case 'cpu':
        return <Cpu className="w-5 h-5 text-[#0878F9]" />;
      case 'shield-plus':
        return <ShieldPlus className="w-5 h-5 text-[#0878F9]" />;
      case 'user-heart':
      case 'user-check':
        return <UserCheck className="w-5 h-5 text-[#0878F9]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#0878F9]" />;
    }
  };

  const [mapProvider, setMapProvider] = useState<'google' | 'osm'>('google');

  // Map coordinates & queries
  const lat = settings.latitude || 31.4187;
  const lon = settings.longitude || 73.0791;
  const mapAddressQuery = settings.full_address 
    ? `${settings.full_address}, ${settings.city || 'Faisalabad'}, ${settings.country || 'Pakistan'}`
    : `${lat},${lon}`;

  // Google Maps embed fills 100% responsive width seamlessly without bounding-box tile cutoffs
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapAddressQuery)}&t=&z=${settings.map_zoom || 15}&ie=UTF8&iwloc=&output=embed`;
  
  // Expanded bounding box for OpenStreetMap to match the ~2.5:1 aspect ratio of the container
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.035}%2C${lat - 0.012}%2C${lon + 0.035}%2C${lat + 0.012}&layer=mapnik&marker=${lat}%2C${lon}`;
  
  const currentMapEmbedUrl = mapProvider === 'google' ? googleMapEmbedUrl : osmEmbedUrl;

  return (
    <section id="about" className="w-full bg-[#F8FAFC] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. About Clinic Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#0878F9]">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#153E70]">
                  {settings.about_title || `About ${settings.clinic_name}`}
                </h2>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                {settings.about_description}
              </p>

              {/* Doctor Credentials Highlight (if configured) */}
              {settings.doctor_name && (
                <div className="mb-6 p-4 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center gap-4">
                  {settings.doctor_image_url && (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0">
                      <Image
                        src={settings.doctor_image_url}
                        alt={settings.doctor_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#153E70]">
                      {settings.doctor_name}
                    </h3>
                    <p className="text-xs text-[#0878F9] font-medium">
                      {settings.doctor_credentials}
                    </p>
                    {settings.doctor_bio && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {settings.doctor_bio}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 4 Feature Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {(settings.about_badges || []).map((badge, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-100 hover:border-sky-200 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-sky-100/70 flex items-center justify-center shrink-0">
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#153E70]">
                      {badge.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Location & Map Card */}
            <div id="location" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#0878F9]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#153E70]">
                    Location
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {/* Map provider toggle */}
                  <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setMapProvider('google')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        mapProvider === 'google'
                          ? 'bg-white text-[#0878F9] shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Google Maps
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapProvider('osm')}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        mapProvider === 'osm'
                          ? 'bg-white text-[#0878F9] shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Street Map
                    </button>
                  </div>

                  <a
                    href={settings.directions_url || `https://maps.google.com/?q=${lat},${lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0878F9] hover:underline ml-1"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Interactive Map Frame */}
              <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mb-4 group">
                <iframe
                  title="Dynasty Dental Solutions Location Map"
                  src={currentMapEmbedUrl}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
                
                {/* Visual Pin overlay card */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs text-[#153E70] flex items-center gap-2 pointer-events-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-semibold">{settings.clinic_name}</span>
                </div>

                {/* Map toggle expand */}
                <a
                  href={settings.directions_url || `https://maps.google.com/?q=${lat},${lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-white/90 hover:bg-white p-2 rounded-lg shadow text-slate-700 hover:text-[#0878F9] transition-colors"
                  title="Expand Map"
                >
                  <Maximize2 className="w-4 h-4" />
                </a>
              </div>

              {/* Location Footer Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <MapPin className="w-4 h-4 text-[#0878F9] shrink-0" />
                  <span>{settings.full_address || `${settings.colony_area}, ${settings.city}, ${settings.country}`}</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-[#0878F9] text-xs font-semibold">
                  <MapPin className="w-3 h-3" />
                  <span>{settings.city}</span>
                </div>
              </div>
            </div>

            {/* 3. Our Services Expanded Card */}
            <div id="services" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#0878F9]">
                  <ToothIcon className="w-5 h-5 text-[#0878F9]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#153E70]">
                  Our Services
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {services.slice(0, 5).map((service) => (
                  <div
                    key={service.id}
                    onClick={onBookClick}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#EAF4FF] hover:bg-[#dbeafe] border border-sky-100 text-center cursor-pointer transition-all hover:scale-102"
                  >
                    <div className="mb-2 text-[#0878F9]">
                      <ServiceIconRenderer iconName={service.icon_name} className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-[#153E70] leading-snug">
                      {service.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div id="contact" className="lg:col-span-5 space-y-6">
            
            {/* 1. Contact Us Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
              <h3 className="text-xl font-bold text-[#153E70] mb-5 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#0878F9]" />
                <span>Contact us</span>
              </h3>

              <div className="space-y-3.5">
                {/* Phone Call Link */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-sky-50/80 text-[#153E70] hover:text-[#0878F9] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-[#0878F9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Phone className="w-4 h-4 fill-current" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base tracking-wide">
                    {settings.phone}
                  </span>
                </a>

                {/* Contact Message Link */}
                <button
                  type="button"
                  onClick={onContactClick}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-sky-50/80 text-[#153E70] hover:text-[#0878F9] transition-colors group text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-[#0878F9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">
                    Contact us
                  </span>
                </button>

                {/* Directions Link */}
                <a
                  href={settings.directions_url || `https://maps.google.com/?q=${lat},${lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-sky-50/80 text-[#153E70] hover:text-[#0878F9] transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-[#0878F9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-sm sm:text-base">
                    Directions
                  </span>
                </a>

                {/* WhatsApp Chat Button */}
                <a
                  href={`https://wa.me/${cleanWhatsApp}?text=Hello%20Dynasty%20Dental%20Solutions,%20I%20would%20like%20to%20inquire%20about%20dental%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-xs transition-colors"
                >
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* 2. Opening Hours Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#0878F9]" />
                  <h3 className="text-xl font-bold text-[#153E70]">
                    Hours
                  </h3>
                </div>
                
                {/* Live Status Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{scheduleStatus.statusText}</span>
                </div>
              </div>

              {/* Holiday Notice (if any) */}
              {settings.show_holiday_notice && settings.holiday_notice && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 text-amber-800 text-xs border border-amber-200">
                  {settings.holiday_notice}
                </div>
              )}

              {/* Weekly Schedule Table */}
              <div className="space-y-2 text-xs sm:text-sm">
                {hours.map((h) => (
                  <div
                    key={h.id || h.day_of_week}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-b-0"
                  >
                    <span className="text-slate-700 font-medium">{h.day_of_week}</span>
                    <span className="text-slate-600">
                      {h.is_closed
                        ? 'Closed'
                        : h.is_open_24h
                        ? 'Open 24 hours'
                        : `${h.open_time} - ${h.close_time}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Insights Card (Accessibility, Amenities, Payments) */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm border border-slate-200/80">
              <div className="flex items-center gap-2.5 mb-5">
                <Lightbulb className="w-5 h-5 text-[#0878F9]" />
                <h3 className="text-xl font-bold text-[#153E70]">
                  Insights
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Accessibility */}
                <div>
                  <h4 className="font-bold text-[#153E70] mb-1.5">Accessibility</h4>
                  <div className="text-slate-600 leading-relaxed">
                    {[
                      settings.insights?.accessibility?.wheelchair_entrance && 'Wheelchair accessible entrance',
                      settings.insights?.accessibility?.wheelchair_parking && 'Wheelchair accessible parking lot',
                      settings.insights?.accessibility?.wheelchair_restroom && 'Wheelchair accessible restroom',
                      settings.insights?.accessibility?.wheelchair_seating && 'Wheelchair accessible seating',
                    ]
                      .filter(Boolean)
                      .join(' • ') || 'Wheelchair accessible entrance and seating'}
                  </div>
                </div>

                {/* Amenities */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-[#153E70] mb-1.5">Amenities</h4>
                  <div className="text-slate-600 leading-relaxed">
                    {[
                      settings.insights?.amenities?.restroom && 'Restroom',
                      settings.insights?.amenities?.waiting_lounge && 'Comfortable waiting lounge',
                      settings.insights?.amenities?.wifi && 'Patient Wi-Fi',
                    ]
                      .filter(Boolean)
                      .join(' • ') || 'Restroom'}
                  </div>
                </div>

                {/* Payments */}
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-[#153E70] mb-1.5">Payments</h4>
                  <div className="text-slate-600 leading-relaxed">
                    {[
                      settings.insights?.payments?.cash && 'Cash',
                      settings.insights?.payments?.checks && 'Checks',
                      settings.insights?.payments?.nfc_mobile && 'NFC mobile payments',
                      settings.insights?.payments?.payment_plans && 'Payment plans',
                      settings.insights?.payments?.credit_cards && 'Credit/Debit cards',
                    ]
                      .filter(Boolean)
                      .join(' • ') || 'Checks • NFC mobile payments • Payment plans'}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Book Your Appointment Today Card */}
            <div className="bg-[#EAF4FF] rounded-2xl p-6 sm:p-7 border border-sky-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-[#0878F9] shrink-0">
                  <ToothIcon className="w-7 h-7 text-[#0878F9]" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#153E70] leading-snug">
                    Book Your Appointment Today
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Get expert dental care with a team that truly cares about your smile.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0878F9] hover:bg-[#0667d6] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>{settings.phone_display || `Call ${settings.phone}`}</span>
                </a>
                <button
                  type="button"
                  onClick={onBookClick}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-[#0878F9] font-semibold text-xs sm:text-sm border border-sky-200 transition-all"
                >
                  <span>Book Online</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
