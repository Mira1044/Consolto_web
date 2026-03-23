import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/components/ui';
import { BookingsSegmentedToggle, UpcomingAppointmentCard } from '../components';
import { useBookingsData } from '../hooks/useBookingsData';
import { useBookingActions } from '../hooks/useBookingActions';
import { useInvoiceDownload } from '../hooks/useInvoiceDownload';
import { toDateOnly } from '../utils/bookingNormalization';

function EmptyState({ tab, filter }) {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <rect height="18" rx="2" width="18" x="3" y="4" />
          <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4" strokeLinecap="round" />
        </svg>
      </div>
      <p className="font-semibold text-slate-700 mb-1">
        No {filter !== 'All' ? filter.toLowerCase() : ''} {tab.toLowerCase()} appointments
      </p>
      <p className="text-sm text-slate-400">Your appointments will appear here.</p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

const PAST_FILTERS = ['All', 'Completed', 'Cancelled'];

export const BookingsPage = () => {
  const data = useBookingsData();
  const actions = useBookingActions({ userRole: data.userRole, onRefresh: data.refresh });
  const invoice = useInvoiceDownload();

  const {
    userRole, roleTab, setRoleTab, showBookingsRoleSwitcher,
    tab, setTab, filter, setFilter,
    filtered, upcomingStats,
  } = data;

  const {
    modal, activeBooking, closeModal, openSummary,
    cancelReason, setCancelReason, cancelLoading, handleCancel, handleConfirmCancel,
    rescheduleFilterDate, availableSlots, selectedAvailabilityId, setSelectedAvailabilityId,
    loadingSlots, rescheduleLoading, handleReschedule, handleConfirmReschedule, handleRescheduleDateChange,
    completeLoading, completeBookingId, handleCompleteBooking,
    handleBookAgain, openSessionFromBooking,
  } = actions;

  const { invoiceLoadingMap, handleDownloadInvoice } = invoice;

  // Stable card callbacks
  const handleJoinChat = useMemo(() => (booking) => openSessionFromBooking(booking, 'chat'), [openSessionFromBooking]);
  const handleJoinCall = useMemo(() => (booking) => openSessionFromBooking(booking, 'video'), [openSessionFromBooking]);

  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white opacity-5" />
        <div className="absolute top-8 -right-4 w-28 h-28 rounded-full bg-white opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-6">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="mb-1"
            initial={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {roleTab === 'consultant' ? 'Client Bookings' : 'Your Bookings'}
            </h1>
            <p className="text-sm text-indigo-200 mt-0.5">
              {roleTab === 'consultant'
                ? 'Manage your client appointments'
                : 'View and manage your consultations'}
            </p>
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-5">
          {showBookingsRoleSwitcher ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-4 xl:gap-6">
              <div className="min-w-0 flex justify-center">
                <BookingsSegmentedToggle
                  aria-label="Upcoming or past appointments"
                  className="w-full max-w-md"
                  layoutId="tab-bg"
                  options={[
                    { value: 'Upcoming', label: 'Upcoming' },
                    { value: 'Past', label: 'Past' },
                  ]}
                  value={tab}
                  onChange={(next) => {
 setTab(next); setFilter('All');
}}
                />
              </div>
              <div className="min-w-0 flex w-full justify-center lg:max-w-none lg:justify-end">
                <BookingsSegmentedToggle
                  aria-label="Booking role"
                  className="w-full max-w-md lg:w-[min(100%,26rem)] lg:shrink-0 xl:w-[min(100%,30rem)]"
                  layoutId="bookings-role-pill"
                  options={[
                    { value: 'consultant', label: 'Consultant Bookings' },
                    { value: 'user', label: 'Client Bookings' },
                  ]}
                  value={roleTab}
                  onChange={(next) => {
 setRoleTab(next); setTab('Upcoming'); setFilter('All');
}}
                />
              </div>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-md">
              <BookingsSegmentedToggle
                aria-label="Upcoming or past appointments"
                layoutId="tab-bg"
                options={[
                  { value: 'Upcoming', label: 'Upcoming' },
                  { value: 'Past', label: 'Past' },
                ]}
                value={tab}
                onChange={(next) => {
 setTab(next); setFilter('All');
}}
              />
            </div>
          )}
        </div>
      </div>

      {/* Filter pills (Past only) */}
      <AnimatePresence>
        {tab === 'Past' && (
          <motion.div
            animate={{ opacity: 1, height: 'auto' }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {PAST_FILTERS.map((f) => {
                const isActive = filter === f;
                return (
                  <Button
                    key={f}
                    className={`inline-flex items-center justify-center min-h-[2.5rem] h-auto !py-2 !px-5 sm:!px-6 rounded-full text-sm font-semibold border !transition-none ${
                      isActive
                        ? 'bg-violet-600 text-white border-violet-600 shadow-sm hover:!bg-violet-600 hover:!text-white hover:!border-violet-600 hover:!shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:!bg-white hover:!text-slate-600 hover:!border-slate-200 hover:!shadow-none'
                    }`}
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </Button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats (Upcoming only) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-2">
        <AnimatePresence mode="wait">
          {tab === 'Upcoming' && filtered.length > 0 && (
            <motion.div
              key="stats"
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
            >
              {[
                { label: 'Total', value: upcomingStats.total, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                { label: 'Video', value: upcomingStats.video, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                { label: 'In-person', value: upcomingStats.inPerson, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  animate={{ opacity: 1, y: 0 }}
                  className={`${s.bg} border ${s.border} rounded-2xl px-4 py-3.5 text-center`}
                  initial={{ opacity: 0, y: 8 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <EmptyState key="empty" filter={filter} tab={tab} />
          ) : (
            <motion.div
              key={`${tab}-${filter}`}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
            >
              {filtered.map((b) => {
                const raw = b?.raw || {};
                const bookingId = raw?._id || b?.id;
                const activeBookingId = activeBooking?.raw?._id || activeBooking?.id;

                return (
                  <UpcomingAppointmentCard
                    key={bookingId}
                    activeTab={tab}
                    booking={b}
                    cancelLoading={cancelLoading && activeBookingId === bookingId}
                    completeLoading={completeLoading && completeBookingId === bookingId}
                    invoiceLoading={!!invoiceLoadingMap[bookingId]}
                    rescheduleLoading={rescheduleLoading && activeBookingId === bookingId}
                    userRole={userRole}
                    onCancelBooking={handleCancel}
                    onCompleteBooking={handleCompleteBooking}
                    onDownloadInvoice={handleDownloadInvoice}
                    onJoinCall={handleJoinCall}
                    onJoinChat={handleJoinChat}
                    onRescheduleBooking={handleReschedule}
                    onViewSummary={openSummary}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal && activeBooking && (
          <motion.div
            key="modal-overlay"
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
 if (e.target === e.currentTarget) {
closeModal();
}
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
                style={{ background: `linear-gradient(90deg, ${activeBooking.accent}cc, ${activeBooking.accent}33)` }}
              />

              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${activeBooking.color}`}>
                    {activeBooking.avatar}
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-medium">
                      {modal === 'summary'
                        ? 'Consultation Summary'
                        : modal === 'cancel'
                          ? 'Cancel Appointment'
                          : modal === 'reschedule'
                            ? 'Reschedule Appointment'
                            : 'Booking Details'}
                    </p>
                    <p className="font-semibold text-slate-800">{activeBooking.doctor}</p>
                    <p className="text-sm text-slate-500">{activeBooking.specialty}</p>
                  </div>
                </div>
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors flex-shrink-0"
                  type="button"
                  onClick={closeModal}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              <div className="p-5">
                {/* Details / Summary modal */}
                {(modal === 'details' || modal === 'summary') && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Date', value: activeBooking.date },
                        { label: 'Time', value: activeBooking.time },
                        { label: 'Mode', value: activeBooking.mode },
                        { label: 'Status', value: activeBooking.status.charAt(0).toUpperCase() + activeBooking.status.slice(1) },
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
 closeModal(); handleReschedule(activeBooking);
}}
                          >
                            Reschedule
                          </motion.button>
                          <motion.button
                            className="flex-1 h-10 rounded-xl text-sm font-semibold border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
 closeModal(); handleCancel(activeBooking);
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
 closeModal(); handleBookAgain(activeBooking);
}}
                        >
                          Book Again
                        </motion.button>
                      )}
                    </div>
                  </>
                )}

                {/* Cancel modal */}
                {modal === 'cancel' && (
                  <div>
                    <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-4">
                      <p className="text-sm font-semibold text-red-700 mb-1">Appointment</p>
                      <p className="text-sm text-red-800">
                        {activeBooking.date} at {activeBooking.time}
                      </p>
                    </div>

                    <textarea
                      className="w-full resize-none border border-red-200 rounded-xl px-4 py-3 text-base text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-colors bg-white"
                      placeholder="Enter cancellation reason..."
                      rows={4}
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
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
                        onClick={closeModal}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        className="flex-1 h-10 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={cancelLoading || cancelReason.trim().length < 20}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={handleConfirmCancel}
                      >
                        {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Reschedule modal */}
                {modal === 'reschedule' && (
                  <div>
                    <div className="mb-4 rounded-xl bg-blue-50 border-l-4 border-blue-500 p-4">
                      <p className="text-sm text-blue-800 font-medium mb-1">Current Appointment</p>
                      <p className="text-sm text-blue-700">Date: {activeBooking.date}</p>
                      <p className="text-sm text-blue-700">Time: {activeBooking.time}</p>
                      {activeBooking?.raw?.appointment_duration && (
                        <p className="text-sm text-blue-700">
                          Duration: {String(activeBooking.raw.appointment_duration).replaceAll('_', ' ')}
                        </p>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-1 font-medium">Select filter date</p>
                      <input
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        min={toDateOnly(activeBooking?.raw?.appointment_booked_date)}
                        type="date"
                        value={rescheduleFilterDate}
                        onChange={(e) => handleRescheduleDateChange(e.target.value)}
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
                              onClick={() => setSelectedAvailabilityId(slot._id)}
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
                        onClick={closeModal}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        className="flex-1 h-10 rounded-xl text-sm font-semibold bg-yellow-500 hover:bg-yellow-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={rescheduleLoading || !selectedAvailabilityId || !rescheduleFilterDate}
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={handleConfirmReschedule}
                      >
                        {rescheduleLoading ? 'Rescheduling...' : 'Reschedule'}
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
