# Consolto Web

A modern React application built with a feature-based, layered architecture. The project enforces strict separation of concerns, SOLID principles, and consistent patterns across all modules.

## Tech Stack

- React 18 with JavaScript (JSX)
- Vite (build tool)
- React Router DOM (routing)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Zod (schema validation)
- Axios (HTTP client)
- Lucide React (icons)
- ESLint and Prettier (code quality)

## Project Structure

```
src/
  main.jsx                   Application entry point
  App.jsx                    Root component (router + global toast)
  index.css                  Global styles and Tailwind directives

  config/                    Application-level configuration
    api.js                   API base URL, timeouts, headers
    index.js                 Config barrel export

  context/                   React context providers
    AuthContext.jsx           Authentication state provider

  features/                  Self-contained feature modules
    auth/
    booking/
    contact/
    experts/

  pages/                     App-level pages (not tied to a feature)
    home/                    Landing page with section components
    NotFoundPage.jsx         404 fallback page

  routes/                    Routing system
    AppRouter.jsx            Central router with guards and lazy loading
    config/
      constants.js           Route path constants (ROUTES, ROUTE_NAMES)
      routes.js              Route definitions with metadata
    guards/
      ProtectedRoute.jsx     Requires authentication
      PublicRoute.jsx        Guest-only access
    hooks/
      useDocumentTitle.js    Updates document title per route

  shared/                    Shared code used across features
    components/
      layout/                MainLayout, Navbar, Footer
      ui/                    Button, Input, Textarea, FormField, Loader
    constants/               Hardcoded data (experts, categories, time slots)
    services/
      api/                   API client, request builder, error handler
      error/                 ErrorBoundary, ErrorContext, ErrorToast, hooks
    theme/                   Design tokens, fonts, animations, layout, Tailwind config
    utils/
      formatters/            Date and price formatting utilities
```

## Feature Architecture

Every feature follows the same layered structure. No exceptions.

```
features/<name>/
  models/           Zod schemas and factory functions
  validators/       Validation functions using safeParse
  utils/            Pure utility functions (no side effects)
  services/         API calls (isolated from UI and hooks)
  hooks/            Business logic and state management
  components/       Presentational components (receive data via props)
  pages/            Thin page wrappers (wire routing to hooks and layouts)
  index.js          Barrel export for the entire feature
```

### Layer Responsibilities

**models** define the shape of data using Zod schemas. Each model file exports schemas and factory functions that return default values.

```javascript
// features/booking/models/bookingModel.js
export const bookingSchema = z.object({
  expertId: z.number().int().positive(),
  duration: z.union([z.literal(15), z.literal(30)]),
  selectedSlot: z.string().min(1, 'Time slot is required'),
  reason: z.string().min(10, 'Please provide a bit more detail'),
});

export const createDefaultBooking = (expert) => ({
  expertId: expert?.id ?? 0,
  duration: 15,
  selectedSlot: '11:30 AM',
  reason: '',
});
```

**validators** use models to validate data. They return a consistent result shape.

```javascript
// features/booking/validators/bookingValidator.js
export const validateBooking = (booking) => {
  const result = bookingSchema.safeParse(booking);
  if (result.success) return { success: true };
  return { success: false, errors: result.error.flatten().fieldErrors };
};
```

**utils** contain pure functions with no side effects. They do not import React or call APIs.

**services** handle API communication. They validate data before sending and return consistent responses. No UI awareness.

```javascript
// features/booking/services/bookingService.js
export const bookingService = {
  async createBooking(booking) {
    // Replace with: return api.post('/bookings').body(booking).getData();
    return Promise.resolve({ ...booking, id: Date.now() });
  },
};
```

**hooks** contain all business logic. They call services, manage state, compute derived values, and expose a clean API to pages.

```javascript
// features/booking/hooks/useBooking.js
export const useBooking = (expert, initialDuration, navigate) => {
  // state, effects, memoized values, callbacks
  return { confirmed, duration, price, canConfirm, confirm, summary };
};
```

**components** are presentational. They receive all data through props and render UI. They do not call hooks that fetch data or manage business state.

**pages** are thin wrappers. They connect routing (useNavigate, useLocation, useParams) to feature hooks and pass the result into layout components.

```javascript
// features/booking/pages/BookingPage.jsx
export const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const expert = location.state?.expert;
  const booking = useBooking(expert, 15, navigate);
  return <BookingLayout expert={expert} state={booking} actions={booking} />;
};
```

**index.js** is the barrel export. External code imports from the feature root, never from internal paths.

```javascript
import { useBooking, BookingPage } from '@/features/booking';
```

## Adding a New Feature

Follow these steps strictly.

1. Create the feature folder under `src/features/<name>/`.
2. Create all required subfolders: `models`, `validators`, `utils`, `services`, `hooks`, `components`, `pages`.
3. Define the data schema in `models/<name>Model.js` using Zod.
4. Create validation functions in `validators/<name>Validator.js`.
5. Add any pure utility functions in `utils/<name>Utils.js`.
6. Create the service in `services/<name>Service.js` with API methods.
7. Build the business logic hook in `hooks/use<Name>.js`.
8. Build presentational components in `components/`.
9. Create the page wrapper in `pages/<Name>Page.jsx`.
10. Create `index.js` at the feature root. Export everything that external code needs.
11. Add the route in `src/routes/config/constants.js` and `src/routes/config/routes.js`.

## Routing

Routes are defined in `src/routes/config/routes.js`. Each route specifies:

- `path` from `ROUTES` constants
- `element` as a lazy-loaded component
- `requiresAuth` and `requiresGuest` flags for guard behavior
- `layout` type (`main` or `auth`)
- `title` for the document title

Feature pages are imported from their feature barrel export:

```javascript
const BookingPage = lazy(() =>
  import('@/features/booking').then(m => ({ default: m.BookingPage }))
);
```

App-level pages (Home, NotFound) are imported from `src/pages/`.

## Shared Layer

Code in `src/shared/` is used by multiple features. It includes:

- **UI components** (Button, Input, Textarea, FormField, Loader) in `shared/components/ui/`
- **Layout components** (MainLayout, Navbar, Footer) in `shared/components/layout/`
- **API client** with request builder pattern in `shared/services/api/`
- **Error handling** (ErrorBoundary, ErrorContext, ErrorToast) in `shared/services/error/`
- **Design tokens** (colors, typography, spacing, shadows) in `shared/theme/tokens.js`
- **Animation presets** in `shared/theme/animations.js`
- **Constants** (hardcoded data for experts, categories, time slots) in `shared/constants/`
- **Formatters** (date, price) in `shared/utils/formatters/`

## Design System

All design tokens are centralized in `src/shared/theme/`. The Tailwind configuration at the project root imports these tokens. Use Tailwind classes throughout the application. Do not use inline style objects for values that exist in the token system.

The theme includes: colors, typography, spacing, border radius, shadows, breakpoints, z-index scale, transitions, and animation presets.

## Rules

1. Features must be self-contained. A feature never imports from another feature directly.
2. All cross-feature communication goes through routing (navigation state), context providers, or shared services.
3. Components never call APIs directly. API calls go through services, which are called by hooks.
4. Pages contain no business logic. They connect routing to hooks and pass data to layouts.
5. All data shapes are defined as Zod schemas in the models layer.
6. Validation is always done through validator functions, not inline in components or hooks.
7. Use `useMemo` and `useCallback` for derived values and stable references.
8. Import from feature barrel exports (`@/features/<name>`), not from internal file paths.
9. Shared utilities, components, and services live under `src/shared/`, never duplicated in features.
10. No TypeScript. The project uses JavaScript with JSX.
11. Every new file must follow the naming convention of its layer: `<name>Model.js`, `<name>Validator.js`, `<name>Utils.js`, `<name>Service.js`, `use<Name>.js`, `<Name>Layout.jsx`, `<Name>Page.jsx`.
12. Do not generate documentation files unless explicitly requested.

## Commands

```
npm run dev           Start development server
npm run build         Production build
npm run preview       Preview production build
npm run lint          Run ESLint
npm run lint:fix      Run ESLint with auto-fix
npm run format        Format code with Prettier
npm run format:check  Check formatting without writing
npm run check         Run lint and format check together
```
