'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Database,
  CheckCircle2,
  AlertCircle,
  Key,
  Clock,
  Check,
  Mail,
  Loader2,
  UserCheck,
} from 'lucide-react';
import { AdminUser } from '@/lib/auth';
import { AdminActivityLog } from '@/types/clinic';

export default function SecurityClient({
  user,
  logs,
  supabaseConnected,
}: {
  user: AdminUser | null;
  logs: AdminActivityLog[];
  supabaseConnected: boolean;
}) {
  const [adminEmail, setAdminEmail] = useState(user?.email || 'owner@dynastydental.pk');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/auth/credentials')
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) {
          setAdminEmail(data.email);
        }
      })
      .catch(() => {});
  }, []);

  const handleCredentialsChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter your current password to authorize changes.',
      });
      return;
    }

    if (!adminEmail || !adminEmail.includes('@') || !adminEmail.includes('.')) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid admin email address.',
      });
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setStatusMessage({
        type: 'error',
        text: 'New password must be at least 8 characters long.',
      });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: 'New passwords do not match.',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newEmail: adminEmail,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update credentials');
      }

      setStatusMessage({
        type: 'success',
        text: 'Admin email & password successfully updated and active for your next login!',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating credentials';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#153E70] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#0878F9]" />
          <span>Security &amp; Account Settings</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Change owner login email &amp; password, check database status, and review security audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Account & Password Settings */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-[#153E70] flex items-center gap-2 pb-2 border-b border-slate-100">
            <Key className="w-4 h-4 text-[#0878F9]" />
            <span>Change Owner Email &amp; Password</span>
          </h3>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
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

          <form onSubmit={handleCredentialsChange} className="space-y-3.5">
            {/* Owner Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Login Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@dynastydental.pk"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9]"
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                This is the email address used to sign in to the owner dashboard.
              </span>
            </div>

            {/* Current Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Password * (Required to authorize changes)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] font-mono"
                />
              </div>
            </div>

            {/* New Password Field */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Password (Leave blank to keep current password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New strong password (min 8 characters)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] font-mono"
                />
              </div>
            </div>

            {/* Confirm New Password Field */}
            {newPassword.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required={newPassword.length > 0}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0878F9] font-mono"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <SaveIcon className="w-3.5 h-3.5" />}
              <span>Save Account Credentials</span>
            </button>
          </form>
        </div>

        {/* Database & Infrastructure Status */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-[#153E70] flex items-center gap-2 pb-2 border-b border-slate-100">
            <Database className="w-4 h-4 text-[#0878F9]" />
            <span>Database &amp; Storage Architecture</span>
          </h3>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Database Connection:</span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  supabaseConnected
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {supabaseConnected ? 'Supabase Active' : 'Local Persistence (Active)'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Storage Destination:</span>
              <span className="font-mono text-slate-600">.data/clinic_data.json</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Authentication Mode:</span>
              <span className="text-emerald-700 font-semibold">HttpOnly Session Cookies (7-day)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Encryption &amp; Protection:</span>
              <span className="text-slate-600 font-semibold">Protected Admin Routes (Role: Owner)</span>
            </div>
          </div>

          {/* Audit Log Box */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Recent Admin Activity Logs</span>
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {logs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-[11px] space-y-0.5"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span>{log.action}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[10px]">{log.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function SaveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
      <polyline points="17 21 17 13 7 13 7 21"/>
      <polyline points="7 3 7 8 15 8"/>
    </svg>
  );
}
