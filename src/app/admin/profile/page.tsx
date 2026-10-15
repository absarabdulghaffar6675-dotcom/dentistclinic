import React from 'react';
import { getClinicSettings } from '@/lib/db';
import ProfileEditorClient from './ProfileEditorClient';


export default async function AdminProfilePage() {
  const settings = await getClinicSettings(true);
  return <ProfileEditorClient initialSettings={settings} />;
}
