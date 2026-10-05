import React from 'react';
import { X, CheckCircle2, Sparkles, Info } from 'lucide-react';
import { usePrism } from '../../context/PrismContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = usePrism();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg text-slate-900 dark:text-slate-100 transition-all duration-150"
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'milestone' ? (
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Info className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-snug">{toast.title}</p>
            {toast.description && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {toast.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
