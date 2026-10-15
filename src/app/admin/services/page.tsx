import React from 'react';
import { getServices } from '@/lib/db';
import ServicesManagerClient from './ServicesManagerClient';


export default async function AdminServicesPage() {
  const services = await getServices(false);
  return <ServicesManagerClient initialServices={services} />;
}
