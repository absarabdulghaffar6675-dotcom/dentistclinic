import Link from 'next/link';
import { LogoIconRenderer } from '@/components/BrandLogo';
import { getClinicSettings } from '@/lib/db';
import { Home, Phone } from 'lucide-react';

export default async function NotFound() {
  const settings = await getClinicSettings(false);
  const cleanPhone = (settings.phone || '03061521205').replace(/\s+/g, '');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#0878F9] flex items-center justify-center text-white mb-4 shadow-lg">
        <LogoIconRenderer iconName={settings.logo_icon} className="w-10 h-10 stroke-[2.2]" />
      </div>

      <h1 className="text-4xl font-black text-[#153E70] tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mt-1">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-2 leading-relaxed">
        The page you are looking for does not exist or has been moved. You can return to {settings.clinic_name} home or contact us directly.
      </p>

      <div className="flex items-center gap-3 mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0878F9] hover:bg-[#0667d6] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <a
          href={`tel:${cleanPhone}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#153E70] border border-slate-200 text-xs font-semibold shadow-xs transition-colors"
        >
          <Phone className="w-4 h-4" />
          <span>Call Clinic</span>
        </a>
      </div>
    </div>
  );
}
