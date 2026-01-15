
import React from 'react';
import { COPYRIGHT_YEAR, LAB_NAME } from '../../constants/version';
import { IdentitySection } from './settings/IdentitySection';
import { SmartConfigSection } from './settings/SmartConfigSection';
import { AppearanceSection } from './settings/AppearanceSection';
import { WorkflowSection } from './settings/WorkflowSection';
import { IntegrationsSection } from './settings/IntegrationsSection';
import { DataManagementSection } from './settings/DataManagementSection';
import { SystemLogViewer } from './settings/SystemLogViewer';
import { Brain, Sliders, Shield, User } from 'lucide-react';

const SettingsScreen: React.FC = () => {
  return (
    <div className="animate-fade-in pb-40 px-4 md:px-0 max-w-5xl mx-auto">
      <header className="mb-12 pl-1 border-l-4 border-primary py-2 px-6">
        <h1 className="text-4xl md:text-5xl font-black font-display tracking-tighter uppercase text-on-surface leading-none italic">Preferences</h1>
        <p className="text-[10px] font-bold text-on-surface-variant opacity-40 uppercase tracking-[0.4em] mt-3">Personalization, Privacy & Infrastructure</p>
      </header>

      <div className="space-y-16">
        {/* SECTION: IDENTITY & CONNECTIONS */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-1 opacity-40">
              <User size={14} strokeWidth={3} />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Account & Bridges</h2>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IdentitySection />
              <IntegrationsSection />
           </div>
        </div>

        {/* SECTION: INTELLIGENCE ENGINE */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1 opacity-40">
            <Brain size={14} strokeWidth={3} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Intelligence Engine</h2>
          </div>
          <SmartConfigSection />
        </div>

        {/* SECTION: WORKSPACE LOOK */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-1 opacity-40">
             <Sliders size={14} strokeWidth={3} />
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Workspace Controls</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AppearanceSection />
              <WorkflowSection />
           </div>
        </div>

        {/* SECTION: SYSTEM OPS */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1 opacity-40">
            <Shield size={14} strokeWidth={3} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Data Maintenance</h2>
          </div>
          <div className="space-y-6">
             <DataManagementSection />
             <SystemLogViewer />
          </div>
        </div>

        <footer className="pt-24 flex flex-col items-center gap-6 text-center opacity-20">
           <div className="h-px w-24 bg-surface-container-highest rounded-full" />
           <p className="text-[9px] font-black tracking-[0.5em] uppercase text-on-surface">
             &copy; {COPYRIGHT_YEAR} {LAB_NAME} LABORATORIES :: ARCHITECT CORE
           </p>
        </footer>
      </div>
    </div>
  );
};

export default SettingsScreen;
