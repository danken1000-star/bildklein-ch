'use client';

import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { errorHandler } from '@/lib/errorHandler';
import { useToast } from '@/hooks/useToast';

interface UploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFormats?: string[];
  messages: any;
  showPreviews?: boolean;
  existingFiles?: File[];
}

export default function Uploader({
  onFilesSelected,
  maxFiles = 10,
  maxSize = 25 * 1024 * 1024, // 25MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  messages,
  showPreviews = true,
  existingFiles = []
}: UploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(existingFiles);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showError, showSuccess, showWarning } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = useCallback((files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check for offline mode
    const offlineWarning = errorHandler.checkOfflineMode();
    if (offlineWarning) {
      showWarning(offlineWarning.message, offlineWarning.details);
    }

    files.forEach(file => {
      // Check for duplicate files
      if (errorHandler.checkForDuplicate(uploadedFiles, file)) {
        showError({
          type: 'duplicate_file',
          message: 'Datei bereits hochgeladen',
          details: file.name,
          retryable: false
        });
        errors.push(file.name);
        return;
      }

      // Validate file using error handler
      const error = errorHandler.validateFile(file);
      
      if (error) {
        showError(error);
        errors.push(file.name);
      } else {
        // Check for large images
        const largeImageWarning = errorHandler.checkForLargeImage(file);
        if (largeImageWarning) {
          showWarning(largeImageWarning.message, largeImageWarning.details);
        }
        validFiles.push(file);
      }
    });

    // Show summary if there were errors
    if (errors.length > 0) {
      showWarning(
        `${errors.length} Datei(en) konnten nicht hochgeladen werden`,
        `Fehlerhafte Dateien: ${errors.join(', ')}`
      );
    }

    // Add valid files
    if (validFiles.length > 0) {
      const newFiles = [...uploadedFiles, ...validFiles].slice(0, maxFiles);
      setUploadedFiles(newFiles);
      onFilesSelected(newFiles);
      
      showSuccess(
        `${validFiles.length} Datei(en) erfolgreich hochgeladen`,
        validFiles.length > 1 ? 'Bereit zur Komprimierung' : undefined
      );
    }
  }, [uploadedFiles, maxFiles, onFilesSelected, showError, showSuccess, showWarning]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFiles(acceptedFiles);
    setIsDragActive(false);
    setDragCounter(0);
  }, [handleFiles]);

  const onDragEnter = useCallback(() => {
    setDragCounter(prev => prev + 1);
    if (dragCounter === 0) {
      setIsDragActive(true);
    }
  }, [dragCounter]);

  const onDragLeave = useCallback(() => {
    setDragCounter(prev => prev - 1);
    if (dragCounter === 1) {
      setIsDragActive(false);
    }
  }, [dragCounter]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    onDragOver,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles,
    maxSize,
    multiple: true,
    noClick: true,
    noKeyboard: true
  });

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const isFileOversized = (file: File) => file.size > maxSize;

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        onClick={handleClick}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-turquoise bg-gradient-to-br from-turquoise-50 to-pink-50 scale-105 shadow-soft-lg' 
            : isDragReject 
              ? 'border-pink-300 bg-pink-50' 
              : 'border-border hover:border-turquoise hover:bg-gradient-to-br hover:from-bg-light hover:to-turquoise-50 hover:shadow-soft'
          }
        `}
      >
        <input 
          {...getInputProps()} 
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp"
        />
        
        <div className="space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-pink-100 to-turquoise-100 rounded-full flex items-center justify-center">
            <Upload className="w-10 h-10 text-turquoise-600" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-text-dark mb-2">
              {messages?.upload?.title || 'Bilder hochladen'}
            </h3>
            <p className="text-lg text-text-gray mb-4">
              {messages?.upload?.subtitle || 'Ziehe Bilder hierher oder klicke zum Auswählen'}
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink to-turquoise text-white rounded-full text-sm font-medium">
              Dateien auswählen
            </div>
          </div>
          
          <div className="text-sm text-text-gray space-y-1">
            <p>{messages?.upload?.supportedFormats || 'Unterstützte Formate: JPG, PNG, WebP'}</p>
            <p>Max. {formatFileSize(maxSize)} pro Bild</p>
            <p>Bis zu {maxFiles} Bilder gleichzeitig</p>
          </div>
        </div>
      </div>

      {/* File Previews */}
      {showPreviews && uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-text-dark">
            Hochgeladene Bilder ({uploadedFiles.length})
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative bg-bg-light rounded-xl border border-border p-4 shadow-soft hover:shadow-soft-lg transition-all duration-200"
              >
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* File Info */}
                <div className="space-y-3">
                  {/* Thumbnail */}
                  <div className="aspect-square bg-bg-gray rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File Details */}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-text-dark truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-text-gray">
                      {formatFileSize(file.size)}
                    </p>
                    
                    {/* Warning for oversized files */}
                    {isFileOversized(file) && (
                      <div className="flex items-center space-x-1 text-xs text-pink-600">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Zu groß</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear All Button */}
          {uploadedFiles.length > 1 && (
            <div className="text-center">
              <button
                onClick={() => {
                  setUploadedFiles([]);
                  onFilesSelected([]);
                }}
                className="px-4 py-2 text-sm text-text-gray hover:text-pink-600 transition-colors"
              >
                Alle entfernen
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}