import { Mic, MicOff, Video, VideoOff, MessageSquare } from 'lucide-react';
import { useCallStateHooks } from '@stream-io/video-react-sdk';

/**
 * CallControls
 *
 * Custom video-call control bar: mic, camera, chat toggle.
 * Mirrors CustomCallControls from consolto_app videoCall.jsx lines 281-374.
 *
 * Uses Stream Video React SDK hooks instead of the RN variants.
 */
export const CallControls = ({
  onToggleChat,
  unreadCount,
  currentMode,
}) => {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();

  const { isMute: micMuted, microphone } = useMicrophoneState();
  const { isMute: camMuted, camera } = useCameraState();

  const toggleMic = async () => {
    try {
      if (micMuted) {
await microphone.enable();
} else {
await microphone.disable();
}
    } catch (err) {
      console.error('Mic toggle error:', err);
    }
  };

  const toggleCamera = async () => {
    try {
      if (camMuted) {
await camera.enable();
} else {
await camera.disable();
}
    } catch (err) {
      console.error('Camera toggle error:', err);
    }
  };

  /** Grid + block SVG fixes optical centering of Lucide icons in circles */
  const btnBase =
    'inline-grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 sm:h-14 sm:w-14 [&_svg]:block [&_svg]:shrink-0';

  return (
    <div className="mt-auto flex flex-shrink-0 flex-wrap items-center justify-center gap-3 border-t border-gray-800/90 bg-gray-950/95 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-gray-950/80 sm:gap-4 sm:px-6 sm:py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <button
        aria-pressed={!micMuted}
        className={`${btnBase} ${micMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
        title={micMuted ? 'Unmute microphone' : 'Mute microphone'}
        type="button"
        onClick={toggleMic}
      >
        {micMuted ? (
          <MicOff aria-hidden className="text-white" size={22} strokeWidth={2} />
        ) : (
          <Mic aria-hidden className="text-white" size={22} strokeWidth={2} />
        )}
      </button>

      <button
        aria-pressed={!camMuted}
        className={`${btnBase} ${camMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'}`}
        title={camMuted ? 'Turn camera on' : 'Turn camera off'}
        type="button"
        onClick={toggleCamera}
      >
        {camMuted ? (
          <VideoOff aria-hidden className="text-white" size={22} strokeWidth={2} />
        ) : (
          <Video aria-hidden className="text-white" size={22} strokeWidth={2} />
        )}
      </button>

      <div className="relative inline-grid place-items-center">
        <button
          className={`${btnBase} bg-violet-600 hover:bg-violet-500`}
          title="Open or close chat"
          type="button"
          onClick={onToggleChat}
        >
          <MessageSquare aria-hidden className="text-white" size={22} strokeWidth={2} />
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
