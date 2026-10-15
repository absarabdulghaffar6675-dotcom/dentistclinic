import React from 'react';
import { getClinicSettings } from '@/lib/db';
import SeoEditorClient from './SeoEditorClient';


export default async function AdminSeoPage() {
  const settings = await getClinicSettings(true);
  return <SeoEditorClient initialSettings={settings} />;
}
