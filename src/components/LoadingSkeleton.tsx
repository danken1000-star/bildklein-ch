'use client';

export function UploadSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-2xl"></div>
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-2 bg-gray-200 rounded"></div>
    </div>
  );
}

export default function LoadingSkeleton() {
  return <UploadSkeleton />;
}
