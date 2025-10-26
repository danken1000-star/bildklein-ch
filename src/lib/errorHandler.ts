export interface ErrorInfo {
  type: 'file_too_large' | 'unsupported_format' | 'compression_failed' | 'browser_not_supported' | 'network_error' | 'unknown' | 'duplicate_file' | 'large_image';
  message: string;
  details?: string;
  retryable?: boolean;
}

export interface WarningInfo {
  type: 'large_image' | 'offline_mode' | 'slow_connection';
  message: string;
  details?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorMessages: Record<string, string> = {
    file_too_large: 'Datei zu groß. Maximum: 25MB',
    unsupported_format: 'Format nicht unterstützt. Nur JPG, PNG, WebP',
    compression_failed: 'Komprimierung fehlgeschlagen. Bitte erneut versuchen.',
    browser_not_supported: 'Bitte nutze einen modernen Browser (Chrome, Firefox, Safari)',
    network_error: 'Netzwerkfehler. Bitte überprüfe deine Internetverbindung.',
    duplicate_file: 'Datei bereits hochgeladen',
    large_image: 'Große Bilder können länger dauern',
    unknown: 'Ein unbekannter Fehler ist aufgetreten.'
  };

  private warningMessages: Record<string, string> = {
    large_image: 'Große Bilder können länger dauern',
    offline_mode: 'Offline - Komprimierung funktioniert trotzdem!',
    slow_connection: 'Langsame Verbindung erkannt'
  };

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  validateFile(file: File): ErrorInfo | null {
    // Check file size (25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > maxSize) {
      return {
        type: 'file_too_large',
        message: this.errorMessages.file_too_large,
        details: `Aktuelle Größe: ${this.formatFileSize(file.size)}`,
        retryable: false
      };
    }

    // Check file format
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedTypes.includes(file.type)) {
      return {
        type: 'unsupported_format',
        message: this.errorMessages.unsupported_format,
        details: `Erkanntes Format: ${file.type || 'Unbekannt'}`,
        retryable: false
      };
    }

    return null;
  }

  checkForLargeImage(file: File): WarningInfo | null {
    // Consider image large if > 10MB or > 10MP (estimate)
    const largeSizeThreshold = 10 * 1024 * 1024; // 10MB
    if (file.size > largeSizeThreshold) {
      return {
        type: 'large_image',
        message: this.warningMessages.large_image,
        details: `Bildgröße: ${this.formatFileSize(file.size)}`
      };
    }
    return null;
  }

  checkOfflineMode(): WarningInfo | null {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        type: 'offline_mode',
        message: this.warningMessages.offline_mode,
        details: 'Alle Funktionen arbeiten im Offline-Modus'
      };
    }
    return null;
  }

  checkForDuplicate(existingFiles: File[], newFile: File): boolean {
    return existingFiles.some(file => 
      file.name === newFile.name && 
      file.size === newFile.size &&
      file.lastModified === newFile.lastModified
    );
  }

  validateBrowserSupport(): ErrorInfo | null {
    // Only check in browser environment, not during SSR
    if (typeof window === 'undefined') {
      return null;
    }

    // Check for required APIs
    const missingAPIs: string[] = [];

    // Check FileReader
    if (typeof FileReader === 'undefined') {
      missingAPIs.push('FileReader');
    }

    // Check Blob
    if (typeof Blob === 'undefined') {
      missingAPIs.push('Blob');
    }

    // Check URL.createObjectURL
    if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
      missingAPIs.push('URL.createObjectURL');
    }

    // Check Canvas API
    if (typeof HTMLCanvasElement === 'undefined') {
      missingAPIs.push('Canvas');
    } else {
      const canvas = document.createElement('canvas');
      if (!canvas.getContext('2d')) {
        missingAPIs.push('Canvas2D');
      }
    }

    // Check for Web Workers support
    if (typeof Worker === 'undefined') {
      missingAPIs.push('Web Workers');
    }

    if (missingAPIs.length > 0) {
      return {
        type: 'browser_not_supported',
        message: this.errorMessages.browser_not_supported,
        details: `Fehlende APIs: ${missingAPIs.join(', ')}`,
        retryable: false
      };
    }

    return null;
  }

  handleCompressionError(error: Error): ErrorInfo {
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        type: 'network_error',
        message: this.errorMessages.network_error,
        details: error.message,
        retryable: true
      };
    }

    if (errorMessage.includes('memory') || errorMessage.includes('quota')) {
      return {
        type: 'compression_failed',
        message: 'Nicht genügend Speicher. Bitte wähle kleinere Bilder.',
        details: error.message,
        retryable: true
      };
    }

    if (errorMessage.includes('format') || errorMessage.includes('decode')) {
      return {
        type: 'compression_failed',
        message: 'Bildformat konnte nicht verarbeitet werden.',
        details: error.message,
        retryable: true
      };
    }

    return {
      type: 'compression_failed',
      message: this.errorMessages.compression_failed,
      details: error.message,
      retryable: true
    };
  }

  handleGenericError(error: unknown): ErrorInfo {
    if (error instanceof Error) {
      return {
        type: 'unknown',
        message: this.errorMessages.unknown,
        details: error.message,
        retryable: true
      };
    }

    return {
      type: 'unknown',
      message: this.errorMessages.unknown,
      details: 'Unbekannter Fehlertyp',
      retryable: true
    };
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getErrorMessage(type: string): string {
    return this.errorMessages[type] || this.errorMessages.unknown;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();
