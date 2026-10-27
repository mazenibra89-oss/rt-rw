import React from 'react';
import { AlertCircle, HeartCrack, ShieldAlert, Car, MoreHorizontal } from 'lucide-react';
import { IncidentCategory } from '../../types/index.ts';

interface EmergencyQuickCardProps {
  onSelectCategory: (category: IncidentCategory) => void;
}

export const EmergencyQuickCard: React.FC<EmergencyQuickCardProps> = ({ onSelectCategory }) => {
  const shortcuts: { id: IncidentCategory; label: string; icon: React.ElementType }[] = [
    { id: 'kematian', label: 'Kematian', icon: HeartCrack },
    { id: 'pencurian', label: 'Pencurian', icon: ShieldAlert },
    { id: 'kecelakaan', label: 'Kecelakaan', icon: Car },
    { id: 'lainnya', label: 'Lainnya', icon: MoreHorizontal },
  ];

  return (
    <div className="rounded-xl bg-[#FFF0F0] border border-[#FCDADA] p-4 flex flex-col justify-between shadow-2xs">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-[#E5242A] text-white flex items-center justify-center shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-[#B5121B] tracking-tight">
            Panik Button
          </h3>
        </div>
        <p className="text-[11px] text-[#737B87] leading-tight">
          Laporkan kejadian darurat dengan cepat.
        </p>
      </div>

      {/* 4 Emergency shortcut buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {shortcuts.map(sc => {
          const Icon = sc.icon;
          return (
            <button
              key={sc.id}
              onClick={() => onSelectCategory(sc.id)}
              className="flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-red-50 border border-[#FCDADA] text-[#B5121B] text-xs font-semibold transition-all shadow-2xs active:scale-97 text-left"
            >
              <div className="w-6 h-6 rounded-md bg-[#FFF0F0] flex items-center justify-center text-[#E5242A] shrink-0">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{sc.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
