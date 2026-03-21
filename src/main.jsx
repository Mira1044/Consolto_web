import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider, ErrorBoundary } from '@/shared/services/error';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <ErrorProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ErrorProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
}
