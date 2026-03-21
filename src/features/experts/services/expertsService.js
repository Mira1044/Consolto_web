/**
 * Experts service
 * Fetches consultants from the backend and normalizes them into the
 * Experts feature domain model used by `ExpertCard` and filters.
 */

import { apiRequest } from '@/shared/services/api';
import { MOCK_EXPERTS, EXPERT_CATEGORIES } from '@/shared/constants';
import { validateExperts, validateCategories } from '../validators/expertValidator';
import { deriveCategoriesFromExperts } from '../utils/expertUtils';

const PALETTE = [
  'bg-purple-100 text-purple-700',
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
  'bg-pink-100 text-pink-700',
  'bg-violet-100 text-violet-700',
  'bg-slate-100 text-slate-700',
];

const initialsFromName = (name) => {
  const cleaned = String(name || '').trim();
  if (!cleaned) return '?';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const second = parts.length > 1 ? parts[1]?.[0] ?? '' : (parts[0]?.[1] ?? '');
  return (first + second).toUpperCase().slice(0, 3) || cleaned.slice(0, 1).toUpperCase();
};

const getCharge = (charges = [], duration) => {
  const item = Array.isArray(charges) ? charges.find((c) => c?.duration === duration) : null;
  return item?.charge_amount ?? 0;
};

const normalizeConsultant = (c, index) => {
  const name = String(c?.user_name ?? '').trim() || 'Consultant';
  const tags = Array.isArray(c?.specialization) ? c.specialization : [];

  return {
    id: c?._id ?? `consultant-${index}`,
    name,
    tags: tags.length ? tags : ['General'],
    rating: typeof c?.avgRating === 'number' ? c.avgRating : null,
    reviews: typeof c?.totalFeedbacks === 'number' ? c.totalFeedbacks : null,
    experience: `${c?.experience_years ?? 0} years`,
    sessions: typeof c?.totalCompletedAppointments === 'number' ? c.totalCompletedAppointments : null,
    price15: getCharge(c?.charges, '15_minutes'),
    price30: getCharge(c?.charges, '30_minutes'),
    initials: initialsFromName(name),
    color: PALETTE[index % PALETTE.length],
  };
};

export const expertsService = {
  /**
   * Fetch the list of experts.
   * GET /consultant/consultants
   *
   * Backend response (after interceptor unwrap):
   *  { total, page, limit, data: Consultant[] }
   */
  async getExperts() {
    try {
      const payload = await apiRequest.get('/consultant/consultants');
      const list = Array.isArray(payload?.data) ? payload.data : [];
      const normalized = list.map(normalizeConsultant);

      const result = validateExperts(normalized);
      if (!result.success) throw new Error('Invalid experts data received');
      return result.value;
    } catch (err) {
      // Fallback to mock data if backend is unavailable
      const result = validateExperts(MOCK_EXPERTS);
      if (!result.success) throw err;
      return result.value;
    }
  },

  /**
   * Fetch the list of categories.
   * Derived from backend data when available; falls back to shared constants.
   */
  async getCategories() {
    try {
      const experts = await this.getExperts();
      const derived = deriveCategoriesFromExperts(experts);
      const result = validateCategories(derived.length ? derived : EXPERT_CATEGORIES);
      if (!result.success) throw new Error('Invalid categories data received');
      return result.value;
    } catch {
      const result = validateCategories(EXPERT_CATEGORIES);
      if (!result.success) throw new Error('Invalid categories data received');
      return result.value;
    }
  },

  /**
   * Get consultant by id
   * GET /consultant/consultants/:id
   *
   * Backend response envelope:
   *  { success, statusCode, message, data: Consultant }
   *
   * After interceptor unwrap, this method receives:
   *  Consultant
   *
   * Returns:
   *  {
   *    expert: normalized Expert (for existing UI),
   *    raw: Consultant (full backend payload)
   *  }
   */
  async getConsultantById(id) {
    const consultant = await apiRequest.get(`/consultant/consultants/${id}`);
    const expert = normalizeConsultant(consultant, 0);
    return { expert, raw: consultant };
  },

  /**
   * Get self consultant (logged-in consultant profile)
   * GET /consultant/self
   *
   * Backend response envelope:
   *  { success, statusCode, message, data: ConsultantSelf }
   *
   * After interceptor unwrap, this method receives:
   *  ConsultantSelf
   *
   * Returns:
   *  { expert, raw }
   */
  async getSelfConsultant() {
    const consultant = await apiRequest.get('/consultant/self');
    const expert = normalizeConsultant(consultant, 0);
    return { expert, raw: consultant };
  },
};
