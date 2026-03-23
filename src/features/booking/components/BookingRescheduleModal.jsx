import { motion, AnimatePresence } from 'framer-motion';
import { toDateOnly } from '../utils/bookingNormalization';

export function BookingRescheduleModal({
  booking,
  rescheduleFilterDate,
  availableSlots,
  selectedAvailabilityId,
  onSelectSlot,
  loadingSlots,
  rescheduleLoading,
  onClose,
  onConfirmReschedule,
  onDateChange,
}) {
  const open = Boolean(booking);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-overlay-reschedule"
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
                  <p className="text-xs text-slate-400 font-medium">Reschedule Appointment</p>
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
                <div className="mb-4 rounded-xl bg-blue-50 border-l-4 border-blue-500 p-4">
                  <p className="text-sm text-blue-800 font-medium mb-1">Current Appointment</p>
                  <p className="text-sm text-blue-700">Date: {booking.date}</p>
                  <p className="text-sm text-blue-700">Time: {booking.time}</p>
                  {booking?.raw?.appointment_duration && (
                    <p className="text-sm text-blue-700">
                      Duration: {String(booking.raw.appointment_duration).replaceAll('_', ' ')}
                    </p>
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Select filter date</p>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    min={toDateOnly(booking?.raw?.appointment_booked_date)}
                    type="date"
                    value={rescheduleFilterDate}
                    onChange={(e) => onDateChange(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <p className="text-sm text-gray-600 mb-1 font-medium">Select new time slot (same duration)</p>
                </div>

                {loadingSlots ? (
                  <div className="py-8 items-center justify-center">
                    <p className="text-sm text-slate-600">Loading available slots...</p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-6 items-center justify-center bg-gray-50 rounded-xl">
                    <p className="text-sm text-slate-600 text-center">No available slots found.</p>
                  </div>
                ) : (
                  <div className="max-h-56 overflow-y-auto pr-1">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedAvailabilityId === slot._id;
                      return (
                        <button
                          key={slot._id}
                          className={`w-full text-left p-3 mb-2 rounded-xl border-2 transition-colors ${
                            isSelected
                              ? 'border-yellow-500 bg-yellow-50'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                          disabled={rescheduleLoading}
                          type="button"
                          onClick={() => onSelectSlot(slot._id)}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className={`font-semibold ${isSelected ? 'text-yellow-800' : 'text-slate-800'}`}>
                                {slot.type === 'SPECIFIC'
                                  ? new Date(String(slot.available_date || '')).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                  : `${slot.type} Availability`}
                              </p>
                              <p className={`text-sm ${isSelected ? 'text-yellow-700' : 'text-slate-600'}`}>
                                {slot.start_time} - {slot.end_time}
                              </p>
                            </div>
                            {isSelected && (
                              <span className="text-yellow-700 font-semibold">✓</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-5">
                  <motion.button
                    className="flex-1 h-10 rounded-xl text-sm font-semibold border border-slate-200 hover:border-slate-300 text-slate-700 transition-colors"
                    disabled={rescheduleLoading}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="flex-1 h-10 rounded-xl text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={rescheduleLoading || !selectedAvailabilityId || !rescheduleFilterDate}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={onConfirmReschedule}
                  >
                    {rescheduleLoading ? 'Rescheduling...' : 'Reschedule'}
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
