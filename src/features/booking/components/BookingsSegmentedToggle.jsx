import { motion } from 'framer-motion';

/** Shared track (purple header) */
const trackClass =
  'flex w-full gap-1 rounded-xl bg-white/15 p-1 sm:gap-1.5 sm:p-1.5';

/**
 * Segment button — fixed min height for tap targets; scales text/padding by breakpoint.
 * Same styles for Upcoming/Past and Consultant/Client.
 */
const segmentClass =
  'relative flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-xl px-2 py-2 text-center text-xs font-semibold leading-tight transition-all duration-200 sm:min-h-[2.75rem] sm:px-3 sm:py-2.5 sm:text-sm md:px-4';

const activeText = 'text-violet-700';
const inactiveText = 'text-white/80 hover:bg-white/10 hover:text-white';

/**
 * Segmented control for the Bookings purple header — one component for both toggle rows.
 *
 * @param {string} layoutId — unique Framer Motion `layoutId` per group on the page
 * @param {Array<{ value: string, label: string }>} options
 */
export function BookingsSegmentedToggle({
  options,
  value,
  onChange,
  layoutId,
  className = '',
  'aria-label': ariaLabel,
}) {
  return (
    <div
      aria-label={ariaLabel}
      className={`${trackClass} ${className}`.trim()}
      role="tablist"
    >
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            aria-selected={isActive}
            className={`${segmentClass} ${isActive ? activeText : inactiveText}`}
            role="tab"
            type="button"
            onClick={() => onChange(opt.value)}
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-white shadow-sm"
                layoutId={layoutId}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 block max-w-full hyphens-auto break-words px-0.5 text-center">
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
