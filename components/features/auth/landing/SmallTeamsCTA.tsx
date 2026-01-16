import React, { useState } from 'react';
import { Users, FileText, Zap, ArrowRight, Activity, ShieldCheck, Database } from 'lucide-react';
import { TeamInquiryForm } from './TeamInquiryForm';

export const SmallTeamsCTA: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      {showForm && <TeamInquiryForm onClose={() => setShowForm(false)} />}
      
      <div className="relative overflow-hidden rounded-[3rem] bg-on-surface text-surface p-12 lg:p-24 group transition-all duration-700 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border-4 border-on-surface">
        <div className="absolute inset-0 ledger-grid pointer-events-none opacity-5" />
        <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-16">
          <div className="max-w-2xl space-y-10">
             <div className="inline-flex items-center gap-3 px-4 py-2 bg-surface/5 border border-surface/10 rounded-full">
                <Users size={18} strokeWidth={2.5} className="text-primary" />
                <span className="text-[10px] font-mono font-black uppercase tracking-[0.4em] text-surface opacity-80">Team Access</span>
             </div>
             
             <div className="space-y-6">
                <h3 className="text-[clamp(2.5rem,5vw,4.5rem)] font-slab font-bold tracking-tighter uppercase leading-[0.9]">
                   Scale your <br />
                   <span className="text-primary italic">Team.</span>
                </h3>
                <p className="text-lg md:text-2xl font-medium opacity-50 font-serif leading-relaxed max-w-xl">
                  Centralize your team's knowledge. Optimized for agencies, research labs, and boutique consulting firms.
                </p>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { icon: ShieldCheck, label: 'Shared Vaults', detail: 'Cross-team access' },
                  { icon: Activity, label: 'Activity Logs', detail: 'Track decision history' },
                  { icon: Database, label: 'Unified Storage', detail: 'Permanent retention' },
                  { icon: Zap, label: 'API Access', detail: 'Custom automation' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group/item">
                    <div className="w-10 h-10 rounded-xl bg-surface/5 flex items-center justify-center text-primary shrink-0 border border-surface/10 transition-colors group-hover/item:bg-primary group-hover/item:text-on-primary">
                       <item.icon size={18} strokeWidth={2.5} />
                    </div>
                    <div className="space-y-0.5">
                       <span className="text-[10px] font-black uppercase tracking-widest block">{item.label}</span>
                       <span className="text-[9px] font-medium opacity-30 uppercase tracking-widest">{item.detail}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto self-stretch flex flex-col justify-center">
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-6 px-12 py-10 bg-primary text-on-primary rounded-3xl font-black text-[13px] uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all w-full lg:w-auto group/btn ring-4 ring-primary/20"
            >
              Contact Sales
              <ArrowRight size={24} strokeWidth={3} className="group-hover/btn:translate-x-2 transition-transform" />
            </button>
            <p className="text-[8px] font-mono font-black text-center mt-6 opacity-30 uppercase tracking-[0.5em]">Enterprise Plans Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};