import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
    gtag?: (...args: any[]) => void;
    __BACON_BOOT__?: boolean;
  }
}

/**
 * Global error handling for unhandled promise rejections.
 */
window.addEventListener('unhandledrejection', (event) => {
  console.error('[App] Connection error:', event.reason);
});

if (!window.__BACON_BOOT__) {
  window.__BACON_BOOT__ = true;
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </ErrorBoundary>
      </React.StrictMode>
    );
  }
}