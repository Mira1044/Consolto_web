// Shared constants
// Export app-wide constants here

export {
  CONSOLTO_WORDMARK_PRIMARY_CLASSES,
  BRAND_HIGHLIGHT_GRADIENT_CLASSES,
  CONSOLTO_WORDMARK_ON_DARK_CLASSES,
} from './brand';

export const EXPERT_CATEGORIES = [
  { id: 'health', label: 'Health & Wellness' },
  { id: 'career', label: 'Career & Education' },
  { id: 'finance', label: 'Finance & Investment' },
  { id: 'business', label: 'Business & Startup' },
  { id: 'technology', label: 'Technology & IT Support' },
  { id: 'legal', label: 'Legal & Compliance' },
];

export const MOCK_EXPERTS = [
  {
    id: 1,
    name: 'Mitali Harshal Zagade',
    tags: ['Finance & Investment', 'Business & Startup Consulting', 'Technology & IT Support'],
    rating: 3.7,
    reviews: 3,
    experience: '2 years',
    sessions: 7,
    price15: 500,
    price30: 1000,
    initials: 'MH',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    id: 2,
    name: 'Shivraj Patil',
    tags: ['Health & Wellness', 'Career & Education Guidance', 'IT Infrastructure Planning'],
    rating: 3.0,
    reviews: 2,
    experience: '3 years',
    sessions: 3,
    price15: 499,
    price30: 999,
    initials: 'SP',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    id: 3,
    name: 'Piyush Gayakwad',
    tags: ['Career & Education Guidance', 'Health & Wellness'],
    rating: null,
    reviews: null,
    experience: '5 years',
    sessions: 2,
    price15: 580,
    price30: 900,
    initials: 'PG',
    color: 'bg-green-100 text-green-700',
  },
  {
    id: 4,
    name: 'Harsha Waghmare',
    tags: ['Technology & IT Support', 'Agriculture & Environment'],
    rating: null,
    reviews: null,
    experience: '5 years',
    sessions: null,
    price15: 600,
    price30: 600,
    initials: 'HW',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    id: 5,
    name: 'Manish',
    tags: ['Health & Wellness'],
    rating: null,
    reviews: null,
    experience: '10 years',
    sessions: null,
    price15: 10000,
    price30: 100000,
    initials: 'M',
    color: 'bg-teal-100 text-teal-700',
  },
];

export const BOOKING_TIME_SLOTS = [
  { time: '11:30 AM', label: 'Daily' },
  { time: '12:00 PM', label: 'Daily' },
  { time: '2:30 PM', label: 'Daily' },
  { time: '4:00 PM', label: 'Daily' },
  { time: '5:30 PM', label: 'Daily' },
];
