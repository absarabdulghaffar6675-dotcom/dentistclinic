'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  contact_info: z.string().min(6, 'Please provide a valid phone number or email address'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  message: z.string().min(6, 'Message must be at least 6 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinicPhone: string;
  clinicName?: string;
}

export default function ContactModal({
  isOpen,
  onClose,
  clinicPhone,
  clinicName = 'Dynasty Dental Solutions',
}: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      contact_info: '',
      subject: '',
      message: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || 'Failed to send message');
      }

      setIsSuccess(true);
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error sending message';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
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
            <div className="w-10 h-10 rounded-xl bg-[#0878F9] flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Contact {clinicName}</h3>
              <p className="text-xs text-blue-100">Direct Message &amp; Inquiries</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#153E70]">
                Message Sent Successfully!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Thank you for reaching out. A dental staff member from {clinicName} will review your inquiry and respond shortly.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#0878F9] text-white font-semibold text-xs hover:bg-[#0667d6] transition-colors"
              >
                Close
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

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Asad Ali"
                  {...register('name')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                  }`}
                />
                {errors.name && (
                  <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Phone or Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number or Email *
                </label>
                <input
                  type="text"
                  placeholder="0306 1521205 or user@gmail.com"
                  {...register('contact_info')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] ${
                    errors.contact_info ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                  }`}
                />
                {errors.contact_info && (
                  <p className="text-rose-500 text-xs mt-1">{errors.contact_info.message}</p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dental Scaling / Teeth Whitening Pricing"
                  {...register('subject')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] ${
                    errors.subject ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                  }`}
                />
                {errors.subject && (
                  <p className="text-rose-500 text-xs mt-1">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  rows={3}
                  placeholder="Write your questions or details here..."
                  {...register('message')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] ${
                    errors.message ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200 bg-white'
                  }`}
                />
                {errors.message && (
                  <p className="text-rose-500 text-xs mt-1">{errors.message.message}</p>
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
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400 pt-1">
                For urgent emergencies, call directly at <strong className="text-slate-600">{clinicPhone}</strong>
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
