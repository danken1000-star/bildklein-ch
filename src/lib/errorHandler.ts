export interface ErrorInfo {
  type: 'file_too_large' | 'unsupported_format' | 'compression_failed' | 'browser_not_supported' | 'network_error' | 'unknown';
  message: string;
  details?: string;
  retryable?: boolean;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorMessages: Record<string, string> = {
    file_too_large: 'Datei zu groß. Maximum: 25MB',
    unsupported_format: 'Format nicht unterstützt. Nur JPG, PNG, WebP',
    compression_failed: 'Komprimierung fehlgeschlagen. Bitte erneut versuchen.',
    browser_not_supported: 'Bitte nutze einen modernen Browser (Chrome, Firefox, Safari)',
    network_error: 'Netzwerkfehler. Bitte überprüfe deine Internetverbindung.',
    unknown: 'Ein unbekannter Fehler ist aufgetreten.'
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

  validateBrowserSupport(): ErrorInfo | null {
    // Check for required APIs
    const requiredAPIs = [
      'FileReader',
      'CanvasRenderingContext2D',
      'Blob',
      'URL.createObjectURL'
    ];

    const missingAPIs = requiredAPIs.filter(api => {
      if (api === 'CanvasRenderingContext2D') {
        const canvas = document.createElement('canvas');
        return !canvas.getContext('2d');
      }
      return !(api in window);
    });

    if (missingAPIs.length > 0) {
      return {
        type: 'browser_not_supported',
        message: this.errorMessages.browser_not_supported,
        details: `Fehlende APIs: ${missingAPIs.join(', ')}`,
        retryable: false
      };
    }

    // Check for Web Workers support
    if (typeof Worker === 'undefined') {
      return {
        type: 'browser_not_supported',
        message: this.errorMessages.browser_not_supported,
        details: 'Web Workers werden nicht unterstützt',
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
