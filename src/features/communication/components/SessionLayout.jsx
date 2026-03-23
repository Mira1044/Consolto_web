import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Loader2, AlertTriangle, Clock, FileWarning } from 'lucide-react';
import { useMediaQuery } from '@/shared/hooks';
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
import { Modal } from '@/shared/components/ui';

const SESSION_NAV_KEY = 'consolto_session_nav';

function readStoredSession(appointmentIdFromUrl) {
  if (!appointmentIdFromUrl) {
return {};
}
  try {
    const raw = sessionStorage.getItem(SESSION_NAV_KEY);
    if (!raw) {
return {};
}
    const o = JSON.parse(raw);
    return String(o.appointmentId) === String(appointmentIdFromUrl) ? o : {};
  } catch {
    return {};
  }
}

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
  const { appointmentId: appointmentIdFromUrl } = useParams();

  const sessionParams = useMemo(() => {
    const stored = readStoredSession(appointmentIdFromUrl);
    const fromNav = location.state && Object.keys(location.state).length ? location.state : {};
    return { ...stored, ...fromNav };
  }, [appointmentIdFromUrl, location.state]);

  const appointmentId = appointmentIdFromUrl || sessionParams.appointmentId;

  const {
    appointmentStartTime = '',
    appointmentEndTime = '',
    appointmentDate = '',
    otherUserName = 'Participant',
    otherUserId = '',
    mode: initialMode = 'video',
  } = sessionParams;

  const [showEndModal, setShowEndModal] = useState(false);
  const [chatSidebarOpen, setChatSidebarOpen] = useState(initialMode === 'chat');
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const closeChatSidebar = useCallback(() => setChatSidebarOpen(false), []);

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
    setShowEndModal(true);
  }, [timer.isExpired, handleExpired]);

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
      if (session.channel) {
await session.channel.markRead();
}
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

  const videoChatOverlay =
    !isDesktop && session.currentMode === 'video' && chatSidebarOpen;

  // When the other participant ends the call, navigate away.
  useEffect(() => {
    if (session.callEndedRemotely) {
      navigate(ROUTES.BOOKINGS, { replace: true });
    }
  }, [session.callEndedRemotely, navigate]);

  // Lock page scroll while in session.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Escape closes mobile chat overlay / sheet.
  useEffect(() => {
    if (!chatSidebarOpen || isDesktop) {
return;
}
    const onKey = (e) => {
      if (e.key === 'Escape') {
closeChatSidebar();
}
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatSidebarOpen, isDesktop, closeChatSidebar]);

  // Expired state
  if (timer.isExpired) {
    return <SessionExpired timeStatus={timer.timeStatus} onConfirm={handleExpired} />;
  }

  // Loading state
  if (session.loading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-950 px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="mb-8">
          <BrandLogo imgClassName="opacity-95" showText={false} to={ROUTES.BOOKINGS} variant="session" />
        </div>
        <Loader2 aria-hidden className="animate-spin text-violet-500" size={40} />
        <p className="mt-4 text-center text-base text-white">
          {initialMode === 'chat' ? 'Connecting to chat...' : 'Connecting to video...'}
        </p>
        <p className="mt-2 max-w-sm text-center text-sm text-gray-500">
          {initialMode === 'video'
            ? 'Allow camera and microphone when your browser asks — you can change this in the address bar.'
            : 'Securing your session...'}
        </p>
      </div>
    );
  }

  // Error state
  if (session.error) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-950 px-6 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-center">
        <div className="mb-6">
          <BrandLogo imgClassName="opacity-95" showText={false} to={ROUTES.BOOKINGS} variant="session" />
        </div>
        <AlertTriangle aria-hidden className="text-red-400" size={48} />
        <h2 className="mt-4 text-xl font-semibold text-white">Connection Error</h2>
        <p className="mt-2 max-w-md text-gray-400">{session.error}</p>
        <button
          className="mt-8 min-h-11 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
          type="button"
          onClick={() => navigate(ROUTES.BOOKINGS, { replace: true })}
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="session-shell flex h-[100dvh] max-h-[100dvh] min-h-0 flex-col overflow-hidden bg-gray-950 overscroll-none">
      <SessionHeader
        currentMode={session.currentMode}
        initialMode={initialMode}
        otherUserName={otherUserName}
        timeStatus={timer.timeStatus}
        unreadCount={session.unreadCount}
        onEndSession={handleEndSession}
        onToggleMode={handleToggleMode}
      />

      <div className="relative flex min-h-0 flex-1">
        <div
          className={`relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-opacity duration-200 ${
            session.currentMode === 'chat' ? 'hidden lg:flex' : ''
          }`}
        >
          <VideoPanel
            call={session.call}
            currentMode={session.currentMode}
            streamClient={session.streamClient}
            unreadCount={session.unreadCount}
            onToggleChat={handleToggleChat}
          />
        </div>

        {videoChatOverlay && (
          <button
            aria-label="Close chat"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] transition-opacity lg:hidden"
            type="button"
            onClick={closeChatSidebar}
          />
        )}

        {chatSidebarOpen && (
          <aside
            aria-label="Chat"
            className={[
              'session-chat-aside flex min-h-0 flex-col bg-black',
              isDesktop &&
                'w-[min(380px,100%)] shrink-0 border-l border-gray-800 transition-[width] duration-300 ease-out',
              !isDesktop && session.currentMode === 'chat' && 'min-h-0 flex-1',
              videoChatOverlay &&
                'fixed bottom-0 right-0 top-16 z-40 w-full max-w-md border-l border-gray-800 shadow-2xl lg:hidden',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <ChatPanel
              canSendMessage={timer.canSendMessage}
              channel={session.channel}
              chatClient={session.chatClient}
              showMobileClose={Boolean(videoChatOverlay)}
              uploading={fileUpload.uploading}
              uploadProgress={fileUpload.uploadProgress}
              onCloseMobile={closeChatSidebar}
              onUpload={fileUpload.upload}
            />
          </aside>
        )}
      </div>

      {showEndModal && (
        <EndSessionModal
          currentMode={session.currentMode}
          onCancel={() => setShowEndModal(false)}
          onConfirm={confirmEnd}
        />
      )}

      <Modal
        ariaDescribedBy="upload-error-desc"
        ariaLabelledBy="upload-error-title"
        closeOnOverlay={false}
        open={Boolean(fileUpload.uploadError)}
        overlayClassName="!z-[9999]"
        role="alertdialog"
        onClose={fileUpload.clearError}
      >
        <div className="w-full max-w-[400px] rounded-xl border border-red-500/40 bg-gray-800 p-6 text-center shadow-xl">
          <FileWarning aria-hidden className="mx-auto mb-4 text-red-400" size={40} />
          <h3 className="mb-2 text-xl font-bold text-white" id="upload-error-title">
            Upload Failed
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-gray-300" id="upload-error-desc">
            {fileUpload.uploadError}
          </p>
          <button
            autoFocus
            className="min-h-11 w-full max-w-[10rem] rounded-lg bg-red-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
            type="button"
            onClick={fileUpload.clearError}
          >
            OK
          </button>
        </div>
      </Modal>

      <Modal
        ariaDescribedBy="session-warning-desc"
        ariaLabelledBy="session-warning-title"
        closeOnOverlay={false}
        open={timer.showTwoMinWarning}
        overlayClassName="!z-[9999]"
        role="alertdialog"
        onClose={timer.dismissTwoMinWarning}
      >
        <div className="w-full max-w-[400px] rounded-xl border border-yellow-500/40 bg-gray-800 p-6 text-center shadow-xl">
          <Clock aria-hidden className="mx-auto mb-4 text-yellow-400" size={40} />
          <h3 className="mb-2 text-xl font-bold text-white" id="session-warning-title">
            Session Ending Soon
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-gray-300" id="session-warning-desc">
            Your session will end in 2 minutes. Please wrap up your discussion.
          </p>
          <button
            autoFocus
            className="min-h-11 w-full max-w-[10rem] rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            type="button"
            onClick={timer.dismissTwoMinWarning}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
};
