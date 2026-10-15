import React from 'react';
import { getClinicSettings } from '@/lib/db';
import HeroEditorClient from './HeroEditorClient';


export default async function AdminHeroPage() {
  const settings = await getClinicSettings(true);
  return <HeroEditorClient initialSettings={settings} />;
}
