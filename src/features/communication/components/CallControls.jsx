import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, MessageSquare } from 'lucide-react';
import { useCallStateHooks, useCall } from '@stream-io/video-react-sdk';

/**
 * CallControls
 *
 * Custom video-call control bar: mic, camera, screen share, chat toggle.
 * Mirrors CustomCallControls from consolto_app videoCall.jsx lines 281-374.
 *
 * Uses Stream Video React SDK hooks instead of the RN variants.
 */
export const CallControls = ({
  onToggleChat,
  unreadCount,
  currentMode,
}) => {
  const currentCall = useCall();
  const { useMicrophoneState, useCameraState, useScreenShareState } = useCallStateHooks();

  const { isMute: micMuted, microphone } = useMicrophoneState();
  const { isMute: camMuted, camera } = useCameraState();
  const { screenShare, isMute: screenShareOff } = useScreenShareState();

  const toggleMic = async () => {
    try {
      if (micMuted) await microphone.enable();
      else await microphone.disable();
    } catch (err) {
      console.error('Mic toggle error:', err);
    }
  };

  const toggleCamera = async () => {
    try {
      if (camMuted) await camera.enable();
      else await camera.disable();
    } catch (err) {
      console.error('Camera toggle error:', err);
    }
  };

  const toggleScreenShare = async () => {
    if (!currentCall) return;
    try {
      await screenShare.toggle();
    } catch (err) {
      console.error('Screen share error:', err);
    }
  };

  const btnBase = 'flex h-12 w-12 items-center justify-center rounded-full transition-colors';

  return (
    <div className="flex items-center justify-center gap-3 bg-gray-950/80 py-3">
      {/* Mic */}
      <button
        onClick={toggleMic}
        className={`${btnBase} ${micMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
        title={micMuted ? 'Unmute' : 'Mute'}
      >
        {micMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
      </button>

      {/* Camera */}
      <button
        onClick={toggleCamera}
        className={`${btnBase} ${camMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
        title={camMuted ? 'Turn on camera' : 'Turn off camera'}
      >
        {camMuted ? <VideoOff size={20} className="text-white" /> : <Video size={20} className="text-white" />}
      </button>

      {/* Screen Share */}
      <button
        onClick={toggleScreenShare}
        className={`${btnBase} ${!screenShareOff ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}
        title={!screenShareOff ? 'Stop sharing' : 'Share screen'}
      >
        {!screenShareOff ? <MonitorOff size={20} className="text-white" /> : <Monitor size={20} className="text-white" />}
      </button>

      {/* Chat toggle */}
      <div className="relative">
        <button
          onClick={onToggleChat}
          className={`${btnBase} bg-blue-600 hover:bg-blue-700`}
          title="Toggle chat"
        >
          <MessageSquare size={20} className="text-white" />
        </button>
        {currentMode === 'video' && unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
    </div>
  );
};
