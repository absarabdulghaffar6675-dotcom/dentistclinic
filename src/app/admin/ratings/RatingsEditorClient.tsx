'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Save, Check, AlertCircle, Loader2 } from 'lucide-react';
import { ClinicSettings, Testimonial } from '@/types/clinic';

export default function RatingsEditorClient({
  initialSettings,
  initialTestimonials,
}: {
  initialSettings: ClinicSettings;
  initialTestimonials: Testimonial[];
}) {
  const router = useRouter();
  const [ratingScore, setRatingScore] = useState(initialSettings.rating_score || 5.0);
  const [reviewsCount, setReviewsCount] = useState(initialSettings.reviews_count || 317);
  const [showRating, setShowRating] = useState<boolean>(initialSettings.show_rating ?? true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);

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
          rating_score: Number(ratingScore),
          reviews_count: Number(reviewsCount),
          show_rating: showRating,
          isDraft,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save');

      setStatusMessage({
        type: 'success',
        text: isDraft ? 'Draft saved.' : 'Ratings configuration published to live website!',
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
            <Star className="w-5 h-5 text-[#0878F9]" />
            <span>Ratings &amp; Reviews Display</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure clinic rating score, total review count, and patient reviews.
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

      {/* Ratings Settings Card */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={showRating}
            onChange={(e) => setShowRating(e.target.checked)}
            className="w-4 h-4 rounded text-[#0878F9]"
          />
          <span className="text-xs font-bold text-slate-800">
            Show Rating Stars in Website Hero Section
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Rating Score (Out of 5.0)
            </label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              value={ratingScore}
              onChange={(e) => setRatingScore(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Total Reviews Count
            </label>
            <input
              type="number"
              value={reviewsCount}
              onChange={(e) => setReviewsCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-[#153E70]">
          Patient Testimonials &amp; Feedback
        </h3>

        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-800">{t.patient_name}</span>
                <div className="flex items-center text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 italic">&ldquo;{t.review_text}&rdquo;</p>
              <span className="text-[10px] text-slate-400 block mt-2">{t.date_text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
