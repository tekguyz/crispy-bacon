
import React, { useState } from 'react';
import { Activity, ShieldCheck, AlertCircle, Loader2, Play } from 'lucide-react';
import { triggerHaptic } from '../../../services/hapticService';

export const BridgeDiagnostics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runPulse = async () => {
    setLoading(true);
    triggerHaptic('medium');
    try {
      const resp = await fetch('/.netlify/functions/health');
      const data = await resp.json();
      setResults(data);
    } catch (e) {
      setResults({ error: "Bridge unreachable. Check Netlify logs." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 space-y-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-xl">
            <Activity size={16} strokeWidth={3} />
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface">Infrastructure Pulse</h2>
        </div>
        <button 
          onClick={runPulse}
          disabled={loading}
          className="px-4 py-2 bg-on-surface text-surface rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} fill="currentColor" />}
          Run Diagnostic
        </button>
      </div>

      <div className="bg-surface-container-highest/30 rounded-2xl p-4 font-mono text-[9px] min-h-[100px] border border-outline-variant/5 shadow-inner overflow-hidden">
        {!results && !loading ? (
          <div className="h-full flex items-center justify-center opacity-20 italic">
            Awaiting manual pulse trigger...
          </div>
        ) : loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-2 w-32 bg-on-surface/10 rounded" />
            <div className="h-2 w-48 bg-on-surface/10 rounded" />
            <div className="h-2 w-24 bg-on-surface/10 rounded" />
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
             <div className="flex justify-between border-b border-on-surface/5 pb-2">
                <span className="text-on-surface-variant/40">NODE_STATUS</span>
                <span className="text-success font-black uppercase">ONLINE</span>
             </div>
             {results.diagnostics?.map((d: any) => (
               <div key={d.name} className="flex justify-between items-center">
                  <span className="text-on-surface-variant/60">{d.name}</span>
                  <div className="flex items-center gap-2">
                    {d.status ? (
                      <>
                        <ShieldCheck size={10} className="text-success" />
                        <span className="text-on-surface font-bold uppercase tracking-tighter">CONFIGURED</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={10} className="text-error" />
                        <span className="text-error font-bold uppercase tracking-tighter">MISSING</span>
                      </>
                    )}
                  </div>
               </div>
             ))}
             {results.error && <p className="text-error font-black uppercase">{results.error}</p>}
             <div className="pt-2 opacity-20">
                TIME: {new Date(results.timestamp).toLocaleTimeString()}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
