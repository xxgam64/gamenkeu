import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, CategoryClassification } from '../types/finance';

export const FinancialOverviewScreen: React.FC = () => {
  const {
    transactions,
    assets,
    sinkingFunds,
    addTransaction,
    addSinkingFund,
    setSelectedAssetForUpdate,
    setIsAddAssetModalOpen,
    setIsExportModalOpen,
    setIsTransactionModalOpen,
    setCurrentScreen,
    selectedPeriod,
    setSelectedPeriod,
    viewMode,
    setViewMode,
  } = useFinance();

  // Local quick entry form state
  const [entryType, setEntryType] = useState<TransactionType>('keluar');
  const [entryDate, setEntryDate] = useState<string>('2024-10-24');
  const [entryCategory, setEntryCategory] = useState<string>('Makanan & Minuman');
  const [entryAmount, setEntryAmount] = useState<string>('125000');
  const [entryNotes, setEntryNotes] = useState<string>('Makan Siang Tim Proyek');

  // Local quick plan form state
  const [planName, setPlanName] = useState<string>('');
  const [planCategory, setPlanCategory] = useState<string>('Tagihan Wajib');
  const [planTarget, setPlanTarget] = useState<string>('');
  const [planDate, setPlanDate] = useState<string>('');

  // Calculate live financial figures
  const totalIncome = transactions
    .filter((t) => t.type === 'masuk')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'keluar')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const baseSaldo = 48750000;
  const currentSaldo = baseSaldo + (totalIncome - 28500000) - (totalExpense - 14850000);
  const netSurplus = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netSurplus / totalIncome) * 100).toFixed(1) : '0';

  // Portfolio aggregates
  const totalMarketValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalInvestedCapital = assets.reduce((sum, a) => sum + a.investedCapital, 0);
  const totalUnrealizedGain = totalMarketValue - totalInvestedCapital;
  const totalGainPercent =
    totalInvestedCapital > 0
      ? ((totalUnrealizedGain / totalInvestedCapital) * 100).toFixed(2)
      : '0';

  // Handling quick entry form submission
  const handleQuickEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(entryAmount.replace(/\D/g, ''), 10);
    if (!entryNotes || isNaN(amountNum) || amountNum <= 0) return;

    let classification: CategoryClassification = 'kebutuhan';
    if (entryType === 'masuk') {
      classification = 'pendapatan';
    } else if (entryCategory.includes('Makanan') || entryCategory.includes('Gaya Hidup')) {
      classification = 'keinginan';
    } else if (entryCategory.includes('Investasi')) {
      classification = 'investasi';
    }

    addTransaction({
      date: entryDate,
      time: '13:00 WIB',
      title: entryNotes,
      description: 'Kas Operasional Mandiri',
      counterparty: 'Kas Operasional',
      account: 'BCA Payroll (•••• 8291)',
      category: entryCategory,
      classification,
      type: entryType,
      amount: amountNum,
      status: 'Selesai',
      receiptAttached: true,
      auditVerified: true,
    });

    setEntryNotes('');
    setEntryAmount('0');
  };

  // Handling quick plan form submission
  const handleQuickPlan = (e: React.FormEvent) => {
    e.preventDefault();
    const targetNum = parseInt(planTarget.replace(/\D/g, ''), 10);
    if (!planName || isNaN(targetNum) || targetNum <= 0) return;

    addSinkingFund({
      name: planName,
      category: planCategory,
      targetAmount: targetNum,
      currentAmount: 0,
      dueDate: planDate || '2025-06-30',
      frequency: 'Tahunan',
      holdingAccount: 'Bank Mandiri - Sinking Fund (*8821)',
      monthlyAllocation: Math.round(targetNum / 12),
      icon: 'savings',
    });

    setPlanName('');
    setPlanTarget('');
    setPlanDate('');
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Command Ribbon & Period Selector */}
      <div className="px-4 lg:px-8 py-3 bg-white border-b border-[#E2E8F0]/70 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[13px] text-[#45464d]">
            <span className="material-symbols-outlined text-[16px] text-slate-500">filter_alt</span>
            <span>Periode Buku Kas:</span>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-transparent font-semibold text-[#0b1c30] outline-none cursor-pointer border border-[#E2E8F0] rounded px-2.5 py-1 text-xs hover:border-slate-400 focus:border-[#006C4A] transition-colors"
              id="period-select"
            >
              <option value="oct-2024">Oktober 2024 (Berjalan)</option>
              <option value="sep-2024">September 2024</option>
              <option value="aug-2024">Agustus 2024</option>
              <option value="ytd-2024">Tahun Berjalan (YTD)</option>
            </select>
          </div>
          <div className="h-4 w-px bg-[#E2E8F0] hidden sm:block"></div>
          <span className="text-xs text-[#45464d] hidden sm:inline-flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#006C4A]"></span>
            4 Akun Bank & E-Wallet Terhubung
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-[#E2E8F0] bg-[#EFF4FF]/60 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode('konsolidasi')}
              className={`px-3 py-1 rounded transition-all ${
                viewMode === 'konsolidasi'
                  ? 'bg-white text-[#0b1c30] shadow-xs font-bold'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              Konsolidasi
            </button>
            <button
              type="button"
              onClick={() => setViewMode('arus-kas')}
              className={`px-3 py-1 rounded transition-all ${
                viewMode === 'arus-kas'
                  ? 'bg-white text-[#0b1c30] shadow-xs font-bold'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              Arus Kas
            </button>
            <button
              type="button"
              onClick={() => setViewMode('audit-fiskal')}
              className={`px-3 py-1 rounded transition-all ${
                viewMode === 'audit-fiskal'
                  ? 'bg-white text-[#0b1c30] shadow-xs font-bold'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              Audit Fiskal
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 flex flex-col gap-8 max-w-[1440px] mx-auto w-full">
        {/* SECTION 1: METRIC KPI CLUSTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Total Saldo Bersih */}
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Saldo Bersih
              </span>
              <span className="material-symbols-outlined text-[18px] text-slate-400">
                account_balance
              </span>
            </div>
            <div>
              <div className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight text-[#0b1c30] tabular-nums">
                Rp {currentSaldo.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">4 Rekening operasional aktif</div>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[#006C4A] font-semibold">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +12.4%
              </span>
              <span className="text-slate-400 text-[11px]">vs. bulan lalu</span>
            </div>
          </div>

          {/* Card 2: Total Pemasukan */}
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Pemasukan
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#006C4A]">
                arrow_downward
              </span>
            </div>
            <div>
              <div className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight text-[#0b1c30] tabular-nums">
                Rp {totalIncome.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Gaji, honor & dividen</div>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[#006C4A] font-semibold">
                100% Target
              </span>
              <span className="text-slate-400 text-[11px]">Capai Rp 28.5M</span>
            </div>
          </div>

          {/* Card 3: Total Pengeluaran */}
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Total Pengeluaran
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#E11D48]">
                arrow_upward
              </span>
            </div>
            <div>
              <div className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight text-[#0b1c30] tabular-nums">
                Rp {totalExpense.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">52.1% dari rasio pemasukan</div>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[#006C4A] font-semibold">
                Batas Terkendali
              </span>
              <span className="text-slate-400 text-[11px]">Maks 60%</span>
            </div>
          </div>

          {/* Card 4: Surplus Arus Kas */}
          <div className="bg-white rounded-xl p-5 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between gap-3 hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Surplus Arus Kas
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#006C4A]">
                account_balance_wallet
              </span>
            </div>
            <div>
              <div className="font-['Plus_Jakarta_Sans'] text-[28px] font-bold tracking-tight text-[#006C4A] tabular-nums">
                +Rp {netSurplus.toLocaleString('id-ID')}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Tersedia untuk alokasi investasi</div>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-[#006C4A] font-semibold">
                Savings Rate: {savingsRate}%
              </span>
              <span className="text-slate-400 text-[11px]">Target &gt; 20%</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: BENTO LAYOUT (Anggaran 50/30/20 & Tren Arus Kas 6 Bulan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Bento: Analisis Anggaran 50/30/20 */}
          <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                    Analisis Anggaran 50/30/20
                  </h2>
                  <span className="text-xs text-slate-500">
                    Distribusi realisasi alokasi kas bulanan
                  </span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EFF4FF] text-slate-600 border border-[#E2E8F0]">
                  Oktober 2024
                </span>
              </div>

              {/* Stacked Master Bar */}
              <div className="mb-4 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]/50">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-500">Total Terealisasi</span>
                  <span className="font-bold text-[#0b1c30] tabular-nums">
                    Rp 18.700.000 / Rp 28.500.000
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
                  <div className="bg-[#0b1c30] h-full" style={{ width: '47.5%' }} title="Kebutuhan: 47.5%"></div>
                  <div className="bg-[#D97706] h-full" style={{ width: '22%' }} title="Keinginan: 22%"></div>
                  <div className="bg-[#006C4A] h-full" style={{ width: '30.5%' }} title="Tabungan: 30.5%"></div>
                </div>
              </div>

              {/* Three Breakdown Cards */}
              <div className="flex flex-col gap-3">
                {/* 1. Kebutuhan Pokok */}
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#0b1c30]"></span>
                      <span className="font-semibold text-[#0b1c30]">Kebutuhan Pokok (50%)</span>
                    </div>
                    <span className="text-slate-500 font-medium">62.4% terpakai</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                    <div className="bg-[#0b1c30] h-full rounded-full" style={{ width: '62.4%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11.5px] text-slate-500">
                    <span>Budget: Rp 14.250.000</span>
                    <span>Terpakai: Rp 8.900.000</span>
                    <span className="text-[#006C4A] font-semibold">Sisa: Rp 5.350.000</span>
                  </div>
                </div>

                {/* 2. Keinginan & Gaya Hidup */}
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#D97706]"></span>
                      <span className="font-semibold text-[#0b1c30]">Keinginan & Gaya Hidup (30%)</span>
                    </div>
                    <span className="text-slate-500 font-medium">48.0% terpakai</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                    <div className="bg-[#D97706] h-full rounded-full" style={{ width: '48%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11.5px] text-slate-500">
                    <span>Budget: Rp 8.550.000</span>
                    <span>Terpakai: Rp 4.100.000</span>
                    <span className="text-[#006C4A] font-semibold">Sisa: Rp 4.450.000</span>
                  </div>
                </div>

                {/* 3. Tabungan & Investasi */}
                <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#006C4A]"></span>
                      <span className="font-semibold text-[#0b1c30]">Tabungan & Investasi (20%)</span>
                    </div>
                    <span className="text-[#006C4A] font-bold">100% terpenuhi</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                    <div className="bg-[#006C4A] h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11.5px] text-slate-500">
                    <span>Budget: Rp 5.700.000</span>
                    <span>Dialokasikan: Rp 5.700.000</span>
                    <span className="text-slate-600 font-semibold">Sisa: Rp 0</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">Aturan alokasi diverifikasi otomatis</span>
              <button
                type="button"
                onClick={() => setCurrentScreen('analisis-anggaran')}
                className="text-[#006C4A] font-semibold hover:underline"
              >
                Sesuaikan Target →
              </button>
            </div>
          </div>

          {/* Right Bento: Tren Arus Kas 6 Bulan */}
          <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex flex-col">
                  <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                    Tren Arus Kas 6 Bulan
                  </h2>
                  <span className="text-xs text-slate-500">
                    Perbandingan Pemasukan vs Pengeluaran Historis
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#006C4A]"></span> Masuk
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-sm bg-[#E11D48]"></span> Keluar
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-slate-700">
                    <span className="w-3 h-0.5 bg-[#0b1c30]"></span> Net Surplus
                  </span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="w-full h-64 flex items-end">
                <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 650 200">
                  <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="650" y1="30" y2="30" />
                  <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="650" y1="80" y2="80" />
                  <line stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="650" y1="130" y2="130" />
                  <line stroke="#CBD5E1" strokeWidth="1" x1="0" x2="650" y1="180" y2="180" />

                  {/* Mei */}
                  <rect fill="#006C4A" height="120" rx="3" width="18" x="40" y="60" />
                  <rect fill="#E11D48" height="80" rx="3" width="18" x="62" y="100" />

                  {/* Jun */}
                  <rect fill="#006C4A" height="130" rx="3" width="18" x="145" y="50" />
                  <rect fill="#E11D48" height="85" rx="3" width="18" x="167" y="95" />

                  {/* Jul */}
                  <rect fill="#006C4A" height="140" rx="3" width="18" x="250" y="40" />
                  <rect fill="#E11D48" height="70" rx="3" width="18" x="272" y="110" />

                  {/* Agt */}
                  <rect fill="#006C4A" height="135" rx="3" width="18" x="355" y="45" />
                  <rect fill="#E11D48" height="95" rx="3" width="18" x="377" y="85" />

                  {/* Sep */}
                  <rect fill="#006C4A" height="150" rx="3" width="18" x="460" y="30" />
                  <rect fill="#E11D48" height="75" rx="3" width="18" x="482" y="105" />

                  {/* Okt */}
                  <rect fill="#006C4A" height="155" rx="3" width="18" x="565" y="25" />
                  <rect fill="#E11D48" height="90" rx="3" width="18" x="587" y="90" />

                  {/* Net Surplus Line */}
                  <path
                    d="M 60 110 L 165 100 L 270 75 L 375 95 L 480 60 L 585 50"
                    fill="none"
                    stroke="#0b1c30"
                    strokeWidth="2.5"
                  />
                  <circle cx="60" cy="110" fill="#0b1c30" r="3.5" />
                  <circle cx="165" cy="100" fill="#0b1c30" r="3.5" />
                  <circle cx="270" cy="75" fill="#0b1c30" r="3.5" />
                  <circle cx="375" cy="95" fill="#0b1c30" r="3.5" />
                  <circle cx="480" cy="60" fill="#0b1c30" r="3.5" />
                  <circle cx="585" cy="50" fill="#006C4A" r="5" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
              </div>

              {/* Month Footer */}
              <div className="grid grid-cols-6 gap-2 pt-2 text-center text-xs border-t border-[#E2E8F0]/60 mt-1">
                <div className="text-slate-500">
                  <span className="block font-medium">Mei</span>
                  <span className="text-[#006C4A] text-[11px] font-semibold">+9.8M</span>
                </div>
                <div className="text-slate-500">
                  <span className="block font-medium">Jun</span>
                  <span className="text-[#006C4A] text-[11px] font-semibold">+10.2M</span>
                </div>
                <div className="text-slate-500">
                  <span className="block font-medium">Jul</span>
                  <span className="text-[#006C4A] text-[11px] font-semibold">+12.1M</span>
                </div>
                <div className="text-slate-500">
                  <span className="block font-medium">Agt</span>
                  <span className="text-[#006C4A] text-[11px] font-semibold">+9.4M</span>
                </div>
                <div className="text-slate-500">
                  <span className="block font-medium">Sep</span>
                  <span className="text-[#006C4A] text-[11px] font-semibold">+13.0M</span>
                </div>
                <div className="font-bold text-[#0b1c30]">
                  <span className="block">Okt (Berjalan)</span>
                  <span className="text-[#006C4A] text-[11px] font-bold">+13.6M</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: BUKU KAS & QUICK ENTRY MODULE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Entry Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl p-6 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                    Entri Transaksi Baru
                  </h2>
                  <span className="text-xs text-slate-500">Pencatatan kas operasional mandiri</span>
                </div>
                <span className="material-symbols-outlined text-[22px] text-slate-400">edit_note</span>
              </div>

              <form onSubmit={handleQuickEntry} className="flex flex-col gap-3">
                {/* Masuk / Keluar toggle */}
                <div className="grid grid-cols-2 p-1 bg-[#EFF4FF] rounded-lg gap-1 border border-[#E2E8F0]/60">
                  <button
                    type="button"
                    onClick={() => setEntryType('keluar')}
                    className={`py-1.5 rounded text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                      entryType === 'keluar'
                        ? 'bg-white text-[#E11D48] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntryType('masuk')}
                    className={`py-1.5 rounded text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                      entryType === 'masuk'
                        ? 'bg-white text-[#006C4A] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#006C4A]" />
                    Pemasukan
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={entryDate}
                      onChange={(e) => setEntryDate(e.target.value)}
                      className="w-full h-10 px-3 bg-[#EFF4FF]/60 border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] outline-none focus:bg-white focus:border-[#006C4A] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Kategori
                    </label>
                    <select
                      value={entryCategory}
                      onChange={(e) => setEntryCategory(e.target.value)}
                      className="w-full h-10 px-2.5 bg-[#EFF4FF]/60 border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] outline-none focus:bg-white focus:border-[#006C4A] transition-all cursor-pointer"
                    >
                      <option value="Makanan & Minuman">Makanan & Minuman</option>
                      <option value="Transportasi">Transportasi</option>
                      <option value="Utilitas & Tagihan">Utilitas & Tagihan</option>
                      <option value="Investasi Portofolio">Investasi & Portofolio</option>
                      <option value="Pendapatan Sampingan">Pendapatan Sampingan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-slate-600">Nominal</label>
                    <button
                      type="button"
                      onClick={() => setIsTransactionModalOpen(true)}
                      className="text-[11px] text-[#006C4A] hover:underline inline-flex items-center gap-1 font-semibold"
                    >
                      <span className="material-symbols-outlined text-[13px]">receipt_long</span>
                      Lampirkan Struk
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-slate-500">Rp</span>
                    <input
                      type="text"
                      value={Number(entryAmount.replace(/\D/g, '') || 0).toLocaleString('id-ID')}
                      onChange={(e) => setEntryAmount(e.target.value.replace(/\D/g, ''))}
                      className="w-full h-10 pl-9 pr-3 bg-[#EFF4FF]/60 border border-[#E2E8F0] rounded-lg font-bold text-sm text-[#0b1c30] outline-none focus:bg-white focus:border-[#006C4A] transition-all tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={entryNotes}
                    onChange={(e) => setEntryNotes(e.target.value)}
                    placeholder="Contoh: Makan Siang Tim Proyek"
                    className="w-full h-10 px-3 bg-[#EFF4FF]/60 border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] outline-none focus:bg-white focus:border-[#006C4A] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 w-full h-10 bg-[#0F172A] text-white rounded-lg text-xs font-semibold hover:bg-[#1E293B] transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  <span>Simpan Transaksi</span>
                </button>
              </form>
            </div>

            <div className="mt-3 pt-3 border-t border-[#E2E8F0]/60 text-xs text-slate-400 flex items-center justify-between">
              <span>Format mata uang Rupiah otomatis</span>
              <span className="text-[11px] font-mono text-slate-500">ISO IDR</span>
            </div>
          </div>

          {/* Mutasi Transaksi Terkini (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl p-6 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex flex-col">
                  <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                    Mutasi Transaksi Terkini
                  </h2>
                  <span className="text-xs text-slate-500">
                    {transactions.slice(0, 5).length} dari {transactions.length} mutasi tercatat bulan ini
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentScreen('buku-kas')}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0b1c30] text-xs font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">tune</span> Filter
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0b1c30] text-xs font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">download</span> CSV
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              <div className="divide-y divide-[#E2E8F0]/60">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="py-2.5 flex items-center justify-between hover:bg-[#F8FAFC] px-2 rounded-lg transition-colors"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-[#0b1c30] truncate">
                          {tx.title}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                            tx.type === 'masuk'
                              ? 'bg-emerald-50 text-[#006C4A] border-emerald-200'
                              : tx.classification === 'investasi'
                              ? 'bg-[#EFF4FF] text-[#006C4A] border-[#E2E8F0]'
                              : tx.classification === 'keinginan'
                              ? 'bg-amber-50 text-[#D97706] border-amber-200'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          {tx.category}
                        </span>
                      </div>
                      <span className="text-[11.5px] text-slate-500 mt-0.5 truncate">
                        {tx.date} • {tx.account}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className={`text-xs font-bold tabular-nums ${
                          tx.type === 'masuk' ? 'text-[#006C4A]' : 'text-[#E11D48]'
                        }`}
                      >
                        {tx.type === 'masuk' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                      </div>
                      <span className="text-[10px] text-slate-400">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs text-slate-500">
              <span>
                Menampilkan 1-5 dari {transactions.length} transaksi
              </span>
              <button
                onClick={() => setCurrentScreen('buku-kas')}
                className="text-xs font-semibold text-[#006C4A] hover:underline flex items-center gap-1"
              >
                <span>Buka Buku Kas Lengkap</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: MANAJEMEN PORTOFOLIO & NILAI ASET */}
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0]/70 shadow-xs flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#0b1c30]">
                  Manajemen Portofolio & Nilai Aset
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006C4A] text-xs font-semibold">
                  {assets.length} Instrumen Aktif
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pemantauan nilai pasar aset investasi, modal disetor riil, dan kalkulasi unrealized return.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddAssetModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#006C4A] hover:bg-[#005137] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_chart</span>
              <span>+ Daftarkan Aset Baru</span>
            </button>
          </div>

          {/* Portfolio Summary Header Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 rounded-xl bg-[#EFF4FF]/50 border border-[#E2E8F0]/60">
            <div className="flex flex-col justify-between">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Total Nilai Pasar Aset
              </span>
              <div className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0b1c30] font-bold tracking-tight my-1 tabular-nums">
                Rp {totalMarketValue.toLocaleString('id-ID')}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#006C4A] font-bold">+{totalGainPercent}% All-Time</span>
                <span className="text-slate-400">• Akumulasi 2022-2024</span>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Alokasi & Modal Disetor
              </span>
              <div className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0b1c30] font-bold tracking-tight my-1 tabular-nums">
                Rp {totalInvestedCapital.toLocaleString('id-ID')}
              </div>
              <div className="flex flex-col gap-1">
                <div className="w-full h-2 rounded-full bg-slate-200 flex overflow-hidden gap-0.5">
                  <div className="bg-[#0b1c30] h-full" style={{ width: '41%' }} title="Saham: 41%"></div>
                  <div className="bg-[#D97706] h-full" style={{ width: '29%' }} title="Emas: 29%"></div>
                  <div className="bg-[#006C4A] h-full" style={{ width: '21%' }} title="SBN: 21%"></div>
                  <div className="bg-[#10B981] h-full" style={{ width: '9%' }} title="Reksadana: 9%"></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Saham 41%</span>
                  <span>Emas 29%</span>
                  <span>SBN 21%</span>
                  <span>Reksadana 9%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Total Unrealized Return
              </span>
              <div className="flex items-center gap-2 my-1">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#006C4A] font-bold tracking-tight tabular-nums">
                  +Rp {totalUnrealizedGain.toLocaleString('id-ID')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006C4A] text-xs font-bold">
                  Untung
                </span>
              </div>
              <span className="text-xs text-slate-400">Diperbarui otomatis hari ini 09:30 WIB</span>
            </div>
          </div>

          {/* Asset Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 rounded-l-lg">Instrumen / Nama Aset</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Modal Disetor</th>
                  <th className="py-3 px-4">Nilai Terkini</th>
                  <th className="py-3 px-4">Gain / Loss</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/60 text-xs">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs tracking-wider shrink-0 ${
                            asset.badgeColor || 'bg-slate-800 text-white'
                          }`}
                        >
                          {asset.code.substring(0, 4)}
                        </div>
                        <div>
                          <div className="font-bold text-[#0b1c30]">{asset.name}</div>
                          <div className="text-[11px] text-slate-500">{asset.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#EFF4FF] text-slate-700 font-medium text-[11px]">
                        {asset.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 tabular-nums">
                      Rp {asset.investedCapital.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0b1c30] tabular-nums">
                      Rp {asset.currentValue.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[#006C4A] font-bold tabular-nums">
                        <span className="material-symbols-outlined text-[15px]">trending_up</span>
                        +Rp {asset.unrealizedGain.toLocaleString('id-ID')} (+{asset.unrealizedGainPercent}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedAssetForUpdate(asset)}
                        className="px-3 py-1 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors text-slate-700 border border-[#E2E8F0] shadow-2xs"
                      >
                        Perbarui Nilai
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: PERENCANAAN DANA & BILL PLANNER (TARGET KEUANGAN) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Plan Input (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                    Perencanaan Dana
                  </h2>
                  <p className="text-xs text-slate-500">Daftar tagihan tempo & target pos simpanan.</p>
                </div>
                <span className="material-symbols-outlined text-[#006C4A] text-[24px]">
                  event_upcoming
                </span>
              </div>

              <form onSubmit={handleQuickPlan} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nama Target / Tagihan
                  </label>
                  <input
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    placeholder="Misal: Pajak Kendaraan Bermotor"
                    required
                    className="w-full h-10 px-3 bg-[#EFF4FF]/60 border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] outline-none focus:bg-white focus:border-[#006C4A] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Kategori Pos
                  </label>
                  <select
                    value={planCategory}
                    onChange={(e) => setPlanCategory(e.target.value)}
                    className="w-full h-10 px-2.5 bg-[#EFF4FF]/60 border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] outline-none focus:bg-white focus:border-[#006C4A] transition-all cursor-pointer"
                  >
                    <option value="Tagihan Wajib">Tagihan Wajib</option>
                    <option value="Dana Darurat">Dana Darurat</option>
                    <option value="Asuransi & Kesehatan">Asuransi & Kesehatan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Liburan & Hiburan">Liburan & Hiburan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Target Kebutuhan Dana (Rp)
                  </label>
                  <input
                    type="text"
                    value={planTarget}
                    onChange={(e) => setPlanTarget(e.target.value)}
                    placeholder="Misal: 5000000"
                    required
                    className="w-full h-10 px-3 bg-[#EFF4FF]/60 border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] outline-none focus:bg-white focus:border-[#006C4A] transition-all tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Target Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
                    className="w-full h-10 px-3 bg-[#EFF4FF]/60 border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] outline-none focus:bg-white focus:border-[#006C4A] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-1 w-full h-10 bg-[#0F172A] text-white rounded-lg text-xs font-semibold hover:bg-[#1E293B] transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">add_task</span>
                  <span>Tambah Rencana Dana</span>
                </button>
              </form>
            </div>

            <div className="mt-4 p-3 rounded-lg bg-[#EFF4FF]/60 border border-[#E2E8F0]/60 flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Proyeksi Kebutuhan:</span>
              <span className="font-bold text-[#0b1c30] tabular-nums">Rp 37.500.000</span>
            </div>
          </div>

          {/* Target Progress Tracking Cards (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl p-6 border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#0b1c30]">
                    Monitoring Target Tabungan & Pos Wajib
                  </h2>
                  <p className="text-xs text-slate-500">
                    Progres akumulasi simpanan vs estimasi tanggal jatuh tempo.
                  </p>
                </div>
                <span className="text-xs bg-[#EFF4FF] px-2.5 py-1 rounded-full text-slate-700 font-semibold">
                  {sinkingFunds.length} Pos Aktif
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {sinkingFunds.map((fund) => {
                  const percent = Math.min(
                    100,
                    Math.round((fund.currentAmount / fund.targetAmount) * 100)
                  );
                  const isComplete = percent >= 100;
                  return (
                    <div
                      key={fund.id}
                      className="p-4 rounded-xl bg-[#EFF4FF]/40 border border-[#E2E8F0]/60 flex flex-col gap-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                              isComplete
                                ? 'bg-emerald-50 text-[#006C4A]'
                                : 'bg-white border border-[#E2E8F0] text-slate-700'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {fund.icon || 'shield'}
                            </span>
                          </div>
                          <div>
                            <div className="font-bold text-xs text-[#0b1c30]">{fund.name}</div>
                            <div className="text-[11px] text-slate-500">
                              Jatuh Tempo: {fund.dueDate} • {fund.holdingAccount}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-['Plus_Jakarta_Sans'] text-base font-bold tabular-nums block ${
                              isComplete ? 'text-[#006C4A]' : 'text-[#0b1c30]'
                            }`}
                          >
                            Rp {fund.currentAmount.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            dari Target Rp {fund.targetAmount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isComplete
                              ? 'bg-[#10B981]'
                              : percent >= 75
                              ? 'bg-[#006C4A]'
                              : 'bg-[#D97706]'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span
                          className={`font-semibold ${
                            isComplete ? 'text-[#006C4A]' : 'text-slate-700'
                          }`}
                        >
                          {percent}% Terpenuhi
                        </span>
                        <span>
                          {isComplete
                            ? 'Dana Telah Siap di Rekening Kas'
                            : `Kekurangan: Rp ${(fund.targetAmount - fund.currentAmount).toLocaleString('id-ID')}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-[#E2E8F0]/60 mt-4">
              <span>Pengingat jatuh tempo dikirimkan via notifikasi aplikasi & email 7 hari sebelum tenggat.</span>
              <button
                type="button"
                onClick={() => setCurrentScreen('perencanaan-dana-dan-tagihan')}
                className="text-[#006C4A] font-semibold hover:underline"
              >
                Kelola Semua Tagihan →
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 6: PREMIUM STATUS & INTEGRATION BANNER */}
        <div className="rounded-xl p-4 bg-white border border-[#E2E8F0]/70 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-[#006C4A] border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006C4A]"></span> Lisensi Aktif Enterprise
            </span>
            <span>GamMenkeu Sistem Finansial Mandiri • Multi-Asset Ledger v2.4</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setCurrentScreen('akses-akun-premium')}
              className="hover:text-[#0b1c30] transition-colors"
            >
              Pusat Bantuan & Panduan
            </button>
            <button
              onClick={() => setCurrentScreen('buku-kas')}
              className="hover:text-[#0b1c30] transition-colors"
            >
              Audit Log
            </button>
            <button
              onClick={() => setCurrentScreen('akses-akun-premium')}
              className="text-[#006C4A] font-semibold hover:underline"
            >
              Pengaturan Lisensi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
