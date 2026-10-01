import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PortfolioAsset } from '../types/finance';

export const PortfolioScreen: React.FC = () => {
  const {
    assets,
    dividends,
    setSelectedAssetForUpdate,
    setIsAddAssetModalOpen,
    setIsExportModalOpen,
    showToast,
  } = useFinance();

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Aggregates
  const totalMarketValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalInvestedCapital = assets.reduce((sum, a) => sum + a.investedCapital, 0);
  const totalUnrealizedGain = totalMarketValue - totalInvestedCapital;
  const totalGainPercent =
    totalInvestedCapital > 0
      ? ((totalUnrealizedGain / totalInvestedCapital) * 100).toFixed(2)
      : '0';

  const handleRefreshAll = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Valuasi Terkini Sinkron', 'Harga penutupan saham (IDX), SBN, dan buyback emas Antam telah diperbarui.');
    }, 750);
  };

  const filteredAssets = assets.filter((a) => {
    if (selectedCategoryFilter === 'all') return true;
    return a.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full p-4 lg:p-8 space-y-8 max-w-[1440px] mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#EFF4FF] text-slate-700 font-semibold text-[11px]">
              PORTFOLIO INTELLIGENCE
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              Valuasi Live IDX • Pasar Tutup 16:00 WIB
            </span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0b1c30] tracking-tight">
            Manajemen Portofolio & Nilai Aset
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl">
            Pemantauan konsolidasi aset investasi, modal disetor riil, yield kumulatif, dan kalkulasi unrealized gain/loss secara terstruktur dan presisi.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs border border-[#E2E8F0] transition-all"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-slate-500 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span>Perbarui Semua Valuasi</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-2xs border border-[#E2E8F0] transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">receipt_long</span>
            <span>Ekspor Laporan Pajak/Aset</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddAssetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 h-10 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Daftarkan Aset Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Overview (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Total Nilai Pasar */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Nilai Pasar Terkini
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF4FF] flex items-center justify-center text-slate-800">
              <span className="material-symbols-outlined text-[18px]">account_balance</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0b1c30] tracking-tight font-bold tabular-nums">
              Rp {totalMarketValue.toLocaleString('id-ID')}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[#006C4A] text-[10px] font-bold">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                +Rp 1.150.000
              </span>
              <span className="text-[11px] text-slate-400">vs penutupan kemarin</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#E2E8F0]/60 flex items-center justify-between text-slate-500 text-xs">
            <span>Valuasi Closing Price</span>
            <span className="font-semibold text-slate-800">Hari ini, 15:45</span>
          </div>
        </div>

        {/* Card 2: Modal Pokok Disetor */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Modal Pokok Disetor
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF4FF] flex items-center justify-center text-slate-800">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0b1c30] tracking-tight font-bold tabular-nums">
              Rp {totalInvestedCapital.toLocaleString('id-ID')}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-xs text-slate-400">Rasio Alokasi:</span>
              <span className="text-xs font-semibold text-slate-800">78.71% dari Plafon</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#E2E8F0]/60 flex items-center justify-between text-slate-500 text-xs">
            <span>Arus Kas Masuk Netto</span>
            <span className="font-semibold text-slate-800">{assets.length} Penempatan Aktif</span>
          </div>
        </div>

        {/* Card 3: Unrealized Return */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Unrealized Return
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-[#006C4A] text-[10px] font-bold">
              Untung / Surplus
            </span>
          </div>
          <div className="mt-3">
            <div className="font-['Plus_Jakarta_Sans'] text-2xl text-[#006C4A] tracking-tight font-bold tabular-nums">
              +Rp {totalUnrealizedGain.toLocaleString('id-ID')}
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-[#006C4A] text-[10px] font-bold">
                <span className="material-symbols-outlined text-[13px]">north_east</span>
                +{totalGainPercent}%
              </span>
              <span className="text-[11px] text-slate-400">Kumulatif All-Time</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#E2E8F0]/60 flex items-center justify-between text-slate-500 text-xs">
            <span>Potensi PPh Final</span>
            <span className="font-semibold text-slate-800">PPh Terhitung 0-10%</span>
          </div>
        </div>

        {/* Card 4: Estimasi Dividen & Kupon */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Estimasi Dividen / Thn
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#EFF4FF] flex items-center justify-center text-slate-800">
              <span className="material-symbols-outlined text-[18px]">price_check</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0b1c30] tracking-tight font-bold tabular-nums">
              Rp 3.420.000
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#EFF4FF] text-slate-700 text-[10px] font-bold">
                3.49% p.a Net
              </span>
              <span className="text-[11px] text-slate-400">rata-rata pasif</span>
            </div>
          </div>
          <div className="mt-4 pt-2.5 border-t border-[#E2E8F0]/60 flex items-center justify-between text-slate-500 text-xs">
            <span>Jadwal Terdekat</span>
            <span className="font-semibold text-slate-800">15 Okt 2024 (ORI024)</span>
          </div>
        </div>
      </div>

      {/* Asset Allocation & Breakdown Section */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
              Alokasi Portofolio Berdasarkan Kelas Aset
            </h2>
            <p className="text-xs text-slate-500">
              Komposisi bobot diversifikasi instrumen terhadap total kapitalisasi nilai pasar portofolio.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#EFF4FF] text-slate-700 text-xs font-semibold self-start sm:self-auto">
            <span className="material-symbols-outlined text-[15px]">pie_chart</span>
            {assets.length} Kelas Aset Aktif
          </span>
        </div>

        {/* Stacked Horizontal Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div className="h-full bg-[#0b1c30]" style={{ width: '41.37%' }} title="Saham: 41.4%"></div>
            <div className="h-full bg-[#D97706]" style={{ width: '29.12%' }} title="Emas: 29.1%"></div>
            <div className="h-full bg-[#006C4A]" style={{ width: '20.68%' }} title="SBN: 20.7%"></div>
            <div className="h-full bg-sky-600" style={{ width: '8.83%' }} title="Reksadana: 8.8%"></div>
          </div>
          <div className="flex justify-between items-center text-slate-400 text-[11px] pt-1">
            <span>0%</span>
            <span>25% Target Defensif</span>
            <span>50%</span>
            <span>75%</span>
            <span>100% (Rp 124.50M)</span>
          </div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Saham */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0b1c30]"></span>
                <span className="text-xs font-bold text-[#0b1c30]">Saham Bluechip</span>
              </div>
              <span className="text-xs font-bold text-slate-900">41.4%</span>
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Nilai Pasar:</span>
                <span className="font-semibold text-slate-900">Rp 51.500.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Modal:</span>
                <span>Rp 44.250.000</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E2E8F0]/40 text-[#006C4A] font-semibold">
                <span>Gain:</span>
                <span>+Rp 7.250.000 (+16.4%)</span>
              </div>
            </div>
          </div>

          {/* Emas */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                <span className="text-xs font-bold text-[#0b1c30]">Emas Logam Mulia</span>
              </div>
              <span className="text-xs font-bold text-[#D97706]">29.1%</span>
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Nilai Pasar:</span>
                <span className="font-semibold text-slate-900">Rp 36.250.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Modal:</span>
                <span>Rp 28.750.000</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E2E8F0]/40 text-[#006C4A] font-semibold">
                <span>Gain:</span>
                <span>+Rp 7.500.000 (+26.1%)</span>
              </div>
            </div>
          </div>

          {/* SBN */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006C4A]"></span>
                <span className="text-xs font-bold text-[#0b1c30]">Surat Berharga Negara</span>
              </div>
              <span className="text-xs font-bold text-[#006C4A]">20.7%</span>
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Nilai Pasar:</span>
                <span className="font-semibold text-slate-900">Rp 25.750.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Modal:</span>
                <span>Rp 25.000.000</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E2E8F0]/40 text-[#006C4A] font-semibold">
                <span>Gain:</span>
                <span>+Rp 750.000 (+3.0%)</span>
              </div>
            </div>
          </div>

          {/* Reksadana */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/60 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
                <span className="text-xs font-bold text-[#0b1c30]">Reksadana Indeks</span>
              </div>
              <span className="text-xs font-bold text-sky-600">8.8%</span>
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Nilai Pasar:</span>
                <span className="font-semibold text-slate-900">Rp 11.000.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Modal:</span>
                <span>Rp 10.000.000</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-[#E2E8F0]/40 text-[#006C4A] font-semibold">
                <span>Gain:</span>
                <span>+Rp 1.000.000 (+10.0%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Assets Table */}
      <div className="bg-white rounded-xl shadow-xs border border-[#E2E8F0]/70 overflow-hidden flex flex-col">
        <div className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
              Daftar Instrumen & Posisi Terbuka
            </h2>
            <p className="text-xs text-slate-500">
              Kalkulasi performa individual setiap kode aset dengan pembaruan mark-to-market harian.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="h-9 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Semua Kelas Aset</option>
              <option value="saham">Saham Bluechip</option>
              <option value="obligasi">Obligasi Negara (SBN)</option>
              <option value="emas">Komoditas / Emas</option>
              <option value="reksadana">Reksadana</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-500 text-[11px] font-semibold uppercase tracking-wider border-y border-[#E2E8F0]/60">
                <th className="py-3 px-6">Instrumen / Kode</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4 text-right">Unit / Lot</th>
                <th className="py-3 px-4 text-right">Harga Beli</th>
                <th className="py-3 px-4 text-right">Modal Disetor</th>
                <th className="py-3 px-4 text-right">Nilai Pasar</th>
                <th className="py-3 px-6 text-right">Unrealized PnL</th>
                <th className="py-3 px-6 text-center">Aksi Portofolio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/60 text-xs">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs tracking-wider shrink-0 ${
                          asset.badgeColor || 'bg-slate-800 text-white'
                        }`}
                      >
                        {asset.code}
                      </div>
                      <div>
                        <div className="font-bold text-[#0b1c30]">{asset.name}</div>
                        <div className="text-[11px] text-slate-400">{asset.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-[#EFF4FF] text-slate-700 font-medium text-[11px]">
                      {asset.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-800 tabular-nums">
                    {asset.units} <span className="text-slate-400 font-normal">({asset.unitLabel})</span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-600 tabular-nums">
                    Rp {Math.round(asset.avgBuyPrice).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-700 font-medium tabular-nums">
                    Rp {asset.investedCapital.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#0b1c30] tabular-nums">
                    Rp {asset.currentValue.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    <div className="inline-flex flex-col items-end">
                      <span className="font-bold text-[#006C4A] tabular-nums">
                        +Rp {asset.unrealizedGain.toLocaleString('id-ID')}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-[#006C4A] font-semibold">
                        <span className="material-symbols-outlined text-[12px]">trending_up</span>
                        +{asset.unrealizedGainPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-center whitespace-nowrap">
                    <div className="inline-flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAssetForUpdate(asset)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-[#E2E8F0] text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
                      >
                        Perbarui Nilai
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(asset.name, 'Riwayat transaksi & konfirmasi kustodian tercatat.', 'info')}
                        className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                        title="Riwayat Transaksi"
                      >
                        <span className="material-symbols-outlined text-[18px]">history</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#F8FAFC] border-t border-[#E2E8F0]/70 font-semibold text-xs text-[#0b1c30]">
              <tr>
                <td className="py-3 px-6 text-right text-slate-500" colSpan={4}>
                  Total Konsolidasi Portofolio:
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  Rp {totalInvestedCapital.toLocaleString('id-ID')}
                </td>
                <td className="py-3 px-4 text-right tabular-nums">
                  Rp {totalMarketValue.toLocaleString('id-ID')}
                </td>
                <td className="py-3 px-6 text-right text-[#006C4A] tabular-nums font-bold">
                  +Rp {totalUnrealizedGain.toLocaleString('id-ID')} (+{totalGainPercent}%)
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bottom Section: Riwayat Dividen & Kupon Masuk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ledger Log Dividen (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                Riwayat Dividen & Kupon Terakhir
              </h3>
              <p className="text-xs text-slate-500">
                Penerimaan imbal hasil pasif riil yang telah dikreditkan ke RDN atau Rekening Penampung.
              </p>
            </div>
            <button
              onClick={() => showToast('Log Dividen Lengkap', 'Seluruh riwayat pembayaran kupon dan dividen telah sinkron.')}
              className="text-xs font-semibold text-[#006C4A] hover:underline flex items-center gap-1"
            >
              <span>Lihat Semua Log</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="divide-y divide-[#E2E8F0]/60">
            {dividends.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between hover:bg-[#F8FAFC] px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#006C4A] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">
                      {item.type === 'kupon' ? 'account_balance' : 'payments'}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#0b1c30]">{item.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.issuer} • {item.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs text-[#006C4A] tabular-nums">
                    +Rp {item.amount.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-400">{item.destination}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Insights & Health Check Widget (1 col) */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006C4A] text-[20px]">
                verified_user
              </span>
              <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                Kesehatan Portofolio
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diversifikasi aset berada pada tingkat <strong className="text-slate-900">Konservatif-Moderat</strong>. Nilai likuiditas defensif (SBN & Emas) menyumbang <span className="font-semibold text-slate-900">49.8%</span>, menjaga volatilitas drawdown tetap terkendali.
            </p>
            <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]/60 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Volatilitas (Beta Relatif):</span>
                <span className="font-bold text-slate-800">0.68 (Stabil)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Sharpe Ratio Terestimasi:</span>
                <span className="font-bold text-[#006C4A]">1.82 (Efisien)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Proteksi Inflasi Riil:</span>
                <span className="font-bold text-[#006C4A]">+23.5% vs CPI</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#EFF4FF] border border-[#E2E8F0]/60 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0b1c30]">
              <span className="material-symbols-outlined text-[16px] text-amber-600">lightbulb</span>
              <span>Rekomendasi Rebalancing</span>
            </div>
            <p className="text-[11.5px] text-slate-600 leading-snug">
              Porsi Saham Bluechip mendekati batas atas alokasi profil (40%). Pertimbangkan mengarahkan DCA berikutnya ke instrumen pasar uang atau SBN ritel terbitan baru.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
