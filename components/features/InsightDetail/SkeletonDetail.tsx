
import React from 'react';

const SkeletonDetail: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-background animate-fade-in overflow-hidden">
      {/* Header Skeleton */}
      <header className="px-6 md:px-10 py-5 border-b border-outline-variant/10 bg-surface-container-low flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-3 w-20 bg-surface-container-highest rounded-md shimmer" />
          <div className="h-8 w-64 bg-surface-container-highest rounded-xl shimmer" />
        </div>
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-xl bg-surface-container-highest shimmer" />
          <div className="w-10 h-10 rounded-xl bg-surface-container-highest shimmer" />
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-hidden p-6 md:p-16 lg:p-24">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Summary Block */}
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-4xl p-10 md:p-14 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest shimmer" />
              <div className="h-6 w-32 bg-surface-container-highest rounded-lg shimmer" />
            </div>
            <div className="space-y-4">
              <div className="h-5 w-full bg-surface-container-highest rounded-lg shimmer" />
              <div className="h-5 w-full bg-surface-container-highest rounded-lg shimmer" />
              <div className="h-5 w-4/5 bg-surface-container-highest rounded-lg shimmer" />
            </div>
          </div>

          {/* Grid Takeaways */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-surface-container-low p-10 rounded-4xl border border-outline-variant/10 flex gap-6">
                <div className="w-10 h-10 rounded-xl bg-surface-container-highest shrink-0 shimmer" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-full bg-surface-container-highest rounded-lg shimmer" />
                  <div className="h-4 w-2/3 bg-surface-container-highest rounded-lg shimmer" />
                </div>
              </div>
            ))}
          </div>

          {/* Tasks Block */}
          <div className="bg-surface-container-highest/10 rounded-4xl p-10 border border-outline-variant/10 space-y-8">
            <div className="h-8 w-48 bg-surface-container-highest rounded-xl shimmer" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 w-full bg-background rounded-3xl border border-outline-variant/10 shimmer" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDetail;
