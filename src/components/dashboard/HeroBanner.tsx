import React from 'react';
import { ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface HeroBannerProps {
  userName: string;
  onOpenReport: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ userName, onOpenReport }) => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#8F0D16] via-[#B5121B] to-[#C91A24] text-white shadow-sm min-h-[148px] p-5 sm:p-6 flex flex-col justify-between">
      {/* Decorative background geometry and architectural neighborhood silhouette */}
      <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/2 opacity-25 pointer-events-none overflow-hidden flex items-end justify-end pr-2">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full object-cover"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Stylized residential roofs & trees in Indonesian housing complex */}
          <path d="M40 180 L80 120 L120 180 Z" fill="white" fillOpacity="0.4" />
          <path d="M110 180 L160 100 L210 180 Z" fill="white" fillOpacity="0.6" />
          <path d="M190 180 L250 85 L310 180 Z" fill="white" fillOpacity="0.5" />
          <path d="M290 180 L350 110 L410 180 Z" fill="white" fillOpacity="0.7" />
          {/* Subtle tropical palm/foliage curves */}
          <circle cx="360" cy="90" r="28" fill="white" fillOpacity="0.3" />
          <circle cx="90" cy="110" r="22" fill="white" fillOpacity="0.25" />
          <rect x="0" y="175" width="400" height="25" fill="white" fillOpacity="0.3" />
        </svg>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 text-[11px] font-medium text-white/95 mb-2 backdrop-blur-xs">
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Selamat Pagi, {userName}</span>
        </div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white leading-snug">
          Membangun lingkungan yang aman, tertib, dan sejahtera dimulai dari kita.
        </h2>
        <p className="text-xs text-white/80 mt-1 max-w-md hidden sm:block">
          Kelola urusan RT/RW kini lebih cepat, transparan, dan terintegrasi langsung dalam satu genggaman.
        </p>
      </div>

      {/* Action Button */}
      <div className="relative z-10 mt-3 sm:mt-2">
        <button
          onClick={onOpenReport}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#B5121B] hover:bg-slate-50 text-xs font-bold transition-all shadow-sm active:scale-98"
        >
          <span>Lapor Sekarang</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
