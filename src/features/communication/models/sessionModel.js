import { z } from 'zod';

/**
 * Session params schema — validates the data passed when entering a session.
 * Mirrors the params the mobile app passes to the videoCall screen.
 */
export const sessionParamsSchema = z.object({
  appointmentId: z.string().min(1),
  appointmentStartTime: z.string().min(1),
  appointmentEndTime: z.string().min(1),
  appointmentDate: z.string().min(1),
  otherUserName: z.string().default('Participant'),
  otherUserId: z.string().min(1),
  mode: z.enum(['video', 'chat']).default('video'),
  userRole: z.enum(['user', 'consultant']).optional(),
  appointmentStatus: z.string().optional(),
});

/**
 * Stream token response schema.
 */
export const streamTokenSchema = z.object({
  token: z.string().min(1),
  chatToken: z.string().min(1),
  apiKey: z.string().min(1),
  userId: z.string().min(1),
  user: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().optional(),
  }),
});

/**
 * Active session check response.
 */
export const activeSessionSchema = z.object({
  hasActiveSession: z.boolean(),
  appointmentId: z.string().optional(),
});
