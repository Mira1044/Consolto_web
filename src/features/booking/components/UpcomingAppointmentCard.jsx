import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  MessageSquare,
  Phone,
  Ticket,
  Video,
  XCircle,
} from 'lucide-react';
import { Button } from '@/shared/components/ui';
import {
  canModifyBookingByDate,
  formatAppointmentDate,
  formatAppointmentTime,
  getChatAvailability,
  getStatusColor,
  getVideoAvailability,
  isAppointmentUpcoming,
} from '../utils/appointmentTimeUtils';

/**
 * UpcomingAppointmentCard
 *
 * Web equivalent of `consolto_app/components/EnhancedBookingCard.jsx` (upcoming path).
 * It computes the same window availability for Chat/Video and shows the same
 * Reschedule/Cancel buttons when allowed.
 */
export const UpcomingAppointmentCard = ({
  booking,
  userRole, // 'user' | 'consultant' (logged-in role)
  actionLoading = false, // join chat/video loader
  rescheduleLoading = false,
  cancelLoading = false,
  onJoinChat,
  onJoinCall,
  onRescheduleBooking,
  onCancelBooking,
  onViewSummary,
}) => {
  const raw = booking?.raw || booking || {};

  const {
    statusColor,
    statusLabel,
    displayName,
    specialization,
    isUpcomingByTime,
    isCompleted,
    paymentStatus: memoPaymentStatus,
    amount: memoAmount,
    userJoined,
    consultantJoined,
    feedbackSubmitted,
    chatAvailability,
    videoAvailability,
    canCancel,
    canReschedule,
  } = useMemo(() => {
    const now = new Date();

    const status = String(raw?.appointment_status || '').toUpperCase();
    const statusColor = getStatusColor(status);
    const statusLabel = String(status || '').replaceAll('_', ' ') || '—';
    const isCompleted = status === 'COMPLETED';

    const amount = typeof raw?.amount === 'number' ? raw.amount : Number(raw?.amount || 0);
    const paymentStatus = raw?.payment_status;

    // Match backend `AppointmentPayment` schema:
    // - `is_user_joined`
    // - `is_consultant_joined`
    const userJoined = Boolean(raw?.is_user_joined);
    const consultantJoined = Boolean(raw?.is_consultant_joined);

    // Feedback fields are not in `AppointmentPayment` schema you shared.
    // Keep support for possible additional backend fields if present.
    const feedbackSubmitted = Boolean(
      raw?.feedback_submitted ||
        raw?.feedbackSubmitted ||
        raw?.is_feedback_submitted ||
        String(raw?.feedback_status || '').toUpperCase().includes('SUBMIT'),
    );

    const displayName =
      userRole === 'consultant'
        ? (() => {
            const u = raw?.user || {};
            const first = u?.firstName || u?.phoneNumber;
            const last = u?.lastName;
            if (first && last) return `${first} ${last}`;
            return u?.firstName || u?.phoneNumber || 'Unknown Client';
          })()
        : raw?.consultant?.user_name || raw?.consultant?.userName || raw?.consultant?.name || 'Unknown Consultant';

    const specialization =
      userRole === 'user'
        ? (() => {
            const spec = raw?.consultant?.specialization;
            if (Array.isArray(spec) && spec.length) return spec.join(', ');
            return 'Specialist';
          })()
        : null;

    const isUpcomingByTime = isAppointmentUpcoming(raw, now);
    const chatAvailability = getChatAvailability(raw, now);
    const videoAvailability = getVideoAvailability(raw, now);

    const canModify = canModifyBookingByDate(raw, now);

    const canCancel =
      canModify &&
      ['PENDING', 'CONFIRMED'].includes(status) &&
      isUpcomingByTime;

    const canReschedule =
      canModify &&
      ['PENDING', 'CONFIRMED'].includes(status) &&
      !['COMPLETED', 'CANCELLED', 'FAILED'].includes(status) &&
      isUpcomingByTime;

    return {
      statusColor,
      statusLabel,
      displayName,
      specialization,
      isUpcomingByTime,
      isCompleted,
      chatAvailability,
      videoAvailability,
      canCancel,
      canReschedule,
      amount,
      paymentStatus,
      userJoined,
      consultantJoined,
      feedbackSubmitted,
    };
  }, [raw, userRole]);

  if (!raw) return null;

  const appointmentId = raw?._id || booking?.id;
  const durationLabel = raw?.appointment_duration ? String(raw.appointment_duration).replaceAll('_', ' ') : null;
  const reasonToVisit = raw?.reason_to_visit;
  const messageText = raw?.message;

  const amount = memoAmount;
  const paymentStatus = memoPaymentStatus;

  const canShowReschedule = canReschedule && !chatAvailability.available && !videoAvailability.available;
  const canShowCancel = canCancel && !chatAvailability.available && !videoAvailability.available;

  const showAvailabilityBanner =
    (!chatAvailability.available && chatAvailability.reason) || (!videoAvailability.available && videoAvailability.reason);

  const messageLabel = chatAvailability.available
    ? isUpcomingByTime
      ? 'Start Chat'
      : 'Chat History'
    : 'Message';

  const userJoinedText = userJoined ? 'Yes' : 'No';
  const consultantJoinedText = consultantJoined ? 'Yes' : 'No';
  const shouldShowInvoice = isCompleted && String(paymentStatus || '').toUpperCase() === 'PAID';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.98 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl p-4 shadow-sm flex flex-col h-full"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: statusColor,
        borderLeftStyle: 'solid',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-3">
          <div className="text-base font-semibold text-gray-800 break-words">{displayName}</div>
          {specialization && <div className="text-sm text-gray-600 mt-0.5 break-words">{specialization}</div>}
        </div>

        <div
          className="px-2.5 py-1.5 rounded-xl flex items-center justify-center min-w-20"
          style={{ backgroundColor: `${statusColor}20` }}
        >
          <span className="text-xs font-semibold text-center" style={{ color: statusColor }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Booking ID */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
        <Ticket size={15} color="#9CA3AF" />
        <span>
          Booking ID: <span className="font-medium">{appointmentId || '—'}</span>
        </span>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
        <CalendarDays size={15} color="#9CA3AF" />
        <span className="font-medium">{formatAppointmentDate(raw?.appointment_booked_date)}</span>
      </div>

      {/* Time + duration */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2 flex-wrap">
        <Clock size={15} color="#9CA3AF" />
        <span className="font-medium">{formatAppointmentTime(raw?.appointment_start_time, raw?.appointment_end_time)}</span>
        {durationLabel && (
          <span className="text-gray-600 text-xs ml-0">
            ({durationLabel})
          </span>
        )}
      </div>

      {/* Reason */}
      {/* Keep height consistent across cards (even when reason is missing) */}
      <div className="mb-2 min-h-[46px]">
        {reasonToVisit ? (
          <div>
            <div className="text-gray-600 text-xs mb-1">Reason:</div>
            <div className="text-gray-800 text-sm break-words">{reasonToVisit}</div>
          </div>
        ) : (
          <div className="opacity-0">
            <div className="text-gray-600 text-xs mb-1">Reason:</div>
            <div className="text-gray-800 text-sm break-words">—</div>
          </div>
        )}
      </div>

      {/* Message */}
      {/* Keep height consistent across cards (even when message is missing) */}
      <div className="mb-2 min-h-[46px]">
        {messageText ? (
          <div>
            <div className="text-gray-600 text-xs mb-1">Message:</div>
            <div className="text-gray-800 text-sm break-words">{messageText}</div>
          </div>
        ) : (
          <div className="opacity-0">
            <div className="text-gray-600 text-xs mb-1">Message:</div>
            <div className="text-gray-800 text-sm break-words">—</div>
          </div>
        )}
      </div>

      {/* Price */}
      {/* Keep height consistent across cards (even when price is missing) */}
      <div className={`mb-3 min-h-[28px] ${amount > 0 ? '' : 'opacity-0'}`}>
        <div className="flex items-center gap-2">
          <Phone size={15} color="#9CA3AF" className="opacity-80" />
          <span className="text-gray-800 text-sm font-medium">₹{amount || 0}</span>
          {paymentStatus && <span className="text-gray-500 text-xs">({paymentStatus})</span>}
        </div>
      </div>

      {/* Availability banner */}
      {/* Keep height consistent across cards (even when banner is missing) */}
      <div
        className={`mb-3 p-2 bg-blue-50 rounded-lg min-h-[44px] ${showAvailabilityBanner ? '' : 'opacity-0'}`}
      >
        {showAvailabilityBanner && (
          <>
            {!chatAvailability.available && (
              <div className="text-blue-700 text-xs">💬 {chatAvailability.reason}</div>
            )}
            {!videoAvailability.available && (
              <div className="text-blue-700 text-xs">📹 {videoAvailability.reason}</div>
            )}
          </>
        )}
      </div>

      {/* Joined info (keeps “yellow area” content linear across cards) */}
      <div className="mb-1 min-h-[38px]">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span className={userJoined ? 'text-emerald-600' : 'text-slate-400'}>
            {userJoined ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          </span>
          <span>User Joined: {userJoinedText}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
          <span className={consultantJoined ? 'text-emerald-600' : 'text-slate-400'}>
            {consultantJoined ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          </span>
          <span>Consultant Joined: {consultantJoinedText}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-auto flex-wrap gap-2 pt-1">
        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={actionLoading || !chatAvailability.available}
          onClick={() => onJoinChat?.(booking)}
          className="h-9 text-xs rounded-xl !transition-none !px-4"
        >
          <span className="inline-flex items-center gap-2">
            <MessageSquare size={16} color="#fff" />
            <span>{messageLabel}</span>
          </span>
        </Button>

        {/* Invoice (downloadable in app; on web we open summary placeholder) */}
        {shouldShowInvoice && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={actionLoading}
            onClick={() => onViewSummary?.(booking)}
            className="h-9 text-xs rounded-xl !transition-none !px-4 !border-slate-200 !text-slate-700 hover:!bg-slate-50"
          >
            <span className="inline-flex items-center gap-2">
              <Download size={16} />
              <span className="font-semibold">Invoice</span>
            </span>
          </Button>
        )}

        {videoAvailability.available && (
          <Button
            type="button"
            variant="secondary"
            disabled={actionLoading}
            onClick={() => onJoinCall?.(booking)}
            className="h-9 text-xs rounded-xl !transition-none !px-4 !bg-green-600 !text-white !hover:bg-green-700"
          >
            <span className="inline-flex items-center gap-2">
              <Video size={16} color="#fff" />
              <span>Join Video Call</span>
            </span>
          </Button>
        )}

        {canShowReschedule && (
          <Button
            type="button"
            variant="secondary"
            disabled={rescheduleLoading}
            onClick={() => onRescheduleBooking?.(booking)}
            className="h-9 text-xs rounded-xl !transition-none !px-4 !bg-yellow-500 !text-white !hover:bg-yellow-600"
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} color="#fff" />
              <span>Reschedule</span>
            </span>
          </Button>
        )}

        {canShowCancel && (
          <Button
            type="button"
            variant="danger"
            disabled={cancelLoading}
            onClick={() => onCancelBooking?.(booking)}
            className="h-9 text-xs rounded-xl !transition-none !px-4"
          >
            <span className="inline-flex items-center gap-2">
              <span className="font-semibold">Cancel</span>
            </span>
          </Button>
        )}
      </div>

      {/* Feedback section (kept linear; placed outside the main row) */}
      <div className="mt-2 min-h-[34px] flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!isCompleted || feedbackSubmitted}
          onClick={() => onViewSummary?.(booking)}
          className="h-9 text-xs rounded-xl !transition-none !px-4"
        >
          <span className="font-semibold">
            {feedbackSubmitted ? 'Feedback Submitted' : 'Submit Feedback'}
          </span>
        </Button>
      </div>
    </motion.div>
  );
};

