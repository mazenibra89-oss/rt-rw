import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#24865B] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#B5121B] shrink-0" />,
    info: <Info className="w-4 h-4 text-[#3478C8] shrink-0" />,
  };

  const borders = {
    success: 'border-[#CDEEDC] bg-[#F4FAF6]',
    error: 'border-[#FCDADA] bg-[#FFF0F0]',
    info: 'border-[#D5E6F8] bg-[#F4F8FC]',
  };

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all transform translate-y-0 ${borders[toast.type]}`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#20242B]">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-[#737B87] mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
        className="text-[#737B87] hover:text-[#20242B] p-0.5 rounded transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
