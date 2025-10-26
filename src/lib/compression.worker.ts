import imageCompression from 'browser-image-compression';

// Web Worker Message Types
interface CompressionMessage {
  type: 'COMPRESS_IMAGE';
  payload: {
    file: File;
    options: CompressionOptions;
    fileIndex: number;
  };
}

interface ProgressMessage {
  type: 'PROGRESS_UPDATE';
  payload: {
    fileIndex: number;
    fileName: string;
    progress: number;
    status: 'pending' | 'compressing' | 'completed' | 'error';
    error?: string;
  };
}

interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  quality: number;
  format?: 'jpg' | 'png' | 'webp';
  initialQuality?: number;
}

// Convert File to ArrayBuffer for Web Worker
async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

// Convert ArrayBuffer back to File
function arrayBufferToFile(buffer: ArrayBuffer, fileName: string, mimeType: string): File {
  const blob = new Blob([buffer], { type: mimeType });
  return new File([blob], fileName, { type: mimeType });
}

// Get MIME type for target format
function getMimeType(format: 'jpg' | 'png' | 'webp'): string {
  const mimeTypes = {
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
  };
  return mimeTypes[format];
}

// Format conversion using Canvas API
async function formatConversion(
  buffer: ArrayBuffer,
  fileName: string,
  targetFormat: 'jpg' | 'png' | 'webp'
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([buffer]);
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const url = URL.createObjectURL(blob);

    img.onload = () => {
      try {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        const mimeType = getMimeType(targetFormat);
        const quality = targetFormat === 'jpg' ? 0.9 : undefined;

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            
            if (!blob) {
              reject(new Error('Failed to convert image format'));
              return;
            }

            blob.arrayBuffer().then(resolve).catch(reject);
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

// Main compression function
async function compressImage(
  file: File,
  options: CompressionOptions,
  fileIndex: number,
  onProgress: (message: ProgressMessage) => void
): Promise<ArrayBuffer> {
  try {
    // Send initial progress
    onProgress({
      type: 'PROGRESS_UPDATE',
      payload: {
        fileIndex,
        fileName: file.name,
        progress: 0,
        status: 'compressing'
      }
    });

    // Convert File to ArrayBuffer for Web Worker
    const fileBuffer = await fileToArrayBuffer(file);
    
    // Create a temporary File object for imageCompression
    const tempFile = new File([fileBuffer], file.name, { type: file.type });

    // Simulate progress updates during compression
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress < 90) {
        onProgress({
          type: 'PROGRESS_UPDATE',
          payload: {
            fileIndex,
            fileName: file.name,
            progress: Math.min(progress, 90),
            status: 'compressing'
          }
        });
      }
    }, 100);

    // Compress the image
    const compressionConfig = {
      maxSizeMB: options.maxSizeMB,
      maxWidthOrHeight: options.maxWidthOrHeight,
      useWebWorker: false, // We're already in a Web Worker
      initialQuality: options.quality,
      alwaysKeepResolution: false,
    };

    const compressedFile = await imageCompression(tempFile, compressionConfig);
    
    clearInterval(progressInterval);

    // Convert compressed file to ArrayBuffer
    const compressedBuffer = await fileToArrayBuffer(compressedFile);

    // Apply format conversion if needed
    let finalBuffer = compressedBuffer;
    if (options.format && options.format !== getFileFormat(file)) {
      finalBuffer = await formatConversion(compressedBuffer, file.name, options.format);
    }

    // Send completion progress
    onProgress({
      type: 'PROGRESS_UPDATE',
      payload: {
        fileIndex,
        fileName: file.name,
        progress: 100,
        status: 'completed'
      }
    });

    return finalBuffer;
  } catch (error) {
    onProgress({
      type: 'PROGRESS_UPDATE',
      payload: {
        fileIndex,
        fileName: file.name,
        progress: 0,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
    throw error;
  }
}

// Get file format from file name or MIME type
function getFileFormat(file: File): 'jpg' | 'png' | 'webp' {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type.split('/')[1];

  if (extension === 'webp' || mimeType === 'webp') return 'webp';
  if (extension === 'png' || mimeType === 'png') return 'png';
  return 'jpg';
}

// Web Worker message handler
self.onmessage = async function(e: MessageEvent<CompressionMessage>) {
  const { type, payload } = e.data;

  if (type === 'COMPRESS_IMAGE') {
    const { file, options, fileIndex } = payload;

    try {
      const compressedBuffer = await compressImage(
        file,
        options,
        fileIndex,
        (message) => {
          self.postMessage(message);
        }
      );

      // Send the compressed file back to main thread
      self.postMessage({
        type: 'COMPRESSION_COMPLETE',
        payload: {
          fileIndex,
          fileName: file.name,
          compressedBuffer,
          originalSize: file.size,
          compressedSize: compressedBuffer.byteLength
        }
      });
    } catch (error) {
      self.postMessage({
        type: 'COMPRESSION_ERROR',
        payload: {
          fileIndex,
          fileName: file.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
    }
  }
};

// Export types for main thread
export type { CompressionMessage, ProgressMessage, CompressionOptions };

