import React from 'react';
import {
  Home,
  AlertTriangle,
  Newspaper,
  FileText,
  ShoppingBag,
  Wallet,
  Headphones,
  MessageSquare,
  Settings,
  ChevronDown,
  X,
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types/index.ts';

export type NavPage =
  | 'beranda'
  | 'darurat'
  | 'berita'
  | 'administrasi'
  | 'jualbeli'
  | 'keuangan'
  | 'layanan'
  | 'forum'
  | 'pengaturan';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  currentUser: UserProfile;
  onChangeRole: (role: UserRole) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  currentUser,
  onChangeRole,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const navItems: { id: NavPage; label: string; icon: React.ElementType }[] = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'darurat', label: 'Notifikasi & Darurat', icon: AlertTriangle },
    { id: 'berita', label: 'Berita & Informasi', icon: Newspaper },
    { id: 'administrasi', label: 'Administrasi Kependudukan', icon: FileText },
    { id: 'jualbeli', label: 'Jual Beli Warga', icon: ShoppingBag },
    { id: 'keuangan', label: 'Keuangan RT/RW', icon: Wallet },
    { id: 'layanan', label: 'Layanan Warga', icon: Headphones },
    { id: 'forum', label: 'Forum Warga', icon: MessageSquare },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const handleSelectNav = (page: NavPage) => {
    onNavigate(page);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#8F0D16] text-white select-none">
      {/* Brand Header */}
      <div className="px-4 py-5 flex items-center justify-between border-b border-white/10">
        <button
          onClick={() => handleSelectNav('beranda')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors">
            <Home className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight leading-none text-white">
              Lapor RT/RW
            </h1>
            <span className="text-[10px] text-white/70 block mt-0.5 font-normal">
              Kel. Kemiri · Sidoarjo
            </span>
          </div>
        </button>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          aria-label="Tutup Menu"
          className="lg:hidden p-1 rounded hover:bg-white/10 text-white/80 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Items (Exact order) */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelectNav(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left group ${
                isActive
                  ? 'bg-[#E5242A] text-white shadow-sm font-semibold'
                  : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform ${
                  isActive ? 'text-white' : 'text-white/75 group-hover:text-white'
                }`}
              />
              <span className="truncate leading-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Card at bottom with quick role switcher */}
      <div className="p-2.5 border-t border-white/10 relative">
        <button
          type="button"
          onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
          className="w-full flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-[#E5242A] border border-white/30 flex items-center justify-center font-bold text-xs text-white shrink-0">
            {currentUser.name
              .split(' ')
              .map(n => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate leading-tight">
              {currentUser.name}
            </p>
            <p className="text-[10px] text-white/70 truncate mt-0.5">
              {currentUser.roleTitle} · {currentUser.rt}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-white/60 shrink-0" />
        </button>

        {/* Role Switcher Menu */}
        {roleDropdownOpen && (
          <div className="absolute bottom-16 left-2 right-2 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-slate-900 text-xs animate-in fade-in slide-in-from-bottom-2">
            <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Ganti Peran (Demo)
            </div>
            <button
              onClick={() => {
                onChangeRole('penduduk');
                setRoleDropdownOpen(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                currentUser.role === 'penduduk' ? 'font-bold text-[#B5121B]' : 'text-slate-700'
              }`}
            >
              <span>Penduduk (Siti)</span>
              {currentUser.role === 'penduduk' && <span className="w-1.5 h-1.5 rounded-full bg-[#B5121B]" />}
            </button>
            <button
              onClick={() => {
                onChangeRole('ketua_rt');
                setRoleDropdownOpen(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                currentUser.role === 'ketua_rt' ? 'font-bold text-[#B5121B]' : 'text-slate-700'
              }`}
            >
              <span>Ketua RT 03 (Budi)</span>
              {currentUser.role === 'ketua_rt' && <span className="w-1.5 h-1.5 rounded-full bg-[#B5121B]" />}
            </button>
            <button
              onClick={() => {
                onChangeRole('pengurus_rw');
                setRoleDropdownOpen(false);
              }}
              className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                currentUser.role === 'pengurus_rw' ? 'font-bold text-[#B5121B]' : 'text-slate-700'
              }`}
            >
              <span>Pengurus RW 05 (H. Bambang)</span>
              {currentUser.role === 'pengurus_rw' && <span className="w-1.5 h-1.5 rounded-full bg-[#B5121B]" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (200px) */}
      <aside className="hidden lg:block w-[200px] fixed top-0 bottom-0 left-0 z-30 shadow-md">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
