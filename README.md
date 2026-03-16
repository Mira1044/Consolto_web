## Consolto Web App

A modern, scalable React + TypeScript single-page application with Tailwind CSS, strict linting/formatting, and a modular architecture designed for long-term maintainability.

### Tech Stack

- **Framework**: React 18 (SPA)
- **Language**: TypeScript (strict mode)
- **Bundler**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS + Prettier Tailwind plugin
- **Animations**: Framer Motion
- **Icons**: lucide-react
- **Backend Integration**: Node.js Express API (via axios)


### High-Level Architecture

- **`src/main.tsx`**: Application entry; wires up `StrictMode`, `BrowserRouter`, and `AuthProvider`.
- **`src/App.tsx`**: Top-level shell with router and layout (Navbar + route views).
- **`src/context/AuthContext.tsx`**: Centralized auth state (email-based session) with `useAuth()` hook.
- **`src/components/`**: Current UI for landing, experts, booking, auth forms, etc. (to be gradually reorganized into `pages/`, `shared/`, and `features/`).
- **`src/shared/`**: Shared, reusable building blocks (UI, hooks, utils, services, types, constants).
- **`src/features/`**: Feature-based modules; `_template` provides the reference structure.
- **`src/auth/`**: Dedicated auth module (components, hooks, services, types, utils).
- **`src/routes/`**: Route configuration and guards (currently a placeholder to be wired up).
- **`src/pages/`**: Page-level components (currently empty; target location for `Home`, `Experts`, `Booking`, `Contact`, etc.).
- **`src/store/`**: Reserved for future global state (Redux/Zustand/etc.).
- **`src/assets/`**: Static assets (fonts, icons, images, global styles).


### Folder Structure (Planned Target)

```text
src/
  App.tsx
  main.tsx
  index.css
  assets/
  auth/
  components/          # legacy; to be refactored into pages/shared/features
  config/
  context/
  features/
    _template/         # reference feature module
  pages/
  routes/
  shared/
  store/
```

- **`shared/`** (global reusables)
  - `components/` (`ui/`, `layout/`, `forms/`)
  - `hooks/`
  - `utils/` (`validators/`, `formatters/`, `helpers/`)
  - `services/` (`api/`, `storage/`)
  - `types/`, `constants/`, `lib/`
- **`features/`** (self-contained feature modules)
  - Each feature: `components/`, `hooks/`, `types/`, `utils/`, `services/`, `index.ts`, `README.md`.
- **`pages/`** (route-level containers)
  - `home/`, `experts/`, `booking/`, `contact/`, etc.
- **`routes/`**
  - `config/` (route config + constants)
  - `guards/` (e.g. `ProtectedRoute`)


### State Management & Auth

- **AuthContext** (`src/context/AuthContext.tsx`):
  - Stores a simple `User` (currently `{ email }`) in `localStorage` under `consolto_user`.
  - Exposes `isLoggedIn`, `user`, `login(email)`, `logout()`.
  - Accessed via `useAuth()`; throws if used outside `AuthProvider`.
- **State placement guidelines**:
  - Prefer **local component state** for view-only concerns.
  - Use **context** for cross-cutting concerns (auth, theme, app-level preferences).
  - Use **feature hooks** under `src/features/**/hooks` for domain-specific logic.
  - Reserve `src/store/` for larger global state if needed later.


### Styling & Tailwind Rules

- Use **Tailwind utility classes** for layout and styling; add custom CSS via `@layer` in `index.css` when necessary.
- Let **Prettier + `prettier-plugin-tailwindcss`** handle Tailwind class ordering.
- Use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`) and state variants (`hover:`, `focus:`) consistently.
- Keep class names readable; avoid extremely long single-line class strings when possible (split logical sections across lines if needed).


### Tooling & Quality Gates

- **TypeScript**: strict mode with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`.
- **ESLint** (`eslint.config.js`):
  - Based on `@eslint/js` + `typescript-eslint` + React + hooks + type-aware rules.
  - Core formatting rules are disabled in favor of Prettier.
- **Prettier** (`.prettierrc`): `semi: true`, `singleQuote: true`, `trailingComma: "all"`, `printWidth: 100`, Tailwind plugin enabled.
- **EditorConfig**: LF, UTF-8, 2-space indentation, trim trailing whitespace, final newline.
- **VS Code**: format-on-save + ESLint fix-on-save, Tailwind IntelliSense configured.

**Commands:**
- `npm run dev` – start dev server.
- `npm run build` – production build.
- `npm run typecheck` – TypeScript project check.
- `npm run lint` / `npm run lint:fix` – ESLint.
- `npm run format` / `npm run format:check` – Prettier.
- `npm run check` – `typecheck + lint + format:check`.

### Environment Configuration

- **`.env`**: Local environment variables (not committed to git)
- **`.env.example`**: Template file showing required environment variables

**Required Environment Variables:**
- `VITE_API_BASE_URL`: Backend API base URL (default: `http://localhost:3000/api`)

**Setup:**
1. Copy `.env.example` to `.env` (if not already present)
2. Update `VITE_API_BASE_URL` to match your Node.js Express backend URL
3. For production, set `VITE_API_BASE_URL` to your production API URL

**Example `.env` file:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
NODE_ENV=development
```
