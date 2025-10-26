'use client';

import { useState, useEffect } from 'react';
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
import EmptyState from '@/components/EmptyState';
import { useMobile, useTouchDevice } from '@/hooks/useMobile';
import { initializeAnalytics } from '@/lib/analytics';
import { Settings } from 'lucide-react';
import { errorHandler } from '@/lib/errorHandler';
import { useToast } from '@/hooks/useToast';
import { getFileFormat } from '@/lib/compression';
import { trackCompression, getTotalImagesCompressed } from '@/lib/analytics';

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
  const [isCancelled, setIsCancelled] = useState(false);
  const [totalCompressed, setTotalCompressed] = useState(0);
  const { showError, showSuccess, showLoading, updateLoading } = useToast();

  // Initialize analytics on mount
  useEffect(() => {
    initializeAnalytics();
    setTotalCompressed(getTotalImagesCompressed());
  }, []);

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
    setIsCancelled(false);
  };

  const handleCancel = () => {
    setIsCancelled(true);
    setIsCompressing(false);
    setCompressionProgress([]);
    showError({
      type: 'compression_failed',
      message: 'Komprimierung abgebrochen',
      details: 'Die Komprimierung wurde vom Benutzer abgebrochen',
      retryable: true
    });
  };

  const handleOptionsChange = (newOptions: CompressionOptions) => {
    setCompressionOptions(newOptions);
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    // Check browser support first
    const browserError = errorHandler.validateBrowserSupport();
    if (browserError) {
      showError(browserError);
      return;
    }

    setIsCompressing(true);
    setCompressionError(null);
    setCompressionProgress([]);

    // Show loading toast
    const loadingToastId = showLoading('Komprimiere Bilder...');

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

      // Track analytics
      results.forEach(({ original, compressed }) => {
        const format = getFileFormat(original);
        trackCompression(original.size, compressed.size, format);
      });
      setTotalCompressed(getTotalImagesCompressed());

      // Update loading toast to success
      updateLoading(loadingToastId, 'Komprimierung erfolgreich abgeschlossen!', 'success');
      
      // Show success message
      const totalSavings = resultsData.reduce((sum, result) => sum + result.compressionRatio, 0) / resultsData.length;
      showSuccess(
        `${files.length} Bild(er) erfolgreich komprimiert`,
        `Durchschnittliche Ersparnis: ${Math.round(totalSavings)}%`
      );

    } catch (error) {
      console.error('Compression failed:', error);
      
      // Handle error with error handler
      const errorInfo = errorHandler.handleCompressionError(error instanceof Error ? error : new Error('Unknown error'));
      setCompressionError(errorInfo.message);
      
      // Update loading toast to error
      updateLoading(loadingToastId, errorInfo.message, 'error');
      
      // Show error toast
      showError(errorInfo);
    } finally {
      setIsCompressing(false);
    }
  };

  const compressedFiles = compressedImages.map(img => img.compressed);

  // Show empty state if no files
  if (files.length === 0 && !isCompressing) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-text-dark mb-4 leading-tight">
            {messages?.hero?.headline || "Bilder verkleinern"}
          </h1>
          <p className="text-xl text-text-gray mb-8">
            {messages?.hero?.subheadline || "Schnell, sicher, Swiss-made"}
          </p>
        </div>

        {/* Empty State */}
        <div className="max-w-4xl mx-auto">
          <EmptyState
            message="Noch keine Bilder hochgeladen"
            subMessage="Ziehe Bilder hierher oder klicke zum Auswählen. Unterstützte Formate: JPG, PNG, WebP"
            icon="upload"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-dark mb-4">
          {messages?.hero?.headline || "Bilder verkleinern"}
        </h1>
        <p className="text-xl text-text-gray max-w-2xl mx-auto mb-6">
          {messages?.hero?.subheadline || "Schnell, sicher, Swiss-made"}
        </p>
        
        {/* Analytics Counter */}
        {totalCompressed > 0 && (
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-turquoise-50 to-pink-50 border border-turquoise-200 rounded-full">
            <span className="text-2xl">🎉</span>
            <span className="text-sm font-medium text-text-dark">
              Über <span className="font-bold text-turquoise-600">{totalCompressed}</span> Bilder komprimiert
            </span>
          </div>
        )}
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
              onCancel={handleCancel}
              isCancellable={true}
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
