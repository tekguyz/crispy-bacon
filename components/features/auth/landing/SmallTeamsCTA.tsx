
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
    <div className="max-w-5xl mx-auto mt-20">
      {showForm && <TeamInquiryForm onClose={() => setShowForm(false)} />}
      
      <div className="relative overflow-hidden rounded-[3rem] bg-surface-container-low p-10 md:p-12 group transition-all duration-500 border border-outline-variant/10 shadow-sm hover:shadow-xl">
        <div className="absolute inset-0 ledger-grid pointer-events-none opacity-[0.03]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 max-w-md">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-outline-variant/10 mb-2">
                <Users size={12} className="text-primary" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Enterprise Ready</span>
             </div>
             
             <h3 className="text-3xl font-slab font-bold tracking-tight uppercase leading-none text-on-surface">
                Crispy Bacon <br/><span className="text-primary italic">for Teams.</span>
             </h3>
             <p className="text-sm font-medium text-on-surface-variant opacity-60 leading-relaxed">
               Shared decision logs and centralized research vaults for high-performance agencies and labs.
             </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6 text-on-surface-variant opacity-50">
               <div className="flex items-center gap-2">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">SSO</span>
               </div>
               <div className="flex items-center gap-2">
                  <Database size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
               </div>
            </div>

            <button 
              onClick={handleInquiry}
              className="flex items-center justify-center gap-3 px-10 h-14 bg-on-surface text-surface rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-2xl hover:scale-105 active:scale-95 transition-all group/btn"
            >
              Contact Sales
              <ArrowRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
