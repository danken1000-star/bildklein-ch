'use client';

import { useState } from 'react';

interface DownloadButtonProps {
  files: File[];
  messages: any;
  className?: string;
}

export default function DownloadButton({ 
  files, 
  messages, 
  className = '' 
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    setIsDownloading(true);
    
    try {
      // Download all files with a small delay to prevent browser blocking
      for (let i = 0; i < files.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        downloadFile(files[i]);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadSingle = (file: File) => {
    downloadFile(file);
  };

  if (files.length === 0) {
    return null;
  }

  if (files.length === 1) {
    return (
      <button
        onClick={() => downloadSingle(files[0])}
        className={`
          w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium
          hover:bg-red-700 transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {messages.download.downloadSingle}
      </button>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <button
        onClick={downloadAll}
        disabled={isDownloading}
        className="
          w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium
          hover:bg-red-700 transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {isDownloading ? messages.download.preparing : messages.download.downloadAll}
      </button>
      
      <div className="grid grid-cols-1 gap-2">
        {files.map((file, index) => (
          <button
            key={index}
            onClick={() => downloadSingle(file)}
            className="
              w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm
              hover:bg-gray-200 transition-colors duration-200
            "
          >
            {file.name}
          </button>
        ))}
      </div>
    </div>
  );
}
