import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-surface-container-low rounded-expressive p-8 md:p-10 border border-outline-variant/10 flex flex-col h-full relative overflow-hidden shadow-sm animate-skeleton-pulse">
      {/* Curved Silhouette cap */}
      <div className="absolute inset-y-0 left-0 w-2 bg-surface-container-highest/20 rounded-l-expressive z-0" />
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-24 skeleton-shimmer" />
            <div className="h-4 w-4 skeleton-shimmer" />
          </div>
          <div className="h-10 w-4/5 skeleton-shimmer rounded-xl" />
        </div>
        <div className="w-12 h-12 skeleton-shimmer rounded-xl" />
      </div>

      <div className="space-y-4 mb-8 relative z-10">
        <div className="h-4 w-full skeleton-shimmer" />
        <div className="h-4 w-full skeleton-shimmer" />
        <div className="h-4 w-3/4 skeleton-shimmer" />
      </div>

      <div className="mt-auto pt-8 border-t border-outline-variant/5 flex flex-col gap-6 relative z-10">
        <div className="flex gap-2.5">
          <div className="h-6 w-20 skeleton-shimmer rounded-xl" />
          <div className="h-6 w-20 skeleton-shimmer rounded-xl" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 w-32 skeleton-shimmer rounded-md" />
          <div className="h-3 w-16 skeleton-shimmer rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;