'use client';

import { useState, useEffect } from 'react';
import { CompressionOptions, getRecommendedOptions, formatFileSize, estimateCompressionTime } from '@/lib/compression';
import { Zap, Image, Settings, Play, Loader2, CheckCircle } from 'lucide-react';

interface CompressSettingsProps {
  options: CompressionOptions;
  onOptionsChange: (options: CompressionOptions) => void;
  onCompress: () => void;
  messages: any;
  files?: File[];
  isCompressing?: boolean;
  compressionResults?: {
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  }[];
}

const presets = {
  high: { quality: 0.9, maxSizeMB: 2, maxWidthOrHeight: 2560, format: 'jpg' as const },
  medium: { quality: 0.8, maxSizeMB: 1, maxWidthOrHeight: 1920, format: 'jpg' as const },
  low: { quality: 0.6, maxSizeMB: 0.5, maxWidthOrHeight: 1280, format: 'jpg' as const },
  webp: { quality: 0.8, maxSizeMB: 1, maxWidthOrHeight: 1920, format: 'webp' as const }
};

export default function CompressSettings({ 
  options, 
  onOptionsChange, 
  onCompress,
  messages,
  files = [],
  isCompressing = false,
  compressionResults = []
}: CompressSettingsProps) {
  const [preset, setPreset] = useState<'high' | 'medium' | 'low' | 'webp' | 'custom'>('medium');
  const [isAutoOptimize, setIsAutoOptimize] = useState(true);
  const [estimatedSize, setEstimatedSize] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  const handlePresetChange = (newPreset: 'high' | 'medium' | 'low' | 'webp' | 'custom') => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      onOptionsChange({ ...options, ...presets[newPreset] });
    }
  };

  const handleOptionChange = (key: keyof CompressionOptions, value: number | string | boolean) => {
    onOptionsChange({ ...options, [key]: value });
    setPreset('custom');
  };

  const handleAutoOptimize = () => {
    if (files.length > 0) {
      const recommendedOptions = getRecommendedOptions(files[0], 1);
      onOptionsChange({ ...options, ...recommendedOptions });
      setPreset('custom');
    }
  };

  // Calculate estimated compression results
  useEffect(() => {
    if (files.length > 0) {
      const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      // Estimate compression ratio based on quality and format
      let compressionRatio = 0.3; // Base compression
      compressionRatio += (1 - options.quality) * 0.4; // Quality impact
      
      if (options.format === 'webp') {
        compressionRatio += 0.2; // WebP is more efficient
      } else if (options.format === 'png') {
        compressionRatio -= 0.1; // PNG is less efficient
      }
      
      const estimatedCompressedSize = totalOriginalSize * (1 - compressionRatio);
      setEstimatedSize(estimatedCompressedSize);
      
      // Estimate time
      const avgFileSize = totalOriginalSize / files.length;
      const time = estimateCompressionTime(avgFileSize, options);
      setEstimatedTime(time);
    }
  }, [files, options]);

  const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0);
  const estimatedCompressionRatio = totalOriginalSize > 0 
    ? Math.round(((totalOriginalSize - estimatedSize) / totalOriginalSize) * 100)
    : 0;

  return (
    <div className="bg-bg-light rounded-lg border border-border p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-text-dark mb-6">
        {messages.settings.title}
      </h3>
      
      {/* Mode Toggle */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm font-medium text-text-dark">Modus:</span>
          <div className="flex bg-bg-gray rounded-lg p-1">
            <button
              onClick={() => setIsAutoOptimize(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                isAutoOptimize
                  ? 'bg-gradient-to-r from-pink to-turquoise text-white shadow-soft'
                  : 'text-text-gray hover:text-text-dark'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Auto-Optimieren</span>
            </button>
            <button
              onClick={() => setIsAutoOptimize(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                !isAutoOptimize
                  ? 'bg-gradient-to-r from-pink to-turquoise text-white shadow-soft'
                  : 'text-text-gray hover:text-text-dark'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Manuell</span>
            </button>
          </div>
        </div>
        
        {isAutoOptimize && files.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-purple-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-text-dark">Intelligente Optimierung</span>
            </div>
            <p className="text-xs text-text-gray mb-3">
              Basierend auf deinen {files.length} Bildern werden optimale Einstellungen gewählt.
            </p>
            <button
              onClick={handleAutoOptimize}
              className="px-3 py-1 bg-gradient-to-r from-orange to-purple text-white rounded-md text-xs font-medium hover:from-orange-600 hover:to-purple-600 transition-all duration-200"
            >
              Einstellungen anwenden
            </button>
          </div>
        )}
      </div>

      {/* Manual Settings */}
      {!isAutoOptimize && (
        <div className="space-y-6">
          {/* Quality Slider */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Qualität: {Math.round(options.quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={options.quality}
              onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-text-gray mt-1">
              <span>10% (kleinere Datei)</span>
              <span>100% (bessere Qualität)</span>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Ausgabeformat
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['jpg', 'png', 'webp'] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => handleOptionChange('format', format)}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1
                    ${options.format === format
                      ? 'bg-gradient-to-r from-pink to-turquoise text-white shadow-soft'
                      : 'bg-bg-gray text-text-gray hover:bg-border hover:text-text-dark'
                    }
                  `}
                >
                  <Image className="w-4 h-4" />
                  <span className="uppercase">{format}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-text-gray mt-1">
              {options.format === 'webp' && 'WebP: Beste Komprimierung, moderne Browser'}
              {options.format === 'jpg' && 'JPG: Universell kompatibel, gute Komprimierung'}
              {options.format === 'png' && 'PNG: Verlustfrei, größere Dateien'}
            </p>
          </div>
        </div>
      )}

      {/* Size Estimate */}
      {files.length > 0 && (
        <div className="bg-gradient-to-r from-turquoise-50 to-pink-50 border border-turquoise-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-dark">Größen-Schätzung</span>
            <span className="text-xs text-text-gray">
              ~{Math.round(estimatedTime)}s
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-gray">Original:</span>
              <span className="font-medium">{formatFileSize(totalOriginalSize)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-gray">Geschätzt:</span>
              <span className="font-medium text-turquoise-600">
                {formatFileSize(estimatedSize)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-gray">Ersparnis:</span>
              <span className="font-medium text-success">
                ~{estimatedCompressionRatio}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Compress Button */}
      <div className="space-y-4">
        <button
          onClick={onCompress}
          disabled={files.length === 0 || isCompressing}
          className={`
            w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-soft
            ${files.length === 0 || isCompressing
              ? 'bg-bg-gray text-text-gray cursor-not-allowed'
              : 'bg-gradient-to-r from-pink to-turquoise text-white hover:from-pink-600 hover:to-turquoise-600 hover:shadow-soft-lg'
            }
          `}
        >
          {isCompressing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Komprimiere...</span>
            </>
          ) : compressionResults.length > 0 ? (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Erneut komprimieren</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Jetzt komprimieren</span>
            </>
          )}
        </button>

        {files.length === 0 && (
          <p className="text-center text-sm text-text-gray">
            Lade zuerst Bilder hoch, um zu komprimieren
          </p>
        )}
      </div>

      {/* Results Summary */}
      {compressionResults.length > 0 && !isCompressing && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-text-dark">Komprimierung abgeschlossen</span>
          </div>
          <div className="space-y-2">
            {compressionResults.map((result, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-text-gray">Bild {index + 1}:</span>
                <span className="font-medium text-success">
                  {result.compressionRatio}% kleiner
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
