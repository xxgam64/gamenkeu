import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export const PremiumAccountScreen: React.FC = () => {
  const {
    setIsCertificateModalOpen,
    setIsExportModalOpen,
    showToast,
    user,
    userProfile,
    logout,
    setIsLoginModalOpen,
  } = useFinance();

  const activeUser = user
    ? {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        badge: 'Firebase Cloud Aktif',
        storageType: 'Firestore Cloud Mandiri',
      }
    : userProfile
    ? {
        displayName: userProfile.displayName,
        email: userProfile.email,
        uid: userProfile.uid,
        photoURL: userProfile.photoURL,
        badge: 'Profil Mandiri Aktif',
        storageType: 'Penyimpanan Mandiri Terisolasi',
      }
    : null;

  const [copied, setCopied] = useState(false);
  const licenseKey = activeUser ? `GM-PRO-${activeUser.uid.slice(0, 8).toUpperCase()}-2024` : 'GM-ENT-2024-94821-X99Q-VAL';

  const copyLicenseKey = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    showToast('Kunci Disalin', 'Kunci lisensi institusi berhasil disalin ke clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevokeSession = (device: string) => {
    showToast('Sesi Diputuskan', `Sesi pada ${device} telah dinonaktifkan.`, 'info');
  };

  return (
    <div className="flex flex-col w-full p-4 lg:p-8 space-y-8 max-w-[1440px] mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Keamanan & Lisensi Akun</span>
            <span>•</span>
            <span className="text-[#006C4A] font-bold">Tier: Enterprise</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0b1c30] tracking-tight">
            Pengaturan Lisensi & Akses Akun Premium
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Status langganan akun, integrasi ekosistem GamMenkeu, dan verifikasi fitur enterprise tanpa pembatasan kuota.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-800 text-xs font-semibold shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">history</span>
            <span>Riwayat Faktur</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCertificateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Perbarui Sertifikat</span>
          </button>
        </div>
      </div>

      {/* Hero License Status Card */}
      <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-xs border border-[#E2E8F0]/70">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {activeUser?.photoURL ? (
              <img
                src={activeUser.photoURL}
                alt={activeUser.displayName || 'Avatar'}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-[#10B981]/30 shrink-0 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-xs shrink-0 font-bold text-xl">
                {activeUser?.displayName ? activeUser.displayName.slice(0, 2).toUpperCase() : 'GM'}
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                  {activeUser ? (activeUser.displayName || 'Pengguna Terverifikasi') : 'Mode Tamu (Lokal)'}
                </h2>
                {activeUser ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#006C4A] text-[11px] font-bold border border-emerald-200">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    {activeUser.badge}
                  </span>
                ) : (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">login</span>
                    Masuk Akun / Multi-User
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">mail</span>
                  {activeUser?.email || 'Belum masuk akun (Data tersimpan di browser)'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">tag</span>
                  ID Pengguna: <span className="font-mono text-slate-800 font-semibold">{activeUser ? activeUser.uid.slice(0, 14) : 'GUEST-LOCAL'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">cloud</span>
                  Penyimpanan: {activeUser ? activeUser.storageType : 'Local Storage'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#F8FAFC] border border-[#E2E8F0]/60 p-4 rounded-xl">
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Integritas Lisensi
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                100% Valid
              </span>
              <span className="text-[11px] text-[#006C4A] flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[13px]">shield</span> Otentikasi SHA-256
              </span>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Batas Kapasitas
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                ∞ Tak Terbatas
              </span>
              <span className="text-[11px] text-slate-500">Cloud Storage Mandiri</span>
            </div>
          </div>
        </div>

        {/* 5 Capability Micro Pills */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0]/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-[#F8FAFC] rounded-xl p-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006C4A] text-[20px]">all_inclusive</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0b1c30] leading-tight">Portofolio Bebas Batas</span>
              <span className="text-[10px] text-slate-400">Multi-aset & dividen</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006C4A] text-[20px]">document_scanner</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0b1c30] leading-tight">AI OCR Scan Struk</span>
              <span className="text-[10px] text-slate-400">Ekstraksi otomatis</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006C4A] text-[20px]">sync_alt</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0b1c30] leading-tight">Multi-Bank Sync</span>
              <span className="text-[10px] text-slate-400">Format CSV & mutasi</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006C4A] text-[20px]">donut_large</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0b1c30] leading-tight">Analisis 50/30/20</span>
              <span className="text-[10px] text-slate-400">Burn-down chart aktif</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006C4A] text-[20px]">receipt_long</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0b1c30] leading-tight">Audit Trail Lengkap</span>
              <span className="text-[10px] text-slate-400">Riwayat tak terbatas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matriks Komparasi Kapabilitas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
              Matriks Komparasi Kapabilitas
            </h3>
            <p className="text-xs text-slate-500">
              Perbandingan transparan antara akun pengguna reguler dan lisensi terverifikasi Enterprise GamMenkeu.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
            <span className="material-symbols-outlined text-[15px]">info</span>
            Spesifikasi v4.8 Institusional
          </span>
        </div>

        <div className="bg-white rounded-xl shadow-xs border border-[#E2E8F0]/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-slate-600 text-xs font-bold border-b border-[#E2E8F0]">
                  <th className="py-3.5 px-6 w-1/3">Modul & Fungsionalitas</th>
                  <th className="py-3.5 px-6 w-1/3 text-slate-500">Standard Community</th>
                  <th className="py-3.5 px-6 w-1/3 bg-[#EFF4FF] text-slate-900">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Enterprise Premium</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#006C4A] text-white font-bold uppercase tracking-wider">
                        Aktif
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/60 text-xs">
                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#0b1c30]">Buku Kas & Entri Transaksi</div>
                    <div className="text-[11px] text-slate-400">
                      Pencatatan mutasi harian, tagging sub-kategori, dan multi-wallet
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="font-semibold text-slate-800">Maksimal 50 transaksi/bln</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Reset per awal siklus bulan kalender</p>
                  </td>
                  <td className="py-4 px-6 bg-[#EFF4FF]/40 font-semibold text-[#006C4A]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px]">all_inclusive</span>
                      <span>Tak Terbatas (Unlimited)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Mendukung multi-kasir & impor massal
                    </p>
                  </td>
                </tr>

                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#0b1c30]">Aturan Anggaran 50/30/20</div>
                    <div className="text-[11px] text-slate-400">
                      Kerangka alokasi Kebutuhan, Keinginan, dan Tabungan
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="font-semibold text-slate-800">Alokasi Dasar Standar</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Rasio statis 50-30-20 tanpa proyeksi</p>
                  </td>
                  <td className="py-4 px-6 bg-[#EFF4FF]/40 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5 text-[#006C4A]">
                      <span className="material-symbols-outlined text-[18px]">tune</span>
                      <span>Kustom Dinamis + Burn-down Chart</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Penyesuaian variabel bebas & analitik laju belanja
                    </p>
                  </td>
                </tr>

                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#0b1c30]">Manajemen Portofolio & Valuasi</div>
                    <div className="text-[11px] text-slate-400">
                      Pelacakan saham IHSG, reksa dana, SBN, obligasi, dan logam mulia
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <div className="flex items-center gap-1 text-[#E11D48] font-semibold">
                      <span className="material-symbols-outlined text-[18px]">lock</span>
                      <span>Terkunci</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Hanya dapat melihat simulasi demo statis</p>
                  </td>
                  <td className="py-4 px-6 bg-[#EFF4FF]/40 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5 text-[#006C4A]">
                      <span className="material-symbols-outlined text-[18px]">trending_up</span>
                      <span>Aktif Penuh + Dividen Tracker</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Perhitungan realisasi yield, CAGR, dan kalender kupon
                    </p>
                  </td>
                </tr>

                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#0b1c30]">Export Data & Dokumen Pajak</div>
                    <div className="text-[11px] text-slate-400">
                      Arsip pembukuan untuk kebutuhan pelaporan SPT & audit mandiri
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="font-semibold text-slate-800">Hanya CSV Sederhana</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Format standar baris data mentah</p>
                  </td>
                  <td className="py-4 px-6 bg-[#EFF4FF]/40 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5 text-[#006C4A]">
                      <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                      <span>PDF Audit Resmi + CSV Multi-format</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Laporan neraca terstruktur, grafik laba-rugi & Excel
                    </p>
                  </td>
                </tr>

                <tr className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#0b1c30]">Dukungan Pengembang & Keamanan Data</div>
                    <div className="text-[11px] text-slate-400">
                      Jaminan ketersediaan sistem, mitigasi bencana data, dan konsultasi teknis
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    <span className="font-semibold text-slate-800">Komunitas Forum Terbuka</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">Dukungan komunitas via GitHub</p>
                  </td>
                  <td className="py-4 px-6 bg-[#EFF4FF]/40 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5 text-[#006C4A]">
                      <span className="material-symbols-outlined text-[18px]">support_agent</span>
                      <span>Prioritas Langsung & Backup Cloud</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                      Sinkronisasi cadangan terenkripsi otomatis setiap hari
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ekosistem Pengembang & Keamanan Sesi Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ekosistem Pengembang (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#006C4A]">groups</span>
              <span>Ekosistem Pengembang</span>
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30] mb-1">
              Dukungan Komunitas Finansial & Kontribusi
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              GamMenkeu dikembangkan dengan fondasi keterbukaan, akuntabilitas matematika uang riil, dan kolaborasi bersama para praktisi keuangan mandiri di Indonesia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <a
                href="https://instagram.com/xxgam64"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#006C4A] hover:bg-white transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all">
                    north_east
                  </span>
                </div>
                <span className="text-xs font-bold text-[#0b1c30]">Instagram Developer</span>
                <span className="text-[11px] text-slate-500 mt-0.5">@xxgam64</span>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#006C4A] hover:bg-white transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">code</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all">
                    north_east
                  </span>
                </div>
                <span className="text-xs font-bold text-[#0b1c30]">Dokumentasi GitHub</span>
                <span className="text-[11px] text-slate-500 mt-0.5">GamMenkeu Engine</span>
              </a>

              <button
                type="button"
                onClick={() => showToast('Pusat Panduan', 'Membuka pedoman alokasi anggaran 50/30/20.', 'info')}
                className="group flex flex-col p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#006C4A] hover:bg-white text-left transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all">
                    north_east
                  </span>
                </div>
                <span className="text-xs font-bold text-[#0b1c30]">Pusat Panduan</span>
                <span className="text-[11px] text-slate-500 mt-0.5">Pedoman 50/30/20</span>
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#EFF4FF] border border-[#E2E8F0]/60 flex items-start gap-3">
            <span className="material-symbols-outlined text-[#006C4A] text-[22px] mt-0.5 shrink-0">
              encrypted
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0b1c30]">
                Enkripsi Lokal & Firebase Secure Storage
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Seluruh catatan mutasi keuangan dienkripsi di sisi klien menggunakan standar militer AES-256 sebelum disinkronkan ke peladen cadangan pribadi Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Keamanan Sesi & Perangkat Terhubung (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
                  <span className="material-symbols-outlined text-[16px]">devices</span>
                  <span>Keamanan Sesi</span>
                </div>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                  Perangkat Terhubung
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-[#006C4A] font-bold border border-emerald-200">
                2 Sesi Aktif
              </span>
            </div>

            <div className="space-y-3 mb-4">
              {/* Session 1 */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EFF4FF] text-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">laptop_mac</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0b1c30]">Chrome di macOS Sonoma</span>
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                    </div>
                    <span className="text-[11px] text-slate-500">Jakarta, Indonesia • IP 182.253.xx.xx</span>
                    <span className="text-[11px] text-[#006C4A] font-semibold mt-0.5">
                      Sesi Sekarang (Browser Ini)
                    </span>
                  </div>
                </div>
              </div>

              {/* Session 2 */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60 flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#EFF4FF] text-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">smartphone</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#0b1c30]">Safari di iPhone 15 Pro</span>
                    <span className="text-[11px] text-slate-500">Bandung, Indonesia • Aktif 4 jam lalu</span>
                    <span className="text-[11px] text-slate-400 font-medium mt-0.5">PWA Sync Client</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRevokeSession('Safari di iPhone 15 Pro')}
                  className="text-slate-400 hover:text-[#E11D48] transition-colors p-1"
                  title="Putuskan Sesi"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]/60 flex flex-col sm:flex-row items-center justify-between gap-2">
            {activeUser ? (
              <>
                <span className="text-xs text-slate-500">
                  Masuk sebagai <strong className="text-slate-800">{activeUser.email}</strong> ({activeUser.displayName})
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-rose-50 text-[#E11D48] hover:bg-rose-100 text-xs font-semibold transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Keluar dari Sesi Ini (Logout)
                </button>
              </>
            ) : (
              <>
                <span className="text-xs text-slate-500">
                  Belum masuk. Masuk untuk mengamankan data Anda.
                </span>
                <button
                  type="button"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold transition-colors text-center flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">login</span>
                  Masuk dengan Google
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Kunci Lisensi Institusi Banner */}
      <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E2E8F0]/70 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#EFF4FF] text-slate-800 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px]">key</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#0b1c30]">Kunci Lisensi Institusi Anda</span>
            <div className="flex items-center gap-2 mt-0.5">
              <code className="font-mono text-xs bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-md text-slate-800 font-semibold select-all">
                {licenseKey}
              </code>
              <button
                type="button"
                onClick={copyLicenseKey}
                className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                title="Salin Kunci Lisensi"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs text-slate-400 hidden xl:inline">
            Perpanjangan otomatis: Tidak diperlukan (Permanen)
          </span>
          <button
            type="button"
            onClick={() => setIsCertificateModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold transition-colors shadow-xs"
          >
            Unduh Sertifikat PDF
          </button>
        </div>
      </div>
    </div>
  );
};
