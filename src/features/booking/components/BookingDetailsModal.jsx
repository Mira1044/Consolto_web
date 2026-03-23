import { motion, AnimatePresence } from 'framer-motion';

export function BookingDetailsModal({
  booking,
  modal,
  tab,
  onClose,
  onReschedule,
  onCancel,
  onBookAgain,
}) {
  const open = Boolean(booking && (modal === 'details' || modal === 'summary'));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-overlay-details"
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <div
              className="h-1 w-full"
              style={{ background: `linear-gradient(90deg, ${booking.accent}cc, ${booking.accent}33)` }}
            />

            <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${booking.color}`}>
                  {booking.avatar}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">
                    {modal === 'summary' ? 'Consultation Summary' : 'Booking Details'}
                  </p>
                  <p className="font-semibold text-slate-800">{booking.doctor}</p>
                  <p className="text-sm text-slate-500">{booking.specialty}</p>
                </div>
              </div>
              <button
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors flex-shrink-0"
                type="button"
                onClick={onClose}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Date', value: booking.date },
                  { label: 'Time', value: booking.time },
                  { label: 'Mode', value: booking.mode },
                  { label: 'Status', value: booking.status.charAt(0).toUpperCase() + booking.status.slice(1) },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400 font-medium mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                  </div>
                ))}
              </div>

              {modal === 'summary' && (
                <div className="mt-4 rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold text-slate-800 mb-1">Notes</p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    This is a placeholder summary. When backend is ready, we&apos;ll show prescription / advice / follow-up here.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-5">
                {tab === 'Upcoming' ? (
                  <>
                    <motion.button
                      className="flex-1 h-10 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 transition-colors"
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        onReschedule(booking);
                      }}
                    >
                      Reschedule
                    </motion.button>
                    <motion.button
                      className="flex-1 h-10 rounded-xl text-sm font-semibold border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        onCancel(booking);
                      }}
                    >
                      Cancel
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    className="flex-1 h-10 rounded-xl text-sm font-semibold bg-slate-900 hover:bg-slate-950 text-white transition-colors"
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onClose();
                      onBookAgain(booking);
                    }}
                  >
                    Book Again
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
