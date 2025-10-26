'use client';

import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertTriangle, Image as ImageIcon, Camera, Smartphone, FileImage } from 'lucide-react';

interface MobileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFormats?: string[];
  messages: any;
  showPreviews?: boolean;
  files?: File[];
  setFiles?: (files: File[]) => void;
  isMobile?: boolean;
}

export default function MobileUploader({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 25 * 1024 * 1024, // 25MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  messages,
  showPreviews = true,
  files = [],
  setFiles,
  isMobile = false
}: MobileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(files);
  const [dragCounter, setDragCounter] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    const oversizedFiles: File[] = [];

    files.forEach(file => {
      if (file.size > maxSize) {
        oversizedFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (oversizedFiles.length > 0) {
      alert(`${oversizedFiles.length} Datei(en) sind zu groß (max. ${formatFileSize(maxSize)})`);
    }

    if (validFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...validFiles].slice(0, maxFiles);
      setUploadedFiles(newFiles);
      if (setFiles) {
        setFiles(newFiles);
      }
      onFilesSelected(newFiles);
    }
  }, [uploadedFiles, maxFiles, maxSize, onFilesSelected]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragActive(false);
    setDragCounter(0);
    handleFiles(acceptedFiles);
  }, [handleFiles]);

  const onDragEnter = useCallback(() => {
    setDragCounter(prev => prev + 1);
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragActive(false);
    }
  }, [dragCounter]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    if (setFiles) {
      setFiles(newFiles);
    }
    onFilesSelected(newFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleCameraInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCameraDialog = () => {
    cameraInputRef.current?.click();
  };

  // Fullscreen mode for mobile
  useEffect(() => {
    if (isMobile && isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isFullscreen]);

  const dropzoneProps = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragOver,
    accept: {
      'image/*': acceptedFormats
    },
    multiple: true,
    maxFiles: maxFiles - uploadedFiles.length
  });

  const uploadArea = (
    <div
      {...dropzoneProps.getRootProps()}
      className={`
        relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer
        ${isDragActive 
          ? 'border-turquoise bg-turquoise-50 scale-105' 
          : 'border-border hover:border-turquoise hover:bg-turquoise-50'
        }
        ${isMobile ? 'min-h-[200px]' : 'min-h-[300px]'}
        ${isFullscreen ? 'fixed inset-4 z-50 bg-bg-light' : ''}
      `}
      onClick={openFileDialog}
    >
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        {/* Mobile Camera/Upload Options */}
        {isMobile && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-md">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openCameraDialog();
              }}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-pink to-turquoise text-white rounded-xl font-medium hover:from-pink-600 hover:to-turquoise-600 transition-all duration-200 shadow-soft min-h-[44px]"
            >
              <Camera className="w-5 h-5" />
              <span>Kamera</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                openFileDialog();
              }}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-bg-gray text-text-dark rounded-xl font-medium hover:bg-border transition-all duration-200 min-h-[44px]"
            >
              <FileImage className="w-5 h-5" />
              <span>Galerie</span>
            </button>
          </div>
        )}

        {/* Desktop Upload Area */}
        {!isMobile && (
          <>
            <div className="w-16 h-16 bg-gradient-to-r from-pink to-turquoise rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-text-dark mb-2">
              {messages.dragDrop || 'Bilder hierher ziehen oder klicken'}
            </h3>
            <p className="text-text-gray mb-4">
              {messages.supportedFormats || 'JPG, PNG, WebP bis zu 25MB'}
            </p>
          </>
        )}

        {/* Mobile Upload Area */}
        {isMobile && (
          <>
            <div className="w-12 h-12 bg-gradient-to-r from-pink to-turquoise rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-text-dark mb-2">
              {messages.dragDrop || 'Bilder hochladen'}
            </h3>
            <p className="text-sm text-text-gray mb-4">
              {messages.supportedFormats || 'JPG, PNG, WebP bis zu 25MB'}
            </p>
          </>
        )}

        {/* File Inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraInput}
          className="hidden"
        />
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-bg-light p-4' : ''}`}>
      {/* Fullscreen Toggle for Mobile */}
      {isMobile && !isFullscreen && (
        <button
          onClick={() => setIsFullscreen(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-pink to-turquoise text-white rounded-xl font-medium hover:from-pink-600 hover:to-turquoise-600 transition-all duration-200 shadow-soft min-h-[44px]"
        >
          <Smartphone className="w-5 h-5" />
          <span>Vollbild-Upload</span>
        </button>
      )}

      {/* Close Fullscreen Button */}
      {isFullscreen && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-dark">Bilder hochladen</h2>
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-2 text-text-gray hover:text-text-dark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      {uploadArea}

      {/* File Previews */}
      {showPreviews && uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-text-dark">
            {messages.uploadedImages || 'Hochgeladene Bilder'}
          </h4>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-bg-gray rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => removeFile(index)}
                    className="opacity-0 group-hover:opacity-100 bg-pink-500 text-white rounded-full p-2 hover:bg-pink-600 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-text-dark truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-text-gray">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setUploadedFiles([]);
              if (setFiles) {
                setFiles([]);
              }
              onFilesSelected([]);
            }}
            className="w-full px-4 py-3 bg-bg-gray text-text-gray rounded-xl font-medium hover:bg-border transition-all duration-200 min-h-[44px]"
          >
            {messages.removeAll || 'Alle entfernen'}
          </button>
        </div>
      )}

      {/* File Size Warning */}
      {uploadedFiles.some(file => file.size > maxSize) && (
        <div className="flex items-center space-x-2 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
          <p className="text-sm text-orange-800">
            {messages.fileTooLarge || 'Einige Dateien sind zu groß und wurden nicht hochgeladen.'}
          </p>
        </div>
      )}
    </div>
  );
}
