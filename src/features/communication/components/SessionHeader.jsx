import { Phone, MessageSquare, Video } from 'lucide-react';
import { BrandLogo } from '@/shared/components/BrandLogo';
import { ROUTES } from '@/routes/config';

/**
 * SessionHeader
 *
 * Top bar for the session page — shows:
 * - End session button (left)
 * - Other user name + time status (center)
 * - Mode switch button (right, video mode only)
 *
 * Mirrors the header from consolto_app videoCall.jsx lines 1764-1836.
 */
export const SessionHeader = ({
  otherUserName,
  timeStatus,
  currentMode,
  onEndSession,
  onToggleMode,
  unreadCount,
  initialMode,
}) => {
  const headerPill =
    'inline-flex h-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 max-sm:h-11 max-sm:w-11 max-sm:gap-0 max-sm:px-0 sm:h-10 sm:gap-2 sm:px-4 md:px-5';

  return (
    <header className="grid min-h-[3.25rem] flex-shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-gray-800 bg-gray-950 px-2 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] sm:gap-3 sm:px-4 sm:py-3">
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <BrandLogo variant="session" to={ROUTES.BOOKINGS} showText={false} imgClassName="opacity-95" />
        <button
          type="button"
          onClick={onEndSession}
          className={`${headerPill} bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-400`}
          aria-label={currentMode === 'chat' ? 'End chat session' : 'End video call'}
        >
          {currentMode === 'chat' ? (
            <MessageSquare className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={2.25} aria-hidden />
          ) : (
            <Phone className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={2.25} aria-hidden />
          )}
          <span className="hidden sm:inline">End {currentMode === 'chat' ? 'chat' : 'call'}</span>
        </button>
      </div>

      <div className="flex min-w-0 flex-col items-center px-1 text-center">
        <h1 className="truncate text-sm font-semibold text-white sm:text-base">
          {otherUserName || (currentMode === 'chat' ? 'Chat session' : 'Video call')}
        </h1>
        {timeStatus ? (
          <p className="mt-0.5 truncate text-[11px] text-gray-400 sm:text-xs">{timeStatus}</p>
        ) : null}
      </div>

      <div className="flex justify-end">
        {initialMode === 'video' ? (
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={onToggleMode}
              className={`${headerPill} bg-violet-600 text-white hover:bg-violet-500`}
              aria-label={currentMode === 'video' ? 'Switch to chat' : 'Switch to video call'}
            >
              {currentMode === 'video' ? (
                <MessageSquare className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={2.25} aria-hidden />
              ) : (
                <Video className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={2.25} aria-hidden />
              )}
              <span className="hidden sm:inline">{currentMode === 'chat' ? 'Video' : 'Chat'}</span>
            </button>
            {currentMode === 'video' && unreadCount > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white"
                aria-hidden
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        ) : (
          <div className="h-10 w-11 shrink-0 sm:w-[5.75rem]" aria-hidden />
        )}
      </div>
    </header>
  );
};
