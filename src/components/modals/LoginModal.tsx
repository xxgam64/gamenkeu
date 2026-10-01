import React, { useState } from 'react';
import { useFinance, AppUserProfile } from '../../context/FinanceContext';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    login,
    loginWithProfile,
    switchProfile,
    deleteSavedProfile,
    savedProfiles,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'profile' | 'google'>('profile');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<{
    type: 'identity_toolkit' | 'unauthorized_domain' | 'popup_blocked' | 'generic';
    message: string;
  } | null>(null);

  if (!isLoginModalOpen) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setLoading(true);
    try {
      await loginWithProfile(name, email);
      setName('');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setAuthError(null);
      await login();
      setIsLoginModalOpen(false);
    } catch (err: any) {
      const msg = err?.message || '';
      if (
        msg.includes('identity-toolkit-api') ||
        msg.includes('identitytoolkit.googleapis.com') ||
        msg.includes('serviceusage.services.enable')
      ) {
        setAuthError({
          type: 'identity_toolkit',
          message:
            'Project Firebase internal cloud ini belum memiliki akses Identity Toolkit API dari Google. Anda dapat langsung menggunakan fitur "Masuk Cepat Multi-User" di tab sebelah tanpa perlu konfigurasi!',
        });
      } else if (err?.code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
        setAuthError({
          type: 'unauthorized_domain',
          message:
            'Domain hosting GitHub Pages belum didaftarkan di Authorized Domains Firebase Console.',
        });
      } else if (err?.code === 'auth/popup-blocked') {
        setAuthError({
          type: 'popup_blocked',
          message: 'Jendela popup Google Sign-In terblokir oleh peramban. Izinkan popup untuk situs ini.',
        });
      } else {
        setAuthError({
          type: 'generic',
          message: err?.message || 'Gagal menghubungkan sesi login.',
        });
      }
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

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            <span>Masuk Cepat (Siapapun Bisa)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'google'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span>Akun Google</span>
          </button>
        </div>

        {/* Tab 1: Instant Multi-User Profile */}
        {activeTab === 'profile' && (
          <div className="py-5 space-y-4 text-left">
            <div className="bg-[#EFF4FF] border border-[#CBD5E1]/60 rounded-xl p-3.5">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006C4A] text-[20px] mt-0.5 shrink-0">
                  group
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#0b1c30]">
                    Multi-Pengguna Terisolasi Mandiri
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Siapapun dapat langsung masuk dengan nama & email. Buku kas, aset portofolio, dan anggaran Anda tersimpan aman dan terpisah dari pengguna lain.
                  </p>
                </div>
              </div>
            </div>

            {/* Saved Accounts Switcher */}
            {savedProfiles.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Pilih Akun yang Tersimpan:
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {savedProfiles.map((p) => (
                    <div
                      key={p.uid}
                      className="flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => switchProfile(p)}
                        className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#131B2E] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {p.displayName.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {p.displayName}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{p.email}</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSavedProfile(p.uid)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Hapus Akun Ini"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="pt-1 text-center">
                  <span className="text-[11px] text-slate-400">Atau buat profil baru di bawah:</span>
                </div>
              </div>
            )}

            {/* Form Buat / Masuk Akun */}
            <form onSubmit={handleProfileSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pengguna / Pemilik Kas
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Pratama, Siti, dll."
                  className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:border-[#006C4A] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email (Pengenal Akun)
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:border-[#006C4A] focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">login</span>
                <span>{loading ? 'Memproses...' : 'Masuk ke Akun Saya'}</span>
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Google Sign-in */}
        {activeTab === 'google' && (
          <div className="py-5 space-y-4 text-left">
            <div className="bg-[#EFF4FF] border border-[#CBD5E1]/60 rounded-xl p-3.5">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#006C4A] text-[20px] mt-0.5 shrink-0">
                  cloud_sync
                </span>
                <div>
                  <h4 className="text-xs font-bold text-[#0b1c30]">
                    Sinkronisasi Cloud Firebase
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Masuk menggunakan akun Google Anda untuk sinkronisasi otomatis ke cloud Firestore pribadi.
                  </p>
                </div>
              </div>
            </div>

            {authError && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-left space-y-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-amber-600 text-[18px] shrink-0 mt-0.5">
                    info
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-amber-900">Catatan Konfigurasi Google Cloud</h5>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      {authError.message}
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>Gunakan Masuk Cepat Multi-User (Tanpa Kendala) →</span>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs shadow-sm transition-all hover:shadow active:scale-[0.99] disabled:opacity-50"
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
              <span>{loading ? 'Menghubungkan...' : 'Lanjutkan dengan Akun Google'}</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>GamMenkeu Multi-User System</span>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-slate-600 hover:text-slate-800 font-medium"
          >
            Lanjutkan Mode Tamu
          </button>
        </div>
      </div>
    </div>
  );
};
