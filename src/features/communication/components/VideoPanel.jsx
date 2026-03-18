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
      <div className="flex flex-1 items-center justify-center bg-gray-950">
        <p className="text-gray-400">Initializing video...</p>
      </div>
    );
  }

  return (
    <StreamVideo client={streamClient}>
      <StreamCall call={call}>
        <StreamTheme>
          <div className="relative flex flex-1 flex-col bg-gray-950">
            <ScreenShareOverlay />
            <div className="flex-1">
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
