
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
    <div className="max-w-4xl mx-auto mt-16">
      {showForm && <TeamInquiryForm onClose={() => setShowForm(false)} />}
      
      <div className="rounded-[2rem] bg-surface-container-low p-2 pr-2 md:pr-4 flex flex-col md:flex-row items-center gap-6 border border-outline-variant/10 shadow-sm group">
        
        <div className="flex-1 flex items-center gap-6 px-6 py-4 md:py-2">
           <div className="w-12 h-12 bg-surface-container-high rounded-full flex items-center justify-center shrink-0 text-primary">
              <Users size={20} strokeWidth={2} />
           </div>
           <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-on-surface mb-1">
                 Crispy Bacon for Teams
              </h3>
              <p className="text-[10px] font-medium text-on-surface-variant opacity-60">
                Shared vaults & SSO for high-performance agencies.
              </p>
           </div>
        </div>

        <button 
          onClick={handleInquiry}
          className="w-full md:w-auto px-8 h-12 bg-on-surface text-surface rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.25em] hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-3 shrink-0"
        >
          Contact Sales
          <ArrowRight size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};
