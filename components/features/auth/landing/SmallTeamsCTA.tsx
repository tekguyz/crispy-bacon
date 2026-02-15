
import React, { useState } from 'react';
import { Users, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { TeamInquiryForm } from './TeamInquiryForm';
import { triggerHaptic } from '../../../../services/hapticService';

export const SmallTeamsCTA: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleInquiry = () => {
    triggerHaptic('medium');
    setShowForm(true);
  };

  return (
    <div className="max-w-5xl mx-auto mt-12">
      {showForm && <TeamInquiryForm onClose={() => setShowForm(false)} />}
      
      <div className="relative overflow-hidden rounded-3xl bg-on-surface text-surface p-6 md:p-8 group transition-all duration-500 border border-on-surface shadow-xl">
        <div className="absolute inset-0 ledger-grid pointer-events-none opacity-5" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
               <Users size={20} strokeWidth={2.5} />
            </div>
            
            <div className="space-y-1">
               <h3 className="text-xl font-slab font-bold tracking-tight uppercase leading-none">
                  Bacon for <span className="text-primary italic">Teams.</span>
               </h3>
               <p className="text-[11px] font-medium opacity-50 uppercase tracking-widest leading-relaxed max-w-sm">
                 Centralized research vaults and shared decision logs for agencies and labs.
               </p>
            </div>
          </div>

          <div className="flex items-center gap-8 shrink-0">
            <div className="hidden lg:flex items-center gap-6">
               <div className="flex items-center gap-2 opacity-30">
                  <ShieldCheck size={14} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Shared Vaults</span>
               </div>
               <div className="flex items-center gap-2 opacity-30">
                  <Database size={14} />
                  <span className="text-[8px] font-black uppercase tracking-widest">Team Admin</span>
               </div>
            </div>

            <button 
              onClick={handleInquiry}
              className="flex items-center justify-center gap-3 px-8 h-12 bg-primary text-on-primary rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:brightness-110 active:scale-95 transition-all group/btn"
            >
              Contact Sales
              <ArrowRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      
      <p className="text-[7px] font-mono font-black text-center mt-4 opacity-20 uppercase tracking-[0.6em]">Professional Enterprise Support Available</p>
    </div>
  );
};
