// Experts feature barrel export
export { useExperts } from './hooks/useExperts';
export { ExpertCard } from './components/ExpertCard';
export { ExpertsLayout } from './components/ExpertsLayout';
export { ExpertsPage } from './pages/ExpertsPage';
export { expertSchema, expertsListSchema, categorySchema } from './models/expertModel';
export { validateExperts, validateCategories } from './validators/expertValidator';
export { filterExperts, getVisibleCategories, enrichCategoriesWithIcons, deriveCategoriesFromExperts } from './utils/expertUtils';
export { expertsService } from './services/expertsService';
