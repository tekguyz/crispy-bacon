import React from 'react';
import { COPYRIGHT_YEAR, LAB_NAME } from '../../constants/version';
import { IdentitySection } from './settings/IdentitySection';
import { SmartConfigSection } from './settings/SmartConfigSection';
import { AppearanceSection } from './settings/AppearanceSection';
import { WorkflowSection } from './settings/WorkflowSection';
import { DataManagementSection } from './settings/DataManagementSection';
import { User, Brain, Sliders, Shield } from 'lucide-react';

const SettingsScreen: React.FC = () => {
  return (
    <div className="animate-fade-in pb-40 px-4 md:px-0 max-w-4xl mx-auto">
      <header className="mb-10 pl-1">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tighter uppercase text-on-surface">Settings</h1>
        <p className="text-[10px] font-normal text-on-surface-variant opacity-60 uppercase tracking-[0.2em] mt-1">Personalize your assistant</p>
      </header>

      <div className="space-y-12">
        {/* SECTION: IDENTITY */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 opacity-40">
            <User size={14} strokeWidth={3} />
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.3em]">Account</h2>
          </div>
          <IdentitySection />
        </section>

        {/* SECTION: CONFIG */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 opacity-40">
            <Brain size={14} strokeWidth={3} />
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.3em]">Assistant</h2>
          </div>
          <SmartConfigSection />
        </section>

        {/* SECTION: WORKSPACE */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 opacity-40">
            <Sliders size={14} strokeWidth={3} />
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.3em]">Workspace</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AppearanceSection />
            <WorkflowSection />
          </div>
        </section>

        {/* SECTION: SYSTEM */}
        <section className="space-y-4">
          <div className="flex items-center gap-3 px-1 opacity-40">
            <Shield size={14} strokeWidth={3} />
            <h2 className="text-[10px] font-extrabold uppercase tracking-[0.3em]">Data</h2>
          </div>
          <DataManagementSection />
        </section>

        <footer className="pt-12 flex flex-col items-center gap-4 text-center opacity-20">
           <div className="w-12 h-1 bg-surface-container-highest rounded-full" />
           <p className="text-[8px] font-extrabold tracking-[0.4em] uppercase text-on-surface">
             &copy; {COPYRIGHT_YEAR} {LAB_NAME}
           </p>
        </footer>
      </div>
    </div>
  );
};

export default SettingsScreen;