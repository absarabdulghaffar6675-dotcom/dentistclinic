'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Menu, X, Shield, Calendar } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  clinicName: string;
  phone: string;
  phoneDisplay: string;
  logoUrl?: string;
  logoIcon?: string;
  logoTextFallback?: boolean;
  logoHeight?: number;
  logoBadgeStyle?: 'badge' | 'plain' | 'outline';
  tagline?: string;
  onBookClick?: () => void;
}

export default function Navbar({
  clinicName,
  phone,
  phoneDisplay,
  logoUrl,
  logoIcon = 'tooth',
  logoTextFallback = false,
  logoHeight = 36,
  logoBadgeStyle = 'plain',
  tagline,
  onBookClick,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cleanPhone = phone.replace(/\s+/g, '');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#153E70] text-white shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Name */}
          <Link href="/" className="group focus:outline-none">
            <BrandLogo
              clinicName={clinicName}
              tagline={tagline}
              logoUrl={logoUrl}
              logoIcon={logoIcon}
              logoTextFallback={logoTextFallback}
              logoHeight={logoHeight}
              logoBadgeStyle={logoBadgeStyle}
              iconClassName="w-8 h-8 text-white stroke-[2.2] transition-transform group-hover:scale-105"
              textClassName="font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-blue-100 transition-colors"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-8 text-sm font-medium">
            <Link
              href="#home"
              className="text-white hover:text-blue-200 px-3 py-2 transition-colors border-b-2 border-white"
            >
              Home
            </Link>
            <Link
              href="#about"
              className="text-white/90 hover:text-white px-3 py-2 transition-colors border-b-2 border-transparent hover:border-blue-300"
            >
              About
            </Link>
            <Link
              href="#services"
              className="text-white/90 hover:text-white px-3 py-2 transition-colors border-b-2 border-transparent hover:border-blue-300"
            >
              Services
            </Link>
            <Link
              href="#gallery"
              className="text-white/90 hover:text-white px-3 py-2 transition-colors border-b-2 border-transparent hover:border-blue-300"
            >
              Gallery
            </Link>
            <Link
              href="#contact"
              className="text-white/90 hover:text-white px-3 py-2 transition-colors border-b-2 border-transparent hover:border-blue-300"
            >
              Contact
            </Link>
          </nav>

          {/* Right Action: Call Pill Button */}
          <div className="hidden sm:flex items-center gap-3">
            {onBookClick && (
              <button
                onClick={onBookClick}
                className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-102"
              >
                <Calendar className="w-3.5 h-3.5" />
                Book Online
              </button>
            )}
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0878F9] hover:bg-[#0667d6] text-white text-sm font-semibold shadow-sm hover:shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{phoneDisplay || `Call ${phone}`}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center p-2 rounded-full bg-[#0878F9] text-white"
              aria-label="Call Clinic"
            >
              <Phone className="w-4 h-4 fill-current" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D2646] border-t border-white/10 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <Link
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-white hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-white/90 hover:bg-white/10"
          >
            About
          </Link>
          <Link
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-white/90 hover:bg-white/10"
          >
            Services
          </Link>
          <Link
            href="#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-white/90 hover:bg-white/10"
          >
            Gallery
          </Link>
          <Link
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-white/90 hover:bg-white/10"
          >
            Contact
          </Link>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href={`tel:${cleanPhone}`}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0878F9] text-white font-semibold text-sm shadow-md"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{phoneDisplay || `Call ${phone}`}</span>
            </a>
            {onBookClick && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onBookClick();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white font-semibold text-sm border border-white/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment Online</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
