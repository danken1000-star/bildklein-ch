'use client';

import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, Archive, Plus, Loader2 } from 'lucide-react';

interface DownloadButtonProps {
  files: File[];
  onReset?: () => void;
  messages: {
    download: {
      downloadSingle: string;
      downloadAll: string;
      downloadZip: string;
      compressMore: string;
      preparing: string;
      downloading: string;
    };
  };
  className?: string;
}

export default function DownloadButton({ 
  files, 
  onReset,
  messages, 
  className = '' 
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const generateFileName = (originalFile: File, isCompressed: boolean = true) => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const originalName = originalFile.name.split('.')[0];
    const extension = originalFile.name.split('.').pop() || 'jpg';
    
    if (isCompressed) {
      return `bildklein-${originalName}.${extension}`;
    }
    return originalFile.name;
  };

  const downloadSingle = (file: File) => {
    setDownloadingFile(file.name);
    const fileName = generateFileName(file);
    saveAs(file, fileName);
    setTimeout(() => setDownloadingFile(null), 1000);
  };

  const downloadAllAsZip = async () => {
    setIsDownloading(true);
    const zip = new JSZip();
    const timestamp = new Date().toISOString().slice(0, 10);

    // Add all files to ZIP with renamed filenames
    for (const file of files) {
      const fileName = generateFileName(file);
      zip.file(fileName, file);
    }

    try {
      const content = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 6
        }
      });
      
      const zipFileName = `bildklein-batch-${timestamp}.zip`;
      saveAs(content, zipFileName);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Primary Download Actions */}
      <div className="space-y-3">
        {files.length === 1 ? (
          // Single file download
          <button
            onClick={() => downloadSingle(files[0])}
            disabled={isDownloading || downloadingFile === files[0].name}
            className="
              w-full flex items-center justify-center space-x-2 px-6 py-3 
              bg-gradient-to-r from-pink to-turquoise text-white rounded-lg font-medium
              hover:from-pink-600 hover:to-turquoise-600 transition-all duration-200 shadow-soft
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {downloadingFile === files[0].name ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{messages.download.downloading}</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>{messages.download.downloadSingle}</span>
              </>
            )}
          </button>
        ) : (
          // Multiple files - ZIP download
          <button
            onClick={downloadAllAsZip}
            disabled={isDownloading}
            className="
              w-full flex items-center justify-center space-x-2 px-6 py-3 
              bg-gradient-to-r from-pink to-turquoise text-white rounded-lg font-medium
              hover:from-pink-600 hover:to-turquoise-600 transition-all duration-200 shadow-soft
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{messages.download.preparing}</span>
              </>
            ) : (
              <>
                <Archive className="w-5 h-5" />
                <span>{messages.download.downloadZip}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Individual file downloads (for multiple files) */}
      {files.length > 1 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-dark text-center">
            Oder einzeln herunterladen:
          </h4>
          <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => downloadSingle(file)}
                disabled={isDownloading || downloadingFile === file.name}
                className="
                  flex items-center justify-between px-3 py-2 
                  bg-bg-gray text-text-gray rounded-md text-sm
                  hover:bg-border hover:text-text-dark transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                <span className="truncate flex-1 text-left" title={file.name}>
                  {generateFileName(file)}
                </span>
                {downloadingFile === file.name ? (
                  <Loader2 className="w-4 h-4 animate-spin ml-2 flex-shrink-0" />
                ) : (
                  <Download className="w-4 h-4 ml-2 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset/Compress More Button */}
      {onReset && (
        <div className="pt-4 border-t border-border">
          <button
            onClick={onReset}
            className="
              w-full flex items-center justify-center space-x-2 px-4 py-2 
              bg-bg-gray text-text-gray rounded-lg font-medium
              hover:bg-border hover:text-text-dark transition-colors duration-200
            "
          >
            <Plus className="w-4 h-4" />
            <span>{messages.download.compressMore}</span>
          </button>
        </div>
      )}

      {/* File Info */}
      <div className="text-center text-xs text-text-gray">
        {files.length === 1 ? (
          <p>Datei wird als "{generateFileName(files[0])}" heruntergeladen</p>
        ) : (
          <p>
            {files.length} Dateien werden als ZIP-Archiv heruntergeladen
          </p>
        )}
      </div>
    </div>
  );
}