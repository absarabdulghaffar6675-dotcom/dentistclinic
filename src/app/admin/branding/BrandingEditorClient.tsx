'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Palette,
  Upload,
  Check,
  AlertCircle,
  Save,
  Loader2,
  Eye,
  Type,
  Sparkles,
  Layout,
  Globe,
  RotateCcw,
  Sliders,
  Phone,
  Calendar,
  X,
  Menu,
} from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';
import {
  BrandLogo,
  LogoIconRenderer,
  AVAILABLE_LOGO_ICONS,
  LogoIconOption,
} from '@/components/BrandLogo';

export default function BrandingEditorClient({
  initialSettings,
}: {
  initialSettings: ClinicSettings;
}) {
  const router = useRouter();

  // Primary Brand & Logo Text
  const [clinicName, setClinicName] = useState(initialSettings.clinic_name || 'Dynasty Dental Solutions');
  const [tagline, setTagline] = useState(initialSettings.tagline || 'Your Smile, Our Priority.');

  // Logo Icon & Image settings
  const [logoIcon, setLogoIcon] = useState(initialSettings.logo_icon || 'tooth');
  const [logoUrl, setLogoUrl] = useState(initialSettings.logo_url || '/images/tooth-logo.svg');
  const [faviconUrl, setFaviconUrl] = useState(initialSettings.favicon_url || '/images/tooth-logo.svg');
  const [logoHeight, setLogoHeight] = useState(initialSettings.logo_height || 38);
  const [logoTextFallback, setLogoTextFallback] = useState(initialSettings.logo_text_fallback || false);
  const [logoBadgeStyle, setLogoBadgeStyle] = useState<'plain' | 'badge' | 'outline'>(
    (initialSettings.logo_badge_style as 'plain' | 'badge' | 'outline') || 'plain'
  );

  // Active Icon Mode Tab: 'preset' | 'upload' | 'text'
  const [activeTab, setActiveTab] = useState<'preset' | 'upload' | 'text'>(
    logoTextFallback
      ? 'text'
      : logoUrl && logoUrl !== '/images/tooth-logo.svg' && !logoUrl.startsWith('data:image/svg+xml')
      ? 'upload'
      : 'preset'
  );

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFavicon: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isFavicon) setUploadingFavicon(true);
    else setUploadingLogo(true);
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

      if (isFavicon) {
        setFaviconUrl(json.url);
        setStatusMessage({ type: 'success', text: 'Favicon uploaded! Click Publish to apply across website.' });
      } else {
        setLogoUrl(json.url);
        setLogoTextFallback(false);
        setActiveTab('upload');
        setStatusMessage({ type: 'success', text: 'Custom logo image uploaded! Preview updated below.' });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      if (isFavicon) setUploadingFavicon(false);
      else setUploadingLogo(false);
    }
  };

  // Live sync the browser tab's title and favicon immediately as user customizes
  React.useEffect(() => {
    if (typeof document === 'undefined') return;

    if (clinicName) {
      document.title = `${clinicName} | Admin Portal`;
    }

    const iconUrl = `/api/favicon?icon=${encodeURIComponent(logoIcon)}&t=${Date.now()}`;
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = iconUrl;
  }, [clinicName, logoIcon]);

  const handleSelectIcon = (iconId: string) => {
    setLogoIcon(iconId);
    setLogoTextFallback(false);
    // If resetting to a preset vector icon, reset logoUrl to default placeholder so icon renders cleanly
    setLogoUrl('/images/tooth-logo.svg');
    setActiveTab('preset');
  };

  const handleSelectTextOnly = (enabled: boolean) => {
    setLogoTextFallback(enabled);
    if (enabled) {
      setActiveTab('text');
    } else {
      setActiveTab('preset');
    }
  };

  const handleSave = async (isDraft: boolean) => {
    setSaving(true);
    setStatusMessage(null);

    try {
      const cleanName = clinicName.trim() || 'Dynasty Dental Solutions';
      const cleanCity = initialSettings.city || 'Faisalabad';

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_name: cleanName,
          seo_meta_title: `${cleanName} | Best Dental Clinic in ${cleanCity}`,
          tagline: tagline.trim(),
          logo_icon: logoIcon,
          logo_url: logoUrl,
          favicon_url: `/api/favicon?icon=${logoIcon}&t=${Date.now()}`,
          logo_height: logoHeight,
          logo_text_fallback: logoTextFallback,
          logo_badge_style: logoBadgeStyle,
          isDraft,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save branding');

      setStatusMessage({
        type: 'success',
        text: isDraft
          ? 'Branding saved as draft. Preview unpublished changes anytime.'
          : 'Brand logo icon and text updated everywhere across the website!',
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
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#153E70] flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-[#0878F9] inline-flex">
              <Palette className="w-5 h-5" />
            </span>
            <span>Logo &amp; Brand Identity</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Change your web logo icon and brand text. Changes immediately update across Navbar, Footer, Booking Modals, SEO, and Portal.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Publish Everywhere</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-3 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-xs'
              : 'bg-rose-50 text-rose-900 border border-rose-200 shadow-xs'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Main Grid: Left Controls (7 cols) + Right Previews (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">

          {/* Section 1: Logo Text & Brand Name */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Type className="w-4 h-4 text-[#0878F9]" />
              <h3 className="text-sm font-bold text-[#153E70]">Logo Text &amp; Brand Name</h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Logo Text (Clinic Name) *
              </label>
              <input
                type="text"
                required
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="e.g. Dynasty Dental Solutions"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0878F9] focus:ring-2 focus:ring-blue-100 outline-none text-sm font-medium text-slate-800 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Displayed in the main website header, footer, appointment confirmation, browser title, and owner dashboard.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Brand Tagline / Secondary Subtitle
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Your Smile, Our Priority."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#0878F9] focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 transition-all"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Displayed underneath the logo brand mark in footer and hero banners.
              </p>
            </div>
          </div>

          {/* Section 2: Web Logo Icon Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0878F9]" />
                <h3 className="text-sm font-bold text-[#153E70]">Web Logo Icon</h3>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                Choose vector icon or upload image
              </span>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('preset');
                  setLogoTextFallback(false);
                }}
                className={`py-2 px-3 rounded-lg transition-all ${
                  activeTab === 'preset' && !logoTextFallback
                    ? 'bg-white text-[#153E70] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vector Icon Presets
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('upload');
                  setLogoTextFallback(false);
                }}
                className={`py-2 px-3 rounded-lg transition-all ${
                  activeTab === 'upload' && !logoTextFallback
                    ? 'bg-white text-[#153E70] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upload Custom Logo
              </button>
              <button
                type="button"
                onClick={() => handleSelectTextOnly(true)}
                className={`py-2 px-3 rounded-lg transition-all ${
                  activeTab === 'text' || logoTextFallback
                    ? 'bg-white text-[#153E70] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Text-Only Mode
              </button>
            </div>

            {/* Tab 1: Vector Icon Grid */}
            {activeTab === 'preset' && !logoTextFallback && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    Select a curated icon for your medical brand:
                  </span>
                  <span className="text-[11px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                    Active: {AVAILABLE_LOGO_ICONS.find((i) => i.id === logoIcon)?.label || 'Tooth'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto p-1 border border-slate-100 rounded-xl">
                  {AVAILABLE_LOGO_ICONS.map((opt: LogoIconOption) => {
                    const isSelected = logoIcon === opt.id && (!logoUrl || logoUrl === '/images/tooth-logo.svg');
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectIcon(opt.id)}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#0878F9] bg-sky-50/70 ring-2 ring-[#0878F9]/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-[#0878F9] text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <LogoIconRenderer iconName={opt.id} className="w-5 h-5 stroke-[2.2]" />
                          </div>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-[#0878F9] text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            {opt.label}
                          </span>
                          <span className="text-[10px] text-slate-400 block line-clamp-1">
                            {opt.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Custom Logo Upload */}
            {activeTab === 'upload' && !logoTextFallback && (
              <div className="space-y-4">
                <label className="block w-full py-5 px-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#0878F9] bg-slate-50 hover:bg-sky-50 text-center cursor-pointer transition-all">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => handleUpload(e, false)}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                  <Upload className="w-7 h-7 text-[#0878F9] mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-700 block">
                    {uploadingLogo ? 'Uploading Logo...' : 'Click to Upload Custom Logo Image'}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    PNG, SVG, JPG, or WebP (Transparent PNG/SVG recommended)
                  </span>
                </label>

                {logoUrl && logoUrl !== '/images/tooth-logo.svg' && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1">
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Custom Logo Active</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px] block">
                          {logoUrl}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectIcon('tooth')}
                      className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Text Only */}
            {(activeTab === 'text' || logoTextFallback) && (
              <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 space-y-2">
                <span className="text-xs font-bold text-[#153E70] block">
                  Text-Only Typographic Mode Active
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  The website will display your brand name <strong className="text-[#153E70]">&quot;{clinicName}&quot;</strong> in clean, modern typography without an icon badge.
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectTextOnly(false)}
                  className="text-xs text-[#0878F9] hover:underline font-semibold"
                >
                  &larr; Switch back to Vector Icon Mode
                </button>
              </div>
            )}

            {/* Logo Style Options (Height & Badge Style) */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">
                    Logo Display Size
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Adjust icon and image scale in the navigation bar
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#0878F9] bg-blue-50 px-2 py-0.5 rounded-md">
                  {logoHeight}px
                </span>
              </div>
              <input
                type="range"
                min="26"
                max="56"
                value={logoHeight}
                onChange={(e) => setLogoHeight(Number(e.target.value))}
                className="w-full accent-[#0878F9] cursor-pointer"
              />

              {/* Badge Container Style */}
              {!logoTextFallback && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Icon Container Style
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setLogoBadgeStyle('plain')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        logoBadgeStyle === 'plain'
                          ? 'border-[#0878F9] bg-sky-50 text-[#0878F9] ring-1 ring-[#0878F9]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Plain (Transparent)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoBadgeStyle('badge')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        logoBadgeStyle === 'badge'
                          ? 'border-[#0878F9] bg-sky-50 text-[#0878F9] ring-1 ring-[#0878F9]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Rounded Blue Badge
                    </button>
                    <button
                      type="button"
                      onClick={() => setLogoBadgeStyle('outline')}
                      className={`p-2.5 rounded-xl border text-center text-xs font-semibold transition-all ${
                        logoBadgeStyle === 'outline'
                          ? 'border-[#0878F9] bg-sky-50 text-[#0878F9] ring-1 ring-[#0878F9]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Subtle Border Outline
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Browser Favicon */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#0878F9]" />
                <h3 className="text-sm font-bold text-[#153E70]">Browser Favicon</h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Shown in browser tabs &amp; bookmarks
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 p-1.5 shadow-sm">
                  {faviconUrl && faviconUrl !== '/images/tooth-logo.svg' ? (
                    <img src={faviconUrl} alt="Favicon" className="w-6 h-6 object-contain" />
                  ) : (
                    <LogoIconRenderer iconName={logoIcon} className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Tab Favicon</span>
                  <span className="text-[11px] text-slate-400">
                    {faviconUrl ? 'Custom Favicon Configured' : 'Using active brand icon'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors">
                  <input
                    type="file"
                    accept="image/png,image/x-icon,image/svg+xml"
                    onChange={(e) => handleUpload(e, true)}
                    disabled={uploadingFavicon}
                    className="hidden"
                  />
                  {uploadingFavicon ? 'Uploading...' : 'Upload Favicon (.ico / .png)'}
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Multi-Surface Preview */}
        <div className="lg:col-span-5 space-y-5 sticky top-6">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#153E70] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0878F9]" />
                <span>Live Website Preview</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Real-time
              </span>
            </div>

            {/* Surface 1: Desktop Navigation Header */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                1. Main Website Header (Dark Nav)
              </span>
              <div className="bg-[#153E70] p-4 rounded-xl flex items-center justify-between shadow-md">
                <div className="max-w-[70%]">
                  <BrandLogo
                    clinicName={clinicName || 'Clinic Name'}
                    tagline={tagline}
                    logoUrl={logoUrl}
                    logoIcon={logoIcon}
                    logoTextFallback={logoTextFallback}
                    logoHeight={Math.min(logoHeight, 36)}
                    logoBadgeStyle={logoBadgeStyle}
                    iconClassName="w-7 h-7 text-white stroke-[2.2]"
                    textClassName="font-bold text-sm text-white truncate block"
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="hidden sm:inline-block text-[10px] text-white/80 font-medium">Home</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#0878F9] text-white text-[10px] font-bold shadow-xs">
                    Call
                  </span>
                </div>
              </div>
            </div>

            {/* Surface 2: Mobile Header Preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                2. Mobile Screen Header
              </span>
              <div className="bg-[#153E70] p-3 rounded-xl flex items-center justify-between shadow-xs">
                <div className="max-w-[75%]">
                  <BrandLogo
                    clinicName={clinicName || 'Clinic Name'}
                    logoUrl={logoUrl}
                    logoIcon={logoIcon}
                    logoTextFallback={logoTextFallback}
                    logoHeight={26}
                    logoBadgeStyle={logoBadgeStyle}
                    iconClassName="w-5 h-5 text-white stroke-[2.2]"
                    textClassName="font-bold text-xs text-white truncate block"
                  />
                </div>
                <Menu className="w-5 h-5 text-white/80" />
              </div>
            </div>

            {/* Surface 3: Light Header Bar */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                3. Light Background Display
              </span>
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between shadow-2xs">
                <div className="max-w-[80%]">
                  <BrandLogo
                    clinicName={clinicName || 'Clinic Name'}
                    tagline={tagline}
                    logoUrl={logoUrl}
                    logoIcon={logoIcon}
                    logoTextFallback={logoTextFallback}
                    logoHeight={28}
                    logoBadgeStyle={logoBadgeStyle === 'plain' ? 'badge' : logoBadgeStyle}
                    iconClassName="w-5 h-5 text-white stroke-[2.2]"
                    badgeClassName="bg-[#0878F9] text-white p-1.5 rounded-lg shadow-xs flex items-center justify-center shrink-0"
                    textClassName="font-bold text-xs text-[#153E70] truncate block"
                  />
                </div>
                <span className="text-[10px] font-bold text-[#0878F9]">Book</span>
              </div>
            </div>

            {/* Surface 4: Footer Bar */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                4. Website Footer Row
              </span>
              <div className="bg-[#0D2646] p-4 rounded-xl flex flex-col gap-2 shadow-xs text-white">
                <BrandLogo
                  clinicName={clinicName || 'Clinic Name'}
                  tagline={tagline || 'Modern Dentistry • Healthy Smiles'}
                  logoUrl={logoUrl}
                  logoIcon={logoIcon}
                  logoTextFallback={logoTextFallback}
                  logoHeight={24}
                  logoBadgeStyle={logoBadgeStyle}
                  showTagline={true}
                  iconClassName="w-5 h-5 text-white stroke-[2.2]"
                  textClassName="font-bold text-xs text-white block"
                  taglineClassName="text-[10px] text-blue-200/80 font-medium block"
                />
                <div className="pt-2 border-t border-white/10 text-[9px] text-blue-200/60">
                  &copy; {new Date().getFullYear()} {clinicName}. All rights reserved.
                </div>
              </div>
            </div>

            {/* Surface 5: Appointment Booking Modal Header */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                5. Appointment Booking Modal Badge
              </span>
              <div className="bg-[#153E70] p-3 rounded-xl flex items-center gap-3 shadow-xs text-white">
                <div className="w-9 h-9 rounded-xl bg-[#0878F9] flex items-center justify-center text-white shrink-0 shadow-sm">
                  <LogoIconRenderer iconName={logoIcon} className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Request an Appointment</span>
                  <span className="text-[10px] text-blue-200 block truncate">
                    {clinicName} &bull; {initialSettings.city || 'Faisalabad'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
