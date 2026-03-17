import { z } from 'zod';

/**
 * Booking domain model & schema
 * Represents the core booking data for the feature.
 */

export const bookingSchema = z.object({
  expertId: z.number().int().positive(),
  duration: z.union([z.literal(15), z.literal(30)]),
  selectedDate: z.date(),
  selectedSlot: z.string().min(1, 'Time slot is required'),
  reason: z
    .string()
    .min(10, 'Please provide a bit more detail')
    .max(100, 'Reason must be at most 100 characters'),
  message: z
    .string()
    .max(100, 'Message must be at most 100 characters')
    .optional()
    .or(z.literal('')),
});

export const createDefaultBooking = (expert, initialDuration = 15) => ({
  expertId: expert?.id ?? 0,
  duration: initialDuration === 30 ? 30 : 15,
  selectedDate: new Date(),
  selectedSlot: '11:30 AM',
  reason: '',
  message: '',
});
