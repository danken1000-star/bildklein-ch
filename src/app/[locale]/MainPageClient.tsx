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
import MobileUploader from '@/components/MobileUploader';
import CompressSettings from '@/components/CompressSettings';
import ImagePreview from '@/components/ImagePreview';
import DownloadButton from '@/components/DownloadButton';
import CompressionProgress from '@/components/CompressionProgress';
import MobileBottomSheet from '@/components/MobileBottomSheet';
import LoadingSkeleton, { UploadSkeleton, ProgressSkeleton } from '@/components/LoadingSkeleton';
import { useMobile, useTouchDevice } from '@/hooks/useMobile';
import { Settings } from 'lucide-react';

interface CompressedImage {
  original: File;
  compressed: File;
}

interface MainPageClientProps {
  messages: any;
}

export default function MainPageClient({ messages }: MainPageClientProps) {
  const { isMobile, isTablet } = useMobile();
  const isTouchDevice = useTouchDevice();
  
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
  const [isLoading, setIsLoading] = useState(false);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);

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
        {isMobile ? (
          <MobileUploader 
            onFilesSelected={handleFilesSelected} 
            messages={messages.uploader}
            files={files}
            setFiles={setFiles}
            isMobile={isMobile}
          />
        ) : (
          <Uploader
            onFilesSelected={handleFilesSelected}
            messages={messages.upload}
          />
        )}
      </div>

      {/* Settings Section */}
      {files.length > 0 && (
        <div className="max-w-4xl mx-auto">
          {isMobile ? (
            <>
              {/* Mobile Settings Button */}
              <div className="mb-4">
                <button
                  onClick={() => setShowSettingsSheet(true)}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-pink to-turquoise text-white rounded-xl font-medium hover:from-pink-600 hover:to-turquoise-600 transition-all duration-200 shadow-soft min-h-[44px]"
                >
                  <Settings className="w-5 h-5" />
                  <span>Einstellungen</span>
                </button>
              </div>
              
              {/* Mobile Bottom Sheet */}
              <MobileBottomSheet
                isOpen={showSettingsSheet}
                onClose={() => setShowSettingsSheet(false)}
                title="Komprimierungseinstellungen"
              >
                <div className="p-6">
                  <CompressSettings
                    options={compressionOptions}
                    onOptionsChange={handleOptionsChange}
                    onCompress={() => {
                      handleCompress();
                      setShowSettingsSheet(false);
                    }}
                    messages={messages.settings}
                    files={files}
                    isCompressing={isCompressing}
                    compressionResults={compressionResults}
                  />
                </div>
              </MobileBottomSheet>
            </>
          ) : (
            <CompressSettings
              options={compressionOptions}
              onOptionsChange={handleOptionsChange}
              onCompress={handleCompress}
              messages={messages.settings}
              files={files}
              isCompressing={isCompressing}
              compressionResults={compressionResults}
            />
          )}
        </div>
      )}

      {/* Loading State */}
      {isCompressing && (
        <div className="max-w-4xl mx-auto">
          {isMobile ? (
            <div className="bg-bg-light rounded-lg border border-border p-4 shadow-soft">
              <ProgressSkeleton />
            </div>
          ) : (
            <CompressionProgress 
              progress={compressionProgress}
              totalFiles={files.length}
            />
          )}
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
        <div className={`space-y-6 ${isMobile ? 'px-4' : ''}`}>
          {compressedImages.map((image, index) => (
            <div key={index} className={`${isMobile ? 'w-full' : 'max-w-6xl mx-auto'}`}>
              <ImagePreview
                originalFile={image.original}
                compressedFile={image.compressed}
                onRecompress={handleCompress}
                messages={messages}
                isMobile={isMobile}
              />
            </div>
          ))}
        </div>
      )}

      {/* Download Section */}
      {compressedFiles.length > 0 && !isCompressing && (
        <div className="max-w-4xl mx-auto">
          <div className={`bg-bg-light rounded-lg border border-border shadow-soft ${isMobile ? 'p-4' : 'p-6'}`}>
            <h3 className={`font-semibold text-text-dark ${isMobile ? 'text-base mb-3' : 'text-lg mb-4'}`}>
              {messages.download.title}
            </h3>
            <DownloadButton
              files={compressedFiles}
              onReset={handleReset}
              messages={messages.download}
              isMobile={isMobile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
