import { useEffect, useState, useCallback, useMemo } from 'react';
import { BOOKING_TIME_SLOTS } from '@/shared/constants';
import { formatDateShort } from '@/shared/utils/formatters/dateFormatter';
import { formatINR } from '@/shared/utils/formatters/priceFormatter';

/**
 * useBooking
 * Feature-level hook that encapsulates booking state and derived data.
 */
export const useBooking = (expert, initialDuration = 15, navigate) => {
  const [confirmed, setConfirmed] = useState(false);
  const [duration, setDuration] = useState(initialDuration === 30 ? 30 : 15);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [selectedSlot, setSelectedSlot] = useState('11:30 AM');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!expert) {
      navigate('/experts', { replace: true });
    }
  }, [expert, navigate]);

  const price = useMemo(
    () => (duration === 15 ? expert?.price15 : expert?.price30),
    [duration, expert],
  );

  const canConfirm = useMemo(
    () => !!selectedSlot && reason.trim().length > 0,
    [selectedSlot, reason],
  );

  const confirm = useCallback(() => {
    if (!canConfirm) return;
    setConfirmed(true);
  }, [canConfirm]);

  const summary = useMemo(
    () => ({
      expertName: expert?.name,
      duration,
      dateLabel: formatDateShort(selectedDate),
      timeLabel: selectedSlot,
      priceLabel: formatINR(price),
    }),
    [expert, duration, selectedDate, selectedSlot, price],
  );

  return {
    // core state
    confirmed,
    duration,
    selectedDate,
    selectedSlot,
    reason,
    message,
    // setters
    setDuration,
    setSelectedDate,
    setSelectedSlot,
    setReason,
    setMessage,
    setConfirmed,
    // derived
    price,
    canConfirm,
    summary,
    timeSlots: BOOKING_TIME_SLOTS,
    // actions
    confirm,
  };
};
