import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ErrorProvider, ErrorBoundary } from '@/shared/services/error';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <ErrorProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ErrorProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </StrictMode>
  );
}
