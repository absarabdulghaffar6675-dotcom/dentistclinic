'use client';

import React from 'react';
import Image from 'next/image';
import {
  Stethoscope,
  HeartPulse,
  Sparkles,
  Smile,
  Shield,
  Crown,
  Activity,
  Plus,
  Star,
  Award,
  Syringe,
  LucideIcon,
} from 'lucide-react';
import { ToothIcon } from './DentalIcons';

export interface LogoIconOption {
  id: string;
  label: string;
  category: 'Dental' | 'Clinical' | 'Premium';
  description: string;
}

export const AVAILABLE_LOGO_ICONS: LogoIconOption[] = [
  { id: 'tooth', label: 'Dental Tooth', category: 'Dental', description: 'Classic healthy molar tooth symbol' },
  { id: 'sparkles', label: 'Cosmetic Sparkles', category: 'Dental', description: 'Teeth whitening & aesthetic glow' },
  { id: 'smile', label: 'Healthy Smile', category: 'Dental', description: 'Friendly welcoming patient smile' },
  { id: 'shield', label: 'Dental Shield', category: 'Dental', description: 'Preventative care & tooth protection' },
  { id: 'crown', label: 'Dental Crown', category: 'Dental', description: 'Prosthetic crown & premium dentistry' },
  { id: 'stethoscope', label: 'Stethoscope', category: 'Clinical', description: 'Consultant surgeon & diagnostics' },
  { id: 'heart', label: 'Heart Pulse', category: 'Clinical', description: 'Comprehensive health & gentle care' },
  { id: 'cross', label: 'Medical Plus', category: 'Clinical', description: '24/7 clinic & emergency response' },
  { id: 'syringe', label: 'Gentle Care', category: 'Clinical', description: 'Painless anesthesia & oral surgery' },
  { id: 'star', label: 'Premier Star', category: 'Premium', description: 'Top rated 5-star clinic excellence' },
  { id: 'award', label: 'Certified Badge', category: 'Premium', description: 'Accredited specialist qualification' },
  { id: 'activity', label: 'Vitality Pulse', category: 'Premium', description: 'State-of-the-art dental technology' },
];

export function LogoIconRenderer({
  iconName = 'tooth',
  className = 'w-6 h-6',
  color = 'currentColor',
}: {
  iconName?: string;
  className?: string;
  color?: string;
}) {
  switch (iconName) {
    case 'sparkles':
      return <Sparkles className={className} color={color} />;
    case 'smile':
      return <Smile className={className} color={color} />;
    case 'shield':
      return <Shield className={className} color={color} />;
    case 'crown':
      return <Crown className={className} color={color} />;
    case 'stethoscope':
      return <Stethoscope className={className} color={color} />;
    case 'heart':
      return <HeartPulse className={className} color={color} />;
    case 'cross':
      return <Plus className={className} color={color} strokeWidth={2.6} />;
    case 'syringe':
      return <Syringe className={className} color={color} />;
    case 'star':
      return <Star className={className} color={color} />;
    case 'award':
      return <Award className={className} color={color} />;
    case 'activity':
      return <Activity className={className} color={color} />;
    case 'tooth':
    default:
      return <ToothIcon className={className} color={color} />;
  }
}

export interface BrandLogoProps {
  clinicName?: string;
  tagline?: string;
  logoUrl?: string;
  logoIcon?: string;
  logoTextFallback?: boolean;
  logoHeight?: number;
  logoBadgeStyle?: 'badge' | 'plain' | 'outline';
  showTagline?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  taglineClassName?: string;
  badgeClassName?: string;
  isLink?: boolean;
}

export function BrandLogo({
  clinicName = 'Dynasty Dental Solutions',
  tagline,
  logoUrl,
  logoIcon = 'tooth',
  logoTextFallback = false,
  logoHeight = 36,
  logoBadgeStyle = 'plain',
  showTagline = false,
  className = '',
  iconClassName = 'w-7 h-7 text-white stroke-[2.2]',
  textClassName = 'font-bold text-lg tracking-tight text-white',
  taglineClassName = 'text-[11px] text-blue-200/90 font-medium tracking-wide',
  badgeClassName = 'bg-[#0878F9] text-white p-2 rounded-xl shadow-md flex items-center justify-center shrink-0',
}: BrandLogoProps) {
  const isCustomUploadedImage =
    logoUrl &&
    logoUrl !== '/images/tooth-logo.svg' &&
    !logoUrl.startsWith('data:image/svg+xml') &&
    (logoUrl.startsWith('http') || logoUrl.startsWith('/') || logoUrl.startsWith('blob:'));

  const renderIconContent = () => {
    if (logoTextFallback) {
      return null;
    }

    if (isCustomUploadedImage) {
      return (
        <div
          style={{ height: `${logoHeight}px`, width: `${logoHeight}px` }}
          className="relative shrink-0 flex items-center justify-center"
        >
          <Image
            src={logoUrl!}
            alt={clinicName}
            width={logoHeight}
            height={logoHeight}
            className="w-full h-full object-contain"
            unoptimized={logoUrl!.startsWith('blob:') || logoUrl!.startsWith('http')}
          />
        </div>
      );
    }

    if (logoBadgeStyle === 'badge') {
      return (
        <div className={badgeClassName}>
          <LogoIconRenderer iconName={logoIcon} className={iconClassName} />
        </div>
      );
    }

    if (logoBadgeStyle === 'outline') {
      return (
        <div className="border border-white/20 p-2 rounded-xl text-white flex items-center justify-center shrink-0">
          <LogoIconRenderer iconName={logoIcon} className={iconClassName} />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center shrink-0">
        <LogoIconRenderer iconName={logoIcon} className={iconClassName} />
      </div>
    );
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {renderIconContent()}
      
      <div className="flex flex-col min-w-0">
        <span className={textClassName}>
          {clinicName}
        </span>
        {showTagline && tagline && (
          <span className={taglineClassName}>
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}
