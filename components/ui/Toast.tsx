
import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ToastMessage, ToastType } from '../../store/types';
import { X, CheckCircle2, AlertTriangle, Zap, AlertCircle } from 'lucide-react';

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 size={14} className="text-on-primary" />,
    error: <AlertCircle size={14} className="text-error" />,
    info: <Zap size={14} className="text-primary" fill="currentColor" />,
    warn: <AlertTriangle size={14} className="text-warning" />
  };

  const bgColors: Record<ToastType, string> = {
    success: 'bg-primary text-on-primary border-primary',
    error: 'bg-surface-container-highest text-on-surface border-error/20',
    info: 'bg-surface-container-highest text-on-surface border-primary/20',
    warn: 'bg-surface-container-highest text-on-surface border-warning/20'
  };

  return (
    <div 
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      className={`
        flex items-center gap-4 px-5 py-4 rounded-expressive shadow-2xl border animate-slide-up-lg min-w-[300px] max-w-sm group transition-all duration-500 ease-spring backdrop-blur-3xl
        ${bgColors[toast.type]}
      `} 
    >
      <div className={`shrink-0 p-2 rounded-xl shadow-inner ${toast.type === 'success' ? 'bg-on-primary/20' : 'bg-background'}`} aria-hidden="true">
        {icons[toast.type]}
      </div>
      <p className="flex-1 text-[11px] font-black uppercase tracking-tight leading-tight">
        {toast.message}
      </p>
      
      <button 
        onClick={() => onRemove(toast.id)}
        className={`p-1.5 rounded-lg transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-white/20 ${toast.type === 'success' ? 'text-on-primary/60 hover:text-on-primary' : 'text-on-surface-variant hover:bg-on-surface/5'}`}
        aria-label="Dismiss Notification"
      >
        <span className="text-[7px] font-mono font-black hidden group-hover:block uppercase">Dismiss</span>
        <X size={12} strokeWidth={4} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[300] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      <div className="pointer-events-auto flex flex-col gap-3" aria-live="polite">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
};
