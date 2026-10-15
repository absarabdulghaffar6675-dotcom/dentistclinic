'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Service } from '@/types/clinic';
import { ToothIcon } from './DentalIcons';
import { LogoIconRenderer } from './BrandLogo';

const appointmentSchema = z.object({
  patient_name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid Pakistani phone number (e.g. 0306 1521205)'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  requested_date: z.string().min(1, 'Please select a date for your visit'),
  requested_time: z.string().min(1, 'Please select a preferred time slot'),
  service_title: z.string().min(1, 'Please select a dental service'),
  notes: z.string().optional(),
  consent_given: z.boolean().refine((val) => val === true, 'You must consent to being contacted for appointment confirmation'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  preselectedService?: Service | null;
  clinicName?: string;
  city?: string;
  logoUrl?: string;
  logoIcon?: string;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  services,
  preselectedService,
  clinicName = 'Dynasty Dental Solutions',
  city = 'Faisalabad',
  logoUrl,
  logoIcon = 'tooth',
}: AppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ id: string; name: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_name: '',
      phone: '',
      email: '',
      requested_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      requested_time: '11:00 AM',
      service_title: preselectedService?.title || 'General Dentistry',
      notes: '',
      consent_given: true,
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const selectedServiceObj = services.find((s) => s.title === data.service_title);

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          service_id: selectedServiceObj?.id || 'general',
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Failed to submit appointment request');
      }

      setSuccessData({
        id: resData.appointment?.id || 'DDS-' + Math.floor(1000 + Math.random() * 9000),
        name: data.patient_name,
      });
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while booking';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccessData(null);
    setErrorMessage(null);
    onClose();
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM', '12:00 AM (Night)'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#153E70] text-white p-6 relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0878F9] flex items-center justify-center text-white shrink-0 shadow-md">
              <LogoIconRenderer iconName={logoIcon} className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Request an Appointment</h3>
              <p className="text-xs text-blue-100">{clinicName} &bull; {city}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-[#153E70]">
                Appointment Request Received!
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-800">{successData.name}</strong>. Your request has been logged. Our clinic reception will call you shortly at your provided phone number to confirm your schedule.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono">
                Booking Reference: DDS-{successData.id.slice(0, 8).toUpperCase()}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 rounded-full bg-[#0878F9] text-white font-semibold text-sm hover:bg-[#0667d6] transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Patient Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Mehmood"
                  {...register('patient_name')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] ${
                    errors.patient_name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                  }`}
                />
                {errors.patient_name && (
                  <p className="text-rose-500 text-xs mt-1">{errors.patient_name.message}</p>
                )}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="0306 1521205"
                    {...register('phone')}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] ${
                      errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-rose-500 text-xs mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="patient@gmail.com"
                    {...register('email')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Required Service *
                </label>
                <select
                  {...register('service_title')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] bg-white"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Other Consultation">Other Consultation / Checkup</option>
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('requested_date')}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    {...register('requested_time')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] bg-white"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Symptoms or Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your toothache, emergency symptoms, or questions..."
                  {...register('notes')}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consent_given')}
                    className="mt-0.5 rounded text-[#0878F9] focus:ring-[#0878F9] w-4 h-4 border-slate-300"
                  />
                  <span className="text-xs text-slate-600 leading-snug">
                    I agree to be contacted by Dynasty Dental Solutions regarding this appointment request.
                  </span>
                </label>
                {errors.consent_given && (
                  <p className="text-rose-500 text-xs mt-1">{errors.consent_given.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-full bg-[#0878F9] hover:bg-[#0667d6] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Submit Appointment Request</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
