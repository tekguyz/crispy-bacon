
import React from 'react';
import { COPYRIGHT_YEAR, LAB_NAME } from '../../../constants/version';
import { IdentitySection } from './IdentitySection';
import { SmartConfigSection } from './SmartConfigSection';
import { InterfaceSection } from './InterfaceSection';
import { IntegrationsSection } from './IntegrationsSection';
import { DataManagementSection } from './DataManagementSection';
import { ActivityLog } from './ActivityLog';
import { Brain, Sliders, Shield, User, HardDrive } from 'lucide-react';

const SettingsScreen: React.FC = () => {
  return (
    <div className="animate-fade-in pb-40 px-4 md:px-0 max-w-4xl mx-auto">
      <header className="mb-10 pl-1 border-l-4 border-primary py-2 px-6">
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tighter uppercase text-on-surface leading-none italic">Preferences</h1>
        <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.4em] mt-3">Settings</p>
      </header>

      <div className="space-y-12">
        {/* SECTION 1: ACCOUNT */}
        <section className="space-y-4">
           <div className="flex items-center gap-3 px-1 opacity-40">
              <User size={14} strokeWidth={3} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Account</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <IdentitySection />
              <IntegrationsSection />
           </div>
        </section>

        {/* SECTION 2: ASSISTANT */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 opacity-40">
            <Brain size={14} strokeWidth={3} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Assistant</h2>
          </div>
          <SmartConfigSection />
        </section>

        {/* SECTION 3: INTERFACE */}
        <section className="space-y-4">
           <div className="flex items-center gap-3 px-1 opacity-40">
             <Sliders size={14} strokeWidth={3} />
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Interface</h2>
           </div>
           <InterfaceSection />
        </section>

        {/* SECTION 4: DATA */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 opacity-40">
            <HardDrive size={14} strokeWidth={3} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Data & Storage</h2>
          </div>
          <DataManagementSection />
        </section>

        {/* SECTION 5: ACTIVITY */}
        <section className="space-y-4 pt-8 border-t border-outline-variant/10">
           <ActivityLog />
        </section>

        <footer className="pt-12 flex flex-col items-center gap-6 text-center opacity-20">
           <div className="h-px w-24 bg-surface-container-highest rounded-full" />
           <p className="text-[9px] font-black tracking-[0.5em] uppercase text-on-surface">
             &copy; {COPYRIGHT_YEAR} {LAB_NAME}
           </p>
        </footer>
      </div>
    </div>
  );
};

export default SettingsScreen;
