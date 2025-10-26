'use client';

import toast from 'react-hot-toast';
import { ErrorInfo } from '@/lib/errorHandler';

export function useToast() {
  const showSuccess = (message: string, details?: string) => {
    toast.success(
      details ? `${message}\n${details}` : message,
      {
        duration: 3000,
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        },
        iconTheme: {
          primary: '#22c55e',
          secondary: '#fff',
        },
      }
    );
  };

  const showError = (errorInfo: ErrorInfo) => {
    const message = errorInfo.details 
      ? `${errorInfo.message}\n${errorInfo.details}`
      : errorInfo.message;
    
    toast.error(
      errorInfo.retryable ? `${message}\nDu kannst es erneut versuchen.` : message,
      {
        duration: 5000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      }
    );
  };

  const showWarning = (message: string, details?: string) => {
    toast(
      details ? `${message}\n${details}` : message,
      {
        duration: 4000,
        style: {
          background: '#fffbeb',
          color: '#d97706',
          border: '1px solid #fed7aa',
        },
        iconTheme: {
          primary: '#f59e0b',
          secondary: '#fff',
        },
      }
    );
  };

  const showLoading = (message: string) => {
    return toast.loading(
      message,
      {
        duration: 0, // Don't auto-dismiss
        style: {
          background: '#fffbeb',
          color: '#d97706',
          border: '1px solid #fed7aa',
        },
        iconTheme: {
          primary: '#f59e0b',
          secondary: '#fff',
        },
      }
    );
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  const updateLoading = (toastId: string, message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(
        message,
        { 
          id: toastId,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#fff',
          },
        }
      );
    } else {
      toast.error(
        message,
        { 
          id: toastId,
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        }
      );
    }
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showLoading,
    dismiss,
    updateLoading,
  };
}
