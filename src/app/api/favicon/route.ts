import { NextResponse } from 'next/server';
import { getClinicSettings } from '@/lib/db';
import fs from 'fs';
import path from 'path';

function getIconSvg(iconName: string): string {
  let pathContent = '';

  switch (iconName) {
    case 'sparkles':
      pathContent = `
        <path d="m16 4-2 6-6 2 6 2 2 6 2-6 6-2-6-2-2-6z"/>
        <path d="m7 21 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z"/>
        <path d="m25 18 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z"/>
      `;
      break;

    case 'smile':
      pathContent = `
        <circle cx="16" cy="16" r="10" stroke-opacity="0.3"/>
        <path d="M11 18c1.5 3 8.5 3 10 0"/>
        <circle cx="12" cy="13" r="1.5" fill="#ffffff" stroke="none"/>
        <circle cx="20" cy="13" r="1.5" fill="#ffffff" stroke="none"/>
      `;
      break;

    case 'shield':
      pathContent = `
        <path d="M16 4s7 3 7 8c0 7-7 13-7 13S9 19 9 12c0-5 7-8 7-8z"/>
        <path d="M16 9v7"/>
        <path d="M12.5 12.5h7"/>
      `;
      break;

    case 'crown':
      pathContent = `
        <path d="m5 22 2-12 5 5 4-7 4 7 5-5 2 12H5z"/>
        <circle cx="16" cy="7" r="1" fill="#ffffff"/>
        <circle cx="7" cy="10" r="1" fill="#ffffff"/>
        <circle cx="25" cy="10" r="1" fill="#ffffff"/>
      `;
      break;

    case 'stethoscope':
      pathContent = `
        <path d="M7 6v6a5 5 0 0 0 10 0V6"/>
        <path d="M12 17v4a3 3 0 0 0 6 0v-2"/>
        <circle cx="20" cy="19" r="2"/>
        <circle cx="7" cy="6" r="1.5" fill="#ffffff"/>
        <circle cx="17" cy="6" r="1.5" fill="#ffffff"/>
      `;
      break;

    case 'heart':
      pathContent = `
        <path d="M22 6a5 5 0 0 0-6 1.8A5 5 0 0 0 10 6C6.7 6 4 8.7 4 12c0 6 12 14 12 14s12-8 12-14c0-3.3-2.7-6-6-6z"/>
        <path d="M7 13h4l2-3 3 6 2-3h4" stroke="#ffffff" stroke-width="2"/>
      `;
      break;

    case 'cross':
      pathContent = `
        <path d="M16 8v16" stroke-width="3.5"/>
        <path d="M8 16h16" stroke-width="3.5"/>
      `;
      break;

    case 'star':
      pathContent = `
        <polygon points="16 4 19.5 12 28 12.8 21.5 18.5 23.5 27 16 22.5 8.5 27 10.5 18.5 4 12.8 12.5 12" fill="#ffffff"/>
      `;
      break;

    case 'award':
      pathContent = `
        <circle cx="16" cy="12" r="6"/>
        <path d="m12.5 17-2.5 9 6-3 6 3-2.5-9"/>
      `;
      break;

    case 'activity':
      pathContent = `
        <polyline points="4 16 9 16 13 8 19 24 23 16 28 16" stroke-width="2.5"/>
      `;
      break;

    case 'syringe':
      pathContent = `
        <path d="m18 4 4 4"/>
        <path d="m15 7 5 5"/>
        <path d="m7 15 8-8 4 4-8 8H7v-4z"/>
        <path d="m11 11-4 4"/>
        <path d="m5 21-2 2"/>
      `;
      break;

    case 'tooth':
    default:
      pathContent = `
        <path d="M7.5 12C6.5 9.5 6.5 7 8 5.5c2-2 5-1.5 7 0 2-1.5 5-2 7 0 1.5 1.5 1.5 4 .5 6.5-1.5 4-2 7.5-3 10.5-.5 1.5-2 1.5-2.5 0-1-3-1.5-5.5-2-5.5s-1 2.5-2 5.5c-.5 1.5-2 1.5-2.5 0-1-3-1.5-6.5-3-10.5z" transform="translate(1.5, 0.5) scale(0.9)"/>
      `;
      break;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
      <rect width="32" height="32" rx="8" fill="#0878F9"/>
      <g fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        ${pathContent}
      </g>
    </svg>
  `.trim();
}

export async function GET() {
  try {
    const settings = await getClinicSettings(false);

    // If clinic has a custom uploaded logo image and it exists on disk or url
    if (
      settings.logo_url &&
      settings.logo_url !== '/images/tooth-logo.svg' &&
      !settings.logo_url.startsWith('data:image/svg+xml')
    ) {
      if (settings.logo_url.startsWith('/')) {
        const localPath = path.join(process.cwd(), 'public', settings.logo_url);
        if (fs.existsSync(localPath)) {
          const buffer = fs.readFileSync(localPath);
          const ext = path.extname(localPath).toLowerCase();
          const contentType =
            ext === '.svg'
              ? 'image/svg+xml'
              : ext === '.png'
              ? 'image/png'
              : ext === '.ico'
              ? 'image/x-icon'
              : 'image/jpeg';

          return new NextResponse(buffer, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
        }
      }
    }

    const iconSvg = getIconSvg(settings.logo_icon || 'tooth');

    return new NextResponse(iconSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch {
    const defaultSvg = getIconSvg('tooth');
    return new NextResponse(defaultSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}
