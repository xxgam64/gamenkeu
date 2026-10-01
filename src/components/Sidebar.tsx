import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ScreenId } from '../types/finance';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const { currentScreen, setCurrentScreen, showToast } = useFinance();

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

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    showToast('Sesi Terkunci', 'Data sesi Anda tetap tersimpan dengan aman di penyimpanan lokal.', 'info');
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

        {/* Bottom Session Logout */}
        <div className="p-4 border-t border-[#E2E8F0]/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[#45464d] hover:bg-[#FFF1F2] hover:text-[#E11D48] transition-colors font-medium text-[13.5px]"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>
    </>
  );
};
