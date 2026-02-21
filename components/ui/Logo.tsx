import React from 'react';

/**
 * Abstract Focus Mark: Stylized brackets with a negative space spark.
 */
export const FocusMark = ({ className = "w-8 h-8" }: { className?: string }) => (
  <div className={`${className} text-primary relative flex items-center justify-center shrink-0`}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" aria-hidden="true">
      {/* Left Shard */}
      <path 
        d="M8 5L4 9V15L8 19" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="square" 
      />
      {/* Right Shard */}
      <path 
        d="M16 5L20 9V15L16 19" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="square" 
      />
      {/* Central Spark / The Point */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  </div>
);

/**
 * BaconBrand: Modern Archive aesthetic. Perfectly upright Slab Serif.
 */
export const BaconBrand = ({ expanded = true, className = "" }: { expanded?: boolean; className?: string }) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <FocusMark className="w-8 h-8 md:w-9 md:h-9" />
      {expanded && (
        <span className="font-slab font-bold text-xl md:text-2xl tracking-tight text-on-surface uppercase leading-none">
          Crispy <span className="text-primary">Bacon</span>
        </span>
      )}
    </div>
  );
};

export const BaconLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <FocusMark className={className} />
);

export const GeminiLiveIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path 
      d="M12 3C12 3 13 10.5 21 12C13 13.5 12 21 12 21C12 21 11 13.5 3 12C11 10.5 12 3 12 3Z" 
      fill="currentColor"
    />
  </svg>
);