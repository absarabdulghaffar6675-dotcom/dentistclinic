'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Palette,
  Sparkles,
  Stethoscope,
  Image as ImageIcon,
  Info,
  Phone,
  MapPin,
  Clock,
  Accessibility,
  Star,
  Calendar,
  Inbox,
  Globe,
  Sliders,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Upload,
  Check,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { ToothIcon } from '@/components/DentalIcons';
import { LogoIconRenderer } from '@/components/BrandLogo';
import { ClinicSettings } from '@/types/clinic';
import { AdminUser } from '@/lib/auth';

interface AdminSidebarClientProps {
  user: AdminUser | null;
  settings: ClinicSettings;
  pendingAppointmentsCount: number;
  unreadMessagesCount: number;
  children: React.ReactNode;
}

export default function AdminSidebarClient({
  user,
  settings,
  pendingAppointmentsCount,
  unreadMessagesCount,
  children,
}: AdminSidebarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage && !user) {
      router.push('/admin/login');
    }
  }, [isLoginPage, user, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handlePublishAll = async () => {
    setPublishing(true);
    try {
      const res = await fetch('/api/settings/publish', { method: 'POST' });
      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 2500);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Clinic Profile', href: '/admin/profile', icon: Building2 },
    { label: 'Logo & Branding', href: '/admin/branding', icon: Palette },
    { label: 'Hero Section', href: '/admin/hero', icon: Sparkles },
    { label: 'Services Manager', href: '/admin/services', icon: Stethoscope },
    { label: 'Photo Gallery', href: '/admin/gallery', icon: ImageIcon },
    { label: 'About the Clinic', href: '/admin/about', icon: Info },
    { label: 'Contact Details', href: '/admin/contact', icon: Phone },
    { label: 'Address & Map Pin', href: '/admin/location', icon: MapPin },
    { label: 'Opening Hours', href: '/admin/hours', icon: Clock },
    { label: 'Accessibility & Insights', href: '/admin/insights', icon: Accessibility },
    { label: 'Ratings & Reviews', href: '/admin/ratings', icon: Star },
    {
      label: 'Appointments',
      href: '/admin/appointments',
      icon: Calendar,
      badge: pendingAppointmentsCount > 0 ? pendingAppointmentsCount : null,
      badgeColor: 'bg-amber-500',
    },
    {
      label: 'Messages',
      href: '/admin/messages',
      icon: Inbox,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
      badgeColor: 'bg-blue-500',
    },
    { label: 'SEO & Social', href: '/admin/seo', icon: Globe },
    { label: 'Appearance', href: '/admin/appearance', icon: Sliders },
    { label: 'Security & Account', href: '/admin/security', icon: ShieldCheck },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0D2646] text-white border-r border-slate-800 shrink-0">
        
        {/* Brand header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0878F9] flex items-center justify-center text-white shrink-0 shadow-md overflow-hidden">
            {settings.logo_url &&
            settings.logo_url !== '/images/tooth-logo.svg' &&
            !settings.logo_url.startsWith('data:image/svg+xml') ? (
              <img
                src={settings.logo_url}
                alt={settings.clinic_name}
                className="w-6 h-6 object-contain"
              />
            ) : (
              <LogoIconRenderer
                iconName={settings.logo_icon}
                className="w-5 h-5 stroke-[2.2]"
              />
            )}
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-sm tracking-tight text-white truncate">
              {settings.clinic_name}
            </h1>
            <p className="text-[10px] text-blue-300 font-medium tracking-wider uppercase">
              Owner Dashboard
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0878F9] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User profile and logout */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Dr. M. Niyalish Semab'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'owner@dynastydental.pk'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-medium text-slate-400">Portal / </span>
              <span className="text-xs font-bold text-[#153E70]">
                {navItems.find((n) => n.href === pathname)?.label || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Draft status indicator */}
            {settings.has_draft_changes ? (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Draft Changes Pending</span>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Website Published</span>
              </div>
            )}

            {/* Quick Publish Changes button */}
            <button
              onClick={handlePublishAll}
              disabled={publishing}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-70"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">Publishing...</span>
                </>
              ) : publishSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Published!</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish Changes</span>
                </>
              )}
            </button>

            {/* View Live Website Link */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden text-xs font-semibold">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center gap-1 transition-colors"
                title="Open Live Public Website"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="/?previewDraft=true"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0878F9] border-l border-slate-200 flex items-center gap-1 transition-colors"
                title="Preview Unpublished Drafts"
              >
                <span>Preview Draft</span>
              </a>
            </div>

          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#0D2646] text-white p-4 space-y-1 overflow-y-auto max-h-[70vh] border-b border-slate-800 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive ? 'bg-[#0878F9] text-white' : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-300 text-xs font-semibold hover:bg-rose-500/10 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Main Children */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
