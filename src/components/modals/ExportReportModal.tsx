import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

export const ExportReportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, transactions, assets, showToast } = useFinance();
  const [reportType, setReportType] = useState<'buku-kas' | 'portofolio' | 'fiskal'>('buku-kas');

  if (!isExportModalOpen) return null;

  const downloadCSV = () => {
    let csvContent = '';
    let filename = '';

    if (reportType === 'buku-kas') {
      csvContent = 'Tanggal,Jam,Deskripsi,Rekanan,Akun,Kategori,Tipe,Nominal (IDR),Status\n';
      transactions.forEach((tx) => {
        csvContent += `"${tx.date}","${tx.time || ''}","${tx.title}","${tx.counterparty || ''}","${tx.account}","${tx.category}","${tx.type}","${tx.amount}","${tx.status}"\n`;
      });
      filename = `Buku_Kas_GamMenkeu_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      csvContent = 'Kode,Nama Aset,Kategori,Unit,Modal Disetor,Nilai Pasar Terkini,Unrealized PnL,Gain %\n';
      assets.forEach((ast) => {
        csvContent += `"${ast.code}","${ast.name}","${ast.category}","${ast.units} ${ast.unitLabel}","${ast.investedCapital}","${ast.currentValue}","${ast.unrealizedGain}","${ast.unrealizedGainPercent}%"\n`;
      });
      filename = `Portofolio_GamMenkeu_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Ekspor Berhasil', `File ${filename} telah diunduh ke perangkat Anda.`);
    setIsExportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0F172A] text-[20px]">file_download</span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-base">
              Ekspor Laporan Finansial
            </h3>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Pilih arsip data yang ingin diunduh untuk kebutuhan audit pajak pribadi (SPT Tahunan) atau pembukuan mandiri.
          </p>

          <div className="space-y-2">
            <label
              onClick={() => setReportType('buku-kas')}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                reportType === 'buku-kas'
                  ? 'border-[#006C4A] bg-emerald-50/40 text-slate-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="exportType"
                checked={reportType === 'buku-kas'}
                onChange={() => setReportType('buku-kas')}
                className="accent-[#006C4A]"
              />
              <div className="flex-1">
                <div className="text-xs font-bold">Jurnal Mutasi Buku Kas Lengkap</div>
                <div className="text-[11px] text-slate-500">
                  {transactions.length} baris transaksi kas masuk/keluar terverifikasi
                </div>
              </div>
            </label>

            <label
              onClick={() => setReportType('portofolio')}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                reportType === 'portofolio'
                  ? 'border-[#006C4A] bg-emerald-50/40 text-slate-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="exportType"
                checked={reportType === 'portofolio'}
                onChange={() => setReportType('portofolio')}
                className="accent-[#006C4A]"
              />
              <div className="flex-1">
                <div className="text-xs font-bold">Rekapitulasi Portofolio & Nilai Aset</div>
                <div className="text-[11px] text-slate-500">
                  {assets.length} instrumen aktif (modal disetor vs nilai pasar terkini)
                </div>
              </div>
            </label>

            <label
              onClick={() => setReportType('fiskal')}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                reportType === 'fiskal'
                  ? 'border-[#006C4A] bg-emerald-50/40 text-slate-900'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <input
                type="radio"
                name="exportType"
                checked={reportType === 'fiskal'}
                onChange={() => setReportType('fiskal')}
                className="accent-[#006C4A]"
              />
              <div className="flex-1">
                <div className="text-xs font-bold">Laporan Ringkasan Pajak & Dividen</div>
                <div className="text-[11px] text-slate-500">
                  PPh Final terpotong SBN, dividen tunai, dan aset berharga
                </div>
              </div>
            </label>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="flex-1 h-10 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              Tutup
            </button>
            <button
              onClick={downloadCSV}
              className="flex-1 h-10 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Unduh File CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
