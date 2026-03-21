import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** Base skeleton element with pulse animation */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

/** Skeleton for a single line of text */
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

/** Skeleton for a stat/metric card */
export const SkeletonStatBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-6 bg-white shadow-sm rounded-xl ${className}`}>
    <Skeleton className="w-1/2 h-5 mb-4" />
    <Skeleton className="w-20 h-10 mb-2" />
    <Skeleton className="w-3/4 h-4" />
  </div>
);

/** Skeleton for a content card with title, text, and optional button */
export const SkeletonCard: React.FC<{ className?: string; hasButton?: boolean }> = ({ className = '', hasButton = false }) => (
  <div className={`p-6 bg-white shadow-sm rounded-xl ${className}`}>
    <Skeleton className="w-2/3 h-5 mb-4" />
    <SkeletonText lines={3} />
    {hasButton && <Skeleton className="w-32 h-10 mt-4" />}
  </div>
);

/** Skeleton for a list of items (e.g. activities) */
export const SkeletonList: React.FC<{ rows?: number; className?: string }> = ({ rows = 4, className = '' }) => (
  <div className={`bg-white shadow-sm rounded-xl overflow-hidden ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className={`p-4 ${i < rows - 1 ? 'border-b border-gray-100' : ''}`}>
        <Skeleton className="w-1/3 h-4 mb-2" />
        <Skeleton className="w-2/3 h-3" />
      </div>
    ))}
  </div>
);

/** Skeleton for a table row */
export const SkeletonTableRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-6 py-4">
        <Skeleton className="w-full h-4" />
      </td>
    ))}
  </tr>
);

/** Full dashboard skeleton layout */
export const DashboardSkeleton: React.FC = () => (
  <div>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <SkeletonStatBox />
      <SkeletonStatBox />
      <SkeletonStatBox />
    </div>
    <div className="mt-8">
      <Skeleton className="w-48 h-7 mb-4" />
      <SkeletonList rows={4} />
    </div>
    <div className="mt-8">
      <Skeleton className="w-56 h-7 mb-4" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard hasButton />
        <SkeletonCard hasButton />
        <SkeletonCard hasButton />
      </div>
    </div>
  </div>
);

/** Progress page skeleton layout */
export const ProgressSkeleton: React.FC = () => (
  <div>
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
      <SkeletonStatBox />
      <SkeletonStatBox />
      <SkeletonStatBox />
    </div>
    <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <Skeleton className="w-48 h-5 mb-4" />
        <Skeleton className="w-full h-64" />
      </div>
      <div className="p-6 bg-white shadow-sm rounded-xl">
        <Skeleton className="w-48 h-5 mb-4" />
        <Skeleton className="w-full h-64" />
      </div>
    </div>
  </div>
);

/** Vocabulary page skeleton layout */
export const VocabularySkeleton: React.FC = () => (
  <div>
    <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
      <Skeleton className="w-48 h-6 mb-6" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <Skeleton className="w-24 h-5 mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-24 h-8 rounded-full" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="w-16 h-5 mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-32 h-8 rounded-full" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="w-24 h-5 mb-3" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-28 h-8 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="p-6 text-center">
        <Skeleton className="w-32 h-4 mx-auto mb-6" />
        <Skeleton className="w-48 h-10 mx-auto mb-3" />
        <Skeleton className="w-32 h-4 mx-auto mb-4" />
        <Skeleton className="w-24 h-4 mx-auto mb-8" />
        <div className="flex justify-between">
          <Skeleton className="w-24 h-10" />
          <Skeleton className="w-24 h-10" />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;
