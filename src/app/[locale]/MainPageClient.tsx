'use client';

import { useState } from 'react';
import { 
  batchCompress, 
  defaultOptions, 
  CompressionOptions, 
  CompressionProgress as CompressionProgressType,
  getImageDimensions,
  formatFileSize,
  calculateCompressionRatio
} from '@/lib/compression';
import Uploader from '@/components/Uploader';
import CompressSettings from '@/components/CompressSettings';
import ImagePreview from '@/components/ImagePreview';
import DownloadButton from '@/components/DownloadButton';
import CompressionProgress from '@/components/CompressionProgress';

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
  const [compressionProgress, setCompressionProgress] = useState<CompressionProgressType[]>([]);
  const [compressionError, setCompressionError] = useState<string | null>(null);
  const [compressionResults, setCompressionResults] = useState<{
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
  }[]>([]);

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setCompressedImages([]);
    setCompressionResults([]);
    setCompressionError(null);
  };

  const handleReset = () => {
    setFiles([]);
    setCompressedImages([]);
    setCompressionResults([]);
    setCompressionError(null);
    setCompressionProgress([]);
  };

  const handleOptionsChange = (newOptions: CompressionOptions) => {
    setCompressionOptions(newOptions);
  };

  const handleCompress = async () => {
    if (files.length === 0) return;
    
    setIsCompressing(true);
    setCompressionError(null);
    setCompressionProgress([]);
    
    try {
      const compressedResults = await batchCompress(
        files, 
        compressionOptions,
        (progress) => {
          setCompressionProgress(prev => {
            const newProgress = [...prev];
            newProgress[progress.fileIndex] = progress;
            return newProgress;
          });
        }
      );
      
      // Create compressed images array
      const results = files.map((original, index) => ({
        original,
        compressed: compressedResults[index] || original
      }));
      
      setCompressedImages(results);
      
      // Calculate compression results for display
      const resultsData = results.map(({ original, compressed }) => ({
        originalSize: original.size,
        compressedSize: compressed.size,
        compressionRatio: calculateCompressionRatio(original.size, compressed.size)
      }));
      setCompressionResults(resultsData);
    } catch (error) {
      console.error('Compression failed:', error);
      setCompressionError(error instanceof Error ? error.message : 'Komprimierung fehlgeschlagen');
    } finally {
      setIsCompressing(false);
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
              onCompress={handleCompress}
              messages={messages.settings}
              files={files}
              isCompressing={isCompressing}
              compressionResults={compressionResults}
            />
        </div>
      )}

      {/* Loading State */}
      {isCompressing && (
        <div className="max-w-4xl mx-auto">
          <CompressionProgress 
            progress={compressionProgress}
            totalFiles={files.length}
          />
        </div>
      )}

      {/* Error State */}
      {compressionError && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-pink-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-pink-800">{compressionError}</p>
            </div>
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
                onRecompress={handleCompress}
                messages={messages}
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
              onReset={handleReset}
              messages={messages.download}
            />
          </div>
        </div>
      )}
    </div>
  );
}
