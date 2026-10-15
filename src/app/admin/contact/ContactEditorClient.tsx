'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';

export default function ContactEditorClient({
  initialSettings,
}: {
  initialSettings: ClinicSettings;
}) {
  const router = useRouter();
  const [phone, setPhone] = useState(initialSettings.phone || '0306 1521205');
  const [phoneDisplay, setPhoneDisplay] = useState(initialSettings.phone_display || 'Call 0306 1521205');
  const [whatsapp, setWhatsapp] = useState(initialSettings.whatsapp || '923061521205');
  const [email, setEmail] = useState(initialSettings.email || 'dynastydentalsolutions@gmail.com');
  const [directionsUrl, setDirectionsUrl] = useState(initialSettings.directions_url || '');

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
          phone,
          phone_display: phoneDisplay,
          whatsapp,
          email,
          directions_url: directionsUrl,
          isDraft,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save contact info');

      setStatusMessage({
        type: 'success',
        text: isDraft ? 'Draft saved.' : 'Contact information updated globally across the website!',
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
            <Phone className="w-5 h-5 text-[#0878F9]" />
            <span>Contact Information &amp; Numbers</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Single source of truth: changes update the header call button, contact cards, footer, and WhatsApp chat links immediately.
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

      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Clinic Phone Number *
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0306 1521205"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Used for <code>tel:</code> phone call links.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Button Display Text
            </label>
            <input
              type="text"
              value={phoneDisplay}
              onChange={(e) => setPhoneDisplay(e.target.value)}
              placeholder="Call 0306 1521205"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Displayed inside the header and hero buttons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              WhatsApp Number (with country code)
            </label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="923061521205"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Example: <code>923061521205</code> for Pakistan (+92).
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinic Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dynastydentalsolutions@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Google Maps Directions URL
          </label>
          <input
            type="text"
            value={directionsUrl}
            onChange={(e) => setDirectionsUrl(e.target.value)}
            placeholder="https://maps.google.com/?q=Dynasty+Dental+Solutions+Faisalabad"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
          />
        </div>
      </div>
    </div>
  );
}
