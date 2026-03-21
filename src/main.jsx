import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider, ErrorBoundary } from '@/shared/services/error';
import { QueryProvider } from '@/shared/query';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <QueryProvider>
            <ErrorProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </ErrorProvider>
          </QueryProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>
  );
}
