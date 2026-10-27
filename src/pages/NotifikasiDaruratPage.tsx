import React, { useState } from 'react';
import {
  EmergencyReport,
  IncidentCategory,
  UserProfile,
  ReportStatus,
} from '../types/index.ts';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { Modal } from '../components/common/Modal.tsx';
import {
  AlertTriangle,
  HeartCrack,
  ShieldAlert,
  Car,
  CloudRain,
  MoreHorizontal,
  ArrowRight,
  Search,
  Filter,
  Phone,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-react';
import { formatTanggalIndo } from '../utils/civicLogic.ts';

interface NotifikasiDaruratPageProps {
  reports: EmergencyReport[];
  currentUser: UserProfile;
  onOpenReportModal: (category?: IncidentCategory) => void;
  onUpdateReportStatus?: (reportId: string, status: ReportStatus, notes?: string) => void;
}

export const NotifikasiDaruratPage: React.FC<NotifikasiDaruratPageProps> = ({
  reports,
  currentUser,
  onOpenReportModal,
  onUpdateReportStatus,
}) => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  const categoryCards: {
    id: IncidentCategory;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
  }[] = [
    {
      id: 'kematian',
      title: 'Kematian',
      description: 'Duka cita & santunan rukun kematian',
      icon: HeartCrack,
      color: 'text-slate-700 bg-slate-100',
    },
    {
      id: 'pencurian',
      title: 'Pencurian',
      description: 'Tindak kejahatan & siskamling darurat',
      icon: ShieldAlert,
      color: 'text-[#B5121B] bg-red-50',
    },
    {
      id: 'kecelakaan',
      title: 'Kecelakaan',
      description: 'Laka lantas & pertolongan pertama',
      icon: Car,
      color: 'text-amber-700 bg-amber-50',
    },
    {
      id: 'bencana_alam',
      title: 'Bencana Alam',
      description: 'Pohon tumbang, banjir & angin kencang',
      icon: CloudRain,
      color: 'text-blue-700 bg-blue-50',
    },
    {
      id: 'lainnya',
      title: 'Lainnya',
      description: 'Kebakaran, sengatan hewan & darurat lain',
      icon: MoreHorizontal,
      color: 'text-purple-700 bg-purple-50',
    },
  ];

  const filteredReports = reports.filter(r => {
    const matchesCategory =
      activeCategoryFilter === 'semua' || r.type === activeCategoryFilter;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.reporter.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });

  const isOfficer = currentUser.role === 'ketua_rt' || currentUser.role === 'pengurus_rw';

  const handleStatusChange = (newStatus: ReportStatus) => {
    if (selectedReport && onUpdateReportStatus) {
      onUpdateReportStatus(selectedReport.id, newStatus, statusUpdateNote);
      setSelectedReport({
        ...selectedReport,
        status: newStatus,
        resolutionNotes: statusUpdateNote || selectedReport.resolutionNotes,
      });
      setStatusUpdateNote('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#20242B] tracking-tight">
          Notifikasi & Darurat
        </h1>
        <p className="text-xs sm:text-sm text-[#737B87] mt-0.5">
          Laporkan kejadian darurat atau pantau informasi penting di lingkungan Anda.
        </p>
      </div>

      {/* Wide Red Emergency Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#8F0D16] via-[#B5121B] to-[#E5242A] text-white p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>Pusat Tanggap Darurat Warga</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold">
            Butuh Bantuan Segera di Lingkungan RT/RW?
          </h2>
          <p className="text-xs text-white/85 mt-1 leading-relaxed">
            Klik tombol darurat untuk memberi tahu pengurus RT, RW 05, dan tetangga terdekat secara real-time.
          </p>
        </div>

        <button
          onClick={() => onOpenReportModal('lainnya')}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#B5121B] hover:bg-slate-50 font-bold text-xs shadow-md transition-all active:scale-98 shrink-0"
        >
          <span>Laporkan Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Five Emergency Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {categoryCards.map(cat => {
          const Icon = cat.icon;
          const count = reports.filter(r => r.type === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => onOpenReportModal(cat.id)}
              className="p-3.5 rounded-xl bg-white border border-[#E9EBEF] hover:border-[#B5121B]/40 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-[#20242B] group-hover:text-[#B5121B] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[10px] text-[#737B87] mt-0.5 line-clamp-2 leading-tight">
                  {cat.description}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span>{count} insiden</span>
                <span className="text-[#B5121B] font-semibold group-hover:translate-x-0.5 transition-transform">
                  + Lapor
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Riwayat Laporan Section */}
      <div className="rounded-xl bg-white border border-[#E9EBEF] shadow-2xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-[#E9EBEF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#20242B]">Riwayat Laporan Darurat</h3>
            <p className="text-xs text-[#737B87]">
              Pemantauan dan status tindak lanjut kejadian di wilayah RW 05
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Cari kejadian, lokasi..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E9EBEF] text-xs text-[#20242B] placeholder:text-slate-400 focus:outline-none focus:border-[#B5121B] w-44 sm:w-52"
              />
            </div>

            {/* Filter category buttons */}
            <select
              value={activeCategoryFilter}
              onChange={e => setActiveCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E9EBEF] bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="semua">Semua Kategori</option>
              <option value="kematian">Kematian</option>
              <option value="pencurian">Pencurian</option>
              <option value="kecelakaan">Kecelakaan</option>
              <option value="bencana_alam">Bencana Alam</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#20242B]">
            <thead className="bg-slate-50/70 border-b border-[#E9EBEF] text-[11px] font-semibold text-[#737B87] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Jenis Kejadian</th>
                <th className="py-3 px-4">Pelapor</th>
                <th className="py-3 px-4">Lokasi</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada laporan darurat yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{report.title}</div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide">
                        {report.type.replace('_', ' ')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{report.reporter}</div>
                      <div className="text-[10px] text-slate-400">{report.phone}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]">{report.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <div>{formatTanggalIndo(report.date)}</div>
                      <div className="text-[10px] text-slate-400">{report.time}</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={report.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="px-2.5 py-1 rounded border border-[#E9EBEF] hover:border-[#B5121B] hover:text-[#B5121B] text-slate-700 font-medium transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Detail Laporan: ${selectedReport.title}`}
          subtitle={`ID: ${selectedReport.id} · Diterima ${formatTanggalIndo(selectedReport.date)} ${selectedReport.time}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Status Penanganan:</span>
              <StatusBadge status={selectedReport.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block">Pelapor</span>
                <span className="font-semibold text-slate-800">{selectedReport.reporter}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Nomor Kontak</span>
                <span className="font-semibold text-slate-800">{selectedReport.phone}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Lokasi Insiden</span>
                <span className="font-semibold text-slate-800">{selectedReport.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Petugas Ditugaskan</span>
                <span className="font-semibold text-slate-800">
                  {selectedReport.assignedOfficer || 'Satgas RT/RW'}
                </span>
              </div>
            </div>

            <div>
              <span className="block font-semibold text-slate-700 mb-1">Keterangan Kejadian:</span>
              <p className="p-3 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed">
                {selectedReport.description}
              </p>
            </div>

            {selectedReport.resolutionNotes && (
              <div>
                <span className="block font-semibold text-slate-700 mb-1">Catatan Penyelesaian:</span>
                <p className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-900 leading-relaxed">
                  {selectedReport.resolutionNotes}
                </p>
              </div>
            )}

            {/* Officer Action Panel */}
            {isOfficer && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">
                  Aksi Pengurus ({currentUser.roleTitle}):
                </span>
                <input
                  type="text"
                  placeholder="Tambah catatan penanganan (opsional)..."
                  value={statusUpdateNote}
                  onChange={e => setStatusUpdateNote(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-200 text-xs"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange('diproses')}
                    disabled={selectedReport.status === 'diproses'}
                    className="flex-1 py-1.5 rounded bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold transition-colors"
                  >
                    Tandai Diproses
                  </button>
                  <button
                    onClick={() => handleStatusChange('selesai')}
                    disabled={selectedReport.status === 'selesai'}
                    className="flex-1 py-1.5 rounded bg-[#24865B] hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold transition-colors"
                  >
                    Tandai Selesai
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900"
              >
                Tutup
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
