'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  CheckCircle2,
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
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  ClinicSettings,
  Appointment,
  ContactMessage,
  AdminActivityLog,
} from '@/types/clinic';

interface AdminOverviewClientProps {
  settings: ClinicSettings;
  appointments: Appointment[];
  messages: ContactMessage[];
  logs: AdminActivityLog[];
  stats: {
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    totalMessages: number;
    unreadMessages: number;
  };
}

export default function AdminOverviewClient({
  settings,
  appointments,
  messages,
  logs,
  stats,
}: AdminOverviewClientProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    setUpdatingId(id);
    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkMessageRead = async (id: string) => {
    try {
      await fetch('/api/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_read: true }),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & Quick Summary */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0878F9]">
            <Sparkles className="w-4 h-4" />
            <span>Clinic Control Center</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#153E70] mt-1">
            Welcome back, {settings.doctor_name || 'Owner'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Managing <strong className="text-slate-700">{settings.clinic_name}</strong> in {settings.city}, Pakistan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/profile"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Edit Profile
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold transition-all shadow-xs"
          >
            <span>Preview Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pending Appointments */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending</span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">
            {stats.pendingAppointments}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting confirmation</p>
        </div>

        {/* Confirmed Appointments */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Confirmed</span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">
            {stats.confirmedAppointments}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ready for patient visit</p>
        </div>

        {/* Total Appointments */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-[#0878F9] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
            <Calendar className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#153E70]">
            {stats.totalAppointments}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">All recorded requests</p>
        </div>

        {/* Unread Inquiries */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between text-blue-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Inquiries</span>
            <Inbox className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">
            {stats.unreadMessages}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">New contact messages</p>
        </div>

      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <h3 className="text-sm font-bold text-[#153E70] uppercase tracking-wider mb-4">
          Quick Actions &amp; Content Management
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/admin/contact"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0878F9] border border-slate-200/80 transition-all text-center group"
          >
            <Phone className="w-5 h-5 text-[#0878F9] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Change Phone</span>
          </Link>

          <Link
            href="/admin/branding"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0878F9] border border-slate-200/80 transition-all text-center group"
          >
            <ImageIcon className="w-5 h-5 text-[#0878F9] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Upload Logo</span>
          </Link>

          <Link
            href="/admin/location"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0878F9] border border-slate-200/80 transition-all text-center group"
          >
            <MapPin className="w-5 h-5 text-[#0878F9] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Update Location</span>
          </Link>

          <Link
            href="/admin/hours"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0878F9] border border-slate-200/80 transition-all text-center group"
          >
            <Clock className="w-5 h-5 text-[#0878F9] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Manage Hours</span>
          </Link>

          <Link
            href="/admin/services"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0878F9] border border-slate-200/80 transition-all text-center group"
          >
            <Stethoscope className="w-5 h-5 text-[#0878F9] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Edit Services</span>
          </Link>

          <Link
            href="/admin/gallery"
            className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0878F9] border border-slate-200/80 transition-all text-center group"
          >
            <ImageIcon className="w-5 h-5 text-[#0878F9] mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold">Add Photos</span>
          </Link>
        </div>
      </div>

      {/* Two Column Section: Recent Appointments & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Appointments */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#153E70] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0878F9]" />
              <span>Recent Appointment Requests</span>
            </h3>
            <Link
              href="/admin/appointments"
              className="text-xs font-semibold text-[#0878F9] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {appointments.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No appointment requests yet.</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-800 text-sm">{apt.patient_name}</strong>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : apt.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : apt.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                      <span>Phone: <a href={`tel:${apt.phone}`} className="text-[#0878F9] underline">{apt.phone}</a></span>
                      <span>Date: <strong>{apt.requested_date}</strong> at {apt.requested_time}</span>
                      <span>Service: <strong className="text-slate-700">{apt.service_title}</strong></span>
                    </div>
                  </div>

                  {/* Quick status actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {apt.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'confirmed')}
                        disabled={updatingId === apt.id}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 transition-colors"
                        title="Confirm Appointment"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm</span>
                      </button>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'completed')}
                        disabled={updatingId === apt.id}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#153E70] flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#0878F9]" />
              <span>Recent Messages</span>
            </h3>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-[#0878F9] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {messages.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No contact inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border text-xs transition-colors ${
                    msg.is_read
                      ? 'bg-slate-50 border-slate-200 text-slate-600'
                      : 'bg-blue-50/50 border-blue-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-sm text-[#153E70]">{msg.name}</strong>
                    {!msg.is_read ? (
                      <button
                        onClick={() => handleMarkMessageRead(msg.id)}
                        className="text-[10px] text-[#0878F9] font-bold hover:underline"
                      >
                        Mark Read
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Read</span>
                    )}
                  </div>
                  <p className="font-semibold text-slate-700">{msg.subject}</p>
                  <p className="text-slate-500 mt-1 line-clamp-2">{msg.message}</p>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Contact: <strong className="text-slate-600">{msg.contact_info}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Admin Activity Log */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200">
        <h3 className="text-sm font-bold text-[#153E70] uppercase tracking-wider mb-3">
          Recent Activity &amp; Audit Trail
        </h3>
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-b-0"
            >
              <div>
                <span className="font-semibold text-slate-800">{log.action}: </span>
                <span className="text-slate-600">{log.details}</span>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
