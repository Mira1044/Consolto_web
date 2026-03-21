import {
  StreamVideo,
  StreamCall,
  SpeakerLayout,
  StreamTheme,
} from '@stream-io/video-react-sdk';
import { CallControls } from './CallControls';
import { ScreenShareOverlay } from './ScreenShareOverlay';

/**
 * VideoPanel
 *
 * Renders the Stream Video call area with:
 * - Participant grid (SpeakerLayout)
 * - Screen share overlay
 * - Custom call controls bar
 *
 * Mirrors the <StreamVideo>/<StreamCall>/<CallContent> tree
 * in consolto_app videoCall.jsx lines 1840-1858.
 */
export const VideoPanel = ({
  streamClient,
  call,
  onToggleChat,
  unreadCount,
  currentMode,
}) => {
  if (!streamClient || !call) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center bg-gray-950 px-4">
        <p className="text-center text-sm text-gray-400">Starting camera and microphone…</p>
        <p className="mt-2 max-w-xs text-center text-xs text-gray-600">
          If nothing happens, check the permission icon in your browser’s address bar.
        </p>
      </div>
    );
  }

  return (
    <StreamVideo client={streamClient}>
      <StreamCall call={call}>
        <StreamTheme className="flex h-full min-h-0 min-w-0 w-full flex-1 flex-col">
          <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-gray-950">
            <ScreenShareOverlay />
            <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <SpeakerLayout participantsBarPosition="bottom" />
            </div>
            <CallControls
              onToggleChat={onToggleChat}
              unreadCount={unreadCount}
              currentMode={currentMode}
            />
          </div>
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};
