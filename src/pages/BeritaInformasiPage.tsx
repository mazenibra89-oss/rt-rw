import React, { useState } from 'react';
import { NewsItem, AnnouncementItem, UserProfile } from '../types/index.ts';
import { Modal } from '../components/common/Modal.tsx';
import {
  Newspaper,
  BellRing,
  Search,
  Filter,
  Plus,
  Eye,
  Calendar,
  Share2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { canPublishAnnouncement } from '../utils/civicLogic.ts';

interface BeritaInformasiPageProps {
  news: NewsItem[];
  announcements: AnnouncementItem[];
  currentUser: UserProfile;
  onAddAnnouncement: (ann: Omit<AnnouncementItem, 'id'>) => void;
}

export const BeritaInformasiPage: React.FC<BeritaInformasiPageProps> = ({
  news,
  announcements,
  currentUser,
  onAddAnnouncement,
}) => {
  const [activeScope, setActiveScope] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedAnn, setSelectedAnn] = useState<AnnouncementItem | null>(null);
  const [isAddAnnModalOpen, setIsAddAnnModalOpen] = useState(false);

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annScope, setAnnScope] = useState(currentUser.rt);
  const [isUrgent, setIsUrgent] = useState(false);

  const scopeFilters = ['Semua', 'RT', 'RW', 'Kelurahan', 'Kota'];

  const filteredNews = news.filter(n => {
    const matchesScope = activeScope === 'Semua' || n.scope === activeScope;
    if (!matchesScope) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q) ||
      n.source.toLowerCase().includes(q)
    );
  });

  const isOfficer = canPublishAnnouncement(currentUser.role);

  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    onAddAnnouncement({
      title: annTitle,
      content: annContent,
      scope: annScope,
      date: 'Baru saja',
      urgent: isUrgent,
      author: currentUser.roleTitle,
    });

    setIsAddAnnModalOpen(false);
    setAnnTitle('');
    setAnnContent('');
    setIsUrgent(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#20242B] tracking-tight">
            Berita & Informasi
          </h1>
          <p className="text-xs sm:text-sm text-[#737B87] mt-0.5">
            Pusat siaran berita resmi dan pengumuman warga RT, RW, Kelurahan, hingga Kota Sidoarjo.
          </p>
        </div>

        {isOfficer && (
          <button
            onClick={() => setIsAddAnnModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white text-xs font-semibold shadow-sm transition-all active:scale-98 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Pengumuman</span>
          </button>
        )}
      </div>

      {/* Search & Scope Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E9EBEF] shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari berita atau pengumuman..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E9EBEF] text-xs text-[#20242B] placeholder:text-slate-400 focus:outline-none focus:border-[#B5121B]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Cakupan:</span>
          {scopeFilters.map(scope => (
            <button
              key={scope}
              onClick={() => setActiveScope(scope)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeScope === scope
                  ? 'bg-[#FFF0F0] text-[#B5121B] border border-[#FCDADA] font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {scope}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Berita Cards & Announcements Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* News List (2 Columns on desktop) */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-[#20242B] flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-[#B5121B]" />
            <span>Kabar Terkini ({filteredNews.length})</span>
          </h2>

          <div className="space-y-3">
            {filteredNews.map((item, idx) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-white border border-[#E9EBEF] hover:border-slate-300 transition-all flex flex-col sm:flex-row gap-4 shadow-2xs group"
              >
                {/* Visual Thumbnail */}
                <div className="w-full sm:w-36 h-28 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 shrink-0 flex items-center justify-center relative overflow-hidden">
                  <div
                    className={`absolute inset-0 opacity-20 ${
                      idx % 3 === 0 ? 'bg-red-500' : idx % 3 === 1 ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}
                  />
                  <Newspaper className="w-10 h-10 text-slate-400 group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/60 text-white">
                    {item.scope}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
                      <span className="font-semibold text-[#B5121B]">{item.source}</span>
                      <span>·</span>
                      <span>{item.publishedAt}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {item.readCount} baca
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-[#20242B] group-hover:text-[#B5121B] transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-[#737B87] mt-1.5 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 font-medium">
                      {item.category}
                    </span>
                    <button
                      onClick={() => setSelectedNews(item)}
                      className="text-xs font-semibold text-[#B5121B] hover:underline"
                    >
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements Sidebar (1 Column) */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-[#20242B] flex items-center gap-2">
            <BellRing className="w-4 h-4 text-[#B5121B]" />
            <span>Pengumuman Lingkungan ({announcements.length})</span>
          </h2>

          <div className="space-y-2.5">
            {announcements.map(ann => (
              <div
                key={ann.id}
                onClick={() => setSelectedAnn(ann)}
                className="p-3.5 rounded-xl bg-white border border-[#E9EBEF] hover:border-[#B5121B]/40 hover:shadow-xs transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF0F0] text-[#B5121B]">
                    {ann.scope}
                  </span>
                  {ann.urgent && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white">
                      Mendesak
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-[#20242B] mt-2 leading-snug">
                  {ann.title}
                </h4>
                <p className="text-[11px] text-[#737B87] mt-1 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{ann.author}</span>
                  <span>{ann.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* News Detail Modal */}
      {selectedNews && (
        <Modal
          isOpen={!!selectedNews}
          onClose={() => setSelectedNews(null)}
          title={selectedNews.title}
          subtitle={`${selectedNews.source} · Diterbitkan ${selectedNews.publishedAt}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2 text-slate-500 pb-2 border-b border-slate-100">
              <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                Cakupan: {selectedNews.scope}
              </span>
              <span>·</span>
              <span className="font-medium text-slate-600">{selectedNews.category}</span>
            </div>

            <p className="text-sm font-semibold text-slate-900 leading-relaxed">
              {selectedNews.summary}
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed space-y-2">
              <p>
                Pemerintah desa dan pengurus rukun warga senantiasa mengingatkan seluruh warga untuk memantau jadwal secara cermat. Kelengkapan berkas asli dan fotokopi disarankan dibawa saat mendatangi balai pelayanan.
              </p>
              <p>
                Informasi lebih lanjut dapat dikonfirmasikan ke Sekretariat Balai RT/RW atau melalui kontak nomor layanan resmi kelurahan.
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 rounded-lg bg-[#B5121B] text-white font-semibold hover:bg-[#8F0D16]"
              >
                Tutup Berita
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Announcement Detail Modal */}
      {selectedAnn && (
        <Modal
          isOpen={!!selectedAnn}
          onClose={() => setSelectedAnn(null)}
          title={selectedAnn.title}
          subtitle={`Oleh ${selectedAnn.author} · ${selectedAnn.date}`}
        >
          <div className="space-y-3 text-xs">
            {selectedAnn.urgent && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[#B5121B] flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Pengumuman Penting & Mendesak</span>
              </div>
            )}

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 leading-relaxed text-slate-800">
              {selectedAnn.content}
            </div>

            <p className="text-slate-500 text-[11px]">
              Diumumkan untuk cakupan: <strong>{selectedAnn.scope}</strong>
            </p>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedAnn(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900"
              >
                Mengerti
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Announcement Modal (Officers) */}
      <Modal
        isOpen={isAddAnnModalOpen}
        onClose={() => setIsAddAnnModalOpen(false)}
        title="Buat Pengumuman Warga Baru"
        subtitle={`Pengumuman resmi dari ${currentUser.roleTitle}`}
      >
        <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Judul Pengumuman <span className="text-[#E5242A]">*</span>
            </label>
            <input
              type="text"
              required
              value={annTitle}
              onChange={e => setAnnTitle(e.target.value)}
              placeholder="Contoh: Kerja Bakti Massal Saluran Air Hari Minggu"
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Wilayah Cakupan <span className="text-[#E5242A]">*</span>
              </label>
              <select
                value={annScope}
                onChange={e => setAnnScope(e.target.value)}
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              >
                <option value="RW 05">Seluruh RW 05</option>
                <option value="RT 01">Warga RT 01</option>
                <option value="RT 02">Warga RT 02</option>
                <option value="RT 03">Warga RT 03</option>
                <option value="RT 04">Warga RT 04</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Tingkat Kepentingan
              </label>
              <label className="flex items-center gap-2 p-2 rounded-lg border border-[#E9EBEF] bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={e => setIsUrgent(e.target.checked)}
                  className="rounded text-[#B5121B]"
                />
                <span className="font-semibold text-red-700">Tandai Mendesak</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Isi Pengumuman Lengkap <span className="text-[#E5242A]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={annContent}
              onChange={e => setAnnContent(e.target.value)}
              placeholder="Sampaikan waktu pelaksanaan, titik kumpul, peralatan yang perlu dibawa, serta kontak pengurus..."
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsAddAnnModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white font-semibold shadow-sm"
            >
              Publikasikan Pengumuman
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
