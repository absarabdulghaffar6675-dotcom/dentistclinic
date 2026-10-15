'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sparkles, Save, Upload, Check, AlertCircle, Loader2, Plus, Trash2, Clock } from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';

const PRESET_CLINIC_PHOTOS = [
  { url: '/images/hero-clinic.jpg', name: 'Main Clinic Hero' },
  { url: '/images/treatment-room.jpg', name: 'Dental Treatment Room' },
  { url: '/images/waiting-lounge.jpg', name: 'Patient Waiting Lounge' },
  { url: '/images/clinic-exterior.jpg', name: 'Clinic Exterior' },
  { url: '/images/smile-aesthetic.jpg', name: 'Aesthetic Smile Care' },
];

export default function HeroEditorClient({
  initialSettings,
}: {
  initialSettings: ClinicSettings;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    hero_headline: initialSettings.hero_headline || initialSettings.clinic_name,
    hero_tagline: initialSettings.hero_tagline || initialSettings.tagline,
    hero_description: initialSettings.hero_description || initialSettings.description,
    verified_clinic: initialSettings.verified_clinic,
    show_rating: initialSettings.show_rating,
    hero_image_url: initialSettings.hero_image_url || '/images/hero-clinic.jpg',
    hero_images: initialSettings.hero_images && initialSettings.hero_images.length > 0
      ? initialSettings.hero_images
      : [
          '/images/hero-clinic.jpg',
          '/images/treatment-room.jpg',
          '/images/waiting-lounge.jpg',
          '/images/clinic-exterior.jpg',
          '/images/smile-aesthetic.jpg',
        ],
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setFormData((prev) => ({
        ...prev,
        hero_image_url: json.url,
        hero_images: [json.url, ...prev.hero_images.filter((img) => img !== json.url)],
      }));
      setStatusMessage({ type: 'success', text: 'New photo added to the rotating hero pictures!' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setUploading(false);
    }
  };

  const handleAddPresetPhoto = (url: string) => {
    if (formData.hero_images.includes(url)) return;
    setFormData((prev) => ({
      ...prev,
      hero_images: [...prev.hero_images, url],
    }));
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    if (formData.hero_images.length <= 1) {
      setStatusMessage({
        type: 'error',
        text: 'At least one hero picture must remain in the carousel.',
      });
      return;
    }
    const updated = formData.hero_images.filter((_, idx) => idx !== indexToRemove);
    setFormData((prev) => ({
      ...prev,
      hero_images: updated,
      hero_image_url: updated[0] || prev.hero_image_url,
    }));
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
          isDraft,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save');

      setStatusMessage({
        type: 'success',
        text: isDraft ? 'Hero draft saved.' : 'Hero section & rotating images updated on live website!',
      });
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving';
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
            <Sparkles className="w-5 h-5 text-[#0878F9]" />
            <span>Hero Section &amp; Rotating Photos</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize the main banner headline, description, badges, and carousel pictures that rotate every 5 seconds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Headline & Content */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-[#153E70]">Main Headline &amp; Information</h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={formData.hero_headline}
              onChange={(e) => setFormData({ ...formData, hero_headline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={formData.hero_tagline}
              onChange={(e) => setFormData({ ...formData, hero_tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.hero_description}
              onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.verified_clinic}
                onChange={(e) => setFormData({ ...formData, verified_clinic: e.target.checked })}
                className="w-4 h-4 rounded text-[#0878F9] focus:ring-[#0878F9]"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display &quot;Verified Clinic&quot; Badge
                </span>
                <span className="text-[11px] text-slate-500">
                  Shows the blue verified checkmark pill badge above the headline.
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.show_rating}
                onChange={(e) => setFormData({ ...formData, show_rating: e.target.checked })}
                className="w-4 h-4 rounded text-[#0878F9] focus:ring-[#0878F9]"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Display Rating Stars &amp; Reviews Count
                </span>
                <span className="text-[11px] text-slate-500">
                  Shows 5.0 (317) rating in the hero section.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Right Form: Rotating Hero Pictures */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#153E70]">Rotating Hero Pictures</h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#0878F9] text-[10px] font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Rotates every 5s</span>
            </span>
          </div>

          {/* Current carousel images */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-700 block">
              Active Carousel Photos ({formData.hero_images.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {formData.hero_images.map((imgUrl, idx) => (
                <div
                  key={`${imgUrl}-${idx}`}
                  className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group"
                >
                  <Image
                    src={imgUrl}
                    alt={`Hero ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between p-2">
                    <span className="text-[10px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                      title="Remove from carousel"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload New Photo Button */}
          <div>
            <label className="block w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-sky-50 text-[#0878F9] text-xs font-semibold text-center cursor-pointer transition-colors border-2 border-dashed border-sky-200 hover:border-[#0878F9]">
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <Upload className="w-4 h-4 mx-auto mb-1" />
              <span>{uploading ? 'Uploading Photo...' : '+ Upload New Photo to Carousel'}</span>
            </label>
          </div>

          {/* Quick Preset Library */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 block">
              Quick Add From Clinic Photo Library
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_CLINIC_PHOTOS.map((preset) => {
                const isAdded = formData.hero_images.includes(preset.url);
                return (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => handleAddPresetPhoto(preset.url)}
                    disabled={isAdded}
                    className={`p-2 rounded-lg border text-left text-[11px] flex items-center justify-between transition-colors ${
                      isAdded
                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-default'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-[#0878F9] hover:bg-sky-50/50 cursor-pointer'
                    }`}
                  >
                    <span className="truncate">{preset.name}</span>
                    {isAdded ? (
                      <Check className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />
                    ) : (
                      <Plus className="w-3 h-3 text-[#0878F9] shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
