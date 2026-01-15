
import React, { useState } from 'react';
import { BookOpen, Crown, Terminal, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

import { ManualSection } from './help/ManualSection';
import { ProSection } from './help/ProSection';
import { SpecsSection } from './help/SpecsSection';

type HelpTab = 'guide' | 'pro' | 'specs';

const HelpScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HelpTab>('guide');
  const setShowUpgradeModal = useAppStore(state => state.setShowUpgradeModal);

  const TABS = [
    { id: 'guide', label: 'User Guide', icon: BookOpen, desc: 'How to use your library' },
    { id: 'pro', label: 'Pro Benefits', icon: Crown, desc: 'Member capabilities' },
    { id: 'specs', label: 'Specifications', icon: Terminal, desc: 'System & Security manifest' },
  ] as const;

  return (
    <div className="animate-fade-in flex flex-col md:flex-row gap-6 md:gap-12 min-h-[70vh] pb-20">
      
      {/* Sidebar Navigation */}
      <nav className="md:w-64 flex flex-col gap-1.5 shrink-0">
         <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30 px-3 mb-3">Support Hub</h3>
         {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as HelpTab)}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${activeTab === tab.id ? 'bg-surface-container border-primary/30 shadow-sm' : 'bg-transparent border-transparent hover:bg-surface-container-low'}`}
            >
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${activeTab === tab.id ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-highest text-on-surface-variant group-hover:text-primary'}`}>
                  <tab.icon size={18} strokeWidth={2.5} />
               </div>
               <div className="flex-1 min-w-0">
                  <span className={`text-[11px] font-black uppercase tracking-tight block mb-0.5 truncate ${activeTab === tab.id ? 'text-on-surface' : 'text-on-surface-variant'}`}>{tab.label}</span>
                  <span className="text-[8px] font-bold text-on-surface-variant opacity-40 uppercase tracking-widest block truncate">{tab.desc}</span>
               </div>
            </button>
         ))}
      </nav>

      {/* Content Area */}
      <main className="flex-1 md:border-l md:border-outline-variant/10 md:pl-12 pt-2">
         {activeTab === 'guide' && <ManualSection />}
         {activeTab === 'pro' && <ProSection onUpgrade={() => setShowUpgradeModal(true)} />}
         {activeTab === 'specs' && <SpecsSection />}
      </main>
    </div>
  );
};

export default HelpScreen;
