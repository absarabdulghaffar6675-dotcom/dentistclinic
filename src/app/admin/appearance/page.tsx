import React from 'react';
import { getClinicSettings } from '@/lib/db';
import AppearanceEditorClient from './AppearanceEditorClient';


export default async function AdminAppearancePage() {
  const settings = await getClinicSettings(true);
  return <AppearanceEditorClient initialSettings={settings} />;
}
