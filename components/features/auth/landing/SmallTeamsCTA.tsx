import React, { useState } from 'react';
import { Users, ArrowRight, ShieldCheck, Database, Zap } from 'lucide-react';
import { TeamInquiryForm } from './TeamInquiryForm';
import { triggerHaptic } from '../../../../services/hapticService';

export const SmallTeamsCTA: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleContact = () => {
    triggerHaptic('medium');
    setShowForm(true);
  };

  return (
    <div className="relative">
      {showForm && <TeamInquiryForm onClose={() => setShowForm(false)} />}
      
      <div className="relative overflow-hidden rounded-[2rem] bg-on-surface text-surface p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 border border-on-surface shadow-xl">
        <div className="absolute inset-0 ledger-grid pointer-events-none opacity-[0.03]" />
        
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 relative z-10">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface/5 flex items-center justify-center text-primary shrink-0 border border-surface/10">
                 <Users size={20} strokeWidth={2.5} />
              </div>
              <div className="space-y-0.5">
                 <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em] text-primary">Team capacity</span>
                 <h3 className="text-2xl font-slab font-bold tracking-tighter uppercase leading-none">Scaling Out.</h3>
              </div>
           </div>

           <div className="hidden lg:flex items-center gap-8 border-l border-surface/10 pl-8">
              <div className="flex items-center gap-2 opacity-40">
                 <ShieldCheck size={14} className="text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Shared Vaults</span>
              </div>
              <div className="flex items-center gap-2 opacity-40">
                 <Database size={14} className="text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Unified Storage</span>
              </div>
              <div className="flex items-center gap-2 opacity-40">
                 <Zap size={14} className="text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Team API</span>
              </div>
           </div>
        </div>

        <button 
          onClick={handleContact}
          className="group/btn relative z-10 flex items-center justify-center gap-3 px-8 h-14 bg-primary text-on-primary rounded-xl font-black text-[11px] uppercase tracking-[0.3em] shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          Contact Sales
          <ArrowRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="mt-4 flex justify-center">
         <p className="text-[8px] font-mono font-black opacity-20 uppercase tracking-[0.4em]">Enterprise Grade Infrastructure Available</p>
      </div>
    </div>
  );
};