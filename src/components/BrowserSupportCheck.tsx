'use client';

import { useEffect } from 'react';
import { errorHandler } from '@/lib/errorHandler';
import { useToast } from '@/hooks/useToast';

export default function BrowserSupportCheck() {
  const { showError } = useToast();

  useEffect(() => {
    // Check browser support on app load
    const browserError = errorHandler.validateBrowserSupport();
    if (browserError) {
      showError(browserError);
    }
  }, [showError]);

  return null; // This component doesn't render anything
}

