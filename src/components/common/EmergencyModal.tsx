import React, { useState } from 'react';
import { Modal } from './Modal.tsx';
import { IncidentCategory, EmergencyReport } from '../../types/index.ts';
import { AlertTriangle, ShieldAlert, Phone, MapPin, FileText, CheckCircle2 } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: Omit<EmergencyReport, 'id' | 'time' | 'date' | 'status'>) => void;
  initialCategory?: IncidentCategory;
  defaultLocation?: string;
  defaultPhone?: string;
  reporterName?: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialCategory = 'lainnya',
  defaultLocation = 'Jl. Melati RT 03',
  defaultPhone = '0812-3456-7890',
  reporterName = 'Budi Santoso',
}) => {
  const [category, setCategory] = useState<IncidentCategory>(initialCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(defaultLocation);
  const [phone, setPhone] = useState(defaultPhone);
  const [step, setStep] = useState<'form' | 'confirm'>('form');

  // Reset or update on open
  React.useEffect(() => {
    if (isOpen) {
      setCategory(initialCategory);
      setStep('form');
      setTitle('');
      setDescription('');
    }
  }, [isOpen, initialCategory]);

  const categories: { id: IncidentCategory; label: string; icon: string }[] = [
    { id: 'kematian', label: 'Kematian Warga', icon: '🕊️' },
    { id: 'pencurian', label: 'Pencurian / Kriminal', icon: '🚨' },
    { id: 'kecelakaan', label: 'Kecelakaan Lalu Lintas', icon: '🚑' },
    { id: 'bencana_alam', label: 'Bencana / Pohon Tumbang', icon: '⛈️' },
    { id: 'lainnya', label: 'Lainnya / Kebakaran', icon: '⚠️' },
  ];

  const handleNextToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim() || !phone.trim()) {
      return;
    }
    setStep('confirm');
  };

  const handleFinalSubmit = () => {
    const reportTitle =
      title.trim() ||
      categories.find(c => c.id === category)?.label ||
      'Laporan Darurat Warga';

    onSubmit({
      type: category,
      title: reportTitle,
      reporter: reporterName,
      location,
      description,
      phone,
    });
    setStep('form');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 'form' ? 'Buat Laporan Darurat' : 'Konfirmasi Kirim Laporan'}
      subtitle={
        step === 'form'
          ? 'Sampaikan kejadian mendesak ke pengurus lingkungan dengan cepat.'
          : 'Periksa kembali rincian sebelum disebarkan ke jajaran pengurus.'
      }
    >
      {step === 'form' ? (
        <form onSubmit={handleNextToConfirm} className="space-y-4">
          {/* Important alert notice */}
          <div className="rounded-lg bg-[#FFF0F0] border border-[#FCDADA] p-3 text-xs text-[#8F0D16] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#E5242A] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#B5121B]">Pemberitahuan Sistem Tanggap RT/RW</p>
              <p className="mt-0.5 text-slate-700 leading-relaxed">
                Fitur ini meneruskan laporan ke Pengurus RT, RW 05, dan Satgas Keamanan Lingkungan setempat.
                Untuk kondisi kritis medis atau ancaman jiwa langsung, segera hubungi juga Call Center 112 / Polsek terdekat.
              </p>
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-[#20242B] mb-1.5">
              Jenis Kejadian <span className="text-[#E5242A]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map(c => {
                const isSelected = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium text-left transition-colors ${
                      isSelected
                        ? 'border-[#B5121B] bg-[#FFF0F0] text-[#B5121B] ring-1 ring-[#B5121B]'
                        : 'border-[#E9EBEF] hover:bg-slate-50 text-[#20242B]'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom title / summary */}
          <div>
            <label className="block text-xs font-semibold text-[#20242B] mb-1">
              Judul Kejadian (Opsional)
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Tabrakan ringan di pertigaan pos kamling"
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] placeholder:text-slate-400 focus:border-[#B5121B] focus:outline-none focus:ring-1 focus:ring-[#B5121B]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-[#20242B] mb-1">
              Lokasi Kejadian <span className="text-[#E5242A]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Contoh: Jl. Melati no. 14 RT 03"
                className="w-full rounded-lg border border-[#E9EBEF] pl-9 pr-3 py-2 text-xs text-[#20242B] placeholder:text-slate-400 focus:border-[#B5121B] focus:outline-none focus:ring-1 focus:ring-[#B5121B]"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-[#20242B] mb-1">
              Nomor Telepon Pelapor <span className="text-[#E5242A]">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full rounded-lg border border-[#E9EBEF] pl-9 pr-3 py-2 text-xs text-[#20242B] placeholder:text-slate-400 focus:border-[#B5121B] focus:outline-none focus:ring-1 focus:ring-[#B5121B]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#20242B] mb-1">
              Deskripsi Singkat Kejadian <span className="text-[#E5242A]">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Jelaskan kondisi di lokasi, korban/dampak, serta bantuan darurat yang mendesak dibutuhkan..."
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] placeholder:text-slate-400 focus:border-[#B5121B] focus:outline-none focus:ring-1 focus:ring-[#B5121B]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white text-xs font-semibold transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Lanjut Konfirmasi
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-[#E9EBEF] space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <span className="text-slate-500">Kategori Kejadian</span>
              <span className="font-semibold text-[#B5121B] uppercase tracking-wide">
                {categories.find(c => c.id === category)?.label}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Pelapor</span>
              <span className="font-medium text-slate-900">{reporterName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Lokasi</span>
              <span className="font-medium text-slate-900">{location}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Kontak</span>
              <span className="font-medium text-slate-900">{phone}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="block text-slate-500 mb-1">Rincian:</span>
              <p className="text-slate-800 bg-white p-2.5 rounded border border-slate-200 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Dengan mengirim laporan ini, notifikasi prioritas tinggi akan segera dikirimkan ke perangkat pengurus RT 03 dan RW 05.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setStep('form')}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Ubah Data
            </button>
            <button
              type="button"
              onClick={handleFinalSubmit}
              className="px-5 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white text-xs font-semibold transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Kirim Laporan Sekarang
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
