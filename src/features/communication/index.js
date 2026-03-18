// Communication feature barrel export

// Services
export { streamService } from './services/streamService';

// Models
export { sessionParamsSchema, streamTokenSchema, activeSessionSchema } from './models/sessionModel';

// Validators
export {
  validateSessionParams,
  validateStreamToken,
  validateActiveSession,
} from './validators/sessionValidator';

// Utils
export {
  parseAppointmentDateTime,
  getTimeWindows,
  evaluateTimeStatus,
  getCallId,
  getChannelId,
  requestMediaPermissions,
  FILE_LIMITS,
  getFileType,
  saveActiveSession,
  getActiveSession,
  clearActiveSession,
} from './utils/sessionUtils';

// Hooks
export { useStreamSession } from './hooks/useStreamSession';
export { useSessionTimer } from './hooks/useSessionTimer';
export { useFileUpload } from './hooks/useFileUpload';

// Components
export { SessionLayout } from './components/SessionLayout';
export { VideoPanel } from './components/VideoPanel';
export { ChatPanel } from './components/ChatPanel';
export { CallControls } from './components/CallControls';
export { ChatInput } from './components/ChatInput';
export { FileAttachment } from './components/FileAttachment';
export { SessionHeader } from './components/SessionHeader';
export { ScreenShareOverlay } from './components/ScreenShareOverlay';
export { SessionExpired } from './components/SessionExpired';
export { EndSessionModal } from './components/EndSessionModal';

// Pages
export { SessionPage } from './pages/SessionPage';
