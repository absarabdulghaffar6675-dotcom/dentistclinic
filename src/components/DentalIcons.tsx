import React from 'react';

// Custom clean dental SVG icons matching the reference aesthetic
export function ToothIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 10.5C3.5 8 3.5 5.5 5 4c2-2 5-1.5 7 0 2-1.5 5-2 7 0 1.5 1.5 1.5 4 .5 6.5-1.5 4-2 7.5-3 10.5-.5 1.5-2 1.5-2.5 0-1-3-1.5-5.5-2-5.5s-1 2.5-2 5.5c-.5 1.5-2 1.5-2.5 0-1-3-1.5-6.5-3-10.5z" />
    </svg>
  );
}

export function SmileIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 13c1.5 3 8.5 3 10 0" />
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" strokeOpacity="0.2" />
    </svg>
  );
}

export function SparklesDentalIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.5 4.5L6 9l4.5 1.5L12 15l1.5-4.5L18 9l-4.5-1.5L12 3z" />
      <path d="M5 18l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" />
      <path d="M19 15l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" />
    </svg>
  );
}

export function RootCanalIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 10.5C3.5 8 3.5 5.5 5 4c2-2 5-1.5 7 0 2-1.5 5-2 7 0 1.5 1.5 1.5 4 .5 6.5-1.5 4-2 7.5-3 10.5-.5 1.5-2 1.5-2.5 0-1-3-1.5-5.5-2-5.5s-1 2.5-2 5.5c-.5 1.5-2 1.5-2.5 0-1-3-1.5-6.5-3-10.5z" />
      <path d="M9 11v5" strokeDasharray="2 2" />
      <path d="M15 11v5" strokeDasharray="2 2" />
    </svg>
  );
}

export function EmergencyClockIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export function YoutubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function TwitterIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export function ServiceIconRenderer({
  iconName,
  className = "w-7 h-7 text-[#0878F9]",
}: {
  iconName: string;
  className?: string;
}) {
  switch (iconName) {
    case 'tooth':
      return <ToothIcon className={className} />;
    case 'smile':
      return <SmileIcon className={className} />;
    case 'sparkles':
      return <SparklesDentalIcon className={className} />;
    case 'root-canal':
      return <RootCanalIcon className={className} />;
    case 'clock':
      return <EmergencyClockIcon className={className} />;
    default:
      return <ToothIcon className={className} />;
  }
}
