import { useState, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useStreamSession } from '../hooks/useStreamSession';
import { useSessionTimer } from '../hooks/useSessionTimer';
import { useFileUpload } from '../hooks/useFileUpload';
import { SessionHeader } from './SessionHeader';
import { VideoPanel } from './VideoPanel';
import { ChatPanel } from './ChatPanel';
import { SessionExpired } from './SessionExpired';
import { EndSessionModal } from './EndSessionModal';
import { ROUTES } from '@/routes/config';
import { BrandLogo } from '@/shared/components/BrandLogo';

/**
 * SessionLayout
 *
 * Main session layout — split panel:
 *   - Video as main area (or hidden in chat-only mode)
 *   - Chat as collapsible right sidebar
 *
 * Mirrors the overall structure from consolto_app videoCall.jsx:
 *   - Header (lines 1764-1836)
 *   - Video/Chat views (lines 1838-2003)
 *   - End confirmation modal (lines 2006-2067)
 */
export const SessionLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionParams = location.state || {};
  const { appointmentId: appointmentIdFromUrl } = useParams();

  // The app navigates with `location.state` (not always `/:appointmentId` in the URL),
  // so we fall back to the state value when the param is missing.
  const appointmentId = appointmentIdFromUrl || sessionParams.appointmentId;

  const {
    appointmentStartTime = '',
    appointmentEndTime = '',
    appointmentDate = '',
    otherUserName = 'Participant',
    otherUserId = '',
    mode: initialMode = 'video',
    userRole,
    appointmentStatus,
  } = sessionParams;

  const [showEndModal, setShowEndModal] = useState(false);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(initialMode === 'chat');

  const session = useStreamSession({
    appointmentId,
    otherUserId,
    mode: initialMode,
  });

  const handleExpired = useCallback(async () => {
    await session.endSession();
    navigate(ROUTES.BOOKINGS, { replace: true });
  }, [session, navigate]);

  const timer = useSessionTimer({
    appointmentDate,
    appointmentStartTime,
    appointmentEndTime,
    mode: session.currentMode,
    onExpired: handleExpired,
  });

  const fileUpload = useFileUpload(session.channel);

  const handleEndSession = useCallback(() => {
    if (timer.isExpired) {
      handleExpired();
      return;
    }
    // Use the same confirmation modal for both chat and video.
    // This keeps the "end session" UX consistent with consolto_app.
    setShowEndModal(true);
  }, [timer.isExpired, session, navigate, handleExpired]);

  const confirmEnd = useCallback(async () => {
    setShowEndModal(false);
    await session.endSession();
    navigate(ROUTES.BOOKINGS, { replace: true });
  }, [session, navigate]);

  const handleToggleMode = useCallback(async () => {
    if (session.currentMode === 'video') {
      session.setCurrentMode('chat');
      session.setUnreadCount(0);
      setChatSidebarOpen(true);
      if (session.channel) await session.channel.markRead();
    } else {
      await session.switchToVideo();
      setChatSidebarOpen(false);
    }
  }, [session]);

  const handleToggleChat = useCallback(async () => {
    setChatSidebarOpen((open) => {
      if (!open && session.channel) {
        session.setUnreadCount(0);
        session.channel.markRead();
      }
      return !open;
    });
  }, [session]);

  // Expired state
  if (timer.isExpired) {
    return <SessionExpired timeStatus={timer.timeStatus} onConfirm={handleExpired} />;
  }

  // Loading state
  if (session.loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4">
        <div className="mb-8">
          <BrandLogo variant="session" to={ROUTES.BOOKINGS} showText={false} imgClassName="opacity-95" />
        </div>
        <Loader2 size={40} className="animate-spin text-blue-500" />
        <p className="mt-3 text-center text-base text-white">
          {initialMode === 'chat' ? 'Connecting to chat...' : 'Connecting to video call...'}
        </p>
      </div>
    );
  }

  // Error state
  if (session.error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-6 text-center">
        <div className="mb-6">
          <BrandLogo variant="session" to={ROUTES.BOOKINGS} showText={false} imgClassName="opacity-95" />
        </div>
        <AlertTriangle size={48} className="text-red-400" />
        <h2 className="mt-4 text-xl font-semibold text-white">Connection Error</h2>
        <p className="mt-2 text-gray-400">{session.error}</p>
        <button
          onClick={() => navigate(ROUTES.BOOKINGS, { replace: true })}
          className="mt-6 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  // Two-minute warning toast
  if (timer.showTwoMinWarning) {
    setTimeout(timer.dismissTwoMinWarning, 5000);
  }

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      <SessionHeader
        otherUserName={otherUserName}
        timeStatus={timer.timeStatus}
        currentMode={session.currentMode}
        onEndSession={handleEndSession}
        onToggleMode={handleToggleMode}
        unreadCount={session.unreadCount}
        initialMode={initialMode}
      />

      {/* Two-min warning */}
      {timer.showTwoMinWarning && (
        <div className="flex items-center justify-center bg-yellow-600/90 px-4 py-2">
          <p className="text-sm font-medium text-white">
            Session ending in 2 minutes. Please wrap up.
          </p>
          <button
            onClick={timer.dismissTwoMinWarning}
            className="ml-4 text-xs text-yellow-200 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main content area */}
      {/* Desktop-first split:
          - Video fills remaining width
          - Chat is fixed width on lg+
          - On small screens, chat can take full width and video can be hidden in chat mode
      */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video area */}
        <div
          className={`flex flex-1 min-w-0 transition-all duration-300 ${
            session.currentMode === 'chat' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <VideoPanel
            streamClient={session.streamClient}
            call={session.call}
            onToggleChat={handleToggleChat}
            unreadCount={session.unreadCount}
            currentMode={session.currentMode}
          />
        </div>

        {/* Chat sidebar */}
        <div
          className={`flex flex-col transition-all duration-300 ${
            chatSidebarOpen
              ? 'w-full lg:w-[380px] border-l border-gray-800'
              : 'w-0 overflow-hidden border-l-0'
          }`}
        >
          <ChatPanel
            chatClient={session.chatClient}
            channel={session.channel}
            canSendMessage={timer.canSendMessage}
            onUpload={fileUpload.upload}
            uploading={fileUpload.uploading}
            uploadProgress={fileUpload.uploadProgress}
            currentMode={session.currentMode}
            onEndSession={handleEndSession}
          />
        </div>
      </div>

      {/* End session modal */}
      {showEndModal && (
        <EndSessionModal
          currentMode={session.currentMode}
          onCancel={() => setShowEndModal(false)}
          onConfirm={confirmEnd}
        />
      )}
    </div>
  );
};
