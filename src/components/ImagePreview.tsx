'use client';

import { formatFileSize, calculateCompressionRatio } from '@/lib/compression';

interface ImagePreviewProps {
  originalFile: File;
  compressedFile: File;
  messages: any;
}

export default function ImagePreview({ 
  originalFile, 
  compressedFile, 
  messages 
}: ImagePreviewProps) {
  const originalSize = originalFile.size;
  const compressedSize = compressedFile.size;
  const savings = calculateCompressionRatio(originalSize, compressedSize);

  return (
    <div className="bg-bg-light rounded-lg border border-border p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-text-dark mb-4">
        {messages.preview.title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-dark">{messages.preview.original}</h4>
          <div className="aspect-square bg-bg-gray rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(originalFile)}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-sm text-text-gray space-y-1">
            <p><span className="font-medium">{messages.preview.size}:</span> {formatFileSize(originalSize)}</p>
            <p><span className="font-medium">{messages.preview.dimensions}:</span> {originalFile.name}</p>
          </div>
        </div>

        {/* Compressed Image */}
        <div className="space-y-3">
          <h4 className="font-medium text-text-dark">{messages.preview.compressed}</h4>
          <div className="aspect-square bg-bg-gray rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(compressedFile)}
              alt="Compressed"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-sm text-text-gray space-y-1">
            <p><span className="font-medium">{messages.preview.size}:</span> {formatFileSize(compressedSize)}</p>
            <p><span className="font-medium">{messages.preview.savings}:</span> 
              <span className={`ml-1 font-semibold ${savings > 0 ? 'text-success' : 'text-pink-600'}`}>
                {savings > 0 ? '-' : '+'}{Math.abs(savings)}%
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Stats */}
      <div className="mt-6 p-4 bg-bg-gray rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-text-gray">{messages.preview.size}</p>
            <p className="text-lg font-semibold text-text-dark">
              {formatFileSize(originalSize)} → {formatFileSize(compressedSize)}
            </p>
          </div>
          <div>
            <p className="text-sm text-text-gray">{messages.preview.savings}</p>
            <p className={`text-lg font-semibold ${savings > 0 ? 'text-success' : 'text-pink-600'}`}>
              {savings > 0 ? '-' : '+'}{Math.abs(savings)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-text-gray">Ersparnis</p>
            <p className="text-lg font-semibold text-success">
              {formatFileSize(originalSize - compressedSize)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
