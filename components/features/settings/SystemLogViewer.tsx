
import React, { useState } from 'react';
import { Terminal, Copy, Check, AlertCircle, Info, AlertTriangle, ChevronDown, Trash2, ZapOff } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

export const SystemLogViewer: React.FC = () => {
  const { systemLogs, addToast, fetchData, setSelectedInsight } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = () => {
    const text = systemLogs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message} ${l.details ? `(${l.details})` : ''}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    addToast('History copied.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHardReset = () => {
    useAppStore.setState({ 
      isProcessing: false, 
      ingestionError: null,
      showInputModal: false,
      showCaptureLab: false 
    } as any);
    setSelectedInsight(null);
    fetchData();
    addToast("System state reset.", "success");
  };

  const getIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle size={10} className="text-error" />;
      case 'warn': return <AlertTriangle size={10} className="text-warning" />;
      default: return <Info size={10} className="text-primary" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex-1 flex items-center justify-between px-6 py-4 bg-surface-container-low border border-outline-variant/10 rounded-2xl hover:bg-surface-container transition-all group"
          >
            <div className="flex items-center gap-3">
               <Terminal size={14} className="text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-on-surface">Activity Log</span>
            </div>
            <ChevronDown size={14} className={`text-on-surface-variant transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <button 
            onClick={handleHardReset}
            className="px-6 py-4 bg-error/5 border border-error/10 text-error rounded-2xl flex items-center gap-3 hover:bg-error/10 transition-all group active:scale-95"
            title="Force reset the assistant state"
          >
             <ZapOff size={14} className="group-hover:scale-110 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Reset State</span>
          </button>
      </div>

      {isOpen && (
        <div className="animate-slide-up space-y-4">
            <div className="flex items-center justify-between px-1">
                <p className="text-[8px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest">Recent Events</p>
                <div className="flex gap-2">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest rounded-lg transition-colors text-[9px] font-black uppercase tracking-widest text-on-surface"
                    >
                        {copied ? <Check size={10} /> : <Copy size={10} />} Copy
                    </button>
                    <button 
                        onClick={() => useAppStore.setState({ systemLogs: [] })}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-error/5 hover:bg-error/10 text-error rounded-lg transition-colors text-[9px] font-black uppercase tracking-widest"
                    >
                        <Trash2 size={10} /> Clear
                    </button>
                </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[1.5rem] border border-outline-variant/20 p-4 h-60 overflow-y-auto custom-scrollbar font-mono text-[10px] leading-relaxed shadow-inner">
                {systemLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-20">
                    <p className="font-black uppercase tracking-widest text-[8px]">System quiet.</p>
                </div>
                ) : (
                <div className="space-y-1.5">
                    {systemLogs.map(log => (
                    <div key={log.id} className="flex gap-3 group/log border-b border-outline-variant/5 pb-1.5 last:border-0">
                        <span className="text-on-surface-variant/30 shrink-0 select-none">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                        <div className="pt-0.5 shrink-0">{getIcon(log.level)}</div>
                        <div className="min-w-0 break-words flex-1">
                        <span className={`${log.level === 'error' ? 'text-error font-bold' : (log.level === 'warn' ? 'text-warning font-bold' : 'text-on-surface opacity-70')}`}>
                            {log.message
                                .replace(/Neural Link/gi, 'Assistant')
                                .replace(/Distillation/gi, 'Analysis')
                                .replace(/Ingest/gi, 'Import')
                                .replace(/Telemetry/gi, 'Activity')
                            }
                        </span>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};
