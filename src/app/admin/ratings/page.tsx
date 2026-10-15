import React from 'react';
import { getClinicSettings, getTestimonials } from '@/lib/db';
import RatingsEditorClient from './RatingsEditorClient';


export default async function AdminRatingsPage() {
  const [settings, testimonials] = await Promise.all([
    getClinicSettings(true),
    getTestimonials(),
  ]);

  return <RatingsEditorClient initialSettings={settings} initialTestimonials={testimonials} />;
}
