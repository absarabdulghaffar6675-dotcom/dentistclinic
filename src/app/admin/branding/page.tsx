import React from 'react';
import { getClinicSettings } from '@/lib/db';
import BrandingEditorClient from './BrandingEditorClient';


export default async function AdminBrandingPage() {
  const settings = await getClinicSettings(true);
  return <BrandingEditorClient initialSettings={settings} />;
}
