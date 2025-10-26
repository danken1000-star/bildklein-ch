'use client';

import { useState } from 'react';
import { CompressionOptions } from '@/lib/compression';

interface CompressSettingsProps {
  options: CompressionOptions;
  onOptionsChange: (options: CompressionOptions) => void;
  messages: any;
}

const presets = {
  high: { quality: 0.9, maxSizeMB: 2, maxWidthOrHeight: 2560 },
  medium: { quality: 0.8, maxSizeMB: 1, maxWidthOrHeight: 1920 },
  low: { quality: 0.6, maxSizeMB: 0.5, maxWidthOrHeight: 1280 }
};

export default function CompressSettings({ 
  options, 
  onOptionsChange, 
  messages 
}: CompressSettingsProps) {
  const [preset, setPreset] = useState<'high' | 'medium' | 'low' | 'custom'>('medium');

  const handlePresetChange = (newPreset: 'high' | 'medium' | 'low' | 'custom') => {
    setPreset(newPreset);
    if (newPreset !== 'custom') {
      onOptionsChange({ ...options, ...presets[newPreset] });
    }
  };

  const handleOptionChange = (key: keyof CompressionOptions, value: number) => {
    onOptionsChange({ ...options, [key]: value });
    setPreset('custom');
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {messages.settings.title}
      </h3>
      
      {/* Preset Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {(['high', 'medium', 'low', 'custom'] as const).map((presetKey) => (
          <button
            key={presetKey}
            onClick={() => handlePresetChange(presetKey)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${preset === presetKey
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {messages.settings.presets[presetKey]}
          </button>
        ))}
      </div>

      {/* Quality Slider */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {messages.settings.quality}: {Math.round(options.quality * 100)}%
        </label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={options.quality}
          onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Max Size */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {messages.settings.maxSize}: {options.maxSizeMB}MB
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={options.maxSizeMB}
          onChange={(e) => handleOptionChange('maxSizeMB', parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.1MB</span>
          <span>5MB</span>
        </div>
      </div>

      {/* Max Dimensions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {messages.settings.maxDimensions}: {options.maxWidthOrHeight}px
        </label>
        <input
          type="range"
          min="320"
          max="3840"
          step="160"
          value={options.maxWidthOrHeight}
          onChange={(e) => handleOptionChange('maxWidthOrHeight', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>320px</span>
          <span>3840px</span>
        </div>
      </div>
    </div>
  );
}
