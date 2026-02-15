
import React, { useState } from 'react';
import { Users, ArrowRight } from 'lucide-react';
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
      
      <div className="rounded-[2.5rem] bg-surface-container-low border border-outline-variant/10 p-2 md:p-3 flex flex-col md:flex-row items-center gap-6 shadow-sm group hover:border-primary/20 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
        <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />
        
        <div className="flex-1 flex items-center gap-6 px-6 py-6 md:py-4 relative z-10">
           <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center shrink-0 text-primary border border-outline-variant/10 shadow-inner">
              <Users size={28} strokeWidth={1.5} />
           </div>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h3 className="text-xl font-slab font-bold text-on-surface uppercase tracking-tight">
                    Crispy Bacon for Teams
                 </h3>
                 <span className="px-2 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-md border border-primary/20">Enterprise</span>
              </div>
              <p className="text-sm font-medium text-on-surface-variant opacity-60 leading-relaxed">
                Shared vaults, centralized billing, and SSO for high-performance agencies.
              </p>
           </div>
        </div>

        <button 
          onClick={handleInquiry}
          className="w-full md:w-auto px-10 h-16 bg-on-surface text-surface rounded-[2rem] font-black text-[11px] uppercase tracking-[0.25em] hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-3 shrink-0 relative z-10 shadow-lg group/btn"
        >
          Contact Sales
          <ArrowRight size={14} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
