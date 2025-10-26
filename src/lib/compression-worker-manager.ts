import { CompressionOptions } from './compression';

export interface CompressionProgress {
  fileIndex: number;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'compressing' | 'completed' | 'error';
  error?: string;
}

export interface CompressionResult {
  fileIndex: number;
  fileName: string;
  compressedFile: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

export interface CompressionWorkerMessage {
  type: 'PROGRESS_UPDATE' | 'COMPRESSION_COMPLETE' | 'COMPRESSION_ERROR';
  payload: any;
}

export class CompressionWorkerManager {
  private workers: Worker[] = [];
  private maxWorkers: number;
  private activeJobs: Map<number, Worker> = new Map();
  private jobCounter = 0;

  constructor(maxWorkers: number = navigator.hardwareConcurrency || 4) {
    this.maxWorkers = Math.min(maxWorkers, 8); // Cap at 8 workers
    this.initializeWorkers();
  }

  private initializeWorkers() {
    for (let i = 0; i < this.maxWorkers; i++) {
      const worker = new Worker(
        new URL('./compression.worker.ts', import.meta.url),
        { type: 'module' }
      );
      this.workers.push(worker);
    }
  }

  private getAvailableWorker(): Worker | null {
    for (const worker of this.workers) {
      if (!Array.from(this.activeJobs.values()).includes(worker)) {
        return worker;
      }
    }
    return null;
  }

  async compressImages(
    files: File[],
    options: CompressionOptions,
    onProgress: (progress: CompressionProgress) => void
  ): Promise<CompressionResult[]> {
    return new Promise((resolve, reject) => {
      const results: CompressionResult[] = [];
      const errors: Error[] = [];
      let completedJobs = 0;

      // Initialize progress for all files
      files.forEach((file, index) => {
        onProgress({
          fileIndex: index,
          fileName: file.name,
          progress: 0,
          status: 'pending'
        });
      });

      const processFile = async (file: File, fileIndex: number) => {
        const worker = this.getAvailableWorker();
        
        if (!worker) {
          // If no worker is available, wait a bit and try again
          setTimeout(() => processFile(file, fileIndex), 100);
          return;
        }

        const jobId = this.jobCounter++;
        this.activeJobs.set(jobId, worker);

        const handleMessage = (e: MessageEvent<CompressionWorkerMessage>) => {
          const { type, payload } = e.data;

          switch (type) {
            case 'PROGRESS_UPDATE':
              onProgress(payload);
              break;

            case 'COMPRESSION_COMPLETE':
              if (payload.fileIndex === fileIndex) {
                const { compressedBuffer, originalSize, compressedSize } = payload;
                
                // Convert ArrayBuffer back to File
                const mimeType = this.getMimeType(options.format || 'jpg');
                const compressedFile = new File([compressedBuffer], file.name, { type: mimeType });
                
                const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100);
                
                results[fileIndex] = {
                  fileIndex,
                  fileName: file.name,
                  compressedFile,
                  originalSize,
                  compressedSize,
                  compressionRatio
                };

                completedJobs++;
                this.activeJobs.delete(jobId);
                worker.removeEventListener('message', handleMessage);

                if (completedJobs === files.length) {
                  if (errors.length > 0 && results.length === 0) {
                    reject(new Error(`All compressions failed: ${errors.map(e => e.message).join(', ')}`));
                  } else {
                    resolve(results.filter(r => r !== undefined));
                  }
                }
              }
              break;

            case 'COMPRESSION_ERROR':
              if (payload.fileIndex === fileIndex) {
                const error = new Error(payload.error);
                errors.push(error);
                
                onProgress({
                  fileIndex,
                  fileName: file.name,
                  progress: 0,
                  status: 'error',
                  error: payload.error
                });

                completedJobs++;
                this.activeJobs.delete(jobId);
                worker.removeEventListener('message', handleMessage);

                if (completedJobs === files.length) {
                  if (errors.length > 0 && results.length === 0) {
                    reject(new Error(`All compressions failed: ${errors.map(e => e.message).join(', ')}`));
                  } else {
                    resolve(results.filter(r => r !== undefined));
                  }
                }
              }
              break;
          }
        };

        worker.addEventListener('message', handleMessage);

        // Send compression job to worker
        worker.postMessage({
          type: 'COMPRESS_IMAGE',
          payload: {
            file,
            options,
            fileIndex
          }
        });
      };

      // Start processing all files
      files.forEach((file, index) => {
        processFile(file, index);
      });
    });
  }

  private getMimeType(format: 'jpg' | 'png' | 'webp'): string {
    const mimeTypes = {
      jpg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp'
    };
    return mimeTypes[format];
  }

  // Clean up workers
  destroy() {
    this.workers.forEach(worker => worker.terminate());
    this.workers = [];
    this.activeJobs.clear();
  }
}

// Singleton instance
let workerManager: CompressionWorkerManager | null = null;

export function getCompressionWorkerManager(): CompressionWorkerManager {
  if (!workerManager) {
    workerManager = new CompressionWorkerManager();
  }
  return workerManager;
}

export function destroyCompressionWorkerManager() {
  if (workerManager) {
    workerManager.destroy();
    workerManager = null;
  }
}

