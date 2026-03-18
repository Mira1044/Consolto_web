import { useState } from 'react';
import { Check } from 'lucide-react';

/**
 * EndSessionModal
 *
 * Confirmation dialog with a checkbox before ending a video call.
 * Mirrors the StyleSheet-based modal in consolto_app videoCall.jsx lines 2006-2067.
 */
export const EndSessionModal = ({ currentMode, onCancel, onConfirm }) => {
  const [agreed, setAgreed] = useState(false);
  const label = currentMode === 'chat' ? 'Chat Session' : 'Video Call';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60" onClick={onCancel}>
      <div
        className="w-[90%] max-w-[400px] rounded-xl border border-gray-700 bg-gray-800 p-6 text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-xl font-bold text-gray-100">End {label}?</h3>
        <p className="mb-6 text-base leading-relaxed text-gray-300">
          Are you sure you want to end the session? You will not be able to rejoin.
        </p>

        <button
          type="button"
          onClick={() => setAgreed((v) => !v)}
          className="mb-6 flex w-full items-center gap-3 rounded-lg bg-gray-700 px-4 py-3 text-left"
        >
          <span
            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border-2 ${
              agreed ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
            }`}
          >
            {agreed && <Check size={14} className="text-white" />}
          </span>
          <span className="text-sm text-gray-100">
            I understand and agree to end the session.
          </span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-gray-600 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!agreed}
            className={`flex-1 rounded-lg py-3 text-sm font-bold text-white transition-colors ${
              agreed ? 'bg-red-600 hover:bg-red-700' : 'cursor-not-allowed bg-gray-600'
            }`}
          >
            End {currentMode === 'chat' ? 'Session' : 'Call'}
          </button>
        </div>
      </div>
    </div>
  );
};
