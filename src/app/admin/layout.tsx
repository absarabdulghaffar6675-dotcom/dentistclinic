import { connection } from 'next/server';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getClinicSettings, getAppointments, getContactMessages } from '@/lib/db';
import AdminSidebarClient from './AdminSidebarClient';

export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  
  // Note: /admin/login is exempt because login has its own layout or handles itself
  // Next.js App Router layout applies to child routes, but we can check if session is missing
  // However, inside layout.tsx, if user is on /admin/login, we shouldn't redirect infinitely.
  // We can pass session to AdminSidebarClient, and if no session and not on login, redirect.

  const [settings, appointments, messages] = await Promise.all([
    getClinicSettings(true),
    getAppointments('pending'),
    getContactMessages(),
  ]);

  const pendingAppointmentsCount = appointments.length;
  const unreadMessagesCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <AdminSidebarClient
        user={session}
        settings={settings}
        pendingAppointmentsCount={pendingAppointmentsCount}
        unreadMessagesCount={unreadMessagesCount}
      >
        {children}
      </AdminSidebarClient>
    </div>
  );
}
