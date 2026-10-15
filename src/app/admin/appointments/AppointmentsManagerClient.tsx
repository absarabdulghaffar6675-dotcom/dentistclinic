'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Search,
  Check,
  X,
  Clock,
  Phone,
  Mail,
  Trash2,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { Appointment } from '@/types/clinic';

export default function AppointmentsManagerClient({
  initialAppointments,
}: {
  initialAppointments: Appointment[];
}) {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = appointments.filter((apt) => {
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    const matchesSearch =
      !searchTerm ||
      apt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phone.includes(searchTerm) ||
      apt.service_title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Status update failed');

      setAppointments(
        appointments.map((a) => (a.id === id ? { ...a, status } : a))
      );
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, patientName: string) => {
    if (!confirm(`Permanently delete appointment for ${patientName}?`)) return;

    try {
      await fetch(`/api/appointments?id=${id}`, { method: 'DELETE' });
      setAppointments(appointments.filter((a) => a.id !== id));
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#153E70] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0878F9]" />
            <span>Appointment Requests &amp; Schedule</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming patient bookings, confirm slots, and manage clinic schedule.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] bg-white"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filterStatus === tab
                ? 'bg-[#153E70] text-white'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            {tab}{' '}
            <span className="opacity-70 text-[10px]">
              (
              {tab === 'all'
                ? appointments.length
                : appointments.filter((a) => a.status === tab).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm font-semibold">No appointments found</p>
          <p className="text-slate-400 text-xs mt-1">
            {searchTerm ? 'Try adjusting your search criteria.' : 'New requests from the website will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => {
            const cleanPhone = apt.phone.replace(/\D/g, '');
            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-sm sm:text-base text-[#153E70]">
                      {apt.patient_name}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : apt.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-medium text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-[#0878F9]" />
                      <span>{apt.requested_date} at {apt.requested_time}</span>
                    </span>

                    <span className="text-slate-400">&bull;</span>
                    <span className="font-semibold text-[#0878F9]">{apt.service_title}</span>

                    <span className="text-slate-400">&bull;</span>
                    <a
                      href={`tel:${apt.phone}`}
                      className="flex items-center gap-1 text-slate-700 hover:text-[#0878F9] underline"
                    >
                      <Phone className="w-3 h-3" />
                      <span>{apt.phone}</span>
                    </a>

                    {apt.email && (
                      <>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-slate-500">{apt.email}</span>
                      </>
                    )}
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                      <strong className="text-slate-700">Patient Note:</strong> {apt.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* WhatsApp Quick Chat */}
                  <a
                    href={`https://wa.me/${cleanPhone.startsWith('92') ? cleanPhone : '92' + cleanPhone.replace(/^0/, '')}?text=Hello%20${encodeURIComponent(apt.patient_name)},%20this%20is%20Dynasty%20Dental%20Solutions%20regarding%20your%20appointment.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                    title="WhatsApp Patient"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  {apt.status !== 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'confirmed')}
                      disabled={updatingId === apt.id}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm</span>
                    </button>
                  )}

                  {apt.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'completed')}
                      disabled={updatingId === apt.id}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}

                  {apt.status !== 'cancelled' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'cancelled')}
                      disabled={updatingId === apt.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(apt.id, apt.patient_name)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
