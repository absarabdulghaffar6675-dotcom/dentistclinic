'use client';

import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';
import { ToothIcon, FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon } from './DentalIcons';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  settings: ClinicSettings;
}

export default function Footer({ settings }: FooterProps) {
  const cleanPhone = settings.phone.replace(/\s+/g, '');

  return (
    <footer className="w-full bg-[#0D2646] text-white pt-12 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Info Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10 text-center md:text-left">
          
          {/* Brand Info */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <BrandLogo
              clinicName={settings.clinic_name}
              tagline={settings.tagline || `Modern Dentistry • Healthy Smiles • ${settings.city}`}
              logoUrl={settings.logo_url}
              logoIcon={settings.logo_icon}
              logoTextFallback={settings.logo_text_fallback}
              logoHeight={30}
              logoBadgeStyle={settings.logo_badge_style}
              showTagline={true}
              iconClassName="w-6 h-6 text-white stroke-[2.2]"
              textClassName="font-bold text-lg tracking-tight text-white"
              taglineClassName="text-xs text-blue-200/80 font-medium tracking-wide"
            />
          </div>

          {/* Quick Contact Chips */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-white/90 font-medium">
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1.5 hover:text-blue-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0878F9]" />
              <span>{settings.phone}</span>
            </a>
            
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0878F9]" />
              <span>{settings.city}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0878F9]" />
              <span>Open 24 hours</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            <a
              href={settings.social_facebook || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0878F9] flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="Facebook"
            >
              <FacebookIcon className="w-4 h-4 fill-current" />
            </a>
            <a
              href={settings.social_instagram || 'https://instagram.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0878F9] flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href={settings.social_youtube || 'https://youtube.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0878F9] flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="YouTube"
            >
              <YoutubeIcon className="w-4 h-4 fill-current" />
            </a>
            <a
              href={settings.social_twitter || 'https://twitter.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#0878F9] flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="Twitter"
            >
              <TwitterIcon className="w-4 h-4 fill-current" />
            </a>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center text-center gap-3 text-xs text-white/50">
          <p>
            &copy; {new Date().getFullYear()} {settings.clinic_name}. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
