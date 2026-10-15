'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone, MessageSquare, MapPin, CheckCircle, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { ScheduleStatus } from '@/lib/schedule';

interface HeroSectionProps {
  headline: string;
  tagline: string;
  description: string;
  city: string;
  phone: string;
  phoneDisplay: string;
  verifiedClinic: boolean;
  scheduleStatus: ScheduleStatus;
  ratingScore: number;
  reviewsCount: number;
  showRating: boolean;
  heroImageUrl: string;
  heroImages?: string[];
  onContactClick: () => void;
  onBookClick: () => void;
}

export default function HeroSection({
  headline,
  description,
  city,
  phone,
  phoneDisplay,
  verifiedClinic,
  scheduleStatus,
  ratingScore,
  reviewsCount,
  showRating,
  heroImageUrl,
  heroImages,
  onContactClick,
  onBookClick,
}: HeroSectionProps) {
  const cleanPhone = phone.replace(/\s+/g, '');

  // Build the list of images to display in the rotating carousel
  const defaultImages = [
    heroImageUrl || '/images/hero-clinic.jpg',
    '/images/treatment-room.jpg',
    '/images/waiting-lounge.jpg',
    '/images/clinic-exterior.jpg',
    '/images/smile-aesthetic.jpg',
  ];

  const activeImageList =
    heroImages && heroImages.length > 0
      ? heroImages
      : defaultImages;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate every 5 seconds (5000ms)
  useEffect(() => {
    if (activeImageList.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeImageList.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [activeImageList.length, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeImageList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeImageList.length) % activeImageList.length);
  };

  return (
    <section id="home" className="w-full bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] pt-8 pb-12 sm:pt-12 sm:pb-16 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Clinic Information */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            
            {/* Verified Clinic Badge */}
            {verifiedClinic && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0878F9] text-xs font-semibold border border-blue-100/80 shadow-xs">
                <CheckCircle className="w-3.5 h-3.5 fill-[#0878F9] text-white" />
                <span>Verified Clinic</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-[#153E70] leading-[1.15]">
              {headline}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Meta Row: Location • Status • Rating */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-slate-700 pt-1">
              {/* Location Badge */}
              <div className="flex items-center gap-1.5 text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dentist in {city}</span>
              </div>

              <span className="text-slate-300">•</span>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${
                    scheduleStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                  }`}
                />
                <span
                  className={scheduleStatus.isOpen ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}
                >
                  {scheduleStatus.statusText}
                </span>
              </div>

              {/* Rating */}
              {showRating && (
                <>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1 text-slate-800">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold ml-0.5">{ratingScore.toFixed(1)}</span>
                    <span className="text-slate-500">({reviewsCount})</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0878F9] hover:bg-[#0667d6] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>{phoneDisplay || `Call ${phone}`}</span>
              </a>

              <button
                type="button"
                onClick={onContactClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-sky-50 text-[#0878F9] font-semibold text-sm border border-sky-200/80 shadow-xs hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact us</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Rotating Image Display (changes every 5 seconds) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-white group select-none">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                {activeImageList.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${headline} slide ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      className="object-cover transform transition-transform duration-7000 ease-out hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ))}

                {/* Subtle dark gradient overlay at the bottom for readability */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent z-20 pointer-events-none" />

                {/* Manual Navigation Arrows (appear on hover) */}
                {activeImageList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
                      aria-label="Previous Hero Image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
                      aria-label="Next Hero Image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Slide Indicators / Dots */}
                {activeImageList.length > 1 && (
                  <div className="absolute bottom-3 left-4 sm:bottom-4 sm:left-5 z-30 flex items-center gap-1.5">
                    {activeImageList.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setCurrentIndex(dotIdx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          dotIdx === currentIndex
                            ? 'w-6 bg-white shadow-sm'
                            : 'w-1.5 bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                    <span className="text-[10px] text-white/90 font-medium ml-1.5 drop-shadow-sm font-mono">
                      {currentIndex + 1}/{activeImageList.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Aesthetic Floating Badge on Image */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-sky-100 shadow-md text-xs font-semibold text-[#153E70] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>24/7 Dental Emergency Care</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
