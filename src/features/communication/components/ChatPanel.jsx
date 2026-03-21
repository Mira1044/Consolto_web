import { useCallback } from 'react';
import { X } from 'lucide-react';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
} from 'stream-chat-react';
import { ChatInput } from './ChatInput';
import { FileAttachment } from './FileAttachment';

/** Stream ⋮ menu: hide edit, delete, and reply; keep pin, mark unread, flag, mute, quote, react */
const SESSION_MESSAGE_ACTIONS = Object.freeze([
  'pin',
  'markUnread',
  'flag',
  'mute',
  'quote',
  'react',
]);

/**
 * ChatPanel
 *
 * Stream Chat panel rendered as a sidebar (or full area in chat-only mode).
 * Mirrors the <Chat>/<Channel>/<MessageList>/<MessageInput> tree
 * from consolto_app videoCall.jsx lines 1862-2002.
 *
 * Uses stream-chat-react (web) instead of stream-chat-react-native.
 *
 * Chat-only chrome (title, end session) lives in SessionHeader; this panel only adds a sub-header
 * when opened as the mobile overlay on top of video (`showMobileClose`).
 */
export const ChatPanel = ({
  chatClient,
  channel,
  canSendMessage,
  onUpload,
  uploading,
  uploadProgress,
  showMobileClose = false,
  onCloseMobile,
}) => {
  if (!chatClient || !channel) {
    return (
      <div className="flex h-full min-h-[12rem] items-center justify-center bg-black px-4">
        <p className="text-center text-sm text-gray-400">Initializing chat…</p>
      </div>
    );
  }

  const customRenderAttachments = useCallback(
    (props) => {
      const { attachments } = props;
      if (!attachments?.length) return null;
      return (
        <div className="flex flex-col gap-2">
          {attachments.map((att, i) => (
            <FileAttachment key={i} attachment={att} />
          ))}
        </div>
      );
    },
    [],
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-black">
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <Channel channel={channel} Attachment={customRenderAttachments}>
          <Window>
            <div className="flex min-h-0 flex-1 flex-col">
              {showMobileClose && (
                <div className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-gray-800 bg-black px-4 py-2.5 sm:px-4 sm:py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white sm:text-base">Messages</p>
                    <p className="truncate text-xs text-gray-500">Esc or tap outside to return to video</p>
                  </div>
                  <button
                    type="button"
                    onClick={onCloseMobile}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-200 transition-colors hover:bg-gray-700 lg:hidden"
                    aria-label="Close chat and return to video"
                  >
                    <X size={22} strokeWidth={2} />
                  </button>
                </div>
              )}

              <div className="str-chat-message-list-wrap min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain">
                <MessageList disableDateSeparator messageActions={SESSION_MESSAGE_ACTIONS} />
              </div>

              {canSendMessage ? (
                <div className="session-chat-composer-shell relative z-10 flex flex-shrink-0 flex-col overflow-visible border-t border-gray-800 bg-black">
                  <ChatInput
                    onUpload={onUpload}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    canSend={canSendMessage}
                  >
                    <MessageInput grow />
                  </ChatInput>
                </div>
              ) : (
                <div className="border-t border-gray-800 bg-gray-900/80 px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <p className="text-center text-sm text-gray-400">
                    You can no longer send messages in this chat.
                  </p>
                </div>
              )}
            </div>
          </Window>
        </Channel>
      </Chat>
    </div>
  );
};
