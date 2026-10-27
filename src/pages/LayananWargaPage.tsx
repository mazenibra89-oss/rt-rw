import React, { useState } from 'react';
import { ComplaintItem, UserProfile } from '../types/index.ts';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { Modal } from '../components/common/Modal.tsx';
import {
  Headphones,
  Plus,
  ThumbsUp,
  MapPin,
  Clock,
  CheckCircle,
  Filter,
  Search,
  Wrench,
  Trash2,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { formatTanggalIndo } from '../utils/civicLogic.ts';

interface LayananWargaPageProps {
  complaints: ComplaintItem[];
  currentUser: UserProfile;
  onCreateComplaint: (complaint: Omit<ComplaintItem, 'id' | 'upvotes' | 'status' | 'date'>) => void;
  onToggleUpvote: (complaintId: string) => void;
  onUpdateComplaintStatus?: (complaintId: string, status: 'Menunggu' | 'Diproses' | 'Selesai', note: string) => void;
}

export const LayananWargaPage: React.FC<LayananWargaPageProps> = ({
  complaints,
  currentUser,
  onCreateComplaint,
  onToggleUpvote,
  onUpdateComplaintStatus,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Infrastruktur' | 'Kebersihan' | 'Keamanan' | 'Sosial' | 'Lainnya'>('Infrastruktur');
  const [location, setLocation] = useState(`Jl. Melati ${currentUser.rt}`);
  const [description, setDescription] = useState('');

  // Officer note
  const [officerNote, setOfficerNote] = useState('');

  const categories = ['Semua', 'Infrastruktur', 'Kebersihan', 'Keamanan', 'Sosial', 'Lainnya'];

  const filteredComplaints = complaints.filter(c => {
    const matchesCat = activeCategory === 'Semua' || c.category === activeCategory;
    if (!matchesCat) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onCreateComplaint({
      title,
      category,
      location,
      reporter: currentUser.name,
      description,
    });

    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const isOfficer = currentUser.role === 'ketua_rt' || currentUser.role === 'pengurus_rw';

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#20242B] tracking-tight">
            Layanan & Pengaduan Warga
          </h1>
          <p className="text-xs sm:text-sm text-[#737B87] mt-0.5">
            Salurkan aspirasi, laporan kerusakan fasilitas umum, atau usulan perbaikan lingkungan.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white text-xs font-semibold shadow-sm transition-all active:scale-98 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pengaduan +</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E9EBEF] shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari keluhan atau lokasi..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E9EBEF] text-xs text-[#20242B] placeholder:text-slate-400 focus:outline-none focus:border-[#B5121B]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#FFF0F0] text-[#B5121B] border border-[#FCDADA] font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-[#E9EBEF] p-6">
            <Headphones className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada pengaduan ditemukan</p>
            <p className="text-xs text-slate-400 mt-0.5">Semua fasilitas lingkungan saat ini terpantau baik.</p>
          </div>
        ) : (
          filteredComplaints.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white border border-[#E9EBEF] hover:border-slate-300 transition-all shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {item.category}
                  </span>
                  <StatusBadge status={item.status} size="sm" />
                  <span className="text-[11px] text-slate-400">· {formatTanggalIndo(item.date)}</span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-[#20242B] hover:text-[#B5121B] transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#737B87] mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{item.location}</span>
                  </span>
                  <span>·</span>
                  <span>Pelapor: {item.reporter}</span>
                </div>
              </div>

              {/* Actions & Upvote */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onToggleUpvote(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    item.userUpvoted
                      ? 'bg-[#FFF0F0] text-[#B5121B] border-[#FCDADA]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${item.userUpvoted ? 'fill-[#B5121B]' : ''}`} />
                  <span className="tabular-nums">{item.upvotes}</span>
                </button>

                <button
                  onClick={() => setSelectedComplaint(item)}
                  className="px-3 py-1.5 rounded-lg border border-[#E9EBEF] hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Complaint Detail & Officer Response Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={selectedComplaint.title}
          subtitle={`ID: ${selectedComplaint.id} · Lokasi: ${selectedComplaint.location}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Status Pengaduan:</span>
              <StatusBadge status={selectedComplaint.status} />
            </div>

            <div>
              <span className="block font-semibold text-slate-700 mb-1">Rincian Laporan:</span>
              <p className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                {selectedComplaint.description}
              </p>
            </div>

            {selectedComplaint.responseNotes && (
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Tanggapan Pengurus RT/RW:</span>
                <p className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 leading-relaxed font-medium">
                  {selectedComplaint.responseNotes}
                </p>
              </div>
            )}

            {/* Officer Action */}
            {isOfficer && onUpdateComplaintStatus && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">
                  Tindak Lanjut ({currentUser.roleTitle}):
                </span>
                <input
                  type="text"
                  placeholder="Catatan penanganan fasilitas (misal: Teknisi telah dihubungi)..."
                  value={officerNote}
                  onChange={e => setOfficerNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onUpdateComplaintStatus(selectedComplaint.id, 'Diproses', officerNote || 'Sedang ditindaklanjuti.');
                      setSelectedComplaint({ ...selectedComplaint, status: 'Diproses', responseNotes: officerNote || 'Sedang ditindaklanjuti.' });
                      setOfficerNote('');
                    }}
                    className="flex-1 py-1.5 rounded bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                  >
                    Set Diproses
                  </button>
                  <button
                    onClick={() => {
                      onUpdateComplaintStatus(selectedComplaint.id, 'Selesai', officerNote || 'Perbaikan fasilitas telah selesai.');
                      setSelectedComplaint({ ...selectedComplaint, status: 'Selesai', responseNotes: officerNote || 'Perbaikan fasilitas telah selesai.' });
                      setOfficerNote('');
                    }}
                    className="flex-1 py-1.5 rounded bg-[#24865B] hover:bg-emerald-700 text-white font-semibold"
                  >
                    Tandai Selesai
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Buat Pengaduan Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Buat Pengaduan / Usulan Fasilitas"
        subtitle="Sampaikan keluhan fasilitas lingkungan untuk ditindaklanjuti pengurus RT/RW."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Judul Pengaduan <span className="text-[#E5242A]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Lampu penerangan jalan padam di perempatan gang"
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Kategori <span className="text-[#E5242A]">*</span>
              </label>
              <select
                value={category}
                onChange={e =>
                  setCategory(e.target.value as 'Infrastruktur' | 'Kebersihan' | 'Keamanan' | 'Sosial' | 'Lainnya')
                }
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              >
                <option value="Infrastruktur">Infrastruktur & Jalan</option>
                <option value="Kebersihan">Kebersihan & Sampah</option>
                <option value="Keamanan">Keamanan & Pos Ronda</option>
                <option value="Sosial">Sosial Kemasyarakatan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Lokasi Fasilitas <span className="text-[#E5242A]">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Contoh: Depan taman bermain RT 03"
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Rincian Masalah / Usulan <span className="text-[#E5242A]">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi kerusakan secara detail, sejak kapan terjadi, dan potensi bahaya yang ditimbulkan..."
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white font-semibold shadow-sm"
            >
              Kirim Pengaduan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
