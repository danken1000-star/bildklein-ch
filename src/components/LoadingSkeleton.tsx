'use client';

import { useState, useEffect } from 'react';

interface LoadingSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

export default function LoadingSkeleton({
  className = '',
  width = '100%',
  height = '20px',
  rounded = false,
  animate = true
}: LoadingSkeletonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        bg-gradient-to-r from-bg-gray via-border to-bg-gray
        ${animate ? 'animate-pulse' : ''}
        ${rounded ? 'rounded-full' : 'rounded-lg'}
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        transition-opacity duration-200
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
}

// Predefined skeleton components
export function ImageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <LoadingSkeleton height={200} rounded className="w-full" />
      <div className="space-y-2">
        <LoadingSkeleton width="80%" height={16} />
        <LoadingSkeleton width="60%" height={14} />
      </div>
    </div>
  );
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-bg-light rounded-lg border border-border p-6 shadow-soft ${className}`}>
      <div className="space-y-4">
        <LoadingSkeleton width="60%" height={20} />
        <LoadingSkeleton width="100%" height={16} />
        <LoadingSkeleton width="80%" height={16} />
        <div className="flex space-x-2">
          <LoadingSkeleton width={80} height={32} rounded />
          <LoadingSkeleton width={100} height={32} rounded />
        </div>
      </div>
    </div>
  );
}

export function ProgressSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <LoadingSkeleton width="40%" height={16} />
        <LoadingSkeleton width="60px" height={16} />
      </div>
      <LoadingSkeleton width="100%" height={8} rounded />
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <LoadingSkeleton width={20} height={20} rounded />
            <div className="flex-1 space-y-1">
              <LoadingSkeleton width="70%" height={14} />
              <LoadingSkeleton width="50%" height={12} />
            </div>
            <LoadingSkeleton width={60} height={16} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function UploadSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-2 border-dashed border-border rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoadingSkeleton width={64} height={64} rounded />
          <LoadingSkeleton width="60%" height={20} />
          <LoadingSkeleton width="80%" height={16} />
          <div className="flex space-x-4">
            <LoadingSkeleton width={120} height={44} rounded />
            <LoadingSkeleton width={120} height={44} rounded />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FileListSkeleton({ className = '', count = 3 }: { className?: string; count?: number }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-bg-light rounded-lg border border-border">
          <LoadingSkeleton width={80} height={80} rounded className="flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton width="70%" height={16} />
            <LoadingSkeleton width="50%" height={14} />
            <div className="flex space-x-2">
              <LoadingSkeleton width={60} height={24} rounded />
              <LoadingSkeleton width={40} height={24} rounded />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
