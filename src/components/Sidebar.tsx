import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ScreenId } from '../types/finance';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const {
    currentScreen,
    setCurrentScreen,
    user,
    userProfile,
    logout,
    setIsLoginModalOpen,
  } = useFinance();

  const activeUser = user
    ? {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        badge: 'Cloud Terhubung',
      }
    : userProfile
    ? {
        displayName: userProfile.displayName,
        email: userProfile.email,
        photoURL: userProfile.photoURL,
        badge: 'Profil Mandiri Aktif',
      }
    : null;

  const navItems: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'ringkasan-keuangan', label: 'Ringkasan Keuangan', icon: 'grid_view' },
    { id: 'buku-kas', label: 'Buku Kas', icon: 'receipt_long' },
    { id: 'analisis-anggaran', label: 'Analisis Anggaran', icon: 'pie_chart' },
    { id: 'manajemen-portofolio', label: 'Manajemen Portofolio', icon: 'trending_up' },
    { id: 'perencanaan-dana-dan-tagihan', label: 'Perencanaan Dana & Tagihan', icon: 'event_upcoming' },
    { id: 'akses-akun-premium', label: 'Akses Akun Premium', icon: 'workspace_premium' },
  ];

  const handleNavClick = (id: ScreenId) => {
    setCurrentScreen(id);
    onCloseMobile();
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-[#E2E8F0] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out select-none ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#E2E8F0]/60">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => handleNavClick('ringkasan-keuangan')}
            >
              {/* Logo Emblem */}
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white shrink-0 shadow-sm relative overflow-hidden">
                <span className="material-symbols-outlined text-[20px] text-[#10B981]">account_balance</span>
              </div>
              <div className="flex flex-col">
                <span className="font-['Plus_Jakarta_Sans'] font-bold text-[18px] text-[#0b1c30] tracking-tight leading-none">
                  GamMenkeu
                </span>
                <span className="text-[11px] font-semibold text-[#45464d] tracking-wider uppercase mt-0.5">
                  Sistem Finansial Mandiri
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Tutup Menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Premium Account Status Badge */}
          <div className="px-4 py-3">
            <div
              onClick={() => handleNavClick('akses-akun-premium')}
              className="bg-[#EFF4FF] hover:bg-[#E5EEFF] cursor-pointer px-3.5 py-2.5 rounded-lg flex items-center justify-between border border-[#E2E8F0]/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006C4A] text-[18px]">verified</span>
                <span className="text-[13px] font-medium text-[#0b1c30]">Akun Premium</span>
              </div>
              <span className="text-[11px] font-bold bg-[#82F5C1] text-[#00714E] px-2 py-0.5 rounded-full">
                Aktif
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-4 mt-2">
            <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Navigasi Utama
            </span>
            {navItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-[#131B2E] text-white font-semibold shadow-sm'
                      : 'text-[#45464d] hover:bg-[#EFF4FF] hover:text-[#0b1c30] font-medium'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-[#10B981]' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[13.5px] truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Session Auth Area */}
        <div className="p-4 border-t border-[#E2E8F0]/60 space-y-2">
          {activeUser ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                {activeUser.photoURL ? (
                  <img
                    src={activeUser.photoURL}
                    alt={activeUser.displayName || 'Avatar'}
                    className="w-7 h-7 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#131B2E] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                    {activeUser.displayName ? activeUser.displayName.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[12px] font-semibold text-[#0b1c30] truncate leading-tight">
                    {activeUser.displayName || 'Pengguna'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {activeUser.badge}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[#E11D48] hover:bg-[#FFF1F2] transition-colors font-medium text-[12.5px]"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Keluar Akun</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="px-2 py-1 text-[11px] text-slate-500 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <span>Mode: Tamu (Lokal)</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Offline/Lokal"></span>
              </div>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white transition-all font-semibold text-[13px] shadow-xs active:scale-[0.98]"
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
                <span>Masuk Akun</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
