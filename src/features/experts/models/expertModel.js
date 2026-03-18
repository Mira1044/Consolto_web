import { z } from 'zod';

/**
 * Expert domain model & schema
 * Represents the core expert data for the feature.
 */

export const expertSchema = z.object({
  id: z.union([z.string().min(1), z.number().int().positive()]),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  rating: z.number().min(0).max(5).nullable(),
  reviews: z.number().int().nonnegative().nullable(),
  experience: z.string().min(1, 'Experience is required'),
  sessions: z.number().int().nonnegative().nullable(),
  price15: z.number().nonnegative(),
  price30: z.number().nonnegative(),
  initials: z.string().min(1).max(3),
  color: z.string().min(1),
});

export const expertsListSchema = z.array(expertSchema);

/**
 * Category model
 */
export const categorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

export const categoriesListSchema = z.array(categorySchema);
