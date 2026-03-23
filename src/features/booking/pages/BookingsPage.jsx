import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/components/ui';
import {
  BookingsSegmentedToggle,
  UpcomingAppointmentCard,
  BookingDetailsModal,
  BookingCancelModal,
  BookingRescheduleModal,
} from '../components';
import { useBookingsData } from '../hooks/useBookingsData';
import { useBookingActions } from '../hooks/useBookingActions';
import { useInvoiceDownload } from '../hooks/useInvoiceDownload';

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
      {(modal === 'details' || modal === 'summary') && activeBooking && (
        <BookingDetailsModal
          booking={activeBooking}
          modal={modal}
          tab={tab}
          onBookAgain={handleBookAgain}
          onCancel={handleCancel}
          onClose={closeModal}
          onReschedule={handleReschedule}
        />
      )}
      {modal === 'cancel' && activeBooking && (
        <BookingCancelModal
          booking={activeBooking}
          cancelLoading={cancelLoading}
          cancelReason={cancelReason}
          onCancelReasonChange={setCancelReason}
          onClose={closeModal}
          onConfirmCancel={handleConfirmCancel}
        />
      )}
      {modal === 'reschedule' && activeBooking && (
        <BookingRescheduleModal
          availableSlots={availableSlots}
          booking={activeBooking}
          loadingSlots={loadingSlots}
          rescheduleFilterDate={rescheduleFilterDate}
          rescheduleLoading={rescheduleLoading}
          selectedAvailabilityId={selectedAvailabilityId}
          onClose={closeModal}
          onConfirmReschedule={handleConfirmReschedule}
          onDateChange={handleRescheduleDateChange}
          onSelectSlot={setSelectedAvailabilityId}
        />
      )}
    </div>
  );
};
