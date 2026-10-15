import React from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle,
  Inbox,
  AlertTriangle,
  ArrowRight,
  Phone,
  Image as ImageIcon,
  MapPin,
  Stethoscope,
  Eye,
  Check,
  X,
} from 'lucide-react';
import {
  getClinicSettings,
  getAppointments,
  getContactMessages,
  getActivityLogs,
} from '@/lib/db';
import { connection } from 'next/server';
import AdminOverviewClient from './AdminOverviewClient';

export default async function AdminOverviewPage() {
  await connection();
  const [settings, appointments, messages, logs] = await Promise.all([
    getClinicSettings(true),
    getAppointments(),
    getContactMessages(),
    getActivityLogs(),
  ]);

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed').length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.is_read).length;

  return (
    <AdminOverviewClient
      settings={settings}
      appointments={appointments.slice(0, 5)}
      messages={messages.slice(0, 5)}
      logs={logs.slice(0, 5)}
      stats={{
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        totalMessages,
        unreadMessages,
      }}
    />
  );
}
