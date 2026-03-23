import { useCallStateHooks } from '@stream-io/video-react-sdk';
import { useMemo } from 'react';
import { Monitor } from 'lucide-react';

/**
 * ScreenShareOverlay
 *
 * When a participant is sharing their screen, overlays the shared stream
 * on top of the video grid. Mirrors ScreenShareView from consolto_app
 * videoCall.jsx lines 75-214.
 *
 * On web we render a <video> element from the participant's screenShareStream.
 */
export const ScreenShareOverlay = () => {
  const { useRemoteParticipants, useLocalParticipant } = useCallStateHooks();
  const remoteParticipants = useRemoteParticipants();
  const localParticipant = useLocalParticipant();

  const screenSharers = useMemo(() => {
    const result = [];

    if (localParticipant?.screenShareStream) {
      result.push({
        userId: localParticipant.userId,
        name: 'You',
        stream: localParticipant.screenShareStream,
      });
    }

    remoteParticipants?.forEach((p) => {
      if (p?.screenShareStream) {
        result.push({
          userId: p.userId,
          name: p.name || p.userId || 'Remote User',
          stream: p.screenShareStream,
        });
      }
    });

    return result;
  }, [localParticipant, remoteParticipants]);

  if (screenSharers.length === 0) {
return null;
}

  return (
      <div className="absolute inset-0 z-50 flex flex-col bg-black">
      <div className="bg-primary-600/90 px-4 py-2 text-center">
        <span className="text-sm font-semibold text-white">
          <Monitor className="mr-1 inline" size={14} />
          {screenSharers.length === 1
            ? `${screenSharers[0].name} is sharing screen`
            : `${screenSharers.length} people sharing screens`}
        </span>
      </div>

      <div className="flex flex-1 flex-wrap gap-2 overflow-auto p-2">
        {screenSharers.map(({ userId, name, stream }) => (
          <div
            key={userId}
            className="relative min-h-[300px] flex-1 overflow-hidden rounded-xl border-2 border-primary-500 bg-gray-900"
          >
            <div className="flex items-center justify-between bg-primary-600 px-4 py-2">
              <span className="text-sm font-semibold text-white">{name}</span>
              <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                LIVE
              </span>
            </div>
            <video
              ref={(el) => {
                if (el && stream) {
                  // eslint-disable-next-line no-param-reassign -- assign MediaStream to video element
                  el.srcObject = stream;
                }
              }}
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
