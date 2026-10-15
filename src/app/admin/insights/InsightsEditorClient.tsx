'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Accessibility, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';

export default function InsightsEditorClient({
  initialSettings,
}: {
  initialSettings: ClinicSettings;
}) {
  const router = useRouter();
  const [insights, setInsights] = useState(
    initialSettings.insights || {
      accessibility: {
        wheelchair_entrance: true,
        wheelchair_parking: true,
        wheelchair_restroom: true,
        wheelchair_seating: true,
      },
      amenities: {
        restroom: true,
        waiting_lounge: true,
        wifi: true,
      },
      payments: {
        checks: true,
        nfc_mobile: true,
        payment_plans: true,
        cash: true,
        credit_cards: true,
      },
    }
  );

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleAccessibility = (key: keyof typeof insights.accessibility) => {
    setInsights({
      ...insights,
      accessibility: {
        ...insights.accessibility,
        [key]: !insights.accessibility[key],
      },
    });
  };

  const toggleAmenities = (key: keyof typeof insights.amenities) => {
    setInsights({
      ...insights,
      amenities: {
        ...insights.amenities,
        [key]: !insights.amenities[key],
      },
    });
  };

  const togglePayments = (key: keyof typeof insights.payments) => {
    setInsights({
      ...insights,
      payments: {
        ...insights.payments,
        [key]: !insights.payments[key],
      },
    });
  };

  const handleSave = async (isDraft: boolean) => {
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          insights,
          isDraft,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save insights');

      setStatusMessage({
        type: 'success',
        text: isDraft ? 'Insights saved as draft.' : 'Accessibility & insights published to live website!',
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
            <Accessibility className="w-5 h-5 text-[#0878F9]" />
            <span>Accessibility, Amenities &amp; Payments</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Owner-confirmed amenities and payment features displayed in the Insights card.
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Accessibility Features */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-[#153E70] border-b border-slate-100 pb-2">
            Accessibility Features
          </h3>
          <div className="space-y-2.5 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.accessibility.wheelchair_entrance}
                onChange={() => toggleAccessibility('wheelchair_entrance')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Wheelchair Accessible Entrance</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.accessibility.wheelchair_parking}
                onChange={() => toggleAccessibility('wheelchair_parking')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Wheelchair Accessible Parking Lot</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.accessibility.wheelchair_restroom}
                onChange={() => toggleAccessibility('wheelchair_restroom')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Wheelchair Accessible Restroom</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.accessibility.wheelchair_seating}
                onChange={() => toggleAccessibility('wheelchair_seating')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Wheelchair Accessible Seating</span>
            </label>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-[#153E70] border-b border-slate-100 pb-2">
            Clinic Amenities
          </h3>
          <div className="space-y-2.5 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.amenities.restroom}
                onChange={() => toggleAmenities('restroom')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Patient Restroom</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.amenities.waiting_lounge}
                onChange={() => toggleAmenities('waiting_lounge')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Comfortable Waiting Lounge</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.amenities.wifi}
                onChange={() => toggleAmenities('wifi')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Free Patient Wi-Fi</span>
            </label>
          </div>
        </div>

        {/* Payments Accepted */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-[#153E70] border-b border-slate-100 pb-2">
            Payment Methods
          </h3>
          <div className="space-y-2.5 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.payments.checks}
                onChange={() => togglePayments('checks')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Checks</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.payments.nfc_mobile}
                onChange={() => togglePayments('nfc_mobile')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">NFC Mobile Payments (EasyPaisa/JazzCash)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.payments.payment_plans}
                onChange={() => togglePayments('payment_plans')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Flexible Payment Plans</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.payments.cash}
                onChange={() => togglePayments('cash')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Cash Accepted</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={insights.payments.credit_cards}
                onChange={() => togglePayments('credit_cards')}
                className="w-4 h-4 rounded text-[#0878F9]"
              />
              <span className="text-slate-700">Credit / Debit Cards</span>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
