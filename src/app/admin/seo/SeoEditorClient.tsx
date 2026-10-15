'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';

export default function SeoEditorClient({
  initialSettings,
}: {
  initialSettings: ClinicSettings;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    seo_meta_title: initialSettings.seo_meta_title || '',
    seo_meta_description: initialSettings.seo_meta_description || '',
    seo_keywords: initialSettings.seo_keywords || '',
    social_facebook: initialSettings.social_facebook || '',
    social_instagram: initialSettings.social_instagram || '',
    social_youtube: initialSettings.social_youtube || '',
    social_twitter: initialSettings.social_twitter || '',
  });

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      if (!res.ok) throw new Error(json.error || 'Failed to save SEO');

      setStatusMessage({
        type: 'success',
        text: isDraft ? 'SEO draft saved.' : 'SEO metadata published to live website!',
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
            <Globe className="w-5 h-5 text-[#0878F9]" />
            <span>SEO &amp; Social Links</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage search engine rankings, meta titles, Google previews, and social media handles.
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

      {/* SEO Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-[#153E70]">Search Engine Optimization (SEO)</h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Browser Title Tag
          </label>
          <input
            type="text"
            value={formData.seo_meta_title}
            onChange={(e) => setFormData({ ...formData, seo_meta_title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Meta Description
          </label>
          <textarea
            rows={3}
            value={formData.seo_meta_description}
            onChange={(e) => setFormData({ ...formData, seo_meta_description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Keywords (comma separated)
          </label>
          <input
            type="text"
            value={formData.seo_keywords}
            onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
          />
        </div>

        {/* Social Links */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-[#153E70] mb-3">Social Profiles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.social_facebook}
                onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0878F9]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.social_instagram}
                onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0878F9]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">YouTube URL</label>
              <input
                type="text"
                value={formData.social_youtube}
                onChange={(e) => setFormData({ ...formData, social_youtube: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0878F9]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Twitter / X URL</label>
              <input
                type="text"
                value={formData.social_twitter}
                onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0878F9]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
