import React from 'react';

/**
 * HeroStat: Vertical alignment for the Granola specification.
 * Prevents line wrapping by stacking the label under the value.
 */
export const HeroStat = ({ value, label }: { value: string, label: string }) => (
  <div className="flex flex-col gap-0.5 group/stat">
    <span className="text-xl md:text-3xl font-slab font-bold tracking-tighter text-on-surface uppercase leading-none group-hover/stat:text-primary transition-colors">
      {value}
    </span>
    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary leading-none opacity-80">
      {label}
    </span>
  </div>
);