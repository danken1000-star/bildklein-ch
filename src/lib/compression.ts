import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  quality: number;
  format?: 'jpg' | 'png' | 'webp';
  initialQuality?: number;
}

export interface CompressionProgress {
  fileIndex: number;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'compressing' | 'completed' | 'error';
  error?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export const defaultOptions: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  quality: 0.8,
  format: 'jpg',
  initialQuality: 0.8,
};

export const supportedFormats = ['jpg', 'jpeg', 'png', 'webp'] as const;
export type SupportedFormat = typeof supportedFormats[number];

/**
 * Compress a single image file
 */
export async function compressImage(
  file: File,
  options: Partial<CompressionOptions> = {}
): Promise<File> {
  const compressionOptions = { ...defaultOptions, ...options };
  
  try {
    // Validate file type
    if (!isValidImageFile(file)) {
      throw new Error('Unsupported file format. Please use JPG, PNG, or WebP images.');
    }

    // Convert quality from 0-100 to 0-1 if needed
    const quality = compressionOptions.quality > 1 
      ? compressionOptions.quality / 100 
      : compressionOptions.quality;

    const compressionConfig = {
      maxSizeMB: compressionOptions.maxSizeMB,
      maxWidthOrHeight: compressionOptions.maxWidthOrHeight,
      useWebWorker: compressionOptions.useWebWorker,
      initialQuality: quality,
      alwaysKeepResolution: false,
    };

    const compressedFile = await imageCompression(file, compressionConfig);
    
    // Apply format conversion if specified
    if (compressionOptions.format && compressionOptions.format !== getFileFormat(file)) {
      return await formatConversion(compressedFile, compressionOptions.format);
    }

    return compressedFile;
  } catch (error) {
    console.error('Compression failed:', error);
    throw new Error(`Bildkomprimierung fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}

/**
 * Compress multiple files in parallel with progress tracking
 */
export async function batchCompress(
  files: File[],
  options: Partial<CompressionOptions> = {},
  onProgress?: (progress: CompressionProgress) => void
): Promise<File[]> {
  const compressionOptions = { ...defaultOptions, ...options };
  const errors: Error[] = [];

  // Initialize progress for all files
  files.forEach((file, index) => {
    onProgress?.({
      fileIndex: index,
      fileName: file.name,
      progress: 0,
      status: 'pending'
    });
  });

  // Process files in parallel with progress tracking
  const compressionPromises = files.map(async (file, index) => {
    try {
      onProgress?.({
        fileIndex: index,
        fileName: file.name,
        progress: 0,
        status: 'compressing'
      });

      const compressedFile = await compressImage(file, compressionOptions);
      
      onProgress?.({
        fileIndex: index,
        fileName: file.name,
        progress: 100,
        status: 'completed'
      });

      return compressedFile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      
      onProgress?.({
        fileIndex: index,
        fileName: file.name,
        progress: 0,
        status: 'error',
        error: errorMessage
      });

      errors.push(new Error(`Fehler bei ${file.name}: ${errorMessage}`));
      return null;
    }
  });

  const results = await Promise.all(compressionPromises);
  const validResults = results.filter((file): file is File => file !== null);

  if (errors.length > 0 && validResults.length === 0) {
    throw new Error(`Alle Komprimierungen fehlgeschlagen: ${errors.map(e => e.message).join(', ')}`);
  }

  if (errors.length > 0) {
    console.warn(`${errors.length} Datei(en) konnten nicht komprimiert werden:`, errors);
  }

  return validResults;
}

/**
 * Get image dimensions without loading the full image
 */
export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image to get dimensions'));
    };

    img.src = url;
  });
}

/**
 * Convert image format using canvas API
 */
export async function formatConversion(
  file: File, 
  targetFormat: 'jpg' | 'png' | 'webp'
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // Set canvas dimensions
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert to target format
        const mimeType = getMimeType(targetFormat);
        const quality = targetFormat === 'jpg' ? 0.9 : undefined;

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            
            if (!blob) {
              reject(new Error('Failed to convert image format'));
              return;
            }

            // Create new file with target format
            const newFileName = file.name.replace(/\.[^/.]+$/, `.${targetFormat}`);
            const newFile = new File([blob], newFileName, {
              type: mimeType,
              lastModified: Date.now()
            });

            resolve(newFile);
          },
          mimeType,
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(new Error(`Format conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image for format conversion'));
    };

    img.src = url;
  });
}

/**
 * Utility function to format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Calculate compression ratio percentage
 */
export function calculateCompressionRatio(originalSize: number, compressedSize: number): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * Get file format from file name or MIME type
 */
export function getFileFormat(file: File): SupportedFormat {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type.split('/')[1];

  if (extension && supportedFormats.includes(extension as SupportedFormat)) {
    return extension as SupportedFormat;
  }

  if (mimeType && supportedFormats.includes(mimeType as SupportedFormat)) {
    return mimeType as SupportedFormat;
  }

  return 'jpg'; // Default fallback
}

/**
 * Validate if file is a supported image format
 */
export function isValidImageFile(file: File): boolean {
  const format = getFileFormat(file);
  return supportedFormats.includes(format);
}

/**
 * Get MIME type for target format
 */
function getMimeType(format: 'jpg' | 'png' | 'webp'): string {
  const mimeTypes = {
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
  };
  return mimeTypes[format];
}

/**
 * Estimate compression time based on file size and options
 */
export function estimateCompressionTime(fileSize: number, options: CompressionOptions): number {
  // Rough estimation: 1MB per second for compression
  const baseTime = fileSize / (1024 * 1024); // seconds
  const qualityFactor = options.quality > 0.8 ? 1.2 : 1; // Higher quality takes longer
  const workerFactor = options.useWebWorker ? 0.8 : 1.2; // Web workers are faster
  
  return Math.max(0.5, baseTime * qualityFactor * workerFactor); // Minimum 0.5 seconds
}

/**
 * Get recommended compression options based on file size and dimensions
 */
export function getRecommendedOptions(file: File, targetSizeMB: number = 1): Partial<CompressionOptions> {
  const fileSizeMB = file.size / (1024 * 1024);
  
  // If file is already small enough, minimal compression
  if (fileSizeMB <= targetSizeMB) {
    return {
      quality: 0.9,
      maxSizeMB: targetSizeMB,
      maxWidthOrHeight: 1920
    };
  }

  // Calculate quality based on file size
  const compressionRatio = targetSizeMB / fileSizeMB;
  const quality = Math.max(0.3, Math.min(0.9, compressionRatio));

  // Calculate max dimensions based on file size
  const maxDimensions = fileSizeMB > 10 ? 1920 : fileSizeMB > 5 ? 2560 : 3840;

  return {
    quality,
    maxSizeMB: targetSizeMB,
    maxWidthOrHeight: maxDimensions,
    useWebWorker: true
  };
}
