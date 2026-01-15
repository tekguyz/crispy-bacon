import React from 'react';

interface DashboardHeaderProps {
  totalNotes: number;
  pendingTasks: number;
  isPro: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ totalNotes, pendingTasks, isPro }) => {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/10 pb-2">
      <div className="space-y-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[8px] font-extrabold uppercase tracking-[0.3em] text-primary">Library</span>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface uppercase leading-none truncate tracking-tighter">
          Recent <span className="text-primary">Notes</span>
        </h2>
      </div>
      
      <div className="bg-surface-container-high/40 border border-outline-variant/10 rounded-xl px-4 py-2 flex items-center gap-5 shadow-sm shrink-0 mb-1">
         <div className="flex flex-col">
            <span className="text-[7px] font-extrabold uppercase tracking-widest text-on-surface-variant opacity-40 leading-none mb-0.5">Vault Status</span>
            <span className="text-xs font-extrabold text-on-surface tracking-tight uppercase whitespace-nowrap">
                {totalNotes} ITEMS • {pendingTasks} OPEN
            </span>
         </div>
         {isPro && (
           <div className="flex items-center gap-2 pl-4 border-l border-outline-variant/20">
              <span className="px-2 py-0.5 bg-primary text-on-primary rounded-[4px] text-[7px] font-extrabold uppercase tracking-widest">EXECUTIVE</span>
           </div>
         )}
      </div>
    </section>
  );
};