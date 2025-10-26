'use client';

import { X } from 'lucide-react';

interface CompressionProgressProps {
  progress: Array<{ fileIndex: number; progress: number; status: string }>;
  totalFiles: number;
  onCancel: () => void;
  isCancellable?: boolean;
}

export default function CompressionProgress({ 
  progress, 
  totalFiles, 
  onCancel, 
  isCancellable = true 
}: CompressionProgressProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Komprimierung läuft...</h3>
        {isCancellable && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Abbrechen"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="space-y-3">
        {progress.map((item) => (
          <div key={item.fileIndex}>
            <div className="flex justify-between text-sm mb-1">
              <span>Bild {item.fileIndex + 1} von {totalFiles}</span>
              <span>{item.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-pink to-turquoise h-2 rounded-full transition-all duration-300"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
