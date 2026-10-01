import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, user } = useFinance();
  const [loading, setLoading] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await login();
      setIsLoginModalOpen(false);
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F172A] flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[22px] text-[#10B981]">
                account_balance
              </span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                Masuk ke GamMenkeu
              </h3>
              <p className="text-xs text-slate-500">Sistem Finansial Mandiri Multi-User</p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="py-6 space-y-4">
          <div className="bg-[#EFF4FF] border border-[#CBD5E1]/60 rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#006C4A] text-[22px] mt-0.5 shrink-0">
                cloud_done
              </span>
              <div>
                <h4 className="text-xs font-bold text-[#0b1c30]">
                  Database Cloud Pribadi Otomatis
                </h4>
                <p className="text-[11.5px] text-slate-600 mt-1 leading-relaxed">
                  Siapapun dapat masuk menggunakan akun Google. Setiap pengguna memiliki buku kas, portofolio aset, dan pos anggaran mandiri yang terenkripsi dan terpisah.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
              <span>Sinkronisasi otomatis di ponsel, tablet, dan PC</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
              <span>Data aman terisolasi di Firebase Firestore</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#10B981] text-[18px]">check_circle</span>
              <span>Gratis tanpa batas transaksi untuk semua pengguna</span>
            </div>
          </div>

          {/* Google Sign-in button */}
          <div className="pt-2">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-sm transition-all hover:shadow active:scale-[0.99] disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>{loading ? 'Menghubungkan Akun...' : 'Lanjutkan dengan Akun Google'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Otentikasi aman via Google Identity</span>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-slate-600 hover:text-slate-800 font-medium"
          >
            Gunakan Mode Tamu
          </button>
        </div>
      </div>
    </div>
  );
};
