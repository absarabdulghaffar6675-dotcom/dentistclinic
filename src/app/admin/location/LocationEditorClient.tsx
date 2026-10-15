'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Save, Check, AlertCircle, Loader2, Navigation, ExternalLink } from 'lucide-react';
import { ClinicSettings } from '@/types/clinic';

export default function LocationEditorClient({
  initialSettings,
}: {
  initialSettings: ClinicSettings;
}) {
  const router = useRouter();
  const [fullAddress, setFullAddress] = useState(initialSettings.full_address || '');
  const [colonyArea, setColonyArea] = useState(initialSettings.colony_area || 'Zia Colony, Jinnah Rd');
  const [city, setCity] = useState(initialSettings.city || 'Faisalabad');
  const [postalCode, setPostalCode] = useState(initialSettings.postal_code || '38000');
  const [country, setCountry] = useState(initialSettings.country || 'Pakistan');
  const [latitude, setLatitude] = useState(initialSettings.latitude || 31.4187);
  const [longitude, setLongitude] = useState(initialSettings.longitude || 73.0791);
  const [directionsUrl, setDirectionsUrl] = useState(initialSettings.directions_url || '');

  const [mapProvider, setMapProvider] = useState<'google' | 'osm'>('google');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const previewQuery = fullAddress ? `${fullAddress}, ${city}, ${country}` : `${latitude},${longitude}`;
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(previewQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.035}%2C${latitude - 0.012}%2C${longitude + 0.035}%2C${latitude + 0.012}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const currentMapEmbedUrl = mapProvider === 'google' ? googleMapEmbedUrl : osmEmbedUrl;

  const handleSave = async (isDraft: boolean) => {
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_address: fullAddress,
          colony_area: colonyArea,
          city,
          postal_code: postalCode,
          country,
          latitude: Number(latitude),
          longitude: Number(longitude),
          directions_url: directionsUrl || `https://maps.google.com/?q=${latitude},${longitude}`,
          isDraft,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to save location');

      setStatusMessage({
        type: 'success',
        text: isDraft ? 'Location draft saved.' : 'Clinic address and map updated across the website!',
      });
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving location';
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
            <MapPin className="w-5 h-5 text-[#0878F9]" />
            <span>Clinic Address &amp; Map Location</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the verified clinic address, GPS coordinates, interactive map embed, and directions link.
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Address Fields */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Clinic Street Address *
            </label>
            <textarea
              rows={2}
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="e.g. Jinnah Rd, Zia Colony, Faisalabad, Punjab, Pakistan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Area / Colony
              </label>
              <input
                type="text"
                value={colonyArea}
                onChange={(e) => setColonyArea(e.target.value)}
                placeholder="Zia Colony, Jinnah Rd"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Faisalabad"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="38000"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Pakistan"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-[#153E70] uppercase tracking-wider mb-2">
              GPS Coordinates
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview: Live Map */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#153E70]">
              Map Pin Live Preview
            </h3>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg text-[10px] font-semibold border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMapProvider('google')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    mapProvider === 'google'
                      ? 'bg-white text-[#0878F9] shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => setMapProvider('osm')}
                  className={`px-2 py-0.5 rounded transition-all ${
                    mapProvider === 'osm'
                      ? 'bg-white text-[#0878F9] shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Street
                </button>
              </div>

              <a
                href={`https://maps.google.com/?q=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-[#0878F9] hover:underline flex items-center gap-1"
              >
                <span>Test Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <iframe
              title="Admin Map Preview"
              src={currentMapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          <p className="text-[11px] text-slate-500">
            Current Marker: <strong>{latitude.toFixed(4)}, {longitude.toFixed(4)}</strong> in {city}, {country}.
          </p>
        </div>

      </div>
    </div>
  );
}
