import { useCallback } from 'react';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Window,
} from 'stream-chat-react';
import { ChatInput } from './ChatInput';
import { FileAttachment } from './FileAttachment';

/**
 * ChatPanel
 *
 * Stream Chat panel rendered as a sidebar (or full area in chat-only mode).
 * Mirrors the <Chat>/<Channel>/<MessageList>/<MessageInput> tree
 * from consolto_app videoCall.jsx lines 1862-2002.
 *
 * Uses stream-chat-react (web) instead of stream-chat-react-native.
 */
export const ChatPanel = ({
  chatClient,
  channel,
  canSendMessage,
  onUpload,
  uploading,
  uploadProgress,
}) => {
  if (!chatClient || !channel) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900">
        <p className="text-gray-400">Initializing chat...</p>
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
    <div className="flex h-full flex-col bg-gray-900">
      <Chat client={chatClient} theme="str-chat__theme-dark">
        <Channel channel={channel} Attachment={customRenderAttachments}>
          <Window>
            <div className="flex flex-1 flex-col overflow-hidden">
              <MessageList />
              {canSendMessage ? (
                <div>
                  <ChatInput
                    onUpload={onUpload}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                    canSend={canSendMessage}
                  />
                  <MessageInput grow />
                </div>
              ) : (
                <div className="border-t border-gray-700 bg-gray-800 px-4 py-4">
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
