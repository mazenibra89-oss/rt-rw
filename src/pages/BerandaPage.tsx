import React, { useState } from 'react';
import { HeroBanner } from '../components/dashboard/HeroBanner.tsx';
import { EmergencyQuickCard } from '../components/dashboard/EmergencyQuickCard.tsx';
import { FeatureNavCards } from '../components/dashboard/FeatureNavCard.tsx';
import { NewsAnnounceWeather } from '../components/dashboard/NewsAnnounceWeather.tsx';
import { Modal } from '../components/common/Modal.tsx';
import {
  UserProfile,
  NewsItem,
  AnnouncementItem,
  WeatherData,
  IncidentCategory,
} from '../types/index.ts';
import { NavPage } from '../components/common/Sidebar.tsx';
import { AlertCircle, Calendar, Eye, Share2, ShieldAlert } from 'lucide-react';

interface BerandaPageProps {
  currentUser: UserProfile;
  news: NewsItem[];
  announcements: AnnouncementItem[];
  weather: WeatherData;
  onNavigate: (page: NavPage) => void;
  onOpenEmergencyModal: (category?: IncidentCategory) => void;
}

export const BerandaPage: React.FC<BerandaPageProps> = ({
  currentUser,
  news,
  announcements,
  weather,
  onNavigate,
  onOpenEmergencyModal,
}) => {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementItem | null>(null);

  return (
    <div className="space-y-4">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#20242B] tracking-tight">
            Selamat Pagi, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#737B87] mt-0.5">
            Bersama kita wujudkan lingkungan yang aman, tertib, dan sejahtera di wilayah {currentUser.rt} / {currentUser.rw}.
          </p>
        </div>
      </div>

      {/* Hero & Emergency Card Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2">
          <HeroBanner
            userName={currentUser.name}
            onOpenReport={() => onOpenEmergencyModal('lainnya')}
          />
        </div>
        <div className="lg:col-span-1">
          <EmergencyQuickCard onSelectCategory={cat => onOpenEmergencyModal(cat)} />
        </div>
      </div>

      {/* Four Feature Cards */}
      <section>
        <FeatureNavCards onNavigate={onNavigate} />
      </section>

      {/* Lower Dashboard Area: 3 Columns */}
      <section>
        <NewsAnnounceWeather
          news={news}
          announcements={announcements}
          weather={weather}
          onNavigate={onNavigate}
          onSelectNews={setSelectedNews}
          onSelectAnnouncement={setSelectedAnnouncement}
        />
      </section>

      {/* News Detail Modal */}
      {selectedNews && (
        <Modal
          isOpen={!!selectedNews}
          onClose={() => setSelectedNews(null)}
          title={selectedNews.title}
          subtitle={`${selectedNews.source} · Diterbitkan ${selectedNews.publishedAt}`}
        >
          <div className="space-y-3 text-xs text-[#20242B]">
            <div className="flex items-center gap-2 text-slate-500 pb-2 border-b border-slate-100">
              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                Skop: {selectedNews.scope}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {selectedNews.readCount} kali dibaca
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-800 leading-relaxed">
              {selectedNews.summary}
            </p>

            <p className="text-slate-600 leading-relaxed">
              Informasi ini resmi disampaikan untuk seluruh warga RT 01 s/d RT 04 Kelurahan Kemiri guna memastikan koordinasi lingkungan berjalan teratur dan transparan. Warga diimbau untuk mematuhi arahan pengurus setempat dan saling mengingatkan tetangga sekitar.
            </p>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 rounded-lg bg-[#B5121B] text-white text-xs font-semibold hover:bg-[#8F0D16] transition-colors"
              >
                Tutup Berita
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <Modal
          isOpen={!!selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
          title={selectedAnnouncement.title}
          subtitle={`Oleh ${selectedAnnouncement.author} · ${selectedAnnouncement.date}`}
        >
          <div className="space-y-3 text-xs text-[#20242B]">
            {selectedAnnouncement.urgent && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[#B5121B] flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Pengumuman Penting & Mendesak</span>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 leading-relaxed text-slate-800">
              {selectedAnnouncement.content}
            </div>

            <p className="text-slate-500 text-[11px]">
              Diumumkan untuk cakupan: <strong>{selectedAnnouncement.scope}</strong>
            </p>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
