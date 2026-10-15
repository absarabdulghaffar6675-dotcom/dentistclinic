import { ToothIcon } from '@/components/DentalIcons';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-[#0878F9] mb-4 animate-bounce">
        <ToothIcon className="w-10 h-10 stroke-[2.2]" />
      </div>
      <h2 className="text-lg font-bold text-[#153E70]">Dynasty Dental Solutions</h2>
      <p className="text-xs text-slate-400 mt-1">Loading clinic information...</p>
    </div>
  );
}
