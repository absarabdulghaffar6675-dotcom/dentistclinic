'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Building2, Save, Upload, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';

export default function ProfileEditorClient({
  initialSettings,
}: {
  initialSettings: ClinicSettings;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clinic_name: initialSettings.clinic_name,
    tagline: initialSettings.tagline,
    description: initialSettings.description,
    doctor_name: initialSettings.doctor_name,
    doctor_credentials: initialSettings.doctor_credentials,
    doctor_bio: initialSettings.doctor_bio || '',
    doctor_image_url: initialSettings.doctor_image_url || '/images/doctor-profile.jpg',
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMessage(null);
    try {
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/gallery/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');

      setFormData((prev) => ({ ...prev, doctor_image_url: json.url }));
      setStatusMessage({ type: 'success', text: 'Doctor photo uploaded! Remember to save changes.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (isDraft: boolean) => {
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          seo_meta_title: `${formData.clinic_name} | Best Dental Clinic in ${initialSettings.city || 'Faisalabad'}`,
          isDraft,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save');

      setStatusMessage({
        type: 'success',
        text: isDraft ? 'Draft changes saved!' : 'Clinic profile published to live website!',
      });
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving profile';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#153E70] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#0878F9]" />
            <span>Clinic Profile &amp; Doctor Info</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your clinic identity, doctor credentials, and public descriptions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Publish Changes</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Clinic Details */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinic Name *
            </label>
            <input
              type="text"
              value={formData.clinic_name}
              onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinic Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinic Description / Introduction
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#153E70] mb-3">
              Principal Dentist Details
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dentist Full Name
                </label>
                <input
                  type="text"
                  value={formData.doctor_name}
                  onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Professional Credentials &amp; Title
                </label>
                <input
                  type="text"
                  value={formData.doctor_credentials}
                  onChange={(e) => setFormData({ ...formData, doctor_credentials: e.target.value })}
                  placeholder="e.g. BDS, RDS — Consultant Dental Surgeon"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dentist Bio
                </label>
                <textarea
                  rows={3}
                  value={formData.doctor_bio}
                  onChange={(e) => setFormData({ ...formData, doctor_bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Doctor Photo */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-[#153E70]">Dentist Profile Picture</h3>
          
          <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            {formData.doctor_image_url && (
              <Image
                src={formData.doctor_image_url}
                alt="Doctor Profile"
                fill
                className="object-cover"
              />
            )}
          </div>

          <div>
            <label className="block w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center cursor-pointer transition-colors border border-slate-200">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? 'Uploading Photo...' : 'Upload / Replace Doctor Photo'}
            </label>
            <p className="text-[11px] text-slate-400 text-center mt-1.5">
              Supports JPG, PNG, WebP up to 10MB
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
