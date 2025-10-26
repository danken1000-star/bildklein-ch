'use client';

import { Upload } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  subMessage?: string;
  icon?: 'upload' | 'image' | 'folder';
}

export default function EmptyState({ message, subMessage, icon = 'upload' }: EmptyStateProps) {
  const iconElement = {
    upload: <Upload className="w-16 h-16 text-gray-400" />,
    image: <Upload className="w-16 h-16 text-gray-400" />,
    folder: <Upload className="w-16 h-16 text-gray-400" />,
  }[icon];

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4">
        {iconElement}
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">{message}</h3>
      {subMessage && <p className="text-gray-500">{subMessage}</p>}
    </div>
  );
}
