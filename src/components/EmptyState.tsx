'use client';

import { Image, Upload, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  icon?: 'upload' | 'image' | 'sparkles';
}

export default function EmptyState({ 
  message = 'Noch keine Bilder hochgeladen',
  subMessage = 'Ziehe Bilder hierher oder klicke zum Auswählen',
  icon = 'upload'
}: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case 'image':
        return <Image className="w-16 h-16 text-text-gray" />;
      case 'sparkles':
        return <Sparkles className="w-16 h-16 text-text-gray" />;
      default:
        return <Upload className="w-16 h-16 text-text-gray" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-32 h-32 bg-gradient-to-br from-pink-50 to-turquoise-50 rounded-full flex items-center justify-center mb-6">
        {getIcon()}
      </div>
      <h3 className="text-xl font-semibold text-text-dark mb-2">
        {message}
      </h3>
      <p className="text-text-gray max-w-md">
        {subMessage}
      </p>
    </div>
  );
}
