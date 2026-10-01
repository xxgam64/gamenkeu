import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const {
    setIsTransactionModalOpen,
    setIsExportModalOpen,
    setCurrentScreen,
    currentScreen,
    showToast,
    user,
    logout,
    setIsLoginModalOpen,
  } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Pajak Tahunan Mobil Jatuh Tempo',
      desc: 'Sisa 22 hari lagi (15 Nov 2024). Dana Rp 3.5M telah siap di kas.',
      time: '1 jam lalu',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Kupon SBN ORI024 Terkredit',
      desc: 'Imbal hasil Rp 114.375 berhasil masuk ke rekening RDN BCA.',
      time: 'Kemarin',
      unread: false,
    },
    {
      id: 'notif-3',
      title: 'Target Tabungan 80% Terpenuhi',
      desc: 'Pos Dana Darurat 6x telah mencapai Rp 24.000.000.',
      time: '3 hari lalu',
      unread: false,
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast('Pencarian Data', `Menemukan entri yang cocok dengan "${searchQuery}".`, 'info');
      if (currentScreen !== 'buku-kas') {
        setCurrentScreen('buku-kas');
      }
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'ringkasan-keuangan':
        return 'Ringkasan Finansial';
      case 'buku-kas':
        return 'Buku Kas & Jurnal Mutasi';
      case 'analisis-anggaran':
        return 'Analisis Anggaran 50/30/20';
      case 'manajemen-portofolio':
        return 'Manajemen Portofolio & Nilai Aset';
      case 'perencanaan-dana-dan-tagihan':
        return 'Perencanaan Dana & Tagihan';
      case 'akses-akun-premium':
        return 'Pengaturan Lisensi & Akses Akun';
      default:
        return 'Ringkasan Finansial';
    }
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0]/70 z-40 flex items-center justify-between px-4 lg:px-6">
      {/* Left zone: Hamburger (mobile) & Title or Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Buka Menu"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari entri buku kas, aset, atau transaksi..."
            className="w-full h-9 pl-9 pr-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:border-[#006C4A] focus:bg-white transition-all"
          />
        </form>

        <div className="sm:hidden font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-sm truncate">
          {getScreenTitle()}
        </div>

        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#E2E8F0]/70 text-slate-500 text-[11px] font-semibold whitespace-nowrap">
          <span className="material-symbols-outlined text-[14px] text-[#10B981]">calendar_today</span>
          <span>Q3 2024 • Realtime</span>
        </div>
      </div>

      {/* Right zone: Actions and User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
            title="Notifikasi Finansial"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-white"></span>
          </button>

          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-slate-900">
                  Notifikasi & Pengingat Tempo
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  1 Baru
                </span>
              </div>
              <div className="divide-y divide-slate-100 mt-1 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 px-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-xs text-slate-900">{n.title}</div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setCurrentScreen('perencanaan-dana-dan-tagihan');
                  }}
                  className="text-[11px] font-semibold text-[#006C4A] hover:underline"
                >
                  Buka Pengingat Kalender Tagihan →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Ekspor Laporan */}
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0b1c30] text-[13px] font-medium transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px] text-slate-500">file_download</span>
          <span>Ekspor Laporan</span>
        </button>

        {/* Catat Transaksi Button */}
        <button
          onClick={() => setIsTransactionModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-[13px] font-semibold transition-all shadow-sm active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span className="whitespace-nowrap">Catat Transaksi</span>
        </button>

        {/* Login or User Profile Lockup */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#E2E8F0] hover:opacity-90 transition-opacity text-left"
              type="button"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Avatar'}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-[#10B981]/30 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#131B2E] text-white flex items-center justify-center font-bold text-[12px] shadow-xs shrink-0">
                  {user.displayName
                    ? user.displayName.slice(0, 2).toUpperCase()
                    : user.email
                    ? user.email.slice(0, 2).toUpperCase()
                    : 'U'}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] font-semibold text-[#0b1c30] leading-tight truncate max-w-[120px]">
                    {user.displayName || 'Pengguna'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" title="Cloud Sync Aktif"></span>
                </div>
                <span className="text-[10px] text-slate-400 leading-tight truncate max-w-[120px]">
                  {user.email || 'Cloud Sync Aktif'}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-slate-400 hidden sm:inline">
                expand_more
              </span>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user.displayName || 'Pengguna GamMenkeu'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-[#006C4A] border border-emerald-200">
                    Firebase Cloud Sync Aktif
                  </span>
                </div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setCurrentScreen('akses-akun-premium');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-400">
                    manage_accounts
                  </span>
                  <span>Kelola Akun & Lisensi</span>
                </button>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Keluar Akun (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#E2E8F0]">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-[#006C4A] text-[13px] font-semibold transition-all shadow-xs"
              type="button"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="whitespace-nowrap">Masuk / Login</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
