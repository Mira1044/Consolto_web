import { Clock } from 'lucide-react';

/**
 * SessionExpired
 *
 * Full-screen state shown when the appointment time has elapsed.
 * Mirrors consolto_app videoCall.jsx lines 1714-1740.
 */
export const SessionExpired = ({ timeStatus, onConfirm }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-10 text-center">
      <Clock size={80} className="text-gray-500" />
      <h2 className="mt-5 mb-2 text-2xl font-semibold text-white">Session Ended</h2>
      <p className="mb-8 text-base leading-relaxed text-gray-300">{timeStatus}</p>
      <button
        onClick={onConfirm}
        className="rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
      >
        OK
      </button>
    </div>
  );
};
