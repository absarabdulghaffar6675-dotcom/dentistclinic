'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Save, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { ClinicSettings, OpeningHour } from '@/types/clinic';
import { calculateClinicStatus } from '@/lib/schedule';

export default function HoursEditorClient({
  initialSettings,
  initialHours,
}: {
  initialSettings: ClinicSettings;
  initialHours: OpeningHour[];
}) {
  const router = useRouter();
  const [hours, setHours] = useState<OpeningHour[]>(initialHours);
  const [timezone, setTimezone] = useState(initialSettings.timezone || 'Asia/Karachi');
  const [holidayNotice, setHolidayNotice] = useState(initialSettings.holiday_notice || '');
  const [showHolidayNotice, setShowHolidayNotice] = useState(initialSettings.show_holiday_notice || false);

  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Live status test
  const liveStatus = calculateClinicStatus(hours, timezone, holidayNotice, showHolidayNotice);

  const handleUpdateDay = (index: number, updates: Partial<OpeningHour>) => {
    const list = [...hours];
    list[index] = { ...list[index], ...updates };
    setHours(list);
  };

  const handleSetAll24Hours = () => {
    const list = hours.map((h) => ({
      ...h,
      is_open_24h: true,
      is_closed: false,
    }));
    setHours(list);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage(null);

    try {
      // 1. Save Hours
      const resHours = await fetch('/api/hours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours }),
      });
      if (!resHours.ok) throw new Error('Failed to update weekly hours');

      // 2. Save timezone & holiday notice in settings
      const resSettings = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timezone,
          holiday_notice: holidayNotice,
          show_holiday_notice: showHolidayNotice,
          isDraft: false,
        }),
      });
      if (!resSettings.ok) throw new Error('Failed to update holiday announcement');

      setStatusMessage({ type: 'success', text: 'Opening hours schedule saved and live status updated!' });
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving hours';
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
            <Clock className="w-5 h-5 text-[#0878F9]" />
            <span>Clinic Opening Hours &amp; Schedule</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure daily opening/closing times, 24-hour mode, closed days, and temporary holiday announcements.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Schedule</span>
        </button>
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

      {/* Live Status Calculation Card */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Real-Time Status in {timezone}
            </span>
          </div>
          <div className="flex items-center gap-2.5 mt-1">
            <span
              className={`w-3 h-3 rounded-full ${
                liveStatus.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            <span className="text-lg font-bold text-slate-800">
              Currently: {liveStatus.statusText}
            </span>
            <span className="text-xs text-slate-500">({liveStatus.detailsText})</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSetAll24Hours}
          className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0878F9] border border-sky-200 text-xs font-semibold transition-colors shrink-0"
        >
          Reset All to Open 24 Hours
        </button>
      </div>

      {/* Daily Schedule Editor */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-[#153E70]">Weekly Working Hours</h3>

        <div className="divide-y divide-slate-100">
          {hours.map((h, idx) => (
            <div
              key={h.id || h.day_of_week}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="w-28 font-bold text-slate-800">{h.day_of_week}</div>

              {/* Toggles */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={h.is_open_24h}
                    onChange={(e) =>
                      handleUpdateDay(idx, {
                        is_open_24h: e.target.checked,
                        is_closed: e.target.checked ? false : h.is_closed,
                      })
                    }
                    className="w-4 h-4 rounded text-[#0878F9]"
                  />
                  <span className="text-slate-600 font-medium">Open 24 Hours</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={h.is_closed}
                    onChange={(e) =>
                      handleUpdateDay(idx, {
                        is_closed: e.target.checked,
                        is_open_24h: e.target.checked ? false : h.is_open_24h,
                      })
                    }
                    className="w-4 h-4 rounded text-rose-500"
                  />
                  <span className="text-slate-600 font-medium">Closed</span>
                </label>
              </div>

              {/* Custom Hours (if not 24h and not closed) */}
              {!h.is_open_24h && !h.is_closed ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={h.open_time}
                    onChange={(e) => handleUpdateDay(idx, { open_time: e.target.value })}
                    className="px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-800"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="time"
                    value={h.close_time}
                    onChange={(e) => handleUpdateDay(idx, { close_time: e.target.value })}
                    className="px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-800"
                  />
                </div>
              ) : (
                <div className="text-slate-400 italic">
                  {h.is_closed ? 'Clinic Closed' : 'Continuous 24/7 care'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Holiday Announcement */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-[#153E70]">
          Temporary Holiday or Emergency Notice
        </h3>

        <div>
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={showHolidayNotice}
              onChange={(e) => setShowHolidayNotice(e.target.checked)}
              className="w-4 h-4 rounded text-[#0878F9]"
            />
            <span className="text-xs font-semibold text-slate-700">
              Display Announcement Banner on Website
            </span>
          </label>

          <input
            type="text"
            value={holidayNotice}
            onChange={(e) => setHolidayNotice(e.target.value)}
            placeholder="e.g. Special Eid Holiday Schedule: Emergency services operating normally."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
          />
        </div>
      </div>
    </div>
  );
}
