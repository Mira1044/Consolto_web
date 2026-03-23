import { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { Button, Modal } from '@/shared/components/ui';

/**
 * EndSessionModal
 *
 * Confirmation dialog with a checkbox before ending a video call.
 * Mirrors the StyleSheet-based modal in consolto_app videoCall.jsx lines 2006-2067.
 */
export const EndSessionModal = ({ currentMode, onCancel, onConfirm }) => {
  const [agreed, setAgreed] = useState(false);
  const panelRef = useRef(null);
  const isChat = currentMode === 'chat';
  const label = isChat ? 'Chat Session' : 'Video Call';

  useEffect(() => {
    const el = panelRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    el?.focus?.();
  }, [isChat]);

  return (
    <Modal
      ariaLabelledBy={isChat ? 'end-session-chat-title' : 'end-session-video-title'}
      closeOnOverlay
      open
      overlayClassName="!z-[9999]"
      onClose={onCancel}
    >
      {/* Chat: match consolto_app style (simple confirm dialog, no checkbox) */}
      {isChat ? (
        <div
          ref={panelRef}
          className="max-h-[85dvh] w-full max-w-[420px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 text-center shadow-xl"
        >
          <h3 className="mb-3 text-xl font-bold text-slate-900" id="end-session-chat-title">
            End chat session?
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-slate-700">
            Are you sure you want to end the chat session?
          </p>

          <div className="flex gap-3 justify-center">
            <Button
              className="flex-1 !px-4 !py-2.5 !rounded-xl border-slate-200 bg-white text-slate-900 hover:!bg-slate-50 hover:!text-slate-900"
              size="sm"
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              CANCEL
            </Button>
            <Button
              className="flex-1 !px-4 !py-2.5 !rounded-xl bg-slate-900 text-white hover:!bg-slate-800 hover:!text-white"
              size="sm"
              type="button"
              variant="secondary"
              onClick={onConfirm}
            >
              END CHAT SESSION
            </Button>
          </div>
        </div>
      ) : (
        <div
          ref={panelRef}
          className="max-h-[85dvh] w-full max-w-[400px] overflow-y-auto rounded-xl border border-gray-700 bg-gray-800 p-6 text-center shadow-xl"
        >
          <h3 className="mb-4 text-xl font-bold text-gray-100" id="end-session-video-title">
            End {label}?
          </h3>
          <p className="mb-6 text-base leading-relaxed text-gray-300">
            Are you sure you want to end the session? You will not be able to rejoin.
          </p>

          <button
            className="mb-6 flex w-full items-center gap-3 rounded-lg bg-gray-700 px-4 py-3 text-left"
            type="button"
            onClick={() => setAgreed((v) => !v)}
          >
            <span
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border-2 ${
                agreed ? 'border-primary-500 bg-primary-500' : 'border-gray-500'
              }`}
            >
              {agreed && <Check className="text-white" size={14} />}
            </span>
            <span className="text-sm text-gray-100">
              I understand and agree to end the session.
            </span>
          </button>

          <div className="flex gap-3">
            <button
              className="flex-1 rounded-lg bg-gray-600 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-500"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className={`flex-1 rounded-lg py-3 text-sm font-bold text-white transition-colors ${
                agreed ? 'bg-red-600 hover:bg-red-700' : 'cursor-not-allowed bg-gray-600'
              }`}
              disabled={!agreed}
              onClick={onConfirm}
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
