import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CategoryClassification, TransactionType } from '../../types/finance';

export const TransactionModal: React.FC = () => {
  const { isTransactionModalOpen, setIsTransactionModalOpen, addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>('keluar');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState<string>('BCA Payroll (•••• 8291)');
  const [category, setCategory] = useState<string>('Makanan & Minuman');
  const [amountStr, setAmountStr] = useState<string>('125000');
  const [title, setTitle] = useState<string>('Makan Siang Tim Proyek');
  const [counterparty, setCounterparty] = useState<string>('Resto Senopati');
  const [receiptAttached, setReceiptAttached] = useState<boolean>(true);

  if (!isTransactionModalOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmountStr(val);
  };

  const formattedAmount = Number(amountStr || 0).toLocaleString('id-ID');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amountStr, 10);
    if (!title || isNaN(numAmount) || numAmount <= 0) return;

    let classification: CategoryClassification = 'kebutuhan';
    if (type === 'masuk') {
      classification = 'pendapatan';
    } else {
      if (category.includes('Investasi') || category.includes('Reksadana')) {
        classification = 'investasi';
      } else if (category.includes('Makanan') || category.includes('Hiburan') || category.includes('Gaya Hidup')) {
        classification = 'keinginan';
      } else {
        classification = 'kebutuhan';
      }
    }

    addTransaction({
      date,
      time: '12:30 WIB',
      title,
      description: counterparty,
      counterparty,
      account,
      category,
      classification,
      type,
      amount: numAmount,
      status: 'Selesai',
      receiptAttached,
      auditVerified: true,
    });

    setIsTransactionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
            </div>
            <div>
              <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-base">
                Catat Transaksi Baru
              </h3>
              <p className="text-xs text-slate-400">Jurnal kas mandiri dengan rekonsiliasi seketika</p>
            </div>
          </div>
          <button
            onClick={() => setIsTransactionModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Segmented Type Toggle */}
          <div className="grid grid-cols-2 p-1 bg-[#EFF4FF] rounded-lg gap-1 border border-[#E2E8F0]/60">
            <button
              type="button"
              onClick={() => setType('keluar')}
              className={`py-2 rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                type === 'keluar'
                  ? 'bg-white text-[#E11D48] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
              Pengeluaran (Kas Keluar)
            </button>
            <button
              type="button"
              onClick={() => setType('masuk')}
              className={`py-2 rounded-md font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                type === 'masuk'
                  ? 'bg-white text-[#006C4A] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#006C4A]" />
              Pemasukan (Kas Masuk)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Akun Sumber Dana</label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full h-10 px-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white cursor-pointer"
              >
                <option value="BCA Payroll (•••• 8291)">BCA Payroll (•••• 8291)</option>
                <option value="Mandiri Operasional (•••• 1042)">Mandiri Operasional (•••• 1042)</option>
                <option value="Jago Rekening (•••• 4991)">Jago Rekening (•••• 4991)</option>
                <option value="Kas Fisik / Tunai">Kas Fisik / Brankas Tunai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white cursor-pointer"
              >
                {type === 'keluar' ? (
                  <>
                    <option value="Makanan & Minuman">Makanan & Minuman (F&B)</option>
                    <option value="Utilitas & Tagihan">Utilitas & Tagihan (Listrik, Air)</option>
                    <option value="Transportasi">Transportasi & BBM</option>
                    <option value="Sewa Tempat Tinggal / Properti">Sewa Tempat Tinggal</option>
                    <option value="Bahan Pokok & Dapur">Bahan Pokok & Dapur</option>
                    <option value="Investasi Portofolio">Investasi Portofolio</option>
                    <option value="Hiburan & Rekreasi">Hiburan & Rekreasi</option>
                  </>
                ) : (
                  <>
                    <option value="Gaji & Kompensasi">Gaji Pokok & Kompensasi</option>
                    <option value="Bonus & Insentif">Bonus & Insentif</option>
                    <option value="Dividen & Kupon">Dividen Saham / Kupon SBN</option>
                    <option value="Pendapatan Sampingan">Pendapatan Proyek / Freelance</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Nominal (IDR)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  Rp
                </span>
                <input
                  type="text"
                  value={amountStr}
                  onChange={handleAmountChange}
                  placeholder="0"
                  required
                  className="w-full h-10 pl-9 pr-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white tabular-nums"
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Terbaca: Rp {formattedAmount}</div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Keterangan Transaksi
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Belanja Bulanan Supermarket"
              required
              className="w-full h-10 px-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nama Rekanan / Merchant
            </label>
            <input
              type="text"
              value={counterparty}
              onChange={(e) => setCounterparty(e.target.value)}
              placeholder="Contoh: GrandLucky SCBD Mart"
              className="w-full h-10 px-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white"
            />
          </div>

          {/* Struk Attachment toggle */}
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#006C4A]">receipt_long</span>
              <span className="text-xs font-medium text-slate-700">Lampirkan Bukti Struk Transaksi</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={receiptAttached}
                onChange={(e) => setReceiptAttached(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#006C4A]"></div>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              <span>Simpan ke Buku Kas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
