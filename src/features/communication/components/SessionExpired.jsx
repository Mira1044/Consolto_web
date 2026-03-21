import { Clock } from 'lucide-react';
import { BrandLogo } from '@/shared/components/BrandLogo';
import { ROUTES } from '@/routes/config';

/**
 * SessionExpired
 *
 * Full-screen state shown when the appointment time has elapsed.
 * Mirrors consolto_app videoCall.jsx lines 1714-1740.
 */
export const SessionExpired = ({ timeStatus, onConfirm }) => {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-950 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] text-center sm:px-10">
      <div className="mb-8">
        <BrandLogo variant="session" to={ROUTES.BOOKINGS} showText={false} imgClassName="opacity-95" />
      </div>
      <Clock className="h-16 w-16 text-gray-500 sm:h-20 sm:w-20" strokeWidth={1.25} aria-hidden />
      <h2 className="mt-5 mb-2 text-xl font-semibold text-white sm:text-2xl">Session ended</h2>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-gray-300 sm:text-base">{timeStatus}</p>
      <button
        type="button"
        onClick={onConfirm}
        className="min-h-12 min-w-[8rem] rounded-full bg-violet-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
      >
        OK
      </button>
    </div>
  );
};
