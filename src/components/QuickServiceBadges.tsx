'use client';

import React from 'react';
import { Service } from '@/types/clinic';
import { ServiceIconRenderer } from './DentalIcons';

interface QuickServiceBadgesProps {
  services: Service[];
  onSelectService?: (service: Service) => void;
}

export default function QuickServiceBadges({
  services,
  onSelectService,
}: QuickServiceBadgesProps) {
  // Take up to 5 main active services for the top banner
  const displayServices = services.slice(0, 5);

  return (
    <section className="w-full bg-white py-6 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {displayServices.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService && onSelectService(service)}
              className="group flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-[#EAF4FF] hover:bg-[#dbeafe] border border-sky-100 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#0878F9] group-hover:scale-110 transition-transform mb-3">
                <ServiceIconRenderer iconName={service.icon_name} className="w-7 h-7 text-[#0878F9]" />
              </div>
              <h3 className="text-center font-semibold text-xs sm:text-sm text-[#153E70] group-hover:text-[#0878F9] transition-colors leading-snug">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
