import {
  Heart,
  GraduationCap,
  TrendingUp,
  Briefcase,
  Monitor,
  Scale,
} from 'lucide-react';

/**
 * Expert utility functions
 * Pure functions for expert-related business logic.
 */

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Build category chips from normalized experts (single source — no second API call).
 */
export const deriveCategoriesFromExperts = (experts) => {
  const labels = new Set();
  for (const e of experts) {
    const tags = Array.isArray(e?.tags) ? e.tags : [];
    for (const t of tags) labels.add(String(t));
  }
  return Array.from(labels)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .map((label) => ({ id: slugify(label), label }));
};

/**
 * Map a category id to its Lucide icon component.
 */
const CATEGORY_ICON_MAP = {
  health: Heart,
  career: GraduationCap,
  finance: TrendingUp,
  business: Briefcase,
  technology: Monitor,
  legal: Scale,
};

/**
 * Enrich raw category objects with their icon component.
 * @param {Array} categories - Array of { id, label }
 * @returns {Array} Array of { id, label, icon }
 */
export const enrichCategoriesWithIcons = (categories) => {
  return categories.map((cat) => ({
    ...cat,
    icon: CATEGORY_ICON_MAP[cat.id] || Briefcase,
  }));
};

/**
 * Filter experts based on search text and active category.
 * @param {Array} experts - Full list of experts
 * @param {Object} filters - { search: string, activeCategory: string|null }
 * @returns {Array} Filtered experts
 */
export const filterExperts = (experts, { search, activeCategory }) => {
  return experts.filter((expert) => {
    const term = search?.toLowerCase() ?? '';

    const matchSearch =
      !term ||
      expert.name.toLowerCase().includes(term) ||
      expert.tags.some((tag) => tag.toLowerCase().includes(term));

    const matchCategory =
      !activeCategory ||
      expert.tags.some((tag) =>
        tag.toLowerCase().includes((activeCategory.split(' ')[0] || '').toLowerCase()),
      );

    return matchSearch && matchCategory;
  });
};

/**
 * Slice categories list for "show all / show less" toggle.
 * @param {Array} categories - Full category list
 * @param {boolean} showAll - Whether to show all categories
 * @param {number} defaultCount - Number of categories to show when collapsed
 * @returns {Array} Visible categories
 */
export const getVisibleCategories = (categories, showAll, defaultCount = 6) => {
  return showAll ? categories : categories.slice(0, defaultCount);
};
