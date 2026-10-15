'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Check, ArrowLeft, Loader2 } from 'lucide-react';

interface DraftBannerProps {
  hasDraftChanges: boolean;
  isPreviewDraft: boolean;
}

export default function DraftBanner({ hasDraftChanges, isPreviewDraft }: DraftBannerProps) {
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  if (!isPreviewDraft && !hasDraftChanges) return null;

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/settings/publish', { method: 'POST' });
      if (res.ok) {
        setPublished(true);
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-xs font-medium shadow-md sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 shrink-0 text-white" />
        <span>
          {isPreviewDraft
            ? 'Owner Draft Preview Mode — You are viewing unpublished draft changes.'
            : 'You have unpublished draft changes in the owner dashboard.'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePublish}
          disabled={publishing || published}
          className="px-3 py-1 rounded-full bg-white text-amber-800 hover:bg-amber-50 font-bold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-70"
        >
          {publishing ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : published ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Published!</span>
            </>
          ) : (
            <span>Publish Changes Now</span>
          )}
        </button>

        <Link
          href={isPreviewDraft ? '/' : '/admin'}
          className="px-3 py-1 rounded-full bg-amber-600 hover:bg-amber-700 text-white transition-colors"
        >
          {isPreviewDraft ? 'Exit Preview' : 'Go to Admin'}
        </Link>
      </div>
    </div>
  );
}
