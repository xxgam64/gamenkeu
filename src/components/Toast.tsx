import React from 'react';
import { useFinance } from '../context/FinanceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#0F172A] text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700/60 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <span className="material-symbols-outlined text-[#10B981] text-[20px] mt-0.5 shrink-0">
            {toast.type === 'info' ? 'info' : toast.type === 'warning' ? 'warning' : 'check_circle'}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="font-['Plus_Jakarta_Sans'] font-semibold text-xs text-white">
              {toast.title}
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};
