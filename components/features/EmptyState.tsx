
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: 'default' | 'filtered' | 'expressive';
  iconColorClass?: string;
  animationClass?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  variant = 'expressive',
  iconColorClass = 'text-primary',
  animationClass = 'animate-bounce-gentle'
}) => {
  const displayTitle = (title === "Awaiting strategic signals." || title === "Ready for your first summary.") ? "Ready for notes." : title;
  const displayDescription = (description === "Initialize ingestion to begin distillation." || description === "Capture a meeting, upload a document, or paste a link to get started.")
    ? "Add a note or link to get started." 
    : description;

  if (variant === 'filtered') {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center animate-fade-in px-4">
        <div className="w-20 h-20 rounded-[2rem] bg-surface-container-high text-primary flex items-center justify-center mb-8 border border-outline-variant/10 shadow-inner relative">
           <div className="absolute inset-0 ledger-grid opacity-[0.05]" />
           <Icon size={28} strokeWidth={2.5} className="relative z-10 icon-tactical" />
        </div>
        <h3 className="text-xl font-slab font-bold text-on-surface mb-3 tracking-tight uppercase">{displayTitle}</h3>
        <p className="text-on-surface-variant text-[13px] max-w-[280px] mb-8 opacity-60 font-bold leading-relaxed">{displayDescription}</p>
        {action}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] text-center animate-fade-in px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 ledger-grid opacity-[0.03] pointer-events-none" />

      <div className="relative mb-12 group">
        <div className="absolute -inset-16 bg-primary/10 blur-[100px] rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse" />
        
        <div className="relative w-40 h-40 md:w-56 md:h-56 bg-card rounded-[3rem] md:rounded-[4rem] border-4 border-outline-variant/10 flex items-center justify-center shadow-2xl shadow-black/5 transition-all duration-700 group-hover:scale-[1.02] group-hover:border-primary/20 overflow-hidden">
          <div className="absolute inset-0 ledger-grid opacity-[0.04]" />
          <div className={`${animationClass} relative z-10`}>
            <Icon 
              className={`${iconColorClass} opacity-60 filter drop-shadow-[0_12px_24px_rgba(var(--primary-rgb),0.2)] w-16 h-16 md:w-24 md:h-24 icon-tactical`} 
            />
          </div>
        </div>
      </div>
      
      <h3 className="text-4xl md:text-7xl font-slab font-bold text-on-surface mb-6 tracking-tighter max-w-2xl leading-[0.9] uppercase text-balance relative z-10">
        {displayTitle}
      </h3>
      
      <p className="text-lg md:text-2xl max-w-sm md:max-w-md leading-relaxed mb-12 opacity-50 font-serif font-medium text-on-surface relative z-10">
        {displayDescription}
      </p>
      
      {action && (
        <div className="animate-slide-up relative z-10">
          {action}
        </div>
      )}

      <style>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EmptyState;
