'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { ToothIcon } from '@/components/DentalIcons';
import { LogoIconRenderer } from '@/components/BrandLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [branding, setBranding] = useState<{
    clinic_name: string;
    logo_icon?: string;
    logo_url?: string;
  }>({
    clinic_name: 'Dynasty Dental Solutions',
    logo_icon: 'tooth',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data?.clinic_name) {
          setBranding({
            clinic_name: data.clinic_name,
            logo_icon: data.logo_icon || 'tooth',
            logo_url: data.logo_url,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-2xl bg-[#0878F9] flex items-center justify-center text-white shadow-xl overflow-hidden">
            {branding.logo_url &&
            branding.logo_url !== '/images/tooth-logo.svg' &&
            !branding.logo_url.startsWith('data:image/svg+xml') ? (
              <img
                src={branding.logo_url}
                alt={branding.clinic_name}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <LogoIconRenderer
                iconName={branding.logo_icon}
                className="w-9 h-9 stroke-[2.2]"
              />
            )}
          </div>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {branding.clinic_name}
        </h2>
        <p className="mt-1 text-center text-xs sm:text-sm text-slate-400">
          Owner &amp; Administration Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-800/90 backdrop-blur-md py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-700/80">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Owner Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0878F9] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Owner Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#0878F9] focus:border-transparent font-mono"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-[#0878F9] hover:bg-[#0667d6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0878F9] transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              &larr; Return to Public Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
