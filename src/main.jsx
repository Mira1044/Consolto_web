import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider, ErrorBoundary } from '@/shared/services/error';
import { queryClient } from '@/lib/queryClient';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <BrowserRouter>
            <ErrorProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ErrorProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </QueryClientProvider>
    </StrictMode>
  );
}
