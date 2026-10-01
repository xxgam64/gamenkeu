import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';

export const PlanningScreen: React.FC = () => {
  const { sinkingFunds, upcomingBills, addSinkingFund, payBill, syncCalendar, showToast } = useFinance();

  const [planName, setPlanName] = useState('');
  const [planCategory, setPlanCategory] = useState('Tagihan Rutin Wajib');
  const [frequency, setFrequency] = useState('Tahunan');
  const [targetNominal, setTargetNominal] = useState('5000000');
  const [dueDate, setDueDate] = useState('2024-12-31');
  const [holdingAccount, setHoldingAccount] = useState('Bank Mandiri - Sinking Fund (*8821)');
  const [isSyncing, setIsSyncing] = useState(false);

  // Aggregates
  const totalTarget = sinkingFunds.reduce((sum, f) => sum + f.targetAmount, 0);
  const totalCollected = sinkingFunds.reduce((sum, f) => sum + f.currentAmount, 0);
  const readinessPercent = totalTarget > 0 ? ((totalCollected / totalTarget) * 100).toFixed(1) : '0';

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      syncCalendar();
    }, 800);
  };

  const handleScrollToForm = () => {
    const el = document.getElementById('planNameInput');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(targetNominal.replace(/\D/g, ''), 10);
    if (!planName || isNaN(num) || num <= 0) return;

    addSinkingFund({
      name: planName,
      category: planCategory,
      targetAmount: num,
      currentAmount: 0,
      dueDate,
      frequency,
      holdingAccount,
      monthlyAllocation: Math.round(num / 12),
      icon: 'savings',
    });

    setPlanName('');
    setTargetNominal('');
  };

  return (
    <div className="flex flex-col w-full p-4 lg:p-8 space-y-8 max-w-[1440px] mx-auto pb-16">
      {/* Header & Page Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <span>GamMenkeu</span>
            <span>•</span>
            <span className="text-[#006C4A] font-bold">Alokasi & Komitmen</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0b1c30] tracking-tight">
            Perencanaan Dana & Tagihan Tempo
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Manajemen komitmen tagihan berkala, pos tabungan wajib, dan estimasi likuiditas dana cadangan.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-center shrink-0">
          <button
            type="button"
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold px-3.5 h-10 rounded-lg shadow-2xs transition-all border border-[#E2E8F0]"
          >
            <span
              className={`material-symbols-outlined text-[18px] text-slate-500 ${
                isSyncing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
            <span>Sinkronisasi Kalender Tagihan</span>
          </button>
          <button
            type="button"
            onClick={handleScrollToForm}
            className="inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold px-4 h-10 rounded-lg shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Tambah Rencana Dana</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Proyeksi Dana (3 KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: Total Target */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Total Target Kebutuhan Dana
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#0b1c30] font-bold tracking-tight mt-1 tabular-nums">
                Rp {totalTarget.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#EFF4FF] flex items-center justify-center text-slate-800">
              <span className="material-symbols-outlined text-[20px]">flag</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E2E8F0]/60 flex items-center justify-between text-slate-500 text-xs">
            <span>{sinkingFunds.length} pos kewajiban aktif</span>
            <span className="font-medium text-slate-700">Periode 2024-2025</span>
          </div>
        </div>

        {/* KPI 2: Akumulasi Dana */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Akumulasi Dana Terkumpul
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#006C4A] font-bold tracking-tight mt-1 tabular-nums">
                Rp {totalCollected.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-[#006C4A]">
              <span className="material-symbols-outlined text-[20px]">savings</span>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-slate-500 text-xs">
              <span>Tingkat Kesiapan Likuiditas</span>
              <span className="font-bold text-[#006C4A]">{readinessPercent}% Terpenuhi</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                style={{ width: `${readinessPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI 3: Kebutuhan Alokasi */}
        <div className="bg-white rounded-xl p-5 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Kebutuhan Alokasi Bulan Ini
              </span>
              <span className="font-['Plus_Jakarta_Sans'] text-2xl text-[#D97706] font-bold tracking-tight mt-1 tabular-nums">
                Rp 2.500.000
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-[#D97706]">
              <span className="material-symbols-outlined text-[20px]">pending_actions</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#E2E8F0]/60 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-amber-50 text-[#D97706] font-semibold border border-amber-200">
              <span className="material-symbols-outlined text-[13px]">info</span>
              Kekurangan tempo terdekat
            </span>
            <span className="text-slate-400">Harus cair s/d 15 Nov</span>
          </div>
        </div>
      </div>

      {/* Functional Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Registrasi (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl p-6 shadow-xs border border-[#E2E8F0]/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-800 text-[22px]">post_add</span>
                <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                  Registrasi Pos Rencana Baru
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 bg-[#EFF4FF] px-2 py-0.5 rounded font-medium">
                Sinking Fund
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Nama Target atau Tagihan
                </label>
                <input
                  id="planNameInput"
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="Contoh: Pajak Kendaraan Bermotor, Asuransi Tahunan"
                  required
                  className="w-full h-10 px-3.5 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:border-[#006C4A] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Kategori Pos
                  </label>
                  <select
                    value={planCategory}
                    onChange={(e) => setPlanCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#006C4A] cursor-pointer"
                  >
                    <option value="Tagihan Rutin Wajib">Tagihan Rutin Wajib</option>
                    <option value="Dana Darurat">Dana Darurat</option>
                    <option value="Dana Pendidikan">Dana Pendidikan</option>
                    <option value="Liburan/Impian">Liburan / Impian</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Catatan Frekuensi
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#006C4A] cursor-pointer"
                  >
                    <option value="Tahunan">Tahunan</option>
                    <option value="Semesteran">Semesteran</option>
                    <option value="Bulanan">Bulanan</option>
                    <option value="Sekali Bayar">Sekali Bayar (Ad-hoc)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Target Nominal Kebutuhan
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      value={Number(targetNominal.replace(/\D/g, '') || 0).toLocaleString('id-ID')}
                      onChange={(e) => setTargetNominal(e.target.value.replace(/\D/g, ''))}
                      required
                      className="w-full h-10 pl-10 pr-3.5 bg-white border border-[#E2E8F0] rounded-lg text-xs font-bold text-[#0b1c30] focus:outline-none focus:border-[#006C4A] tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Target Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#006C4A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Rekening Penampung / Sinking Fund
                </label>
                <select
                  value={holdingAccount}
                  onChange={(e) => setHoldingAccount(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#006C4A] cursor-pointer"
                >
                  <option value="Bank Mandiri - Sinking Fund (*8821)">
                    Bank Mandiri - Sinking Fund (*8821)
                  </option>
                  <option value="BCA - Deposito Berjangka (*4019)">
                    BCA - Deposito Berjangka (*4019)
                  </option>
                  <option value="Bibit RDN - Pasar Uang Likuid">Bibit RDN - Pasar Uang Likuid</option>
                  <option value="Bank Jago - Kantong Dana Darurat">Bank Jago - Kantong Dana Darurat</option>
                </select>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full h-11 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Simpan Rencana Pos Finansial</span>
                </button>
              </div>
            </form>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0]/60 flex items-center gap-2 text-slate-400 text-xs">
            <span className="material-symbols-outlined text-[16px] text-[#006C4A]">verified_user</span>
            <span>Perhitungan alokasi bulanan dikalkulasikan secara otomatis berdasarkan sisa hari.</span>
          </div>
        </div>

        {/* Right Column: Monitoring Pos Wajib (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-800 text-[22px]">tune</span>
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                Monitoring Pos Wajib & Target Simpanan Berjalan
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {sinkingFunds.length} Pos Aktif Terdata
            </span>
          </div>

          {sinkingFunds.map((fund) => {
            const percent = Math.min(
              100,
              Math.round((fund.currentAmount / fund.targetAmount) * 100)
            );
            const isComplete = percent >= 100;
            return (
              <div
                key={fund.id}
                className="bg-white rounded-xl p-5 shadow-xs border border-[#E2E8F0]/70 hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-[#0b1c30]">
                        {fund.name}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isComplete
                            ? 'bg-emerald-50 text-[#006C4A] border border-emerald-200'
                            : percent >= 75
                            ? 'bg-emerald-50 text-[#006C4A]'
                            : 'bg-amber-50 text-[#D97706]'
                        }`}
                      >
                        {isComplete ? 'Dana Siap di Rekening Kas' : fund.statusNote}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Pos: {fund.category} • Penampung: {fund.holdingAccount}
                    </p>
                  </div>

                  <div className="text-right sm:shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Terkumpul / Target
                    </span>
                    <span className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30] tabular-nums">
                      Rp {fund.currentAmount.toLocaleString('id-ID')}{' '}
                      <span className="text-slate-400 text-xs font-normal">
                        / Rp {fund.targetAmount.toLocaleString('id-ID')}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1 my-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#006C4A] font-bold">{percent}% Terpenuhi</span>
                    <span className="text-slate-500">
                      Sisa: <strong className="text-slate-800">Rp {(fund.targetAmount - fund.currentAmount).toLocaleString('id-ID')}</strong>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
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
                </div>

                <div className="pt-2.5 border-t border-[#E2E8F0]/60 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">
                        calendar_month
                      </span>
                      Tempo: <strong className="text-slate-800">{fund.dueDate}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">
                        payments
                      </span>
                      Alokasi:{' '}
                      <strong className="text-slate-800 tabular-nums">
                        Rp {fund.monthlyAllocation.toLocaleString('id-ID')}/bln
                      </strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(
                        fund.name,
                        `Detail pos: Sisa target Rp ${(fund.targetAmount - fund.currentAmount).toLocaleString('id-ID')}`,
                        'info'
                      )
                    }
                    className="text-slate-700 hover:text-[#006C4A] font-semibold flex items-center gap-0.5"
                  >
                    <span>Rincian</span>
                    <span className="material-symbols-outlined text-[15px]">chevron_right</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kalender & Jadwal Arus Kas Jatuh Tempo Mendatang */}
      <div className="bg-white rounded-xl shadow-xs border border-[#E2E8F0]/70 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0]/60 gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-800 text-[22px]">event_note</span>
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                Jadwal Arus Kas & Tagihan Jatuh Tempo Mendatang
              </h2>
              <p className="text-xs text-slate-500">
                Daftar komitmen pengeluaran dalam rentang 30 hari ke depan untuk monitoring likuiditas harian.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-xs bg-[#F8FAFC] text-slate-600 px-3 py-1.5 rounded-lg border border-[#E2E8F0] font-medium">
            <span className="material-symbols-outlined text-[14px]">filter_alt</span>
            Filter: 30 Hari Terdekat
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0]/60 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Tanggal Jatuh Tempo</th>
                <th className="py-3 px-4">Deskripsi Tagihan & Lembaga</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Rekening Penampung</th>
                <th className="py-3 px-4 text-right">Nominal Tagihan</th>
                <th className="py-3 px-4 text-center">Status Kesiapan Dana</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/60 text-xs text-[#0b1c30]">
              {upcomingBills.map((bill) => (
                <tr key={bill.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">event</span>
                      <span className="font-bold">{bill.dueDate}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 pl-6 block">{bill.daysRemainingText}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold block text-slate-900">{bill.title}</span>
                    <span className="text-[11px] text-slate-500">{bill.institution}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded text-[11px] bg-[#EFF4FF] text-slate-700 font-medium">
                      {bill.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{bill.holdingAccount}</td>
                  <td className="py-3.5 px-4 text-right font-bold tabular-nums whitespace-nowrap">
                    Rp {bill.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        bill.isPaid
                          ? 'bg-emerald-50 text-[#006C4A]'
                          : bill.readinessStatus === 'Dana Siap 100%' ||
                            bill.readinessStatus === 'Teralokasi Penuh'
                          ? 'bg-emerald-50 text-[#006C4A]'
                          : 'bg-amber-50 text-[#D97706]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {bill.isPaid ? 'Lunas / Terbayar' : bill.readinessStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {bill.isPaid ? (
                      <span className="text-xs text-slate-400 font-medium">Selesai</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => payBill(bill.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        Bayar Sekarang
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footnote */}
        <div className="mt-4 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#006C4A]">
              security_update_good
            </span>
            <span>Semua tagihan otomatis sinkron dengan reminder kalender & notifikasi 3 hari sebelum tempo.</span>
          </div>
          <button
            onClick={() => showToast('Notifikasi Aktif', 'Pengingat otomatis aktif via WhatsApp & Email.', 'info')}
            className="text-xs text-[#006C4A] hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Pengaturan Notifikasi</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
