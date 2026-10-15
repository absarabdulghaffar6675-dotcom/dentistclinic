'use client';

import React, { useState } from 'react';
import { ClinicSettings, OpeningHour, Service, GalleryImage } from '@/types/clinic';
import { ScheduleStatus } from '@/lib/schedule';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import QuickServiceBadges from './QuickServiceBadges';
import GallerySection from './GallerySection';
import InformationGrid from './InformationGrid';
import Footer from './Footer';
import AppointmentModal from './AppointmentModal';
import ContactModal from './ContactModal';
import DraftBanner from './DraftBanner';

interface HomeClientWrapperProps {
  settings: ClinicSettings;
  hours: OpeningHour[];
  services: Service[];
  galleryImages: GalleryImage[];
  scheduleStatus: ScheduleStatus;
  isPreviewDraft: boolean;
}

export default function HomeClientWrapper({
  settings,
  hours,
  services,
  galleryImages,
  scheduleStatus,
  isPreviewDraft,
}: HomeClientWrapperProps) {
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleOpenAppointment = (service?: Service) => {
    setSelectedService(service || null);
    setAppointmentModalOpen(true);
  };

  const handleOpenContact = () => {
    setContactModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Draft Mode Banner (if owner is previewing draft) */}
      <DraftBanner
        hasDraftChanges={settings.has_draft_changes}
        isPreviewDraft={isPreviewDraft}
      />

      {/* Main Header / Navigation */}
      <Navbar
        clinicName={settings.clinic_name}
        phone={settings.phone}
        phoneDisplay={settings.phone_display}
        logoUrl={settings.logo_url}
        logoIcon={settings.logo_icon}
        logoTextFallback={settings.logo_text_fallback}
        logoHeight={settings.logo_height}
        logoBadgeStyle={settings.logo_badge_style}
        tagline={settings.tagline}
        onBookClick={() => handleOpenAppointment()}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <HeroSection
          headline={settings.hero_headline || settings.clinic_name}
          tagline={settings.hero_tagline || settings.tagline}
          description={settings.hero_description || settings.description}
          city={settings.city}
          phone={settings.phone}
          phoneDisplay={settings.phone_display}
          verifiedClinic={settings.verified_clinic}
          scheduleStatus={scheduleStatus}
          ratingScore={settings.rating_score}
          reviewsCount={settings.reviews_count}
          showRating={settings.show_rating}
          heroImageUrl={settings.hero_image_url}
          heroImages={settings.hero_images}
          onContactClick={handleOpenContact}
          onBookClick={() => handleOpenAppointment()}
        />

        {/* 5 Quick Service Badges Row */}
        <QuickServiceBadges
          services={services}
          onSelectService={(s) => handleOpenAppointment(s)}
        />

        {/* Our Clinic Gallery Section */}
        <GallerySection images={galleryImages} />

        {/* Two-Column Information Grid */}
        <InformationGrid
          settings={settings}
          hours={hours}
          services={services}
          scheduleStatus={scheduleStatus}
          onContactClick={handleOpenContact}
          onBookClick={() => handleOpenAppointment()}
        />
      </main>

      {/* Footer */}
      <Footer settings={settings} />

      {/* Interactive Modals */}
      <AppointmentModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        services={services}
        preselectedService={selectedService}
        clinicName={settings.clinic_name}
        city={settings.city}
        logoUrl={settings.logo_url}
        logoIcon={settings.logo_icon}
      />

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        clinicPhone={settings.phone}
        clinicName={settings.clinic_name}
      />
    </div>
  );
}
