import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

export const AddAssetModal: React.FC = () => {
  const { isAddAssetModalOpen, setIsAddAssetModalOpen, addAsset } = useFinance();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Saham Bluechip' | 'Obligasi Negara' | 'Komoditas / Emas' | 'Reksadana Saham'>('Saham Bluechip');
  const [unitsStr, setUnitsStr] = useState('10');
  const [unitLabel, setUnitLabel] = useState('Lot');
  const [capitalStr, setCapitalStr] = useState('10000000');
  const [currentValStr, setCurrentValStr] = useState('10500000');

  if (!isAddAssetModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const units = parseFloat(unitsStr) || 1;
    const investedCapital = parseInt(capitalStr.replace(/\D/g, '') || '0', 10);
    const currentValue = parseInt(currentValStr.replace(/\D/g, '') || '0', 10);

    if (!code || !name || investedCapital <= 0 || currentValue <= 0) return;

    let badgeColor = 'bg-slate-800 text-white';
    if (category === 'Saham Bluechip') badgeColor = 'bg-navy-light text-white';
    else if (category === 'Obligasi Negara') badgeColor = 'bg-emerald-700 text-white';
    else if (category === 'Komoditas / Emas') badgeColor = 'bg-amber-600 text-white';
    else if (category === 'Reksadana Saham') badgeColor = 'bg-sky-600 text-white';

    addAsset({
      code: code.toUpperCase(),
      name,
      description: description || `${category} terverifikasi`,
      category,
      units,
      unitLabel,
      avgBuyPrice: units > 0 ? investedCapital / units : 0,
      investedCapital,
      currentValue,
      badgeColor,
    });

    setIsAddAssetModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006C4A] text-[22px]">add_chart</span>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-base">
              Daftarkan Instrumen Aset Baru
            </h3>
          </div>
          <button
            onClick={() => setIsAddAssetModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kode Simbol</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Misal: BMRI"
                required
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm font-bold uppercase text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nama Lengkap Aset</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bank Mandiri (Persero) Tbk"
                required
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kategori Instrumen</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-10 px-2.5 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white cursor-pointer"
              >
                <option value="Saham Bluechip">Saham Bluechip</option>
                <option value="Obligasi Negara">Obligasi Negara (SBN/SBSN)</option>
                <option value="Komoditas / Emas">Komoditas / Logam Mulia</option>
                <option value="Reksadana Saham">Reksadana Saham / Indeks</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Keterangan / Kustodian</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Misal: KSEI ID / Bank Mandiri"
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Jumlah Unit/Lot</label>
              <input
                type="number"
                value={unitsStr}
                onChange={(e) => setUnitsStr(e.target.value)}
                required
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Satuan</label>
              <input
                type="text"
                value={unitLabel}
                onChange={(e) => setUnitLabel(e.target.value)}
                placeholder="Lot / Gram / Unit"
                required
                className="w-full h-10 px-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Modal Pokok Disetor</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                <input
                  type="text"
                  value={Number(capitalStr.replace(/\D/g, '') || 0).toLocaleString('id-ID')}
                  onChange={(e) => setCapitalStr(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full h-10 pl-9 pr-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white tabular-nums"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nilai Pasar Saat Ini</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">Rp</span>
                <input
                  type="text"
                  value={Number(currentValStr.replace(/\D/g, '') || 0).toLocaleString('id-ID')}
                  onChange={(e) => setCurrentValStr(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full h-10 pl-9 pr-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddAssetModalOpen(false)}
              className="flex-1 h-10 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 h-10 bg-[#006C4A] hover:bg-[#005137] text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Simpan Instrumen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
