import React, { useState } from 'react';
import {
  Bell,
  Menu,
  ChevronDown,
  MapPin,
  Check,
  User,
  Shield,
  ExternalLink,
} from 'lucide-react';
import { UserProfile, UserRole, NotificationItem } from '../../types/index.ts';

interface TopHeaderProps {
  pageTitle: string;
  currentUser: UserProfile;
  activeRtFilter: string;
  onChangeRtFilter: (rt: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationsRead: () => void;
  onChangeRole: (role: UserRole) => void;
  onOpenMobileMenu: () => void;
  onOpenEmergencyModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  pageTitle,
  currentUser,
  activeRtFilter,
  onChangeRtFilter,
  notifications,
  onMarkNotificationsRead,
  onChangeRole,
  onOpenMobileMenu,
  onOpenEmergencyModal,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [rtDropdownOpen, setRtDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const rtOptions = ['RW 05', 'RT 01', 'RT 02', 'RT 03', 'RT 04'];

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-[#E9EBEF] px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Page Title / Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Buka Menu"
          className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#20242B] tracking-tight leading-tight">
            {pageTitle}
          </h2>
          <p className="text-[11px] text-[#737B87] hidden sm:block">
            Sistem Informasi Warga Kelurahan Kemiri · Sidoarjo
          </p>
        </div>
      </div>

      {/* Right controls: Quick Panic, Neighborhood selector, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Emergency button in header for urgent access */}
        <button
          onClick={onOpenEmergencyModal}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFF0F0] text-[#B5121B] border border-[#FCDADA] text-xs font-semibold hover:bg-[#FCDADA] transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-[#E5242A] animate-pulse" />
          <span>Panik</span>
        </button>

        {/* Neighborhood Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setRtDropdownOpen(!rtDropdownOpen);
              setNotifOpen(false);
              setUserDropdownOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E9EBEF] bg-slate-50/70 hover:bg-slate-100 text-xs font-medium text-[#20242B] transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#B5121B]" />
            <span className="font-semibold">{activeRtFilter}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {rtDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-[#E9EBEF] py-1 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[10px] text-slate-400 font-semibold uppercase">
                Pilih Wilayah
              </div>
              {rtOptions.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    onChangeRtFilter(option);
                    setRtDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                    activeRtFilter === option
                      ? 'font-bold text-[#B5121B] bg-[#FFF0F0]'
                      : 'text-slate-700'
                  }`}
                >
                  <span>{option}</span>
                  {activeRtFilter === option && <Check className="w-3 h-3 text-[#B5121B]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setRtDropdownOpen(false);
              setUserDropdownOpen(false);
            }}
            aria-label="Notifikasi"
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E5242A] ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-2xl border border-[#E9EBEF] py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-[#E9EBEF]">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-[#20242B]">Notifikasi Lingkungan</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-[#FFF0F0] text-[#B5121B] font-bold">
                      {unreadCount} baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkNotificationsRead}
                    className="text-[11px] text-[#B5121B] hover:underline font-medium"
                  >
                    Tandai dibaca
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Tidak ada notifikasi baru
                  </div>
                ) : (
                  notifications.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 text-xs transition-colors hover:bg-slate-50 ${
                        !item.read ? 'bg-[#FFF9F9]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-semibold text-slate-900 ${!item.read ? 'text-[#B5121B]' : ''}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                      </div>
                      <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setUserDropdownOpen(!userDropdownOpen);
              setNotifOpen(false);
              setRtDropdownOpen(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#B5121B] text-white flex items-center justify-center font-bold text-xs ring-2 ring-slate-100">
              {currentUser.name
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-[#20242B] leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-[#737B87]">
                {currentUser.roleTitle}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border border-[#E9EBEF] py-2 z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="px-3.5 py-2 border-b border-[#E9EBEF]">
                <p className="font-semibold text-[#20242B]">{currentUser.name}</p>
                <p className="text-[11px] text-[#737B87]">{currentUser.email}</p>
                <div className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FFF0F0] text-[#B5121B]">
                  {currentUser.roleTitle} · {currentUser.rt}/{currentUser.rw}
                </div>
              </div>

              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulasi Peran Pengguna
              </div>
              <button
                onClick={() => {
                  onChangeRole('penduduk');
                  setUserDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                  currentUser.role === 'penduduk' ? 'font-bold text-[#B5121B]' : 'text-slate-700'
                }`}
              >
                <span>Penduduk (Siti Nurhaliza)</span>
                {currentUser.role === 'penduduk' && <Check className="w-3.5 h-3.5 text-[#B5121B]" />}
              </button>
              <button
                onClick={() => {
                  onChangeRole('ketua_rt');
                  setUserDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                  currentUser.role === 'ketua_rt' ? 'font-bold text-[#B5121B]' : 'text-slate-700'
                }`}
              >
                <span>Ketua RT 03 (Budi Santoso)</span>
                {currentUser.role === 'ketua_rt' && <Check className="w-3.5 h-3.5 text-[#B5121B]" />}
              </button>
              <button
                onClick={() => {
                  onChangeRole('pengurus_rw');
                  setUserDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-1.5 hover:bg-slate-50 flex items-center justify-between ${
                  currentUser.role === 'pengurus_rw' ? 'font-bold text-[#B5121B]' : 'text-slate-700'
                }`}
              >
                <span>Pengurus RW 05 (H. Bambang)</span>
                {currentUser.role === 'pengurus_rw' && <Check className="w-3.5 h-3.5 text-[#B5121B]" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
