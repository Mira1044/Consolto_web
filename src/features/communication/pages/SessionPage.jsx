import { SessionLayout } from '../components/SessionLayout';

/**
 * SessionPage
 *
 * Thin page wrapper — follows the pattern of ExpertsPage.
 * The session route uses layout: 'none' (full-screen, no navbar/footer).
 */
export const SessionPage = () => {
  return <SessionLayout />;
};
