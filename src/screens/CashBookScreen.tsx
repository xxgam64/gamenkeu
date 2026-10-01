import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, CategoryClassification } from '../types/finance';

export const CashBookScreen: React.FC = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    setIsExportModalOpen,
    setIsTransactionModalOpen,
    showToast,
  } = useFinance();

  // Form states for Left sticky form
  const [txType, setTxType] = useState<TransactionType>('keluar');
  const [txDate, setTxDate] = useState('2024-09-28');
  const [txAccount, setTxAccount] = useState('BCA Payroll (•••• 8291) - Rp 31.250.000');
  const [txCategory, setTxCategory] = useState('Sewa Tempat Tinggal / Properti');
  const [txAmount, setTxAmount] = useState('750000');
  const [txDescription, setTxDescription] = useState('Pembelian Lisensi Cloud & Server Q3');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logic
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.counterparty && t.counterparty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedCategoryFilter === 'all') return matchesSearch;
    if (selectedCategoryFilter === 'pendapatan') return matchesSearch && t.type === 'masuk';
    if (selectedCategoryFilter === 'kebutuhan') return matchesSearch && t.classification === 'kebutuhan';
    if (selectedCategoryFilter === 'investasi') return matchesSearch && t.classification === 'investasi';
    if (selectedCategoryFilter === 'gaya-hidup') return matchesSearch && t.classification === 'keinginan';
    return matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginated.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(txAmount.replace(/\D/g, ''), 10);
    if (!txDescription || isNaN(num) || num <= 0) return;

    let classification: CategoryClassification = 'kebutuhan';
    if (txType === 'masuk') {
      classification = 'pendapatan';
    } else if (txCategory.includes('Investasi') || txCategory.includes('Reksadana')) {
      classification = 'investasi';
    } else if (txCategory.includes('Restoran') || txCategory.includes('Hiburan')) {
      classification = 'keinginan';
    }

    addTransaction({
      date: txDate,
      time: '14:30 WIB',
      title: txDescription,
      description: txCategory,
      counterparty: 'Vendor Terverifikasi',
      account: txAccount.split(' - ')[0],
      category: txCategory,
      classification,
      type: txType,
      amount: num,
      status: 'Selesai',
      receiptAttached: true,
      auditVerified: true,
    });

    setTxDescription('');
    setTxAmount('0');
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('gaji') || cat.includes('kompensasi') || cat.includes('honor')) return 'payments';
    if (cat.includes('sewa') || cat.includes('tempat tinggal') || cat.includes('rumah')) return 'home';
    if (cat.includes('investasi') || cat.includes('reksadana')) return 'trending_up';
    if (cat.includes('belanja') || cat.includes('dapur') || cat.includes('pokok')) return 'shopping_cart';
    if (cat.includes('listrik') || cat.includes('pln') || cat.includes('utilitas')) return 'bolt';
    if (cat.includes('proyek') || cat.includes('konsultasi')) return 'assignment_turned_in';
    if (cat.includes('restoran') || cat.includes('dining') || cat.includes('kuliner')) return 'restaurant';
    if (cat.includes('internet') || cat.includes('wifi') || cat.includes('fiber')) return 'wifi';
    return 'receipt';
  };

  return (
    <div className="flex flex-col w-full p-4 lg:p-8 space-y-6 max-w-[1440px] mx-auto pb-16">
      {/* Header & Toolbar Aksi Utama */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Buku Kas Utama</span>
            <span>•</span>
            <span className="text-[#006C4A]">Audit Trail Terverifikasi</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0b1c30] tracking-tight">
            Buku Kas & Jurnal Mutasi
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Pencatatan arus kas operasional, rekonsiliasi transaksi, dan audit trail kas masuk/keluar harian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 h-10 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs">
            <span className="material-symbols-outlined text-[18px] text-slate-500">calendar_month</span>
            <span>September 2024</span>
          </div>
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 px-3.5 h-10 rounded-lg border border-[#E2E8F0] shadow-2xs text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">download</span>
            <span>Unduh Rekap</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTransactionModalOpen(true)}
            className="inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white px-4 h-10 rounded-lg shadow-sm text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Entri Transaksi Baru</span>
          </button>
        </div>
      </div>

      {/* Ringkasan Kas Cepat (3 KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metrik 1: Total Saldo Kas */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Saldo Kas Operasional
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#0b1c30] tracking-tight tabular-nums">
                  Rp 48.750.000
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#EFF4FF] flex items-center justify-center text-slate-800">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-[#E2E8F0]/60">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Terkonsolidasi 4 rekening aktif
            </span>
            <span className="font-semibold text-[#006C4A]">+12.4% MoM</span>
          </div>
        </div>

        {/* Metrik 2: Total Mutasi Masuk */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Mutasi Masuk (Bulan Ini)
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#006C4A] tracking-tight tabular-nums">
                  +Rp 28.500.000
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-[#006C4A]">
              <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-[#E2E8F0]/60">
            <span>14 Transaksi Terkredit</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#006C4A] text-[11px] font-bold">
              100% Cocok
            </span>
          </div>
        </div>

        {/* Metrik 3: Total Mutasi Keluar */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0]/70 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Mutasi Keluar (Bulan Ini)
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#E11D48] tracking-tight tabular-nums">
                  -Rp 14.850.000
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-[#E11D48]">
              <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-[#E2E8F0]/60">
            <span>24 Transaksi Terdebet</span>
            <span className="text-slate-600 font-semibold text-[11px]">Rasio Anggaran 52%</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Sticky Form (Left) & Ledger Audit Table (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Mutasi Kas */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#E2E8F0]/70 shadow-xs space-y-4 lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-[#0b1c30]">
                Formulir Mutasi Kas
              </h2>
              <p className="text-xs text-slate-400">Input jurnal transaksi dengan rekonsiliasi seketika.</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">edit_note</span>
          </div>

          {/* Segmented Tab */}
          <div className="grid grid-cols-2 p-1 bg-[#EFF4FF] rounded-lg text-center text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTxType('keluar')}
              className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                txType === 'keluar'
                  ? 'bg-white text-[#E11D48] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">remove_circle_outline</span>
              <span>Kas Keluar</span>
            </button>
            <button
              type="button"
              onClick={() => setTxType('masuk')}
              className={`py-2 rounded-md transition-all flex items-center justify-center gap-1.5 ${
                txType === 'masuk'
                  ? 'bg-white text-[#006C4A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">add_circle_outline</span>
              <span>Kas Masuk</span>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tanggal & Jam Transaksi
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  event
                </span>
                <input
                  type="date"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="w-full h-10 pl-10 pr-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#006C4A] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Akun Sumber Dana
              </label>
              <select
                value={txAccount}
                onChange={(e) => setTxAccount(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#006C4A] focus:bg-white cursor-pointer"
              >
                <option value="BCA Payroll (•••• 8291) - Rp 31.250.000">
                  BCA Payroll (•••• 8291) - Rp 31.250.000
                </option>
                <option value="Mandiri Operasional (•••• 1042) - Rp 12.400.000">
                  Mandiri Operasional (•••• 1042) - Rp 12.400.000
                </option>
                <option value="Jago Kantong Utama (•••• 4991) - Rp 4.100.000">
                  Jago Kantong Utama (•••• 4991) - Rp 4.100.000
                </option>
                <option value="Kas Fisik / Brankas Tunai - Rp 1.000.000">
                  Kas Fisik / Brankas Tunai - Rp 1.000.000
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Klasifikasi Kategori
              </label>
              <select
                value={txCategory}
                onChange={(e) => setTxCategory(e.target.value)}
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#006C4A] focus:bg-white cursor-pointer"
              >
                <optgroup label="Pengeluaran Pokok & Operasional">
                  <option value="Sewa Tempat Tinggal / Properti">Sewa Tempat Tinggal / Properti</option>
                  <option value="Belanja Bahan Pokok & Dapur">Belanja Bahan Pokok & Dapur</option>
                  <option value="Tagihan Utilitas & Listrik PLN">Tagihan Utilitas & Listrik PLN</option>
                  <option value="Transportasi & Bahan Bakar">Transportasi & Bahan Bakar</option>
                </optgroup>
                <optgroup label="Investasi & Tabungan">
                  <option value="Reksadana & Obligasi Negara">Reksadana & Obligasi Negara</option>
                  <option value="Alokasi Dana Darurat">Alokasi Dana Darurat</option>
                </optgroup>
                <optgroup label="Gaya Hidup & Lainnya">
                  <option value="Restoran & Kuliner">Restoran & Kuliner</option>
                  <option value="Langganan Digital & Hiburan">Langganan Digital & Hiburan</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Nominal Mutasi (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                  Rp
                </span>
                <input
                  type="text"
                  value={Number(txAmount.replace(/\D/g, '') || 0).toLocaleString('id-ID')}
                  onChange={(e) => setTxAmount(e.target.value.replace(/\D/g, ''))}
                  placeholder="0"
                  className="w-full h-11 pl-10 pr-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-sm font-bold text-[#0b1c30] focus:outline-none focus:border-[#006C4A] focus:bg-white tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Keterangan / Penerima
              </label>
              <input
                type="text"
                value={txDescription}
                onChange={(e) => setTxDescription(e.target.value)}
                placeholder="Contoh: Belanja Bulanan Supermarket..."
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] focus:outline-none focus:border-[#006C4A] focus:bg-white"
              />
            </div>

            {/* Lampirkan Bukti Struk Box */}
            <div
              onClick={() => showToast('Bukti Struk Siap', 'File bukti struk telah terunggah.', 'info')}
              className="bg-[#F8FAFC] hover:bg-slate-100 transition-colors border border-dashed border-[#E2E8F0] rounded-lg p-3 text-center cursor-pointer flex flex-col items-center justify-center space-y-1"
            >
              <span className="material-symbols-outlined text-[22px] text-slate-400">cloud_upload</span>
              <span className="text-xs font-semibold text-slate-700">
                Klik untuk unggah atau seret berkas
              </span>
              <span className="text-[10px] text-slate-400">Format PDF, PNG, atau JPEG (Maks. 5MB)</span>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Simpan ke Buku Kas</span>
            </button>
          </form>
        </div>

        {/* Right Column: Tabel Detail Mutasi & Toolbar Audit */}
        <div className="lg:col-span-8 space-y-4">
          {/* Toolbar Filter */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]/70 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative w-full max-w-xs">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter mutasi / penerima..."
                  className="w-full h-9 pl-9 pr-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:border-[#006C4A]"
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="h-9 px-3 bg-[#F8FAFC] border border-[#E2E8F0] text-slate-700 rounded-lg text-xs font-medium cursor-pointer focus:outline-none"
              >
                <option value="all">Semua Kategori</option>
                <option value="kebutuhan">Kebutuhan Pokok</option>
                <option value="investasi">Tabungan & Investasi</option>
                <option value="pendapatan">Pendapatan Masuk</option>
                <option value="gaya-hidup">Gaya Hidup & F&B</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 bg-[#EFF4FF] px-2.5 py-1.5 rounded-lg text-slate-800 font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#006C4A]">verified</span>
                <span>Semua Terverifikasi</span>
              </span>
              <button
                type="button"
                onClick={() => showToast('Sinkronisasi Selesai', 'Data buku kas telah diperbarui secara seketika.')}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                title="Muat Ulang Data"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-[#E2E8F0]/70 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === paginated.length && paginated.length > 0}
                        onChange={handleSelectAll}
                        className="rounded accent-[#0F172A] cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4">Tanggal & Waktu</th>
                    <th className="py-3 px-4">Deskripsi & Rekanan</th>
                    <th className="py-3 px-4">Rekening Akun</th>
                    <th className="py-3 px-4">Kategori Pos</th>
                    <th className="py-3 px-4 text-right">Nominal (IDR)</th>
                    <th className="py-3 px-4 text-center">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]/60 text-xs">
                  {paginated.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(tx.id)}
                          onChange={() => handleToggleSelect(tx.id)}
                          className="rounded accent-[#0F172A] cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold block text-[#0b1c30]">{tx.date}</span>
                        <span className="text-[11px] text-slate-400 tabular-nums">
                          {tx.time || '12:00 WIB'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              tx.type === 'masuk'
                                ? 'bg-emerald-50 text-[#006C4A]'
                                : 'bg-[#EFF4FF] text-slate-700'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {getCategoryIcon(tx.category)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[#0b1c30] block truncate">
                              {tx.title}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate block">
                              {tx.counterparty || tx.description}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 block truncate">
                          {tx.account}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-[#EFF4FF] font-medium text-[11px] text-slate-800">
                          {tx.category}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-right whitespace-nowrap font-bold tabular-nums ${
                          tx.type === 'masuk' ? 'text-[#006C4A]' : 'text-[#E11D48]'
                        }`}
                      >
                        {tx.type === 'masuk' ? '+' : '-'}Rp {tx.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className="material-symbols-outlined text-[18px] text-[#006C4A] cursor-pointer hover:scale-110 transition-transform"
                          title="Audit Trail Terverifikasi: Berkas Kuitansi/Struk Sah"
                        >
                          task_alt
                        </span>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        Tidak ada entri transaksi yang sesuai dengan filter pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Menampilkan{' '}
                <span className="font-bold text-slate-800 tabular-nums">
                  {filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                  {Math.min(currentPage * itemsPerPage, filtered.length)}
                </span>{' '}
                dari <span className="font-bold text-slate-800 tabular-nums">{filtered.length}</span>{' '}
                total entri mutasi
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">first_page</span>
                </button>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                      currentPage === pg
                        ? 'bg-white text-slate-900 border border-[#E2E8F0] shadow-xs'
                        : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">last_page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
