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

const SESSION_NAV_KEY = 'consolto_session_nav';

function readStoredSession(appointmentIdFromUrl) {
  if (!appointmentIdFromUrl) return {};
  try {
    const raw = sessionStorage.getItem(SESSION_NAV_KEY);
    if (!raw) return {};
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
    userRole,
    appointmentStatus,
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
    if (!chatSidebarOpen || isDesktop) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeChatSidebar();
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
          <BrandLogo variant="session" to={ROUTES.BOOKINGS} showText={false} imgClassName="opacity-95" />
        </div>
        <Loader2 size={40} className="animate-spin text-violet-500" aria-hidden />
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
          <BrandLogo variant="session" to={ROUTES.BOOKINGS} showText={false} imgClassName="opacity-95" />
        </div>
        <AlertTriangle size={48} className="text-red-400" aria-hidden />
        <h2 className="mt-4 text-xl font-semibold text-white">Connection Error</h2>
        <p className="mt-2 max-w-md text-gray-400">{session.error}</p>
        <button
          type="button"
          onClick={() => navigate(ROUTES.BOOKINGS, { replace: true })}
          className="mt-8 min-h-11 rounded-full bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  return (
    <div className="session-shell flex h-[100dvh] max-h-[100dvh] min-h-0 flex-col overflow-hidden bg-gray-950 overscroll-none">
      <SessionHeader
        otherUserName={otherUserName}
        timeStatus={timer.timeStatus}
        currentMode={session.currentMode}
        onEndSession={handleEndSession}
        onToggleMode={handleToggleMode}
        unreadCount={session.unreadCount}
        initialMode={initialMode}
      />

      <div className="relative flex min-h-0 flex-1">
        <div
          className={`relative z-0 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden transition-opacity duration-200 ${
            session.currentMode === 'chat' ? 'hidden lg:flex' : ''
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

        {videoChatOverlay && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-[2px] transition-opacity lg:hidden"
            aria-label="Close chat"
            onClick={closeChatSidebar}
          />
        )}

        {chatSidebarOpen && (
          <aside
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
            aria-label="Chat"
          >
            <ChatPanel
              chatClient={session.chatClient}
              channel={session.channel}
              canSendMessage={timer.canSendMessage}
              onUpload={fileUpload.upload}
              uploading={fileUpload.uploading}
              uploadProgress={fileUpload.uploadProgress}
              showMobileClose={Boolean(videoChatOverlay)}
              onCloseMobile={closeChatSidebar}
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

      {fileUpload.uploadError && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
          role="presentation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="upload-error-title"
            aria-describedby="upload-error-desc"
            className="w-full max-w-[400px] rounded-xl border border-red-500/40 bg-gray-800 p-6 text-center shadow-xl"
          >
            <FileWarning size={40} className="mx-auto mb-4 text-red-400" aria-hidden />
            <h3 id="upload-error-title" className="mb-2 text-xl font-bold text-white">
              Upload Failed
            </h3>
            <p id="upload-error-desc" className="mb-6 text-sm leading-relaxed text-gray-300">
              {fileUpload.uploadError}
            </p>
            <button
              type="button"
              autoFocus
              onClick={fileUpload.clearError}
              className="min-h-11 w-full max-w-[10rem] rounded-lg bg-red-500 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {timer.showTwoMinWarning && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]"
          role="presentation"
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="session-warning-title"
            aria-describedby="session-warning-desc"
            className="w-full max-w-[400px] rounded-xl border border-yellow-500/40 bg-gray-800 p-6 text-center shadow-xl"
          >
            <Clock size={40} className="mx-auto mb-4 text-yellow-400" aria-hidden />
            <h3 id="session-warning-title" className="mb-2 text-xl font-bold text-white">
              Session Ending Soon
            </h3>
            <p id="session-warning-desc" className="mb-6 text-sm leading-relaxed text-gray-300">
              Your session will end in 2 minutes. Please wrap up your discussion.
            </p>
            <button
              type="button"
              autoFocus
              onClick={timer.dismissTwoMinWarning}
              className="min-h-11 w-full max-w-[10rem] rounded-lg bg-yellow-500 px-6 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
