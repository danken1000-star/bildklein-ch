'use client';

import { useState, useEffect } from 'react';
import type { CompressionProgress } from '@/lib/compression';
import { CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';

interface CompressionProgressProps {
  progress: CompressionProgress[];
  totalFiles: number;
  className?: string;
}

export default function CompressionProgress({ 
  progress, 
  totalFiles, 
  className = '' 
}: CompressionProgressProps) {
  const [completedFiles, setCompletedFiles] = useState(0);
  const [errorFiles, setErrorFiles] = useState(0);

  useEffect(() => {
    const completed = progress.filter(p => p.status === 'completed').length;
    const errors = progress.filter(p => p.status === 'error').length;
    
    setCompletedFiles(completed);
    setErrorFiles(errors);
  }, [progress]);

  const overallProgress = totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0;
  const isComplete = completedFiles + errorFiles === totalFiles;

  return (
    <div className={`bg-bg-light rounded-lg border border-border p-6 shadow-soft ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink to-turquoise rounded-lg flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-dark">
              {isComplete ? 'Komprimierung abgeschlossen' : 'Komprimiere Bilder...'}
            </h3>
            <p className="text-sm text-text-gray">
              {completedFiles} von {totalFiles} Dateien verarbeitet
              {errorFiles > 0 && ` • ${errorFiles} Fehler`}
            </p>
          </div>
        </div>
        
        {isComplete ? (
          <div className="flex items-center space-x-2 text-success">
            <CheckCircle className="w-6 h-6" />
            <span className="text-sm font-medium">Fertig!</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-turquoise-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">{overallProgress}%</span>
          </div>
        )}
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-text-dark">Gesamtfortschritt</span>
          <span className="text-sm text-text-gray">{overallProgress}%</span>
        </div>
        <div className="w-full bg-bg-gray rounded-full h-3 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${
              isComplete 
                ? errorFiles > 0 
                  ? 'bg-gradient-to-r from-orange to-pink' 
                  : 'bg-gradient-to-r from-success to-turquoise'
                : 'bg-gradient-to-r from-pink to-turquoise'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Individual File Progress */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {progress.map((fileProgress, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-bg-gray rounded-lg">
            {/* Status Icon */}
            <div className="flex-shrink-0">
              {fileProgress.status === 'completed' && (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
              {fileProgress.status === 'error' && (
                <AlertCircle className="w-5 h-5 text-pink-600" />
              )}
              {fileProgress.status === 'compressing' && (
                <Loader2 className="w-5 h-5 text-turquoise-600 animate-spin" />
              )}
              {fileProgress.status === 'pending' && (
                <div className="w-5 h-5 rounded-full border-2 border-text-gray" />
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-dark truncate">
                {fileProgress.fileName}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-text-gray">
                  {fileProgress.status === 'completed' && 'Abgeschlossen'}
                  {fileProgress.status === 'error' && 'Fehler'}
                  {fileProgress.status === 'compressing' && `${fileProgress.progress}%`}
                  {fileProgress.status === 'pending' && 'Wartend'}
                </span>
                {fileProgress.status === 'error' && fileProgress.error && (
                  <span className="text-xs text-pink-600 truncate">
                    {fileProgress.error}
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar for Compressing Files */}
            {fileProgress.status === 'compressing' && (
              <div className="w-20">
                <div className="w-full bg-border rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-pink to-turquoise rounded-full transition-all duration-300"
                    style={{ width: `${fileProgress.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {isComplete && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{completedFiles}</div>
                <div className="text-xs text-text-gray">Erfolgreich</div>
              </div>
              {errorFiles > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">{errorFiles}</div>
                  <div className="text-xs text-text-gray">Fehler</div>
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium text-text-dark">
                {overallProgress}% abgeschlossen
              </div>
              <div className="text-xs text-text-gray">
                {completedFiles > 0 && `${completedFiles} Dateien komprimiert`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
