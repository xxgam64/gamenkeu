import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';

export const UpdateAssetModal: React.FC = () => {
  const { selectedAssetForUpdate, setSelectedAssetForUpdate, updateAssetValuation } = useFinance();

  const [valStr, setValStr] = useState('');
  const [unitPriceStr, setUnitPriceStr] = useState('');

  useEffect(() => {
    if (selectedAssetForUpdate) {
      setValStr(selectedAssetForUpdate.currentValue.toString());
      setUnitPriceStr(selectedAssetForUpdate.currentUnitPrice?.toString() || '');
    }
  }, [selectedAssetForUpdate]);

  if (!selectedAssetForUpdate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newVal = parseInt(valStr.replace(/\D/g, ''), 10);
    const newUnitPrice = unitPriceStr ? parseInt(unitPriceStr.replace(/\D/g, ''), 10) : undefined;

    if (!isNaN(newVal) && newVal > 0) {
      updateAssetValuation(selectedAssetForUpdate.id, newVal, newUnitPrice);
      setSelectedAssetForUpdate(null);
    }
  };

  const currentCapital = selectedAssetForUpdate.investedCapital;
  const numVal = parseInt(valStr.replace(/\D/g, '') || '0', 10);
  const diff = numVal - currentCapital;
  const diffPercent = currentCapital > 0 ? ((diff / currentCapital) * 100).toFixed(2) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] font-bold text-slate-900 text-base">
              Perbarui Nilai Pasar
            </h3>
            <p className="text-xs text-slate-400">{selectedAssetForUpdate.name}</p>
          </div>
          <button
            onClick={() => setSelectedAssetForUpdate(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-[#F8FAFC] rounded-lg border border-slate-200 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Modal Disetor:</span>
              <span className="font-semibold text-slate-900">
                Rp {selectedAssetForUpdate.investedCapital.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jumlah Unit/Lot:</span>
              <span className="font-semibold text-slate-900">
                {selectedAssetForUpdate.units} {selectedAssetForUpdate.unitLabel}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Total Nilai Pasar Terkini (IDR)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                Rp
              </span>
              <input
                type="text"
                value={Number(valStr.replace(/\D/g, '') || 0).toLocaleString('id-ID')}
                onChange={(e) => setValStr(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full h-11 pl-9 pr-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-base font-bold text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white tabular-nums"
              />
            </div>
          </div>

          {selectedAssetForUpdate.currentUnitPrice !== undefined && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Estimasi Harga per Unit/Gram/Lot (Opsional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  Rp
                </span>
                <input
                  type="text"
                  value={unitPriceStr ? Number(unitPriceStr.replace(/\D/g, '') || 0).toLocaleString('id-ID') : ''}
                  onChange={(e) => setUnitPriceStr(e.target.value.replace(/\D/g, ''))}
                  placeholder="Harga penutupan hari ini"
                  className="w-full h-10 pl-9 pr-3 bg-[#F8FAFC] border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#006C4A] focus:bg-white tabular-nums"
                />
              </div>
            </div>
          )}

          {/* Unrealized Gain Preview */}
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
            <span className="text-emerald-800 font-medium">Estimasi Unrealized PnL:</span>
            <span className={`font-bold font-mono ${diff >= 0 ? 'text-[#006C4A]' : 'text-[#E11D48]'}`}>
              {diff >= 0 ? '+' : ''}Rp {diff.toLocaleString('id-ID')} ({diffPercent}%)
            </span>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedAssetForUpdate(null)}
              className="flex-1 h-10 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 h-10 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Simpan Valuasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
