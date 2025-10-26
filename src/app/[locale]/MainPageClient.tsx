'use client';

import { useState } from 'react';
import { compressImage, defaultOptions, CompressionOptions } from '@/lib/compression';
import Uploader from '@/components/Uploader';
import CompressSettings from '@/components/CompressSettings';
import ImagePreview from '@/components/ImagePreview';
import DownloadButton from '@/components/DownloadButton';

interface CompressedImage {
  original: File;
  compressed: File;
}

interface MainPageClientProps {
  messages: any;
}

export default function MainPageClient({ messages }: MainPageClientProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([]);
  const [compressionOptions, setCompressionOptions] = useState<CompressionOptions>(defaultOptions);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setIsCompressing(true);
    
    try {
      const compressedResults = await Promise.all(
        selectedFiles.map(async (file) => {
          const compressed = await compressImage(file, compressionOptions);
          return { original: file, compressed };
        })
      );
      
      setCompressedImages(compressedResults);
    } catch (error) {
      console.error('Compression failed:', error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleOptionsChange = async (newOptions: CompressionOptions) => {
    setCompressionOptions(newOptions);
    
    if (files.length > 0) {
      setIsCompressing(true);
      try {
        const compressedResults = await Promise.all(
          files.map(async (file) => {
            const compressed = await compressImage(file, newOptions);
            return { original: file, compressed };
          })
        );
        setCompressedImages(compressedResults);
      } catch (error) {
        console.error('Recompression failed:', error);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const compressedFiles = compressedImages.map(img => img.compressed);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-dark mb-4">
          {messages.title}
        </h1>
        <p className="text-xl text-text-gray max-w-2xl mx-auto">
          {messages.description}
        </p>
      </div>

      {/* Upload Section */}
      <div className="max-w-4xl mx-auto">
        <Uploader
          onFilesSelected={handleFilesSelected}
          messages={messages.upload}
        />
      </div>

      {/* Settings Section */}
      {files.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <CompressSettings
            options={compressionOptions}
            onOptionsChange={handleOptionsChange}
            messages={messages.settings}
          />
        </div>
      )}

      {/* Loading State */}
      {isCompressing && (
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-turquoise-100 text-turquoise-800 rounded-lg">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-turquoise-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Komprimiere Bilder...
          </div>
        </div>
      )}

      {/* Preview Section */}
      {compressedImages.length > 0 && !isCompressing && (
        <div className="space-y-6">
          {compressedImages.map((image, index) => (
            <div key={index} className="max-w-6xl mx-auto">
              <ImagePreview
                originalFile={image.original}
                compressedFile={image.compressed}
                messages={messages.preview}
              />
            </div>
          ))}
        </div>
      )}

      {/* Download Section */}
      {compressedFiles.length > 0 && !isCompressing && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-bg-light rounded-lg border border-border p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-text-dark mb-4">
              {messages.download.title}
            </h3>
            <DownloadButton
              files={compressedFiles}
              messages={messages.download}
            />
          </div>
        </div>
      )}
    </div>
  );
}
