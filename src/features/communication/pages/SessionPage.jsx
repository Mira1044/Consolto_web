import '@stream-io/video-react-sdk/dist/css/styles.css';
import 'stream-chat-react/dist/css/v2/index.css';
import { SessionLayout } from '../components/SessionLayout';

/**
 * SessionPage
 *
 * Thin page wrapper — follows the pattern of ExpertsPage.
 * The session route uses layout: 'none' (full-screen, no navbar/footer).
 * Stream Video default styles are bundled here so layouts (SpeakerLayout, controls) render correctly.
 */
export const SessionPage = () => {
  return <SessionLayout />;
};
