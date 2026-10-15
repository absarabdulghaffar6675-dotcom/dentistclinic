'use client';

import { useEffect } from 'react';

export function DynamicTabSync({
  clinicName,
  logoIcon = 'tooth',
}: {
  clinicName?: string;
  logoIcon?: string;
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // 1. Update tab title dynamically
    if (clinicName) {
      const currentTitle = document.title;
      if (
        !currentTitle ||
        currentTitle.includes('Dynasty Dental Solutions') ||
        currentTitle.includes('Create Next App') ||
        currentTitle.startsWith('Dynasty')
      ) {
        document.title = `${clinicName} | Best Dental Clinic in Faisalabad`;
      }
    }

    // 2. Update browser tab favicon dynamically with cache-busting
    const iconUrl = `/api/favicon?icon=${encodeURIComponent(logoIcon)}&t=${Date.now()}`;
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconUrl;
  }, [clinicName, logoIcon]);

  return null;
}
