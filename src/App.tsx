import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/shared/components/layout';
import { HomePage } from '@/pages/home';
import { ExpertsPage } from '@/pages/experts';
import { BookingPage } from '@/pages/booking';
import { ContactPage } from '@/pages/contact';
import { ProtectedRoute } from '@/routes/guards';

function App(): JSX.Element {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/experts"
          element={
            <ProtectedRoute>
              <ExpertsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
