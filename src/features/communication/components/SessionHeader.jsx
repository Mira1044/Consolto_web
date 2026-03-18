import { Phone, MessageSquare, Video, X } from 'lucide-react';

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
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-gray-800 bg-gray-950 px-4">
      {/* Left — End button */}
      <button
        onClick={onEndSession}
        className="flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
      >
        {currentMode === 'chat' ? <MessageSquare size={16} /> : <Phone size={16} />}
        <span>End {currentMode === 'chat' ? 'Chat' : 'Call'}</span>
      </button>

      {/* Center — User info */}
      <div className="flex flex-col items-center">
        <span className="text-base font-semibold text-white">
          {otherUserName || (currentMode === 'chat' ? 'Chat Session' : 'Video Call')}
        </span>
        {timeStatus && (
          <span className="mt-0.5 text-xs text-gray-400">{timeStatus}</span>
        )}
      </div>

      {/* Right — Mode switch (only when initially opened in video mode) */}
      {initialMode === 'video' ? (
        <div className="relative">
          <button
            onClick={onToggleMode}
            className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
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
        <div className="w-28" />
      )}
    </header>
  );
};
