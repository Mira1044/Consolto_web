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
  return (
    <header className="grid h-16 flex-shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-gray-800 bg-gray-950 px-2 sm:px-4">
      {/* Left — Brand + End */}
      <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
        <BrandLogo variant="session" to={ROUTES.BOOKINGS} showText={false} imgClassName="opacity-95" />
        <button
          type="button"
          onClick={onEndSession}
          className="flex shrink-0 items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 sm:px-4 sm:text-sm"
        >
          {currentMode === 'chat' ? <MessageSquare size={16} /> : <Phone size={16} />}
          <span className="hidden sm:inline">End {currentMode === 'chat' ? 'Chat' : 'Call'}</span>
          <span className="sm:hidden">End</span>
        </button>
      </div>

      {/* Center — User info */}
      <div className="flex min-w-0 flex-col items-center px-1 text-center">
        <span className="truncate text-sm font-semibold text-white sm:text-base">
          {otherUserName || (currentMode === 'chat' ? 'Chat Session' : 'Video Call')}
        </span>
        {timeStatus && (
          <span className="mt-0.5 truncate text-[10px] text-gray-400 sm:text-xs">{timeStatus}</span>
        )}
      </div>

      {/* Right — Mode switch (only when initially opened in video mode) */}
      <div className="flex justify-end">
        {initialMode === 'video' ? (
          <div className="relative">
            <button
              type="button"
              onClick={onToggleMode}
              className="flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:px-4 sm:text-sm"
            >
              {currentMode === 'video' ? <MessageSquare size={16} /> : <Video size={16} />}
              <span>{currentMode === 'chat' ? 'Call' : 'Chat'}</span>
            </button>
            {currentMode === 'video' && unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        ) : (
          <div className="w-8 sm:w-28" aria-hidden />
        )}
      </div>
    </header>
  );
};
