import React from 'react';
import { getClinicSettings } from '@/lib/db';
import LocationEditorClient from './LocationEditorClient';


export default async function AdminLocationPage() {
  const settings = await getClinicSettings(true);
  return <LocationEditorClient initialSettings={settings} />;
}
