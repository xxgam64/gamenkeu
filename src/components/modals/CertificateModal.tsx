import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

export const CertificateModal: React.FC = () => {
  const { isCertificateModalOpen, setIsCertificateModalOpen, showToast } = useFinance();
  const [copied, setCopied] = useState(false);

  if (!isCertificateModalOpen) return null;

  const licenseKey = 'GM-ENT-2024-94821-X99Q-VAL';

  const copyKey = () => {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    showToast('Kunci Disalin', 'Kunci lisensi institusi tersalin ke clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Certificate Decorative Header */}
        <div className="bg-[#0F172A] text-white p-6 relative overflow-hidden text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[#10B981] text-[28px]">verified</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981] block mb-1">
            Official Verification Certificate
          </span>
          <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-white">
            GamMenkeu Enterprise License
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Sistem Finansial Mandiri • Multi-Asset Ledger v2.4
          </p>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-4">
          <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs bg-[#F8FAFC]">
            <div className="flex justify-between">
              <span className="text-slate-500">Nama Pemilik Akun:</span>
              <span className="font-bold text-slate-900">Budi Pratama</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ID Pengguna:</span>
              <span className="font-mono font-medium text-slate-800">GM-94821-ENT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status Lisensi:</span>
              <span className="font-semibold text-[#006C4A]">Verified Lifetime (Aktif Permanen)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Otentikasi Kriptografi:</span>
              <span className="font-mono text-slate-700 text-[11px]">SHA-256 Validated</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kapasitas Catatan:</span>
              <span className="font-semibold text-slate-900">Tak Terbatas (Unlimited Multi-kasir)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Kunci Lisensi Institusi
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 font-mono text-xs bg-[#EFF4FF] border border-[#E2E8F0] px-3 py-2.5 rounded-lg text-slate-900 font-semibold select-all">
                {licenseKey}
              </code>
              <button
                type="button"
                onClick={copyKey}
                className="px-3 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Sertifikat diterbitkan secara digital oleh GamMenkeu Engine.
            </span>
            <button
              onClick={() => setIsCertificateModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
