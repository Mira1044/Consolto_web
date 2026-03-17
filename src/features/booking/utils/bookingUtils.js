import { formatDateShort } from '@/shared/utils/formatters/dateFormatter';
import { formatINR } from '@/shared/utils/formatters/priceFormatter';

/**
 * Build a summary object for booking, used by presentation layer.
 */
export const buildBookingSummary = (expert, { duration, selectedDate, selectedSlot, price }) => {
  return {
    expertName: expert?.name,
    duration,
    dateLabel: formatDateShort(selectedDate),
    timeLabel: selectedSlot,
    priceLabel: formatINR(price),
  };
};
