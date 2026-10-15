import React from 'react';
import { getClinicSettings } from '@/lib/db';
import AboutEditorClient from './AboutEditorClient';


export default async function AdminAboutPage() {
  const settings = await getClinicSettings(true);
  return <AboutEditorClient initialSettings={settings} />;
}
