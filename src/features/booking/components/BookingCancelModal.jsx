import { motion, AnimatePresence } from 'framer-motion';

export function BookingCancelModal({
  booking,
  cancelReason,
  onCancelReasonChange,
  cancelLoading,
  onClose,
  onConfirmCancel,
}) {
  const open = Boolean(booking);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-overlay-cancel"
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
                  <p className="text-xs text-slate-400 font-medium">Cancel Appointment</p>
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
              <div>
                <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-4">
                  <p className="text-sm font-semibold text-red-700 mb-1">Appointment</p>
                  <p className="text-sm text-red-800">
                    {booking.date} at {booking.time}
                  </p>
                </div>

                <textarea
                  className="w-full resize-none border border-red-200 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-colors bg-white"
                  placeholder="Enter cancellation reason..."
                  rows={4}
                  value={cancelReason}
                  onChange={(e) => onCancelReasonChange(e.target.value)}
                />

                <p className={`text-xs mt-2 ${cancelReason.trim().length < 20 ? 'text-red-600' : 'text-slate-500'}`}>
                  {cancelReason.trim().length} / 20 characters minimum
                </p>

                <div className="flex items-center gap-2 mt-5">
                  <motion.button
                    className="flex-1 h-10 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 transition-colors"
                    disabled={cancelLoading}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="flex-1 h-10 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={cancelLoading || cancelReason.trim().length < 20}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={onConfirmCancel}
                  >
                    {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
