import React from 'react';
import { getClinicSettings } from '@/lib/db';
import ContactEditorClient from './ContactEditorClient';


export default async function AdminContactPage() {
  const settings = await getClinicSettings(true);
  return <ContactEditorClient initialSettings={settings} />;
}
