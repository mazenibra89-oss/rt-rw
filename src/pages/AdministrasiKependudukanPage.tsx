import React, { useState } from 'react';
import {
  DocumentRequest,
  DocumentType,
  UserProfile,
  RequestStatus,
} from '../types/index.ts';
import { StatusBadge } from '../components/common/StatusBadge.tsx';
import { Modal } from '../components/common/Modal.tsx';
import {
  Plus,
  FileText,
  CreditCard,
  Users,
  Navigation,
  Baby,
  HeartCrack,
  MoreHorizontal,
  CheckCircle,
  FileCheck,
  Search,
  UploadCloud,
  Clock,
  Printer,
} from 'lucide-react';
import { formatTanggalIndo } from '../utils/civicLogic.ts';

interface AdministrasiKependudukanPageProps {
  requests: DocumentRequest[];
  currentUser: UserProfile;
  onCreateRequest: (req: Omit<DocumentRequest, 'id' | 'requestNumber' | 'status' | 'requestDate'>) => void;
  onUpdateStatus?: (requestId: string, status: RequestStatus) => void;
}

export const AdministrasiKependudukanPage: React.FC<AdministrasiKependudukanPageProps> = ({
  requests,
  currentUser,
  onCreateRequest,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'permohonan' | 'riwayat'>('permohonan');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType>('KTP');
  const [applicantName, setApplicantName] = useState(currentUser.name);
  const [nik, setNik] = useState(currentUser.nik);
  const [phone, setPhone] = useState(currentUser.phone);
  const [notes, setNotes] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentRequest | null>(null);

  const services: {
    type: DocumentType;
    name: string;
    description: string;
    icon: React.ElementType;
  }[] = [
    {
      type: 'KTP',
      name: 'KTP Elektronik',
      description: 'Pengantar rekam baru atau penggantian KTP rusak/hilang.',
      icon: CreditCard,
    },
    {
      type: 'Kartu Keluarga',
      name: 'Kartu Keluarga',
      description: 'Penerbitan baru, perubahan anggota keluarga & pecah KK.',
      icon: Users,
    },
    {
      type: 'Surat Pindah',
      name: 'Surat Pindah (SKPWNI)',
      description: 'Surat keterangan pindah domisili antar RT/Kelurahan/Kota.',
      icon: Navigation,
    },
    {
      type: 'Akta Kelahiran',
      name: 'Akta Kelahiran',
      description: 'Pengantar akta kelahiran bayi baru lahir ke Dispendukcapil.',
      icon: Baby,
    },
    {
      type: 'Akta Kematian',
      name: 'Akta Kematian',
      description: 'Keterangan duka cita & pelaporan akta kematian warga.',
      icon: HeartCrack,
    },
    {
      type: 'Lainnya',
      name: 'Surat Keterangan Lain',
      description: 'Surat domisili usaha, SKCK pengantar RT, atau keterangan tidak mampu.',
      icon: MoreHorizontal,
    },
  ];

  const handleOpenWithService = (type: DocumentType) => {
    setSelectedType(type);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !nik) return;

    onCreateRequest({
      serviceType: selectedType,
      applicantName,
      nik,
      phone,
      notes: notes || 'Permohonan surat pengantar administrasi RT/RW.',
      rt: currentUser.rt,
      rw: currentUser.rw,
      estimatedCompletion: '2-3 Hari Kerja',
    });

    setIsApplyModalOpen(false);
    setNotes('');
  };

  // Filter requests for tabs
  const activeRequests = requests.filter(r => r.status === 'Baru' || r.status === 'Diproses');
  const historyRequests = requests.filter(r => r.status === 'Selesai' || r.status === 'Ditolak');

  const displayedList = activeTab === 'permohonan' ? activeRequests : historyRequests;

  const isOfficer = currentUser.role === 'ketua_rt' || currentUser.role === 'pengurus_rw';

  return (
    <div className="space-y-5">
      {/* Page Title & Apply Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#20242B] tracking-tight">
            Administrasi Kependudukan
          </h1>
          <p className="text-xs sm:text-sm text-[#737B87] mt-0.5">
            Urus dokumen kependudukan dengan mudah dan cepat tanpa antre di balai RT.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedType('KTP');
            setIsApplyModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white text-xs font-semibold shadow-sm transition-all active:scale-98 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajukan Permohonan +</span>
        </button>
      </div>

      {/* Six Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map(svc => {
          const Icon = svc.icon;
          return (
            <button
              key={svc.type}
              onClick={() => handleOpenWithService(svc.type)}
              className="p-4 rounded-xl bg-white border border-[#E9EBEF] hover:border-[#B5121B]/40 hover:shadow-xs transition-all text-left flex items-start gap-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#FFF0F0] text-[#B5121B] flex items-center justify-center shrink-0 group-hover:bg-[#E5242A] group-hover:text-white transition-colors">
                <Icon className="w-4 h-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-[#20242B] group-hover:text-[#B5121B] transition-colors">
                  {svc.name}
                </h3>
                <p className="text-[11px] text-[#737B87] mt-0.5 line-clamp-2 leading-relaxed">
                  {svc.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Table Section with 2 Tabs */}
      <div className="rounded-xl bg-white border border-[#E9EBEF] shadow-2xs overflow-hidden">
        {/* Tab Selector Header */}
        <div className="px-4 pt-3 border-b border-[#E9EBEF] flex items-center gap-4">
          <button
            onClick={() => setActiveTab('permohonan')}
            className={`pb-3 text-xs font-semibold transition-colors relative ${
              activeTab === 'permohonan'
                ? 'text-[#B5121B]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Permohonan Aktif ({activeRequests.length})
            {activeTab === 'permohonan' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B5121B] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('riwayat')}
            className={`pb-3 text-xs font-semibold transition-colors relative ${
              activeTab === 'riwayat'
                ? 'text-[#B5121B]'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Riwayat Selesai ({historyRequests.length})
            {activeTab === 'riwayat' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B5121B] rounded-full" />
            )}
          </button>
        </div>

        {/* Structured Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#20242B]">
            <thead className="bg-slate-50/70 border-b border-[#E9EBEF] text-[11px] font-semibold text-[#737B87] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Jenis Layanan</th>
                <th className="py-3 px-4">Nomor Permohonan</th>
                <th className="py-3 px-4">Pemohon</th>
                <th className="py-3 px-4">Tanggal Pengajuan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9EBEF]">
              {displayedList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada dokumen pada daftar ini.
                  </td>
                </tr>
              ) : (
                displayedList.map(req => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{req.serviceType}</div>
                      <div className="text-[10px] text-slate-400">{req.rt} / {req.rw}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                      {req.requestNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{req.applicantName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">NIK: {req.nik}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      {formatTanggalIndo(req.requestDate)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedDoc(req)}
                        className="px-2.5 py-1 rounded border border-[#E9EBEF] hover:border-[#B5121B] hover:text-[#B5121B] text-slate-700 font-medium transition-colors"
                      >
                        Detail Surat
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Request Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Ajukan Permohonan Surat Pengantar"
        subtitle="Isi formulir untuk mengajukan surat pengantar resmi dari Ketua RT."
      >
        <form onSubmit={handleSubmitApply} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Jenis Dokumen / Layanan <span className="text-[#E5242A]">*</span>
            </label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as DocumentType)}
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            >
              {services.map(s => (
                <option key={s.type} value={s.type}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Nama Lengkap Sesuai KK <span className="text-[#E5242A]">*</span>
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Nomor Induk Kependudukan (NIK) <span className="text-[#E5242A]">*</span>
              </label>
              <input
                type="text"
                required
                value={nik}
                onChange={e => setNik(e.target.value)}
                placeholder="16 digit NIK"
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs font-mono text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Nomor WhatsApp / HP <span className="text-[#E5242A]">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#20242B] mb-1">
                Wilayah Domisili
              </label>
              <input
                type="text"
                disabled
                value={`${currentUser.rt} / ${currentUser.rw}`}
                className="w-full rounded-lg border border-[#E9EBEF] bg-slate-100 px-3 py-2 text-xs text-slate-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Keperluan / Catatan Tambahan
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Contoh: Permohonan penggantian KTP karena chip rusak atau pecah."
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          {/* Upload preview simulator */}
          <div className="rounded-lg border-2 border-dashed border-slate-200 p-4 text-center hover:bg-slate-50 transition-colors">
            <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1" />
            <p className="font-semibold text-slate-700 text-xs">
              Unggah Berkas Pendukung (KK / Pengantar Lama)
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Format JPG/PNG/PDF (Maks. 5MB)</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white font-semibold shadow-sm"
            >
              Kirim Permohonan
            </button>
          </div>
        </form>
      </Modal>

      {/* Document Detail & Officer Approval Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={`Detail Permohonan Dokumen`}
          subtitle={`No: ${selectedDoc.requestNumber} · Tanggal ${formatTanggalIndo(selectedDoc.requestDate)}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-medium text-slate-500">Status Permohonan:</span>
              <StatusBadge status={selectedDoc.status} />
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Layanan:</span>
                <span className="font-bold text-slate-900">{selectedDoc.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pemohon:</span>
                <span className="font-semibold text-slate-900">{selectedDoc.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NIK:</span>
                <span className="font-mono text-slate-800">{selectedDoc.nik}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wilayah:</span>
                <span className="text-slate-800">{selectedDoc.rt} / {selectedDoc.rw}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estimasi Selesai:</span>
                <span className="text-slate-800 font-medium">{selectedDoc.estimatedCompletion}</span>
              </div>
            </div>

            <div>
              <span className="block font-semibold text-slate-700 mb-1">Catatan Pemohon:</span>
              <p className="p-3 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed">
                {selectedDoc.notes}
              </p>
            </div>

            {/* Officer Verification Action */}
            {isOfficer && onUpdateStatus && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 block">
                  Aksi Verifikasi ({currentUser.roleTitle}):
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedDoc.id, 'Diproses');
                      setSelectedDoc({ ...selectedDoc, status: 'Diproses' });
                    }}
                    disabled={selectedDoc.status === 'Diproses'}
                    className="flex-1 py-1.5 rounded bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold transition-colors"
                  >
                    Setujui & Proses
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedDoc.id, 'Selesai');
                      setSelectedDoc({ ...selectedDoc, status: 'Selesai' });
                    }}
                    disabled={selectedDoc.status === 'Selesai'}
                    className="flex-1 py-1.5 rounded bg-[#24865B] hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold transition-colors"
                  >
                    Terbitkan Surat
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
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
