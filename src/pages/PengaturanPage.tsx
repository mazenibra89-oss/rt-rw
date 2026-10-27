import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types/index.ts';
import { Modal } from '../components/common/Modal.tsx';
import {
  User,
  MapPin,
  Shield,
  Settings as SettingsIcon,
  Edit3,
  Phone,
  Mail,
  Building,
  Users,
  Bell,
  Lock,
  LogOut,
  CheckCircle,
} from 'lucide-react';

interface PengaturanPageProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onChangeRole: (role: UserRole) => void;
}

export const PengaturanPage: React.FC<PengaturanPageProps> = ({
  currentUser,
  onUpdateProfile,
  onChangeRole,
}) => {
  const [activeTab, setActiveTab] = useState<'profil' | 'wilayah' | 'pengguna' | 'pengaturan'>('profil');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Edit form state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);

  // Region mock list
  const rtList = [
    { rt: 'RT 01', leader: 'Pak Hartono', phone: '0812-1111-2222', kkCount: 42, wargaCount: 168 },
    { rt: 'RT 02', leader: 'Agus Riyadi', phone: '0813-3333-4444', kkCount: 45, wargaCount: 176 },
    { rt: 'RT 03', leader: 'Budi Santoso', phone: '0812-3456-7890', kkCount: 48, wargaCount: 192 },
    { rt: 'RT 04', leader: 'Dedi Sutisna', phone: '0819-5555-6666', kkCount: 38, wargaCount: 150 },
  ];

  // User management mock list
  const [usersList, setUsersList] = useState([
    { id: '1', name: 'Budi Santoso', role: 'Ketua RT 03', rt: 'RT 03', status: 'Aktif', verified: true },
    { id: '2', name: 'H. Bambang Soeprapto', role: 'Ketua RW 05', rt: 'RT 01', status: 'Aktif', verified: true },
    { id: '3', name: 'Siti Nurhaliza', role: 'Penduduk', rt: 'RT 03', status: 'Aktif', verified: true },
    { id: '4', name: 'Dimas Kurniawan', role: 'Penduduk', rt: 'RT 02', status: 'Aktif', verified: true },
    { id: '5', name: 'Pak Joko Subagyo', role: 'Penduduk', rt: 'RT 01', status: 'Aktif', verified: true },
    { id: '6', name: 'Kevin Pratama', role: 'Penduduk', rt: 'RT 04', status: 'Verifikasi Pending', verified: false },
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, phone, email });
    setIsEditProfileOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#20242B] tracking-tight">
          Profil & Pengaturan
        </h1>
        <p className="text-xs sm:text-sm text-[#737B87] mt-0.5">
          Kelola akun dan pengaturan wilayah lingkungan Anda.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-[#E9EBEF] shadow-2xs overflow-hidden">
        <div className="flex items-center gap-1 p-1.5 border-b border-[#E9EBEF] bg-slate-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profil')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'profil'
                ? 'bg-white text-[#B5121B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil Pengguna</span>
          </button>
          <button
            onClick={() => setActiveTab('wilayah')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'wilayah'
                ? 'bg-white text-[#B5121B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Wilayah RT/RW</span>
          </button>
          <button
            onClick={() => setActiveTab('pengguna')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'pengguna'
                ? 'bg-white text-[#B5121B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manajemen Pengguna</span>
          </button>
          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'pengaturan'
                ? 'bg-white text-[#B5121B] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Pengaturan Akun</span>
          </button>
        </div>

        {/* Tab 1: Profil */}
        {activeTab === 'profil' && (
          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E9EBEF]">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#B5121B] text-white flex items-center justify-center font-bold text-xl shadow-sm">
                  {currentUser.name
                    .split(' ')
                    .map(n => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#20242B]">{currentUser.name}</h3>
                  <p className="text-xs text-[#737B87] mt-0.5 font-medium">
                    {currentUser.roleTitle} · {currentUser.rt} / {currentUser.rw}
                  </p>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-[#24865B] mt-1 border border-emerald-200">
                    Akun Terverifikasi RT/RW
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setName(currentUser.name);
                  setPhone(currentUser.phone);
                  setEmail(currentUser.email);
                  setIsEditProfileOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E9EBEF] hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Ubah Profil</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#B5121B]" />
                  <span>Informasi Pribadi</span>
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Nama Lengkap</span>
                  <span className="font-semibold text-slate-800">{currentUser.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">NIK Terdaftar</span>
                  <span className="font-mono text-slate-800">{currentUser.nik}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Peran Sistem</span>
                  <span className="font-semibold text-[#B5121B]">{currentUser.roleTitle}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#B5121B]" />
                  <span>Domisili & Kontak</span>
                </h4>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Wilayah RT / RW</span>
                  <span className="font-semibold text-slate-800">{currentUser.rt} / {currentUser.rw}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Kelurahan</span>
                  <span className="text-slate-800">{currentUser.kelurahan}, {currentUser.kecamatan}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">No. WhatsApp</span>
                  <span className="font-mono text-slate-800">{currentUser.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Email</span>
                  <span className="text-slate-800">{currentUser.email}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Wilayah */}
        {activeTab === 'wilayah' && (
          <div className="p-5 sm:p-6 space-y-5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Rukun Warga 05 · Kelurahan Kemiri
                </h3>
                <p className="text-slate-600 mt-1">
                  Kecamatan Sidoarjo, Kabupaten Sidoarjo, Jawa Timur (Kode Pos 61218)
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-slate-500 block">Total Warga Terdata:</span>
                <span className="font-bold text-slate-900 text-sm">686 Jiwa (173 KK)</span>
              </div>
            </div>

            <h4 className="font-bold text-slate-800 text-xs">
              Daftar Rukun Tetangga (RT) dalam Lingkungan RW 05:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rtList.map(rt => (
                <div key={rt.rt} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-sm text-[#B5121B]">{rt.rt}</span>
                    <span className="text-[11px] text-slate-500">{rt.kkCount} Kartu Keluarga</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ketua RT:</span>
                    <span className="font-semibold text-slate-900">{rt.leader}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kontak:</span>
                    <span className="font-mono text-slate-800">{rt.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Jumlah Jiwa:</span>
                    <span className="text-slate-800">{rt.wargaCount} Warga</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Pengguna */}
        {activeTab === 'pengguna' && (
          <div className="p-5 sm:p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Daftar Akun Pengurus & Warga</h3>
                <p className="text-slate-500">
                  Tinjau dan kelola verifikasi akun kependudukan warga RW 05
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Nama</th>
                    <th className="py-2.5 px-3">Peran</th>
                    <th className="py-2.5 px-3">Wilayah</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{u.name}</td>
                      <td className="py-2.5 px-3 text-slate-700">{u.role}</td>
                      <td className="py-2.5 px-3 text-slate-600">{u.rt}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            u.verified
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setUsersList(prev =>
                              prev.map(item =>
                                item.id === u.id
                                  ? { ...item, verified: !item.verified, status: !item.verified ? 'Aktif' : 'Verifikasi Pending' }
                                  : item
                              )
                            );
                          }}
                          className="px-2 py-1 rounded border border-slate-200 hover:bg-slate-100 text-[11px] font-medium"
                        >
                          {u.verified ? 'Tangguhkan' : 'Verifikasi'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Pengaturan */}
        {activeTab === 'pengaturan' && (
          <div className="p-5 sm:p-6 space-y-6 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#B5121B]" />
                <span>Preferensi Notifikasi Lingkungan</span>
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#B5121B]" />
                  <div>
                    <p className="font-semibold text-slate-900">Peringatan Bahaya & Panik Button</p>
                    <p className="text-[11px] text-slate-500">Terima pemberitahuan seketika saat ada kecelakaan atau pencurian di wilayah RT Anda.</p>
                  </div>
                </label>
                <label className="flex items-center gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#B5121B]" />
                  <div>
                    <p className="font-semibold text-slate-900">Pengumuman Resmi RT/RW</p>
                    <p className="text-[11px] text-slate-500">Notifikasi jadwal kerja bakti, posyandu, dan rapat warga.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#B5121B]" />
                <span>Keamanan Sandi & Privasi</span>
              </h4>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">Kata Sandi Akun</p>
                  <p className="text-[11px] text-slate-500">Terakhir diperbarui 30 hari yang lalu</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Fitur simulasi ubah sandi: tautan reset telah dikirim ke email terdaftar.')}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Ubah Sandi
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold border border-rose-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun (Logout)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Ubah Profil Pengguna"
        subtitle="Perbarui data kontak yang digunakan untuk koordinasi lingkungan."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Nama Lengkap <span className="text-[#E5242A]">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#20242B] mb-1">
              Nomor WhatsApp <span className="text-[#E5242A]">*</span>
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
              Alamat Email <span className="text-[#E5242A]">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#E9EBEF] px-3 py-2 text-xs text-[#20242B] focus:border-[#B5121B] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#E5242A] hover:bg-[#B5121B] text-white font-semibold shadow-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar Akun"
        subtitle="Apakah Anda yakin ingin keluar dari sesi aplikasi Lapor RT/RW?"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            Anda dapat masuk kembali kapan saja menggunakan akun demo warga atau pengurus RT/RW.
          </p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E9EBEF]">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E9EBEF] text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>
            <button
              onClick={() => {
                setIsLogoutModalOpen(false);
                onChangeRole('penduduk');
              }}
              className="px-4 py-2 rounded-lg bg-[#E5242A] text-white font-semibold hover:bg-[#B5121B]"
            >
              Ya, Keluar Akun
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
