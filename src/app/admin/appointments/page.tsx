import React from 'react';
import { getAppointments } from '@/lib/db';
import AppointmentsManagerClient from './AppointmentsManagerClient';


export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments();
  return <AppointmentsManagerClient initialAppointments={appointments} />;
}
