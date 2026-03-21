import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import {
  AlertTriangle,
  Banknote,
  CalendarDays,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Star,
  Ticket,
  User,
  Video,
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
 * Web equivalent of `consolto_app/components/EnhancedBookingCard.jsx`.
 * Same availability rules, status labels, and action gating as the mobile card.
 */
export const UpcomingAppointmentCard = ({
  booking,
  userRole, // 'user' | 'consultant' (logged-in role)
  activeTab, // 'Upcoming' | 'Past'
  actionLoading = false, // join chat/video loader
  rescheduleLoading = false,
  cancelLoading = false,
  completeLoading = false,
  invoiceLoading = false,
  onJoinChat,
  onJoinCall,
  onRescheduleBooking,
  onCancelBooking,
  onCompleteBooking,
  onDownloadInvoice,
  onViewSummary,
}) => {
  const raw = booking?.raw || booking || {};

  const {
    statusColor,
    statusLabel,
    displayName,
    specialization,
    isUpcomingByTime,
    paymentStatus: memoPaymentStatus,
    amount: memoAmount,
    userJoined,
    consultantJoined,
    isFeedback,
    chatAvailability,
    videoAvailability,
    canCancel,
    canReschedule,
    canComplete,
  } = useMemo(() => {
    const now = new Date();

    const status = String(raw?.appointment_status || '').toUpperCase();
    
    const statusColor = getStatusColor(status);
    // Same as app: `booking.appointment_status.replace('_', ' ')` (first underscore only)
    const statusLabel = String(raw?.appointment_status || '').replace('_', ' ') || '—';
    const amount = typeof raw?.amount === 'number' ? raw.amount : Number(raw?.amount || 0);
    const paymentStatus = raw?.payment_status;

    // Match backend `AppointmentPayment` schema:
    // - `is_user_joined`
    // - `is_consultant_joined`
    const userJoined = Boolean(raw?.is_user_joined);
    const consultantJoined = Boolean(raw?.is_consultant_joined);

    // Backend includes:
    // - `isFeedback` boolean
    // - `feedback` object (if exists)
    const isFeedback = Boolean(raw?.isFeedback);

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
            // App uses `booking.consultant_id` (populated object) for specialization
            const consultantObj =
              raw?.consultant_id && typeof raw.consultant_id === 'object' ? raw.consultant_id : raw?.consultant;
            const spec = consultantObj?.specialization;
            if (Array.isArray(spec) && spec.length) return spec.join(', ');
            return 'Specialist';
          })()
        : null;

    const isUpcomingByTime = isAppointmentUpcoming(raw, now);

    const canComplete =
      userRole === 'consultant' && status === 'IN_PROGRESS' && !isUpcomingByTime;
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
      statusColor: statusColor,
      statusLabel: statusLabel,
      displayName: displayName,
      specialization: specialization,
      isUpcomingByTime: isUpcomingByTime,
      chatAvailability: chatAvailability,
      videoAvailability: videoAvailability,
      canCancel: canCancel,
      canReschedule: canReschedule,
      canComplete: canComplete,
      amount: amount,
      paymentStatus: paymentStatus,
      userJoined: userJoined,
      consultantJoined: consultantJoined,
      isFeedback: isFeedback,
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

  /** App: only `CONFIRMED` shows chat/video window hints (see EnhancedBookingCard). */
  const showAvailabilityBanner =
    raw?.appointment_status === 'CONFIRMED' &&
    ((!chatAvailability.available && chatAvailability.reason) || (!videoAvailability.available && videoAvailability.reason));

  const isPast = String(activeTab || '').toLowerCase() === 'past';

  const missedAppointment =
    isPast &&
    String(raw?.appointment_status || '').toUpperCase() !== 'CANCELLED' &&
    ((userRole === 'user' && !userJoined) || (userRole === 'consultant' && !consultantJoined));

  const canSubmitFeedback =
    userRole === 'user' &&
    String(raw?.appointment_status || '').toUpperCase() === 'COMPLETED' &&
    !isFeedback;

  const shouldShowInvoice =
    userRole === 'user' &&
    (String(paymentStatus || '').toLowerCase() === 'paid' ||
      ['COMPLETED', 'IN_PROGRESS', 'CONFIRMED', 'CANCELLED'].includes(String(raw?.appointment_status || '').toUpperCase()));

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
      {/* 1) Missed appointment — top of card (same order as app) */}
      <div className={`mb-3 min-h-[40px] ${missedAppointment ? '' : 'opacity-0 pointer-events-none'}`}>
        <div className="p-2 bg-red-100 rounded-lg flex items-center justify-center gap-2">
          <AlertTriangle size={16} color="#EF4444" />
          <span className="text-red-600 text-sm font-semibold text-center">You have missed this appointment!</span>
        </div>
      </div>

      {/* 2) Header: name, role/specialization, status */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0 pr-3">
          <div className="text-base font-semibold text-gray-800 break-words">{displayName}</div>
          {specialization && <div className="text-sm text-gray-600 mt-0.5 break-words">{specialization}</div>}
        </div>

        <div
          className="shrink-0 px-3 py-2 rounded-xl flex items-center justify-center min-w-[5.5rem] max-w-[11rem]"
          style={{ backgroundColor: `${statusColor}20` }}
        >
          <span
            className="text-[11px] sm:text-xs font-semibold text-center leading-snug break-words"
            style={{ color: statusColor }}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* 3) Booking ID */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
        <Ticket size={15} color="#9CA3AF" />
        <span>
          Booking ID: <span className="font-medium">{appointmentId || '—'}</span>
        </span>
      </div>

      {/* 4) Date */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
        <CalendarDays size={15} color="#9CA3AF" />
        <span className="font-medium">{formatAppointmentDate(raw?.appointment_booked_date)}</span>
      </div>

      {/* 5) Time + duration */}
      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2 flex-wrap">
        <Clock size={15} color="#9CA3AF" />
        <span className="font-medium">{formatAppointmentTime(raw?.appointment_start_time, raw?.appointment_end_time)}</span>
        {durationLabel && (
          <span className="text-gray-600 text-xs ml-0">
            ({durationLabel})
          </span>
        )}
      </div>

      {/* 6) Reason — label on one line, value next (app layout) */}
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

      {/* Web-only: Message (after Reason, before joined lines — keeps app sequence for shared rows) */}
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

      {/* 7–8) User / Consultant joined (Past tab; placeholders keep grid aligned on Upcoming) */}
      <div className={`mb-2 min-h-[38px] ${isPast ? '' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={15} color="#9CA3AF" />
          <span>User Joined: {userJoined ? 'Yes' : 'No'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
          <User size={15} color="#9CA3AF" />
          <span>Consultant Joined: {consultantJoined ? 'Yes' : 'No'}</span>
        </div>
      </div>

      {/* 9) Payment — banknote icon like app */}
      <div className={`mb-3 min-h-[28px] ${amount > 0 || paymentStatus ? '' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Banknote size={15} color="#9CA3AF" />
          <span className="text-gray-800 font-medium">
            ₹{amount || 0}
            {paymentStatus ? <span className="text-gray-500 font-normal"> ({paymentStatus})</span> : null}
          </span>
        </div>
      </div>

      {/* 10) Chat/video window hints — same as app (CONFIRMED only, upcoming tab) */}
      <div
        className={`mb-3 p-2 bg-blue-50 rounded-lg min-h-[44px] ${
          !isPast && showAvailabilityBanner ? '' : 'opacity-0 pointer-events-none'
        }`}
      >
        {!isPast && showAvailabilityBanner && (
          <>
            {!chatAvailability.available && chatAvailability.reason && (
              <div className="text-blue-700 text-xs">💬 {chatAvailability.reason}</div>
            )}
            {!videoAvailability.available && videoAvailability.reason && (
              <div className="text-blue-700 text-xs">📹 {videoAvailability.reason}</div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-auto flex-wrap gap-2 pt-1">
        {chatAvailability.available && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            disabled={actionLoading}
            onClick={() => onJoinChat?.(booking)}
            className="h-9 text-xs rounded-xl !transition-none !px-4"
          >
            <span className="inline-flex items-center gap-2">
              <MessageSquare size={16} color="#fff" />
              <span>{isUpcomingByTime ? 'Start Chat' : 'Chat History'}</span>
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

        {canComplete && (
          <Button
            type="button"
            variant="secondary"
            disabled={completeLoading}
            onClick={() => onCompleteBooking?.(booking)}
            className="h-9 text-xs rounded-xl !transition-none !px-4 !bg-green-600 !text-white !hover:bg-green-700"
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle size={16} color="#fff" />
              <span className="font-semibold">Complete</span>
            </span>
          </Button>
        )}

        {canSubmitFeedback && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={actionLoading}
            onClick={() => onViewSummary?.(booking)}
            className="h-9 text-xs rounded-xl !transition-none !px-4 !bg-orange-500 !text-white !hover:bg-orange-600"
          >
            <span className="inline-flex items-center gap-2">
              <Star size={16} color="#fff" />
              <span className="font-semibold">Submit Feedback</span>
            </span>
          </Button>
        )}

        {shouldShowInvoice && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={actionLoading || invoiceLoading}
            onClick={() => onDownloadInvoice?.(appointmentId)}
            className="h-9 text-xs rounded-xl !transition-none !px-4 !bg-blue-100 !text-blue-600 !border-transparent hover:!bg-blue-200"
          >
            <span className="inline-flex items-center gap-2">
              <FileText size={16} />
              <span className="font-semibold">Invoice</span>
            </span>
          </Button>
        )}
      </div>
    </motion.div>
  );
};

