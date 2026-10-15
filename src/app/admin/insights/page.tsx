import React from 'react';
import { getClinicSettings } from '@/lib/db';
import InsightsEditorClient from './InsightsEditorClient';


export default async function AdminInsightsPage() {
  const settings = await getClinicSettings(true);
  return <InsightsEditorClient initialSettings={settings} />;
}
