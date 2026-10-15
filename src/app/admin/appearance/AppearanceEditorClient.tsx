'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sliders, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';

export default function AppearanceEditorClient({
  initialSettings,
}: {
  initialSettings: ClinicSettings;
}) {
  const router = useRouter();
  const [primaryColor, setPrimaryColor] = useState(initialSettings.primary_color || '#153E70');
  const [accentBlue, setAccentBlue] = useState(initialSettings.accent_blue || '#0878F9');
  const [lightBg, setLightBg] = useState(initialSettings.light_bg_color || '#EAF4FF');

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
          primary_color: primaryColor,
          accent_blue: accentBlue,
          light_bg_color: lightBg,
          isDraft,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save');

      setStatusMessage({
        type: 'success',
        text: isDraft ? 'Appearance saved as draft.' : 'Appearance updated on live website!',
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
            <Sliders className="w-5 h-5 text-[#0878F9]" />
            <span>Website Appearance &amp; Color Scheme</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your clinic brand palette and theme styling.
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
        <h3 className="text-sm font-bold text-[#153E70]">Core Brand Colors</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Primary Navy Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
            <p className="text-[10px] text-slate-400">Used for navigation bar and headlines</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Primary Blue Accent
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={accentBlue}
                onChange={(e) => setAccentBlue(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={accentBlue}
                onChange={(e) => setAccentBlue(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
            <p className="text-[10px] text-slate-400">Used for CTA buttons and phone badges</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Light Blue Background
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={lightBg}
                onChange={(e) => setLightBg(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-0"
              />
              <input
                type="text"
                value={lightBg}
                onChange={(e) => setLightBg(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs font-mono uppercase"
              />
            </div>
            <p className="text-[10px] text-slate-400">Used for service badges &amp; banner cards</p>
          </div>
        </div>
      </div>
    </div>
  );
}
