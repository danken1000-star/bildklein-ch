'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { errorHandler } from '@/lib/errorHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to external service if needed
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-text-dark mb-4">
              Oops! Etwas ist schiefgelaufen
            </h1>
            
            <p className="text-text-gray mb-6">
              Ein unerwarteter Fehler ist aufgetreten. Bitte lade die Seite neu oder versuche es später erneut.
            </p>
            
            {this.state.error && (
              <details className="text-left bg-bg-gray p-4 rounded-lg mb-6">
                <summary className="cursor-pointer text-sm font-medium text-text-dark mb-2">
                  Fehlerdetails anzeigen
                </summary>
                <pre className="text-xs text-text-gray overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink to-turquoise text-white rounded-lg font-medium hover:from-pink-600 hover:to-turquoise-600 transition-all duration-200 shadow-soft"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Erneut versuchen</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-6 py-3 bg-bg-gray text-text-dark rounded-lg font-medium hover:bg-border transition-all duration-200"
              >
                Seite neu laden
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

