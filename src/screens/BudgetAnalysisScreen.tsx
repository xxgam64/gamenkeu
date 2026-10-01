import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export const BudgetAnalysisScreen: React.FC = () => {
  const { transactions, setIsTransactionModalOpen, showToast } = useFinance();

  const [monthlyIncome, setMonthlyIncome] = useState<number>(28500000);
  const [ratioNeeds, setRatioNeeds] = useState<number>(50);
  const [ratioWants, setRatioWants] = useState<number>(30);
  const [ratioSavings, setRatioSavings] = useState<number>(20);

  // Calculate limits based on user income and ratio
  const budgetNeeds = (monthlyIncome * ratioNeeds) / 100;
  const budgetWants = (monthlyIncome * ratioWants) / 100;
  const budgetSavings = (monthlyIncome * ratioSavings) / 100;

  // Actual spent from transactions
  const actualNeeds = transactions
    .filter((t) => t.type === 'keluar' && t.classification === 'kebutuhan')
    .reduce((sum, t) => sum + t.amount, 0);

  const actualWants = transactions
    .filter((t) => t.type === 'keluar' && t.classification === 'keinginan')
    .reduce((sum, t) => sum + t.amount, 0);

  const actualSavings = transactions
    .filter((t) => t.type === 'keluar' && t.classification === 'investasi')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = actualNeeds + actualWants + actualSavings;

  const pctNeeds = Math.min(100, Math.round((actualNeeds / budgetNeeds) * 100)) || 0;
  const pctWants = Math.min(100, Math.round((actualWants / budgetWants) * 100)) || 0;
  const pctSavings = Math.min(100, Math.round((actualSavings / budgetSavings) * 100)) || 0;

  const handleApplyPreset = (n: number, w: number, s: number) => {
    setRatioNeeds(n);
    setRatioWants(w);
    setRatioSavings(s);
    showToast('Preset Diterapkan', `Rasio disesuaikan ke ${n}/${w}/${s}.`);
  };

  return (
    <div className="flex flex-col w-full p-4 lg:p-8 space-y-8 max-w-[1440px] mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>Metodologi Alokasi</span>
            <span>•</span>
            <span className="text-[#006C4A] font-bold">Smart Allocation 50/30/20</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0b1c30] tracking-tight">
            Analisis Anggaran 50/30/20 & Simulasi Alokasi
          </h1>
          <p className="text-xs text-slate-500 max-w-3xl mt-0.5">
            Analitik komprehensif pembagian pendapatan bulanan ke dalam Kebutuhan Pokok, Gaya Hidup, dan Tabungan Investasi dengan kontrol rasio dinamis.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => handleApplyPreset(50, 30, 20)}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-slate-700 shadow-2xs"
          >
            Standar 50/30/20
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset(40, 20, 40)}
            className="px-3 py-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-lg text-xs font-semibold text-slate-700 shadow-2xs"
          >
            Agresif 40/20/40
          </button>
          <button
            type="button"
            onClick={() => setIsTransactionModalOpen(true)}
            className="px-4 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Catat Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* Income & Ratio Control Card */}
      <div className="bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div>
            <label className="block text-xs font-bold text-[#0b1c30] mb-1.5">
              Basis Pemasukan Bulanan (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                Rp
              </span>
              <input
                type="text"
                value={monthlyIncome.toLocaleString('id-ID')}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace(/\D/g, '') || '0', 10);
                  setMonthlyIncome(val);
                }}
                className="w-full h-11 pl-10 pr-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm font-bold text-[#0b1c30] focus:outline-none focus:border-[#006C4A] tabular-nums"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-slate-900">Kebutuhan ({ratioNeeds}%)</span>
              <span className="text-[#0b1c30]">Rp {budgetNeeds.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="20"
              max="70"
              value={ratioNeeds}
              onChange={(e) => setRatioNeeds(parseInt(e.target.value, 10))}
              className="w-full accent-[#0b1c30]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-amber-700">Keinginan ({ratioWants}%)</span>
              <span className="text-amber-700">Rp {budgetWants.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={ratioWants}
              onChange={(e) => setRatioWants(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span className="text-[#006C4A]">Tabungan ({ratioSavings}%)</span>
              <span className="text-[#006C4A]">Rp {budgetSavings.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={ratioSavings}
              onChange={(e) => setRatioSavings(parseInt(e.target.value, 10))}
              className="w-full accent-[#006C4A]"
            />
          </div>
        </div>

        {/* Master Stacked Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[#E2E8F0]/60 space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Total Realisasi Pengeluaran: <strong className="text-slate-900">Rp {totalSpent.toLocaleString('id-ID')}</strong></span>
            <span>Kapasitas Pemasukan: <strong className="text-slate-900">Rp {monthlyIncome.toLocaleString('id-ID')}</strong></span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
            <div
              className="h-full bg-[#0b1c30]"
              style={{ width: `${(actualNeeds / monthlyIncome) * 100}%` }}
              title="Kebutuhan"
            ></div>
            <div
              className="h-full bg-[#D97706]"
              style={{ width: `${(actualWants / monthlyIncome) * 100}%` }}
              title="Keinginan"
            ></div>
            <div
              className="h-full bg-[#006C4A]"
              style={{ width: `${(actualSavings / monthlyIncome) * 100}%` }}
              title="Tabungan/Investasi"
            ></div>
          </div>
        </div>
      </div>

      {/* 3 Main Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Kebutuhan Pokok */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#0b1c30]"></span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                  Kebutuhan Pokok
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {ratioNeeds}% Alokasi
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sewa tempat tinggal, utilitas PLN/air, bahan makanan pokok dapur, dan transportasi wajib harian.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Plafon Anggaran:</span>
                <span className="font-bold text-slate-900">Rp {budgetNeeds.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Realisasi Kas:</span>
                <span className="font-bold text-slate-900">Rp {actualNeeds.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-400">Sisa Kuota:</span>
                <span className="font-bold text-[#006C4A]">
                  Rp {Math.max(0, budgetNeeds - actualNeeds).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
              <div
                className="h-full bg-[#0b1c30] rounded-full transition-all"
                style={{ width: `${pctNeeds}%` }}
              ></div>
            </div>
            <span className="text-[11px] text-slate-500 block text-right font-medium">
              {pctNeeds}% dari kuota terpakai
            </span>
          </div>
        </div>

        {/* Pillar 2: Keinginan & Gaya Hidup */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#D97706]"></span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                  Keinginan & Lifestyle
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-[#D97706]">
                {ratioWants}% Alokasi
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Makan di luar / cafe, belanja hobi, streaming hiburan, nongkrong santai, dan liburan akhir pekan.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Plafon Anggaran:</span>
                <span className="font-bold text-slate-900">Rp {budgetWants.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Realisasi Kas:</span>
                <span className="font-bold text-slate-900">Rp {actualWants.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-400">Sisa Kuota:</span>
                <span className="font-bold text-[#006C4A]">
                  Rp {Math.max(0, budgetWants - actualWants).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
              <div
                className="h-full bg-[#D97706] rounded-full transition-all"
                style={{ width: `${pctWants}%` }}
              ></div>
            </div>
            <span className="text-[11px] text-slate-500 block text-right font-medium">
              {pctWants}% dari kuota terpakai
            </span>
          </div>
        </div>

        {/* Pillar 3: Tabungan & Investasi */}
        <div className="bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#006C4A]"></span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                  Tabungan & Investasi
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-[#006C4A]">
                {ratioSavings}% Alokasi
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Top up Reksadana, pembelian SBN ritel, akumulasi emas batangan, dan setoran Dana Darurat wajib.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Plafon Anggaran:</span>
                <span className="font-bold text-slate-900">Rp {budgetSavings.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Realisasi Kas:</span>
                <span className="font-bold text-slate-900">Rp {actualSavings.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-100">
                <span className="text-slate-400">Sisa Kuota:</span>
                <span className="font-bold text-slate-700">
                  Rp {Math.max(0, budgetSavings - actualSavings).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-2">
              <div
                className="h-full bg-[#006C4A] rounded-full transition-all"
                style={{ width: `${pctSavings}%` }}
              ></div>
            </div>
            <span className="text-[11px] text-[#006C4A] block text-right font-bold">
              {pctSavings}% terpenuhi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
