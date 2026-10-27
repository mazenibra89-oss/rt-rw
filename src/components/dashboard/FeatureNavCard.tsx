import React from 'react';
import { IdCard, ShoppingBag, Wallet, Newspaper, ChevronRight } from 'lucide-react';
import { NavPage } from '../common/Sidebar.tsx';

interface FeatureNavCardProps {
  onNavigate: (page: NavPage) => void;
}

export const FeatureNavCards: React.FC<FeatureNavCardProps> = ({ onNavigate }) => {
  const cards: {
    id: NavPage;
    title: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    {
      id: 'administrasi',
      title: 'Administrasi Kependudukan',
      description: 'Urus dokumen kependudukan.',
      icon: IdCard,
    },
    {
      id: 'jualbeli',
      title: 'Jual Beli Warga',
      description: 'Beli, jual, dan dukung usaha warga.',
      icon: ShoppingBag,
    },
    {
      id: 'keuangan',
      title: 'Keuangan RT/RW',
      description: 'Lihat laporan keuangan.',
      icon: Wallet,
    },
    {
      id: 'berita',
      title: 'Berita & Informasi',
      description: 'Update dari RW, Kelurahan & Kota.',
      icon: Newspaper,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="group p-4 rounded-xl bg-white border border-[#E9EBEF] hover:border-[#B5121B]/40 hover:shadow-sm transition-all text-left flex items-start justify-between relative overflow-hidden"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFF0F0] text-[#B5121B] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="min-w-0 pr-2">
                <h3 className="text-xs font-bold text-[#20242B] group-hover:text-[#B5121B] transition-colors leading-tight">
                  {card.title}
                </h3>
                <p className="text-[11px] text-[#737B87] mt-1 leading-normal line-clamp-2">
                  {card.description}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#B5121B] shrink-0 mt-0.5 transition-colors" />
          </button>
        );
      })}
    </div>
  );
};
