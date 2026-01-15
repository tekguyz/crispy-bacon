
import React from 'react';
import { ShieldCheck, Cpu, Database, Globe, Lock, HardDrive } from 'lucide-react';

export const InfrastructureManifest: React.FC = () => {
  const specs = [
    { label: 'Reasoning', value: 'Smart Models', detail: 'Advanced logic to understand complex meeting context.' },
    { label: 'Library', value: 'Secure Vault', detail: 'Your data is encrypted and strictly private by default.' },
    { label: 'Isolation', value: 'Private Workspace', detail: 'Strict separation ensures only you see your work.' },
    { label: 'Data Policy', value: 'Zero Training', detail: 'We never use your private notes to train general models.' },
    { label: 'Encryption', value: 'Always Active', detail: 'Encrypted transit and storage using industry standards.' },
    { label: 'Reliability', value: 'Fast Recaps', detail: 'Efficient systems designed for high availability.' },
  ];

  return (
    <section className="py-24 md:py-40 bg-background border-t border-outline-variant relative overflow-hidden">
      <div className="container-landing relative z-10">
        <div className="max-w-4xl mb-20 space-y-6">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The System</span>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-slab font-bold tracking-tighter uppercase text-on-background leading-none">Built for <span className="opacity-30">Privacy.</span></h2>
          <p className="text-lg md:text-xl font-medium text-on-surface-variant opacity-60 max-w-xl leading-relaxed">
            Crispy Bacon is built with security as the first priority. Your research stays with you, and we ensure it stays protected.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-outline-variant/10 border border-outline-variant rounded-[3rem] overflow-hidden shadow-2xl">
          {specs.map((spec, i) => (
            <div key={i} className="bg-background p-10 flex flex-col gap-8 hover:bg-surface-container-low transition-all duration-500 group">
              <div className="flex items-center justify-between">
                 <div className="p-3 bg-surface-container-high rounded-2xl text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 shadow-inner">
                    {i === 0 ? <Cpu size={20} /> : i === 1 ? <HardDrive size={20} /> : i === 2 ? <Database size={20} /> : i === 3 ? <ShieldCheck size={20} /> : i === 4 ? <Globe size={20} /> : <Lock size={20} />}
                 </div>
                 <span className="text-[9px] font-mono font-black text-on-surface/10 uppercase tracking-[0.3em]">SECURE_ENTRY_0{i+1}</span>
              </div>
              <div className="space-y-3">
                 <h4 className="text-2xl font-slab font-bold text-on-surface uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{spec.value}</h4>
                 <p className="text-[12px] font-bold text-on-surface-variant opacity-60 leading-relaxed">
                   {spec.detail}
                 </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-1 flex items-center justify-center p-12 bg-surface-container-highest/20 rounded-b-[3rem] border border-outline-variant">
           <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center shadow-inner border border-success/20 animate-pulse">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-2">
                 <h4 className="text-xl font-black uppercase tracking-tighter text-on-surface">Private & Secure</h4>
                 <p className="text-xs font-medium text-on-surface-variant opacity-60 max-w-lg tracking-wide">
                   Every session is isolated and encrypted. We prioritize your privacy above everything else.
                 </p>
              </div>
           </div>
        </div>
      </div>
      
      {/* Background Ledger Grid */}
      <div className="absolute inset-0 ledger-grid pointer-events-none opacity-20" />
    </section>
  );
};
