import React from 'react';
import { formatFileSize, calculateCompressionRatio } from '@/lib/compression';
import { ArrowRight, Download, RotateCcw, CheckCircle, TrendingDown } from 'lucide-react';

interface ImagePreviewProps {
  originalFile: File;
  compressedFile: File;
  onRecompress?: () => void;
  messages: {
    preview: {
      title: string;
      original: string;
      compressed: string;
      size: string;
      dimensions: string;
      savings: string;
      recompress: string;
      download: string;
      before: string;
      after: string;
    };
  };
}

export default function ImagePreview({ 
  originalFile, 
  compressedFile, 
  onRecompress,
  messages 
}: ImagePreviewProps) {
  const originalSize = originalFile.size;
  const compressedSize = compressedFile.size;
  const savings = calculateCompressionRatio(originalSize, compressedSize);
  const savedBytes = originalSize - compressedSize;
  const isSignificantSavings = savings > 50;

  return (
    <div className="bg-bg-light rounded-lg border border-border p-6 shadow-soft hover:shadow-soft-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-dark">
          {messages.preview.title}
        </h3>
        {onRecompress && (
          <button
            onClick={onRecompress}
            className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-orange to-purple text-white rounded-md text-sm font-medium hover:from-orange-600 hover:to-purple-600 transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{messages.preview.recompress}</span>
          </button>
        )}
      </div>

      {/* Before/After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Original Image */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
            <h4 className="font-medium text-text-dark">{messages.preview.before}</h4>
          </div>
          
          <div className="aspect-square bg-bg-gray rounded-lg overflow-hidden border-2 border-pink-200">
            <img
              src={URL.createObjectURL(originalFile)}
              alt="Original"
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-gray">{messages.preview.size}:</span>
              <span className="font-semibold text-text-dark">{formatFileSize(originalSize)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-gray">Datei:</span>
              <span className="text-sm text-text-dark truncate max-w-32" title={originalFile.name}>
                {originalFile.name}
              </span>
            </div>
          </div>
        </div>

        {/* Arrow Indicator */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-50 to-turquoise-50 rounded-full p-3">
            <ArrowRight className="w-6 h-6 text-turquoise-600" />
          </div>
        </div>

        {/* Compressed Image */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-turquoise-500 rounded-full"></div>
            <h4 className="font-medium text-text-dark">{messages.preview.after}</h4>
            {isSignificantSavings && (
              <span className="text-lg">🎉</span>
            )}
          </div>
          
          <div className="aspect-square bg-bg-gray rounded-lg overflow-hidden border-2 border-turquoise-200">
            <img
              src={URL.createObjectURL(compressedFile)}
              alt="Compressed"
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-gray">{messages.preview.size}:</span>
              <span className="font-semibold text-turquoise-600">{formatFileSize(compressedSize)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-gray">Datei:</span>
              <span className="text-sm text-text-dark truncate max-w-32" title={compressedFile.name}>
                {compressedFile.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Arrow */}
      <div className="lg:hidden flex justify-center mb-6">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-50 to-turquoise-50 rounded-full p-2">
          <ArrowRight className="w-5 h-5 text-turquoise-600 rotate-90" />
        </div>
      </div>

      {/* Savings Summary */}
      <div className="bg-gradient-to-r from-turquoise-50 to-pink-50 border border-turquoise-200 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingDown className="w-5 h-5 text-success" />
          <span className="font-semibold text-text-dark">Komprimierungs-Ergebnis</span>
          {isSignificantSavings && (
            <span className="text-lg">🎉</span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-text-gray mb-1">Original</p>
            <p className="text-lg font-bold text-text-dark">
              {formatFileSize(originalSize)}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-text-gray mb-1">Komprimiert</p>
            <p className="text-lg font-bold text-turquoise-600">
              {formatFileSize(compressedSize)}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-text-gray mb-1">Ersparnis</p>
            <div className="flex items-center justify-center space-x-1">
              <p className={`text-lg font-bold ${savings > 0 ? 'text-success' : 'text-pink-600'}`}>
                {savings > 0 ? '-' : '+'}{Math.abs(savings)}%
              </p>
              {isSignificantSavings && (
                <span className="text-lg">🎉</span>
              )}
            </div>
            <p className="text-xs text-text-gray">
              {formatFileSize(savedBytes)} gespart
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(compressedFile);
            link.download = compressedFile.name;
            link.click();
          }}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink to-turquoise text-white rounded-lg font-medium hover:from-pink-600 hover:to-turquoise-600 transition-all duration-200 shadow-soft"
        >
          <Download className="w-4 h-4" />
          <span>{messages.preview.download}</span>
        </button>
        
        {onRecompress && (
          <button
            onClick={onRecompress}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-bg-gray text-text-gray rounded-lg font-medium hover:bg-border hover:text-text-dark transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Andere Einstellungen</span>
          </button>
        )}
      </div>

      {/* Success Message for Significant Savings */}
      {isSignificantSavings && (
        <div className="mt-4 p-3 bg-gradient-to-r from-success-50 to-turquoise-50 border border-success-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success-800">
              Großartig! Du hast über 50% der Dateigröße eingespart! 🎉
            </span>
          </div>
        </div>
      )}
    </div>
  );
}