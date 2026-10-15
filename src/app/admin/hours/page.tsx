import React from 'react';
import { getClinicSettings, getOpeningHours } from '@/lib/db';
import HoursEditorClient from './HoursEditorClient';


export default async function AdminHoursPage() {
  const [settings, hours] = await Promise.all([
    getClinicSettings(true),
    getOpeningHours(),
  ]);

  return <HoursEditorClient initialSettings={settings} initialHours={hours} />;
}
