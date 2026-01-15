import React, { useState } from 'react';
import { Users, BookOpen, Zap, ArrowRight, Activity } from 'lucide-react';
import { TeamInquiryForm } from './TeamInquiryForm';

export const SmallTeamsCTA: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      {showForm && <TeamInquiryForm onClose={() => setShowForm(false)} />}
      
      <div className="relative overflow-hidden rounded-[3rem] bg-on-surface text-surface p-12 lg:p-20 group transition-all duration-700 shadow-2xl">
        <div className="absolute inset-0 ledger-grid pointer-events-none opacity-10" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-2xl space-y-8">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-surface/5 rounded-xl text-primary">
                   <Users size={24} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-surface opacity-40">Squad Solutions</span>
             </div>
             
             <div className="space-y-6">
                <h3 className="text-[clamp(2.5rem,5vw,3.75rem)] font-slab font-bold tracking-tighter uppercase leading-none">Scale your whole <span className="text-primary">Collective.</span></h3>
                <p className="text-lg md:text-xl font-medium opacity-60 leading-relaxed">
                  Centralize your squad's knowledge. Perfect for agencies, research teams, and boutique labs who need shared recaps and team-wide clarity.
                </p>
             </div>

             <div className="flex flex-wrap gap-x-10 gap-y-4">
                {[
                  { icon: BookOpen, label: 'Shared Library' },
                  { icon: Activity, label: 'Team Progress' },
                  { icon: Zap, label: 'Priority Support' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
                    <item.icon size={16} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="shrink-0 w-full lg:w-auto">
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-4 px-12 py-7 bg-primary text-on-primary rounded-3xl font-black text-[12px] uppercase tracking-[0.25em] shadow-2xl hover:brightness-110 transition-all active:scale-95 w-full lg:w-auto group/btn"
            >
              Contact Sales
              <ArrowRight size={20} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};