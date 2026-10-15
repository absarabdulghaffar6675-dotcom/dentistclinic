'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';

export default function AboutEditorClient({
  initialSettings,
}: {
  initialSettings: ClinicSettings;
}) {
  const router = useRouter();
  const [aboutTitle, setAboutTitle] = useState(
    initialSettings.about_title || 'About Dynasty Dental Solutions'
  );
  const [aboutDescription, setAboutDescription] = useState(
    initialSettings.about_description || ''
  );
  const [badges, setBadges] = useState(
    initialSettings.about_badges || [
      { icon: 'shield-check', title: 'Professional Dental Care' },
      { icon: 'settings', title: 'Modern Equipment' },
      { icon: 'shield-plus', title: 'Clean & Safe Environment' },
      { icon: 'user-heart', title: 'Patient-Focused Service' },
    ]
  );

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleBadgeChange = (index: number, newTitle: string) => {
    const updated = [...badges];
    updated[index].title = newTitle;
    setBadges(updated);
  };

  const handleSave = async (isDraft: boolean) => {
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          about_title: aboutTitle,
          about_description: aboutDescription,
          about_badges: badges,
          isDraft,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save');

      setStatusMessage({
        type: 'success',
        text: isDraft ? 'Draft saved.' : 'About section published!',
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
            <Info className="w-5 h-5 text-[#0878F9]" />
            <span>About Clinic Section</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the introduction story and 4 core clinical standard badges.
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

      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Section Title *
          </label>
          <input
            type="text"
            value={aboutTitle}
            onChange={(e) => setAboutTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            About Description Text *
          </label>
          <textarea
            rows={4}
            value={aboutDescription}
            onChange={(e) => setAboutDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#153E70] mb-3">
            4 Feature Badges (Pills)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((b, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Badge {idx + 1}
                </span>
                <input
                  type="text"
                  value={b.title}
                  onChange={(e) => handleBadgeChange(idx, e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] bg-white font-medium"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
