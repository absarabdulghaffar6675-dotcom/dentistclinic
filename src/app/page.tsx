import { Metadata } from 'next';
import { connection } from 'next/server';
import {
  getClinicSettings,
  getOpeningHours,
  getServices,
  getGalleryImages,
} from '@/lib/db';
import { calculateClinicStatus } from '@/lib/schedule';
import HomeClientWrapper from '@/components/HomeClientWrapper';
import { DynamicTabSync } from '@/components/DynamicTabSync';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ previewDraft?: string }>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const isPreview = resolvedSearchParams.previewDraft === 'true';
  const settings = await getClinicSettings(isPreview);
  const activeTitle = `${settings.clinic_name} | Best Dental Clinic in ${settings.city}`;

  return {
    title: activeTitle,
    description: settings.seo_meta_description || settings.description,
    keywords: settings.seo_keywords,
    openGraph: {
      title: activeTitle,
      description: settings.seo_meta_description || settings.description,
      images: [settings.og_image_url || '/images/hero-clinic.jpg'],
      type: 'website',
    },
    icons: {
      icon: [
        { url: '/api/favicon', type: 'image/svg+xml' },
      ],
      shortcut: ['/api/favicon'],
      apple: ['/api/favicon'],
    },
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ previewDraft?: string }>;
}) {
  await connection();
  const resolvedSearchParams = await searchParams;
  const isPreviewDraft = resolvedSearchParams.previewDraft === 'true';

  const [settings, hours, services, galleryImages] = await Promise.all([
    getClinicSettings(isPreviewDraft),
    getOpeningHours(),
    getServices(true),
    getGalleryImages(false),
  ]);

  const scheduleStatus = calculateClinicStatus(
    hours,
    settings.timezone,
    settings.holiday_notice,
    settings.show_holiday_notice
  );

  // LocalBusiness Schema.org JSON-LD for Dental Clinic SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: settings.clinic_name,
    description: settings.description,
    telephone: settings.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.full_address,
      addressLocality: settings.city,
      postalCode: settings.postal_code,
      addressCountry: settings.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings.latitude,
      longitude: settings.longitude,
    },
    url: 'https://dynastydentalsolutions.pk',
    image: settings.hero_image_url,
    priceRange: 'PKR',
    openingHoursSpecification: hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.day_of_week,
      opens: h.is_closed ? undefined : h.is_open_24h ? '00:00' : h.open_time,
      closes: h.is_closed ? undefined : h.is_open_24h ? '23:59' : h.close_time,
    })),
  };

  return (
    <>
      <DynamicTabSync
        clinicName={settings.clinic_name}
        logoIcon={settings.logo_icon}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClientWrapper
        settings={settings}
        hours={hours}
        services={services}
        galleryImages={galleryImages}
        scheduleStatus={scheduleStatus}
        isPreviewDraft={isPreviewDraft}
      />
    </>
  );
}
