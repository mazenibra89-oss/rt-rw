import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const s = status.toLowerCase();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  if (s === 'diproses') {
    return (
      <span className={`inline-flex items-center font-medium rounded-full bg-[#FFF0F0] text-[#B5121B] border border-[#FCDADA] ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#E5242A] mr-1.5" />
        Diproses
      </span>
    );
  }

  if (s === 'selesai') {
    return (
      <span className={`inline-flex items-center font-medium rounded-full bg-[#EBF7F0] text-[#24865B] border border-[#CDEEDC] ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#24865B] mr-1.5" />
        Selesai
      </span>
    );
  }

  if (s === 'baru' || s === 'menunggu') {
    return (
      <span className={`inline-flex items-center font-medium rounded-full bg-[#EDF4FC] text-[#3478C8] border border-[#D5E6F8] ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#3478C8] mr-1.5" />
        {status}
      </span>
    );
  }

  if (s === 'ditolak') {
    return (
      <span className={`inline-flex items-center font-medium rounded-full bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA] ${sizeClasses}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mr-1.5" />
        Ditolak
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
      {status}
    </span>
  );
};
