import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Printer,
  Search,
  UserCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    staffList,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setQuickActionOpen,
    setPrintModalOpen,
    resetToDefaultData
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const todayFormatted = new Date().toLocaleDateString('ms-MY', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <header id="header-bar" className="h-14 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm flex items-center justify-between px-4 sm:px-6 shrink-0">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-700 rounded-md flex items-center justify-center text-white font-bold text-sm tracking-tight shrink-0 shadow-xs">
            TM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight leading-none">
                Jabatan Perancangan & Pembangunan
              </h1>
              <span className="text-slate-400 font-normal text-xs hidden md:inline">
                | Majlis Daerah Tanah Merah
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
              e-SPP MDTM • Sistem Pentadbiran & Pemantauan Bersepadu
            </p>
          </div>
        </div>

        {/* Middle Status Indicator */}
        <div className="hidden xl:flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status Sistem</div>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Aktif & Bersepadu
            </div>
          </div>
        </div>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-2">
          
          {/* Quick Action Button */}
          <button
            id="btn-quick-action"
            onClick={() => setQuickActionOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all active:scale-95"
            title="Tambah Entri Baharu"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daftar Baharu</span>
          </button>

          {/* Print Daily Report Button */}
          <button
            id="btn-print-report"
            onClick={() => setPrintModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs rounded-lg transition-all"
            title="Cetak Laporan Pergerakan Harian"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Cetak Laporan</span>
          </button>

          {/* Reset Data Button */}
          <button
            id="btn-reset-data"
            onClick={() => {
              if (confirm('Adakah anda pasti untuk menetapkan semula data aplikasi ke keadaan asal?')) {
                resetToDefaultData();
              }
            }}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
            title="Sifar Data Ujian"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notifications Toggle */}
          <div className="relative">
            <button
              id="btn-notification-toggle"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-all"
              aria-label="Pemberitahuan"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs text-slate-900">Notifikasi System</span>
                    <span className="bg-red-100 text-red-700 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                      {unreadCount} baru
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Tanda semua dibaca
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto mt-2 space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">Tiada notifikasi terkini.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2.5 rounded-lg border text-xs transition-all cursor-pointer ${
                          n.read ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-blue-50/50 border-blue-100 text-slate-800 font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Selector */}
          <div className="relative border-l border-slate-200 pl-2 ml-1">
            <button
              id="btn-user-profile"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold text-slate-800 truncate max-w-[120px] leading-none">
                  {currentUser.name.split(' ')[0]} {currentUser.name.split(' ')[1] || ''}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px] mt-0.5">
                  {currentUser.grade}
                </p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50">
                <div className="px-2 py-1.5 border-b border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Tukar Pengguna Log Masuk</p>
                  <p className="text-xs text-slate-500 mt-0.5">Pilih staf untuk melihat pandangan peribadi</p>
                </div>
                <div className="mt-1 max-h-56 overflow-y-auto space-y-1">
                  {staffList.map((stf) => (
                    <button
                      key={stf.id}
                      onClick={() => {
                        setCurrentUser(stf);
                        setShowUserDropdown(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between ${
                        stf.id === currentUser.id ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <p className="font-medium truncate">{stf.name}</p>
                        <p className="text-[10px] text-slate-500">{stf.position}</p>
                      </div>
                      {stf.id === currentUser.id && <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
