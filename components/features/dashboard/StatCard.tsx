import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subValue?: string;
  isLoading?: boolean;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  subValue, 
  isLoading = false,
  className = '' 
}) => {
  return (
    <div className={`p-3 bg-surface-container-high/40 border border-outline-variant/10 rounded-xl flex flex-col justify-between transition-all duration-300 hover:border-primary/40 group/stat shadow-sm active:scale-[0.98] ${className}`}>
       <div className="flex items-center gap-2 opacity-40 group-hover/stat:opacity-100 transition-opacity">
          <Icon size={12} strokeWidth={3} className="text-primary" />
          <p className="text-[8px] font-black uppercase tracking-[0.15em] text-on-surface leading-none">
            {label}
          </p>
       </div>
       
       <div className="flex items-baseline gap-1 mt-2 min-h-[1.2rem]">
          {isLoading ? (
            <div className="h-5 w-12 bg-surface-container-highest rounded shimmer opacity-20" />
          ) : (
            <>
              <p className="text-xl font-mono font-black tracking-tighter leading-none text-on-surface">
                {value}
              </p>
              {subValue && (
                <span className="text-[8px] font-bold text-on-surface-variant opacity-20 uppercase tracking-widest leading-none shrink-0">
                  {subValue}
                </span>
              )}
            </>
          )}
       </div>
    </div>
  );
};

export default React.memo(StatCard);