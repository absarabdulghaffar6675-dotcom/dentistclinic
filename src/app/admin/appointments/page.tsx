import React from 'react';
import { connection } from 'next/server';
import { getAppointments } from '@/lib/db';
import AppointmentsManagerClient from './AppointmentsManagerClient';

export default async function AdminAppointmentsPage() {
  await connection();
  const appointments = await getAppointments();
  return <AppointmentsManagerClient initialAppointments={appointments} />;
}
