import { AppRouter } from '@/routes';
import { ErrorToast } from '@/shared/services/error';

/**
 * Main App Component
 * Uses the centralized AppRouter for all routing logic
 */
function App() {
  return (
    <>
      <AppRouter />
      <ErrorToast />
    </>
  );
}

export default App;
