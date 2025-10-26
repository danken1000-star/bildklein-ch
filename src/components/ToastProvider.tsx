'use client';

import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: '#fff',
          color: '#333',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '400px',
        },
        // Success toasts
        success: {
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
        },
        // Error toasts
        error: {
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
        },
        // Warning toasts
        loading: {
          duration: 0, // Don't auto-dismiss loading toasts
          style: {
            background: '#fffbeb',
            color: '#d97706',
            border: '1px solid #fed7aa',
          },
          iconTheme: {
            primary: '#f59e0b',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
