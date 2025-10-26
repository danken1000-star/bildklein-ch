'use client';

import { useState } from 'react';
import { CompressionOptions, getRecommendedOptions } from '@/lib/compression';
import { Zap, Image, Settings } from 'lucide-react';

interface CompressSettingsProps {
  options: CompressionOptions;
  onOptionsChange: (options: CompressionOptions) => void;
  messages: any;
  files?: File[];
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
  messages,
  files = []
}: CompressSettingsProps) {
  const [preset, setPreset] = useState<'high' | 'medium' | 'low' | 'webp' | 'custom'>('medium');

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
      const avgFileSize = files.reduce((sum, file) => sum + file.size, 0) / files.length;
      const recommendedOptions = getRecommendedOptions(files[0], 1);
      onOptionsChange({ ...options, ...recommendedOptions });
      setPreset('custom');
    }
  };

  return (
    <div className="bg-bg-light rounded-lg border border-border p-6 shadow-soft">
      <h3 className="text-lg font-semibold text-text-dark mb-4">
        {messages.settings.title}
      </h3>
      
      {/* Preset Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {(['high', 'medium', 'low', 'webp', 'custom'] as const).map((presetKey) => (
          <button
            key={presetKey}
            onClick={() => handlePresetChange(presetKey)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-1
              ${preset === presetKey
                ? 'bg-gradient-to-r from-pink to-turquoise text-white shadow-soft'
                : 'bg-bg-gray text-text-gray hover:bg-border hover:text-text-dark'
              }
            `}
          >
            {presetKey === 'webp' && <Image className="w-4 h-4" />}
            {presetKey === 'custom' && <Settings className="w-4 h-4" />}
            <span>{messages.settings.presets[presetKey]}</span>
          </button>
        ))}
      </div>

      {/* Auto Optimize Button */}
      {files.length > 0 && (
        <div className="mb-6">
          <button
            onClick={handleAutoOptimize}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange to-purple text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-purple-600 transition-all duration-200 shadow-soft"
          >
            <Zap className="w-4 h-4" />
            <span>Auto-Optimieren</span>
          </button>
          <p className="text-xs text-text-gray mt-1">
            Automatische Einstellungen basierend auf deinen Bildern
          </p>
        </div>
      )}

      {/* Quality Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-dark mb-2">
          {messages.settings.quality}: {Math.round(options.quality * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={options.quality}
          onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-text-gray mt-1">
          <span>10%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Max Size */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-dark mb-2">
          {messages.settings.maxSize}: {options.maxSizeMB}MB
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={options.maxSizeMB}
          onChange={(e) => handleOptionChange('maxSizeMB', parseFloat(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-text-gray mt-1">
          <span>0.1MB</span>
          <span>5MB</span>
        </div>
      </div>

      {/* Max Dimensions */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-dark mb-2">
          {messages.settings.maxDimensions}: {options.maxWidthOrHeight}px
        </label>
        <input
          type="range"
          min="320"
          max="3840"
          step="160"
          value={options.maxWidthOrHeight}
          onChange={(e) => handleOptionChange('maxWidthOrHeight', parseInt(e.target.value))}
          className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-text-gray mt-1">
          <span>320px</span>
          <span>3840px</span>
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
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
          WebP bietet die beste Komprimierung, JPG ist am kompatibelsten
        </p>
      </div>

      {/* Advanced Options */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-4 h-4 text-text-gray" />
          <span className="text-sm font-medium text-text-dark">Erweiterte Optionen</span>
        </div>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.useWebWorker}
              onChange={(e) => handleOptionChange('useWebWorker', e.target.checked)}
              className="w-4 h-4 text-turquoise-600 bg-bg-gray border-border rounded focus:ring-turquoise-500"
            />
            <span className="text-sm text-text-dark">Web Worker verwenden (schneller)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
